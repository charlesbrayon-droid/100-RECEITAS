import { execFileSync } from 'node:child_process';
import { cp, rm, writeFile, access, readFile } from 'node:fs/promises';
import { canSell, salesRequirements } from '../public/sales.js';
import { config } from '../public/config.js';
const preview=process.argv.includes('--preview');
const missing=salesRequirements(config);
if(config.salesEnabled && missing.length)throw new Error('Vendas bloqueadas. Confirme: '+missing.join(', '));
if(config.supportEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.supportEmail))throw new Error('E-mail de suporte inválido.');
if(config.canonicalUrl && new URL(config.canonicalUrl).protocol!=='https:')throw new Error('Domínio final deve usar HTTPS.');
for(const asset of [config.cover,...config.previews.flatMap(p=>[p.src,p.fullSrc])].filter(Boolean)){if(!asset.startsWith('/assets/')||asset.includes('..')||!/\.(webp|png|jpe?g|avif)$/i.test(asset))throw new Error('Use apenas imagens autorizadas em /assets/');await access('public'+asset);}
if(config.metaPixel.id)throw new Error('Rastreamento requer implementação e validação do consentimento antes da ativação.');
await rm('dist',{recursive:true,force:true});await cp('public','dist',{recursive:true});
// Deixa os CTAs e o preço disponíveis também sem JavaScript no build comercial.
const escapeHtml = value => String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
if(canSell(config)) {
 let html = await readFile('dist/index.html','utf8');
 html = html.replace(/<button\b([^>]*\bdata-purchase-control\b[^>]*)>[\s\S]*?<\/button>/g, (_,attrs) => {
  attrs=attrs.replace(/\s+disabled\b/g,'').replace(/\s+type="button"/g,'');
  return `<a${attrs} data-checkout="true" href="${escapeHtml(config.checkoutUrl)}">${escapeHtml(config.purchaseLabel)}</a>`;
 });
 html=html.replace(/(<p\b[^>]*\bdata-offer-price\b[^>]*>)[\s\S]*?(<\/p>)/g,(_,start,end)=>start+escapeHtml(config.price)+end);
 html=html.replace(/<span class="launch-label">[\s\S]*?<\/span>/g,'');
 html=html.replace(/(<p id="hero-status" class="fine">)[\s\S]*?(<\/p>)/,(_,start,end)=>start+'Compra no checkout da Hotmart.'+end);
 html=html.replace(/<p class="pending" id="purchase-status">[\s\S]*?<\/p>/,'<p class="fine" id="purchase-status">Compra no checkout da Hotmart.</p>');
 if(config.cover) {
  const start=html.indexOf('<div id="cover-slot"');
  const end=html.indexOf('<span class="stage-note">',start);
  if(start>=0 && end>start) html=html.slice(0,start)+`<div class="book-mockup"><img class="real-cover" src="${escapeHtml(config.cover)}" width="900" height="1500" fetchpriority="high" alt="Capa oficial do eBook 100 Marmitas Econômicas e Práticas. Ilustrações geradas por IA."></div>`+html.slice(end);
 }
 await writeFile('dist/index.html',html);
}
if(config.canonicalUrl) {
 for(const [file, pathname] of [['index.html','/'],['privacidade/index.html','/privacidade/'],['termos/index.html','/termos/']]) {
  const canonical = new URL(pathname,config.canonicalUrl).href;
  const safe = canonical.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
  const html = await readFile('dist/'+file,'utf8');
  await writeFile('dist/'+file,html.replace('</head>',`<link rel="canonical" href="${safe}">${file==='index.html'?`<meta property="og:url" content="${safe}">`:''}</head>`));
 }
}
let commit = process.env.COMMIT_REF || '';
if(!/^[a-f0-9]{40}$/i.test(commit)) {
 try { commit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(); } catch { commit=''; }
}
await writeFile('dist/release.json',JSON.stringify({commit:/^[a-f0-9]{40}$/i.test(commit)?commit:null,salesEnabled:config.salesEnabled===true},null,2)+'\n');
if(preview) await writeFile('dist/robots.txt','User-agent: *\nDisallow: /\n');
console.log(`${preview ? 'Prévia' : 'Produção'} gerada em dist. Modo: ${config.salesEnabled ? 'vendas habilitadas' : 'pré-lançamento, sem vendas'}.`);

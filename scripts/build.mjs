import { execFileSync } from 'node:child_process';
import { cp, rm, writeFile, access, readFile } from 'node:fs/promises';
import { salesRequirements } from '../public/sales.js';
import { config } from '../public/config.js';
const preview=process.argv.includes('--preview');
const missing=salesRequirements(config);
if(config.salesEnabled && missing.length)throw new Error('Vendas bloqueadas. Confirme: '+missing.join(', '));
if(config.supportEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.supportEmail))throw new Error('E-mail de suporte inválido.');
if(config.canonicalUrl && new URL(config.canonicalUrl).protocol!=='https:')throw new Error('Domínio final deve usar HTTPS.');
for(const asset of [config.cover,...config.previews.flatMap(p=>[p.src,p.fullSrc])].filter(Boolean)){if(!asset.startsWith('/assets/')||asset.includes('..')||!/\.(webp|png|jpe?g|avif)$/i.test(asset))throw new Error('Use apenas imagens autorizadas em /assets/');await access('public'+asset);}
if(config.metaPixel.id)throw new Error('Rastreamento requer implementação e validação do consentimento antes da ativação.');
await rm('dist',{recursive:true,force:true});await cp('public','dist',{recursive:true});
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

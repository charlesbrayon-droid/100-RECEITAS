import { cp, rm, writeFile, access } from 'node:fs/promises';
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
if(preview) await writeFile('dist/robots.txt','User-agent: *\nDisallow: /\n');
console.log(`${preview ? 'Prévia' : 'Produção'} gerada em dist. Modo: ${config.salesEnabled ? 'vendas habilitadas' : 'pré-lançamento, sem vendas'}.`);

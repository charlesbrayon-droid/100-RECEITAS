import { config } from './config.js';
import { canSell } from './sales.js';
const $ = (s) => document.querySelector(s);
$('#year') && ($('#year').textContent = new Date().getFullYear());
if (config.supportEmail) { const a = document.createElement('a'); a.href = `mailto:${config.supportEmail}`; a.textContent = config.supportEmail; $('#support')?.replaceChildren(a); }
if (config.deliveryDescription && $('#delivery')) $('#delivery').textContent = config.deliveryDescription;
if (config.canonicalUrl) { const url = new URL(config.canonicalUrl); if(url.protocol !== 'https:') throw new Error('O domínio canônico deve usar HTTPS.'); const link = document.createElement('link'); link.rel='canonical'; link.href=new URL(location.pathname,url).href; document.head.append(link); }
if (canSell(config) && $('#purchase')) {
 const url = new URL(config.checkoutUrl);
 if(url.protocol !== 'https:' || !['pay.hotmart.com','hotmart.com','www.hotmart.com'].includes(url.hostname)) throw new Error('Confirme um checkout HTTPS oficial da Hotmart.');
 const price=document.createElement('p');price.className='price';price.textContent=config.price;
 const a=document.createElement('a');a.className='button';a.href=url.href;a.textContent='Comprar na Hotmart';a.dataset.checkout='true';
 const refund=document.createElement('p');refund.className='fine';refund.textContent=config.refundDescription;
 $('#purchase').replaceChildren(price,a,refund);
 document.querySelectorAll('a[href="#oferta"]').forEach(link=>{link.href=url.href;link.textContent='Comprar na Hotmart';link.dataset.checkout='true';});
}
if(config.cover && $('#cover-slot')){const img=document.createElement('img');img.src=config.cover;img.alt='Capa do eBook 100 Marmitas Econômicas e Práticas, da Alquimia do Sabor';img.className='real-cover';img.width=360;img.height=510;$('#cover-slot').replaceWith(img);}
const dialog=$('#lightbox');let trigger;
if(dialog){dialog.querySelector('button').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>trigger?.focus());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});}
if(config.previews.length && $('#preview-grid')){ $('#preview-pending').hidden=true;config.previews.forEach(preview=>{const button=document.createElement('button');button.type='button';button.className='preview-button';const img=document.createElement('img');img.src=preview.src;img.alt=preview.alt;img.loading='lazy';img.width=480;img.height=640;const label=document.createElement('span');label.textContent='Ampliar: '+preview.alt;button.append(img,label);button.addEventListener('click',()=>{trigger=button;dialog.querySelector('img').src=preview.src;dialog.querySelector('img').alt=preview.alt;dialog.querySelector('p').textContent=preview.alt;dialog.showModal();});$('#preview-grid').append(button);});}
// Meta Pixel permanece inativo. Nenhum script externo, cookie ou evento é criado.
// A ativação futura exige política aprovada, consentimento revogável e testes de
// PageView/clique de saída sem duplicação. Purchase depende da Hotmart.
if(config.responsible && $('#support')){const responsible=document.createElement('p');responsible.textContent=config.responsible;$('#support').after(responsible);}

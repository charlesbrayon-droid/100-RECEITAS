import { config } from './config.js';
import { canSell } from './sales.js';
const $ = (s) => document.querySelector(s);
$('#year') && ($('#year').textContent = new Date().getFullYear());
if (config.supportEmail) { const a = document.createElement('a'); a.href = `mailto:${config.supportEmail}`; a.textContent = config.supportEmail; $('#support')?.replaceChildren(a); }
if (config.deliveryDescription) document.querySelectorAll('[data-delivery-description]').forEach(el => { el.textContent = config.deliveryDescription; });
if (config.canonicalUrl) { const url = new URL(config.canonicalUrl); if(url.protocol !== 'https:') throw new Error('O domínio canônico deve usar HTTPS.'); const link = document.querySelector('link[rel="canonical"]') || document.createElement('link'); link.rel='canonical'; link.href=new URL(location.pathname,url).href; if(!link.isConnected) document.head.append(link); }
document.querySelectorAll('[data-offer-price]').forEach(el => { el.textContent = config.price || ''; });
document.querySelectorAll('[data-refund-description]').forEach(el => { el.textContent = config.refundDescription || ''; el.hidden = !config.refundDescription; });
const salesReady = canSell(config);
document.querySelectorAll('[data-purchase-control]').forEach(control => {
 control.textContent = control.dataset.purchaseLabel || config.purchaseLabel || 'QUERO MINHAS 100 RECEITAS';
 if (!salesReady) return;
 if (control instanceof HTMLAnchorElement) { control.href = config.checkoutUrl; control.dataset.checkout = 'true'; return; }
 const link = document.createElement('a');
 link.className = control.className;
 link.href = config.checkoutUrl;
 link.textContent = control.textContent;
 link.dataset.checkout = 'true';
 control.replaceWith(link);
});
if (salesReady) {
 const heroStatus = $('#hero-status');
 if (heroStatus) heroStatus.textContent = 'Produto digital em PDF • Acesso após a confirmação do pagamento';
 const status = $('#purchase-status');
 if (status) { status.className = 'fine'; status.textContent = 'Compra no checkout da Hotmart.'; }
 const label = $('.launch-label');
 if (label) label.remove();
}
if (config.cover && $('#cover-slot')) {
 const frame = document.createElement('div');
 frame.className = 'book-mockup';
 const img = document.createElement('img');
 img.src = config.cover;
 img.alt = 'Capa oficial da cartilha culinária digital 100 Marmitas Econômicas e Práticas. Ilustrações geradas por IA.';
 img.className = 'real-cover';
 img.width = 900; img.height = 1500;
 img.fetchPriority = 'high';
 frame.append(img);
 $('#cover-slot').replaceWith(frame);
}
const dialog = $('#lightbox');
let trigger;
let previewIndex = 0;
function setPreviewZoom(zoomed) {
 dialog.querySelector('.lightbox-image').classList.toggle('is-zoomed', zoomed);
 const button = dialog.querySelector('[data-zoom]');
 button.setAttribute('aria-pressed', String(zoomed));
 button.textContent = zoomed ? 'Ajustar à tela' : 'Ampliar detalhes';
}
function showPreview(index) {
 previewIndex = (index + config.previews.length) % config.previews.length;
 const preview = config.previews[previewIndex];
 const img = dialog.querySelector('img');
 img.src = preview.fullSrc || preview.src;
 img.alt = preview.alt;
 $('#lightbox-caption').textContent = preview.title ? `${preview.title} — página real ${preview.printedPage} da cartilha culinária digital. Ilustração gerada por IA.` : preview.alt;
 setPreviewZoom(false);
 $('#lightbox-count').textContent = `${previewIndex + 1} de ${config.previews.length}`;
 dialog.querySelector('.lightbox-image').scrollTop = 0;
 dialog.querySelector('.lightbox-image').scrollLeft = 0;
}
if (dialog) {
 dialog.querySelector('[data-zoom]').addEventListener('click', () => setPreviewZoom(dialog.querySelector('[data-zoom]').getAttribute('aria-pressed') !== 'true'));
 dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
 dialog.addEventListener('close', () => trigger?.focus());
 dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
 dialog.querySelector('[data-previous]').addEventListener('click', () => showPreview(previewIndex - 1));
 dialog.querySelector('[data-next]').addEventListener('click', () => showPreview(previewIndex + 1));
 dialog.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
   e.preventDefault();
   showPreview(previewIndex + (e.key === 'ArrowRight' ? 1 : -1));
  }
 });
}
if (config.previews.length && $('#preview-grid')) {
 $('#preview-pending').hidden = true;
 $('#preview-description').hidden = false;
 config.previews.forEach((preview, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'preview-button';
  button.setAttribute('aria-haspopup', 'dialog');
  button.setAttribute('aria-controls', 'lightbox');
  const img = document.createElement('img');
  img.src = preview.src;
  img.alt = ''; // O rótulo completo da miniatura está no botão.
  img.loading = 'lazy';
  img.decoding = 'async';
  img.width = preview.width || 480;
  img.height = preview.height || 640;
  const label = document.createElement('span');
  label.className = 'preview-title';
  label.textContent = preview.title || preview.alt;
  const tag = document.createElement('span');
  tag.className = 'preview-tag';
  tag.textContent = preview.recipe ? `RECEITA ${String(preview.recipe).padStart(3, '0')} · PÁGINA REAL` : 'PÁGINA REAL';
  const action = document.createElement('span');
  action.className = 'preview-action';
  action.textContent = 'Ampliar página';
  button.setAttribute('aria-label', `Ampliar: ${preview.title || preview.alt}`);
  button.append(img, tag, label, action);
  button.addEventListener('click', () => {
   trigger = button;
   showPreview(index);
   dialog.showModal();
  });
  $('#preview-grid').append(button);
 });
 dialog.querySelector('.lightbox-navigation').hidden = config.previews.length < 2;
}
document.querySelectorAll('[data-responsible]').forEach(el => { el.textContent = config.responsible || ''; });
document.querySelectorAll('[data-cnpj]').forEach(el => { el.textContent = config.cnpj ? `CNPJ: ${config.cnpj}` : ''; });
document.querySelectorAll('[data-business-address]').forEach(el => { el.textContent = config.businessAddress ? `Endereço cadastral: ${config.businessAddress}. Sem atendimento presencial.` : ''; el.hidden = !config.businessAddress; });

// Reserva a altura real da barra de compra, inclusive com fonte ampliada/safe area.
const mobilePurchase = document.querySelector('.mobile-purchase');
if (mobilePurchase) {
 const syncPurchaseSpace = () => document.documentElement.style.setProperty('--mobile-purchase-height', `${Math.ceil(mobilePurchase.getBoundingClientRect().height)}px`);
 syncPurchaseSpace();
 if ('ResizeObserver' in window) new ResizeObserver(syncPurchaseSpace).observe(mobilePurchase);
}

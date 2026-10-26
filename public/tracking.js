import { config } from './config.js';

// O ID do Pixel é público. Nenhum token da API de Conversões pertence a este arquivo.
const pixel = config.metaPixel;
const storageKey = 'alquimia-marketing-consent';
const policyVersion = 1;
const lifetime = 180 * 24 * 60 * 60 * 1000;
const instanceKey = Symbol.for('alquimia.metaConsent');

if (pixel?.consentPolicyApproved && /^\d{5,25}$/.test(pixel.id) && !window[instanceKey]) {
 window[instanceKey] = true;
 let consent = 'denied';
 let initialized = false;
 let pageViewSent = false;
 let lastCheckout = 0;
 const handledEvents = new WeakSet();
 let saved = null;
 try {
  const value = JSON.parse(localStorage.getItem(storageKey));
  if (value?.version === policyVersion && ['granted','denied'].includes(value.choice) && Number.isFinite(value.at) && Date.now() >= value.at && Date.now() - value.at < lifetime) saved = value.choice;
 } catch { /* Sem armazenamento, a escolha vale somente nesta página. */ }

 // Bootstrap oficial da Meta, executado exclusivamente após consentimento.
 function startPixel() {
  if (initialized || consent !== 'granted') return;
  initialized = true;
  /* eslint-disable */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
  (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  window.fbq('consent','grant');
  window.fbq('set','autoConfig',false,pixel.id);
  window.fbq('init',pixel.id);
  if (!pageViewSent) {
   pageViewSent = true;
   window.fbq('trackSingle',pixel.id,'PageView');
  }
 }

 function forgetMetaCookies() {
  for (const name of ['_fbp','_fbc']) {
   document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
   document.cookie = `${name}=; Max-Age=0; path=/; domain=${location.hostname}; SameSite=Lax`;
   document.cookie = `${name}=; Max-Age=0; path=/; domain=.${location.hostname}; SameSite=Lax`;
  }
 }

 const panel = document.createElement('section');
 panel.className = 'consent-panel';
 panel.setAttribute('aria-labelledby','consent-title');
 panel.setAttribute('role','region');
 const title = document.createElement('h2'); title.id = 'consent-title'; title.textContent = 'Sua escolha de privacidade';
 const description = document.createElement('p');
 description.textContent = 'Com sua autorização, usamos o Meta Pixel para medir visitas e cliques de compra e avaliar anúncios. Você pode recusar e comprar normalmente, ou mudar sua escolha a qualquer momento.';
 const policy = document.createElement('a'); policy.href = '/privacidade/'; policy.textContent = 'Política de Privacidade';
 const actions = document.createElement('div'); actions.className = 'consent-actions';
 const deny = document.createElement('button'); deny.type = 'button'; deny.textContent = 'Recusar marketing';
 const accept = document.createElement('button'); accept.type = 'button'; accept.textContent = 'Aceitar marketing';
 const close = document.createElement('button'); close.type = 'button'; close.textContent = 'Manter escolha atual'; close.hidden = true;
 actions.append(deny,accept,close);panel.append(title,description,policy,actions);document.body.append(panel);
 let settingsTrigger;
 function hidePanel() { panel.hidden = true; settingsTrigger?.focus(); }
 function choose(choice) {
  const wasGranted = consent === 'granted';
  consent = choice;
  try { localStorage.setItem(storageKey,JSON.stringify({version:policyVersion,choice,at:Date.now()})); } catch { /* Mantém o consentimento somente em memória. */ }
  saved = choice;
  hidePanel();
  if (choice === 'granted') startPixel();
  else {
   if (initialized && window.fbq) window.fbq('consent','revoke');
   forgetMetaCookies();
   // Recarregar encerra o SDK e seus listeners. A preferência recusada é preservada.
   if (wasGranted) location.reload();
  }
 }
 deny.addEventListener('click',()=>choose('denied'));
 accept.addEventListener('click',()=>choose('granted'));
 close.addEventListener('click',hidePanel);
 document.querySelectorAll('[data-privacy-settings]').forEach(button=>{
  button.hidden = false;
  button.addEventListener('click',()=>{
   settingsTrigger = button;
   panel.hidden = false;
   close.hidden = saved === null;
   deny.focus();
  });
 });
 consent = saved || 'denied';
 panel.hidden = saved !== null;
 if (consent === 'granted') startPixel();

 function checkoutClick(event) {
  if (consent !== 'granted' || !initialized || event.defaultPrevented || handledEvents.has(event)) return;
  if (event.type === 'click' && event.button !== 0) return;
  if (event.type === 'auxclick' && event.button !== 1) return;
  const link = event.target instanceof Element ? event.target.closest('a[data-checkout]') : null;
  if (!link || link.href !== config.checkoutUrl) return;
  handledEvents.add(event);
  const now = Date.now();
  if (now - lastCheckout < 1000) return;
  lastCheckout = now;
  const value = Number(config.price.replace(/[^\d,]/g,'').replace(',','.'));
  window.fbq('trackSingle',pixel.id,'InitiateCheckout',{
   content_name:'100 Receitas — Alquimia do Sabor', currency:'BRL', value, num_items:1
  });
  // Não impede, atrasa ou substitui a navegação; não dispara Purchase.
 }
 document.addEventListener('click',checkoutClick);
 document.addEventListener('auxclick',checkoutClick);
}

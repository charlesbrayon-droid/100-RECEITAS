import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
const output=process.env.ARTIFACT_DIR || '/tmp/alquimia-offer-preview';await mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
const results=[],errors=[],origin=process.env.OFFER_TEST_URL || 'http://127.0.0.1:8091',checkout='https://pay.hotmart.com/Q108196211Y';
try {
for(const width of [320,360,390,768,1440]){
 const page=await browser.newPage({viewport:{width,height:1000}});page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto(origin,{waitUntil:'networkidle'});
 if(width<=600)assert(!(await page.locator('.mobile-purchase').isVisible()));
 await page.getByRole('button',{name:'Recusar marketing',exact:true}).click();
 assert.equal(await page.locator('[data-checkout]').count(),3);
 const checkPrices=async()=>assert.deepEqual(await page.locator('[data-offer-price]').allTextContents(),['R$ 19,90','R$ 19,90','R$ 19,90']);await checkPrices();
 assert.match(await page.locator('h1').textContent(),/Chega de perder tempo procurando receitas na internet!/);
 assert(!/\be-?book\b/i.test(await page.locator('body').innerText()),'Terminologia comercial atualizada');
 assert.match(await page.locator('#oferta').innerText(),/Cartilha Culinária — 100 Receitas para Transformar suas Refeições/);
 assert.equal(await page.locator('#hero-status').textContent(),'Produto digital em PDF • Acesso após a confirmação do pagamento');
 assert.equal(await page.locator('[role=timer]').count(),0);assert.equal(await page.locator('del,s').count(),0);
 assert(await page.getByText('Seu próximo prato favorito pode estar aqui.',{exact:false}).isVisible());
 for(const link of await page.locator('[data-checkout]').all()){assert.equal(await link.getAttribute('href'),checkout);assert.equal(await link.textContent(),await link.getAttribute('data-purchase-label') || 'QUERO MINHA CARTILHA POR R$ 19,90');}
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 for(const link of await page.locator('[data-checkout]:visible').all())assert(await link.evaluate(e=>e.scrollWidth<=e.clientWidth+1));
 assert(await page.locator('.price-line [data-offer-price]').evaluate(e=>e.getBoundingClientRect().right<=e.parentElement.getBoundingClientRect().right+1),'Preço sem corte');
 if(width<=600){assert(await page.locator('.mobile-purchase').isVisible());const rect=await page.locator('.mobile-purchase').boundingBox();assert(Math.abs(rect.y+rect.height-1000)<2);}
 await page.locator('.preview-button').first().click();await page.waitForFunction(()=>document.querySelector('dialog img').complete&&document.querySelector('dialog img').naturalWidth>0);if(width<=600)assert(!(await page.locator('.mobile-purchase').isVisible()));await page.keyboard.press('ArrowRight');await page.keyboard.press('Escape');await checkPrices();
 await page.getByText('A cartilha tem garantia de reembolso?',{exact:true}).click();await checkPrices();
 for(const img of await page.locator('.preview-button img').all()) {await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());}
 assert.equal(await page.locator('.preview-button').count(),6);
 await page.evaluate(()=>window.scrollTo({top:document.body.scrollHeight,behavior:'instant'}));
 if(width<=600){const footer=await page.locator('[data-privacy-settings]').boundingBox();const sticky=await page.locator('.mobile-purchase').boundingBox();assert(footer.y+footer.height<=sticky.y+1,'Rodapé deve ficar acima da barra ao final da página');}
 await page.getByRole('button',{name:'Preferências de privacidade',exact:true}).click();if(width<=600)assert(!(await page.locator('.mobile-purchase').isVisible()));await page.getByRole('button',{name:'Manter escolha atual',exact:true}).click();
 await page.clock.install();await page.clock.fastForward(24*60*60*1000);await checkPrices();
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:`${output}/inicio-${width}.png`});
 await page.locator('#oferta').screenshot({path:`${output}/oferta-${width}.png`,style:'.mobile-purchase { visibility: hidden !important; }'});
 await page.route(checkout,r=>r.fulfill({status:200,contentType:'text/plain',body:'Destino interceptado de teste, sem acesso à Hotmart'}));
 for(let i=0;i<(width<=600?3:2);i++){
  await page.goto(origin,{waitUntil:'networkidle'});await page.locator('[data-checkout]:visible').nth(i).click();await page.waitForURL(checkout);assert.equal(page.url(),checkout);
 }
 results.push({width,status:'PASS'});await page.close();
}
const page=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:1000}});await page.goto(origin);assert.deepEqual(await page.locator('[data-offer-price]').allTextContents(),['R$ 19,90','R$ 19,90','R$ 19,90']);assert.equal(await page.locator('a[data-checkout]').count(),3);await page.close();assert.deepEqual(errors,[]);console.log(JSON.stringify({results,errors,price:'R$ 19,90 permanece após galeria, FAQ, preferências e avanço de 24 horas',links:'3 CTAs corretos (2 no desktop, 3 no celular)',sticky:'rodapé acessível e barra oculta com consentimento/galeria abertos',noJavaScript:'PASS'},null,2));
} finally {await browser.close();}

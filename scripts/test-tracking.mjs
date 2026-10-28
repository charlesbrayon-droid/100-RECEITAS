import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile,stat } from 'node:fs/promises';
import { resolve,extname } from 'node:path';
import { existsSync } from 'node:fs';
import assert from 'node:assert/strict';
const dist=resolve('dist');
const policy=(await readFile('netlify.toml','utf8')).match(/Content-Security-Policy = "([^"]+)"/)[1];
const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.json':'application/json'};
const server=createServer(async(req,res)=>{
 try {
  let file=resolve(dist,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(file!==dist && !file.startsWith(dist+'/')) {res.writeHead(403).end();return;}
  if((await stat(file)).isDirectory()) file=resolve(file,'index.html');
  const data=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Content-Security-Policy':policy});res.end(data);
 } catch {res.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const executablePath=process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined);
const browser=await chromium.launch({executablePath,args:['--no-sandbox']});
try {
const pixel='2173554340182566', origin=`http://127.0.0.1:${server.address().port}`, checkout='https://pay.hotmart.com/Q108196211Y';
const sdk=`(()=>{const q=window.fbq;const record=function(){const args=[...arguments];console.log('PIXEL_TEST '+JSON.stringify(args));};q.callMethod=record;for(const args of q.queue)record(...args);q.queue=[];})();`;
const results=[];
async function setup(width=390,storage){
 const page=await browser.newPage({viewport:{width,height:900}});const calls=[],requests=[],errors=[];
 page.on('console',m=>{if(m.text().startsWith('PIXEL_TEST '))calls.push(JSON.parse(m.text().slice(11)));else if(m.type()==='error')errors.push(m.text());});page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(/facebook\.com|facebook\.net/.test(r.url()))requests.push(r.url());});
 await page.route('https://connect.facebook.net/en_US/fbevents.js',r=>r.fulfill({contentType:'application/javascript',body:sdk}));
 await page.route(checkout,r=>r.fulfill({status:200,contentType:'text/plain',body:'Checkout interceptado no teste, sem acesso à Hotmart.'}));
 await page.addInitScript(()=>{window.__checkoutTestBlock=e=>{if(e.target instanceof Element && e.target.closest('a[data-checkout]'))e.preventDefault();};window.addEventListener('click',window.__checkoutTestBlock);});
 if(storage)await page.addInitScript(value=>localStorage.setItem('alquimia-marketing-consent',JSON.stringify(value)),storage);
 await page.goto(origin+'/',{waitUntil:'networkidle'});return {page,calls,requests,errors};
}
for(const width of [360,390,768,1440]){
 const {page,calls,requests,errors}=await setup(width);
 assert.equal(requests.length,0,'Nenhuma requisição Meta antes do consentimento');assert.equal(calls.length,0);
 assert(await page.locator('.consent-panel').isVisible());assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert.equal(await page.locator('[data-checkout]').count(),3);assert.equal(await page.locator('.preview-button').count(),6);
 await page.getByRole('button',{name:'Recusar marketing',exact:true}).click();
 await page.locator('[data-checkout]:visible').first().click({noWaitAfter:true});await page.waitForTimeout(100);
 assert.equal(calls.length,0);assert.equal(requests.length,0);assert.equal(page.url(),origin+'/');
 await page.reload({waitUntil:'networkidle'});assert(!(await page.locator('.consent-panel').isVisible()));assert.equal(requests.length,0);
 await page.getByRole('button',{name:'Preferências de privacidade',exact:true}).click();
 await page.getByRole('button',{name:'Aceitar marketing',exact:true}).click();await page.waitForFunction(()=>window.fbq?.callMethod);
 assert.equal(calls.filter(c=>c[0]==='init'&&c[1]===pixel).length,1);
 assert.equal(calls.filter(c=>c[0]==='trackSingle'&&c[2]==='PageView').length,1);
 assert.equal(requests.filter(u=>u.includes('fbevents.js')).length,1);
 await page.evaluate(()=>import('/tracking.js?duplicate-test=1'));assert.equal(await page.locator('.consent-panel').count(),1);
 await page.getByRole('button',{name:'Preferências de privacidade',exact:true}).click();await page.getByRole('button',{name:'Aceitar marketing',exact:true}).click();
 assert.equal(calls.filter(c=>c[0]==='init').length,1);assert.equal(calls.filter(c=>c[2]==='PageView').length,1);
 await page.locator('[data-checkout]:visible').first().click({noWaitAfter:true});await page.locator('[data-checkout]:visible').last().click({noWaitAfter:true});await page.waitForTimeout(100);
 assert.equal(calls.filter(c=>c[2]==='InitiateCheckout').length,1,'Clique duplicado suprimido');
 await page.waitForTimeout(1050);await page.locator('[data-checkout]:visible').last().focus();await page.keyboard.press('Enter');await page.waitForTimeout(100);
 assert.equal(calls.filter(c=>c[2]==='InitiateCheckout').length,2);
 for(const c of calls.filter(c=>c[2]==='InitiateCheckout')){assert.equal(c[1],pixel);assert.equal(c[3].value,19.9);assert.equal(c[3].currency,'BRL');}
 assert(!calls.some(c=>c.includes('Purchase')));
 await page.evaluate(()=>{document.cookie='_fbp=fixture; path=/';document.cookie='_fbc=fixture; path=/';});
 const scriptCount=requests.length,pvCount=calls.filter(c=>c[2]==='PageView').length;
 await page.getByRole('button',{name:'Preferências de privacidade',exact:true}).click();await page.getByRole('button',{name:'Recusar marketing',exact:true}).click();await page.waitForLoadState('networkidle');
 assert.equal(calls.filter(c=>c[2]==='PageView').length,pvCount);assert.equal(requests.length,scriptCount);
 assert(!(await page.evaluate(()=>document.cookie)).match(/_fbp=|_fbc=/));assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('alquimia-marketing-consent')).choice),'denied');
 for(let i=0;i<(width<=600?3:2);i++){
  await page.goto(origin+'/',{waitUntil:'networkidle'});
  await page.evaluate(()=>window.removeEventListener('click',window.__checkoutTestBlock));
  await page.locator('[data-checkout]:visible').nth(i).click();await page.waitForURL(checkout);assert.equal(page.url(),checkout);
 }
 assert(!errors.length,errors.join('\n'));results.push({width,status:'PASS'});await page.close();
}
for(const storage of [{version:1,choice:'granted',at:Date.now()-181*86400000},{version:0,choice:'granted',at:Date.now()}]){
 const {page,requests}=await setup(390,storage);assert(await page.locator('.consent-panel').isVisible());assert.equal(requests.length,0);await page.close();
}
const {page,calls,requests}=await setup(390,{version:1,choice:'granted',at:Date.now()});
await page.waitForFunction(()=>window.fbq?.callMethod);assert.equal(calls.filter(c=>c[2]==='PageView').length,1);
await page.goto(origin+'/privacidade/',{waitUntil:'networkidle'});assert.equal(calls.filter(c=>c[2]==='PageView').length,2);assert(await page.getByRole('button',{name:'Preferências de privacidade',exact:true}).isVisible());await page.close();
console.log(JSON.stringify({results,events:'PageView e InitiateCheckout com SDK substituído por fixture local; nenhum evento enviado à Meta',checks:['sem SDK/eventos antes de consentimento','recusa e persistência','aceite e PageView único','cliques e teclado','sem duplicação de init/SDK/eventos','revogação e cookies','expiração/versionamento','navegação para privacidade','checkout preservado','sem Purchase']},null,2));} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}

import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const html=await readFile('public/index.html','utf8');
assert(!/href=["']#["']/.test(html),'Link vazio');
for(const id of [...html.matchAll(/href="#([^"]+)"/g)].map(m=>m[1]))assert(html.includes(`id="${id}"`),'Âncora inexistente: '+id);
for(const file of ['public/privacidade/index.html','public/termos/index.html','public/assets/favicon.svg','public/config.js','public/app.js','public/styles.css','public/tracking.js'])await readFile(file);
async function inspect(dir){for(const entry of await readdir(dir,{withFileTypes:true})){if(entry.isDirectory())await inspect(`${dir}/${entry.name}`);else assert(!/\.(pdf|psd|ai|indd)$/i.test(entry.name),'Arquivo pago/editável público');}}await inspect('public');
assert(html.includes('lang="pt-BR"'));assert(html.includes('id="lightbox"'));console.log('Verificações estruturais passaram: âncoras, arquivos, páginas legais e ausência de PDFs/editáveis públicos.');

// Testes da trava comercial: não fazem requisições nem simulam compras.
const { canSell, salesRequirements } = await import('../public/sales.js');
const { config } = await import('../public/config.js');
assert.equal(canSell({...config, salesEnabled: false}), false, 'O pré-lançamento não habilita vendas');
const fixture = { salesEnabled: true, commercialApproved: true, legalApproved: true, deliveryConfirmed: true, checkoutUrl: 'https://pay.hotmart.com/TESTE-NAO-REAL', price: 'valor de teste', supportEmail: 'teste@example.com', responsible: 'Fixture', cnpj: 'Fixture não comercial', businessAddress: 'Endereço apenas de teste', deliveryDescription: 'Fixture', refundDescription: 'Fixture' };
assert.equal(canSell(fixture), true);
for (const key of ['checkoutUrl','price','supportEmail','responsible','cnpj','businessAddress','deliveryDescription','refundDescription','deliveryConfirmed','legalApproved','commercialApproved','salesEnabled']) assert.equal(canSell({...fixture,[key]: ''}), false, 'Campo obrigatório: '+key);
for (const checkoutUrl of ['javascript:alert(1)', 'https://pay.hotmart.com.evil.example/checkout', 'http://pay.hotmart.com/checkout', 'https://pay.hotmart.com/', 'https://user:password@pay.hotmart.com/checkout']) assert.equal(canSell({...fixture, checkoutUrl}), false);
assert(salesRequirements({}).length > 0);
console.log('Trava de vendas passou: pré-lançamento, requisitos ausentes e checkouts inválidos.');

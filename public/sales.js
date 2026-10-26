// Mesma regra no navegador e no build: publicar o pré-lançamento não habilita vendas.
export function salesRequirements(config) {
  const missing = ['checkoutUrl', 'price', 'supportEmail', 'responsible', 'deliveryDescription', 'refundDescription'].filter(key => typeof config[key] !== 'string' || !config[key].trim());
  if (config.legalApproved !== true) missing.push('legalApproved');
  if (config.commercialApproved !== true) missing.push('commercialApproved');
  try {
    const url = new URL(config.checkoutUrl);
    if (url.protocol !== 'https:' || !['pay.hotmart.com', 'hotmart.com', 'www.hotmart.com'].includes(url.hostname) || url.username || url.password || url.pathname === '/') missing.push('checkout válido');
  } catch { missing.push('checkout válido'); }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.supportEmail || '')) missing.push('suporte válido');
  return missing;
}
export const canSell = config => config.salesEnabled === true && salesRequirements(config).length === 0;

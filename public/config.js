export const config = {
  salesEnabled: false, // Pré-lançamento publicável; habilitar somente após confirmação comercial.
  commercialApproved: false,
  checkoutUrl: '',
  price: '',
  supportEmail: '',
  responsible: '',
  deliveryDescription: '',
  refundDescription: '', // Condições reais de garantia/reembolso; nunca presumir prazos.
  canonicalUrl: '',
  cover: '', // Caminho público de uma imagem autorizada da capa. Nunca use o PDF pago.
  previews: [], // [{ src: '/assets/previa.webp', alt: 'Descrição da página real' }]
  legalApproved: false,
  metaPixel: { id: '', consentPolicyApproved: false } // Inativo: ativação requer implementação e validação do consentimento.
};

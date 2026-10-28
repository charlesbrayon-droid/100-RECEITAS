export const config = {
  salesEnabled: true, // Ativação autorizada após confirmação dos dados pelo proprietário.
  commercialApproved: true,
  checkoutUrl: 'https://pay.hotmart.com/Q108196211Y',
  price: 'R$ 19,90',
  purchaseLabel: 'QUERO MINHA CARTILHA POR R$ 19,90',
  supportEmail: 'charles.brayon@icloud.com',
  responsible: '69.295.622 CHARLES BRAYON AUGUSTO SCHOENROCK',
  cnpj: '69.295.622/0001-90',
  businessAddress: 'Avenida Frederico Grulke, 1220, Santa Maria de Jetibá – ES, CEP 29645-012', // Endereço cadastral fornecido pelo proprietário; sem atendimento presencial.
  deliveryConfirmed: true, // Proprietário confirmou cadastro do PDF completo para entrega; sem teste de compra pelo agente.
  deliveryDescription: 'Produto 100% digital, em formato PDF. Não há envio de produto físico. O acesso é disponibilizado pela Hotmart após a confirmação do pagamento. O comprador deverá seguir as instruções enviadas pela Hotmart para acessar o material.', // Fluxo confirmado pelo proprietário; prazo de acesso não anunciado.
  refundDescription: 'Garantia de reembolso de 7 dias, conforme as condições apresentadas no checkout da Hotmart.', // Configuração confirmada pelo proprietário.
  canonicalUrl: 'https://alquimia-do-sabor-receitas.netlify.app/',
  cover: '/assets/ebook/capa-oficial.webp', // Extraída da primeira página do Modulo_01.pdf, sem recortes.
  // Capa e seis prévias aprovadas pelo proprietário. Fontes: módulos 01, 02 e 05.
  previews: [
    {
        "pdfPage": 21,
        "printedPage": "47",
        "recipe": 2,
        "title": "Coxa assada com limão, batatas e couve refogada",
        "category": "Frango",
        "src": "/assets/ebook/receita-002-miniatura.webp",
        "fullSrc": "/assets/ebook/receita-002-pagina.webp",
        "alt": "Receita 002 — Coxa assada com limão, batatas e couve refogada. Página real de apresentação da cartilha culinária digital; ilustração gerada por IA.",
        "width": 480,
        "height": 800
    },
    {
        "pdfPage": 31,
        "printedPage": "229",
        "recipe": 28,
        "title": "Almôndegas bovinas ao sugo com purê de mandioca",
        "category": "Carnes bovinas e suínas",
        "src": "/assets/ebook/receita-028-miniatura.webp",
        "fullSrc": "/assets/ebook/receita-028-pagina.webp",
        "alt": "Receita 028 — Almôndegas bovinas ao sugo com purê de mandioca. Página real de apresentação da cartilha culinária digital; ilustração gerada por IA.",
        "width": 480,
        "height": 800
    },
    {
        "pdfPage": 107,
        "printedPage": "305",
        "recipe": 39,
        "title": "Lombo suíno com molho de laranja, arroz e cenoura",
        "category": "Carnes bovinas e suínas",
        "src": "/assets/ebook/receita-039-miniatura.webp",
        "fullSrc": "/assets/ebook/receita-039-pagina.webp",
        "alt": "Receita 039 — Lombo suíno com molho de laranja, arroz e cenoura. Página real de apresentação da cartilha culinária digital; ilustração gerada por IA.",
        "width": 480,
        "height": 800
    },
    {
        "pdfPage": 22,
        "printedPage": "595",
        "recipe": 82,
        "title": "Tilápia assada com batata-doce e vagem",
        "category": "Leves e equilibradas",
        "src": "/assets/ebook/receita-082-miniatura.webp",
        "fullSrc": "/assets/ebook/receita-082-pagina.webp",
        "alt": "Receita 082 — Tilápia assada com batata-doce e vagem. Página real de apresentação da cartilha culinária digital; ilustração gerada por IA.",
        "width": 480,
        "height": 800
    },
    {
        "pdfPage": 37,
        "printedPage": "610",
        "recipe": 84,
        "title": "Lentilha com arroz integral, beterraba e molho de iogurte separado",
        "category": "Leves e equilibradas",
        "src": "/assets/ebook/receita-084-miniatura.webp",
        "fullSrc": "/assets/ebook/receita-084-pagina.webp",
        "alt": "Receita 084 — Lentilha com arroz integral, beterraba e molho de iogurte separado. Página real de apresentação da cartilha culinária digital; ilustração gerada por IA.",
        "width": 480,
        "height": 800
    },
    {
        "pdfPage": 57,
        "printedPage": "630",
        "recipe": 87,
        "title": "Omelete de ervas com arroz integral e abóbora",
        "category": "Leves e equilibradas",
        "src": "/assets/ebook/receita-087-miniatura.webp",
        "fullSrc": "/assets/ebook/receita-087-pagina.webp",
        "alt": "Receita 087 — Omelete de ervas com arroz integral e abóbora. Página real de apresentação da cartilha culinária digital; ilustração gerada por IA.",
        "width": 480,
        "height": 800
    }
],
  legalApproved: true,
  metaPixel: { id: '2173554340182566', consentPolicyApproved: true } // SDK e eventos somente após consentimento de marketing.
};

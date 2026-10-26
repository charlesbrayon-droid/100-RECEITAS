# Alquimia do Sabor — 100 Receitas

Página estática premium, em português brasileiro, sem dependências de produção. O pré-lançamento pode ser publicado agora, sem checkout, preço, capa ou prévias. **Nenhuma venda é habilitada por padrão.**

## Desenvolvimento e build

Requer Node.js 24. Python 3 é usado apenas para servir arquivos localmente, não no deploy.

```sh
npm run check
npm run build
npm run dev
```

- `npm run build`: gera `dist/` publicável em pré-lançamento.
- `npm run build:preview`: gera uma prévia com `robots.txt` bloqueando indexação; não usar em produção.
- `npm run dev`: serve `public/` na porta 8080.
- Para revisar exatamente o build: `python3 -m http.server 8081 --directory dist`.

Não é necessário instalar pacotes. Os testes de navegador desta entrega foram executados com Playwright e Chromium, instalados fora do checkout. O painel de onboarding não suporta links localhost; consulte as capturas fornecidas.

## Arquivos

- `public/index.html` e `public/styles.css`: conteúdo e identidade visual responsiva.
- `public/config.js`: configurações centrais e públicas. Nunca inserir segredos.
- `public/sales.js`: requisitos comerciais compartilhados entre build e navegador.
- `public/app.js`: checkout, apresentação de imagens e ampliação por diálogo.
- `public/assets/`: apenas imagens autorizadas e otimizadas. Nunca colocar PDFs pagos, arquivos editáveis ou as 100 ilustrações.
- `public/privacidade/`, `public/termos/`: páginas legais que descrevem o pré-lançamento atual.
- `public/404.html`: página para endereços inexistentes na Netlify.
- `netlify.toml`: build, diretório e cabeçalhos de segurança.

## Publicar via GitHub conectado à Netlify

1. Revisar as alterações e enviá-las ao repositório `charlesbrayon-droid/100-RECEITAS` no GitHub, na branch desejada. Esta entrega não fez push nem deploy.
2. Na Netlify, escolher adicionar/importar um projeto a partir de um repositório Git e conectar o GitHub.
3. Selecionar esse repositório e a branch `main` (ou a branch em que os arquivos foram enviados).
4. Usar a raiz do repositório como diretório base, `npm run build` como comando e `dist` como diretório de publicação. O `netlify.toml` já configura comando, diretório e Node.js 24.
5. Iniciar o deploy. Não há variáveis secretas, instalação paga ou servidor de aplicação necessário.
6. Verificar o endereço HTTPS fornecido pela Netlify: página inicial, `/privacidade/`, `/termos/` e um endereço inexistente para validar o 404. Testar também pelo celular. O comportamento na Netlify só poderá ser confirmado após esse deploy.
7. Quando o domínio final for confirmado, preencher `canonicalUrl` em `public/config.js` com a origem HTTPS e publicar a alteração. Não há domínio fictício no código.

As páginas legais usam diretórios com `index.html`. Não há regra de SPA que transforme caminhos inválidos na página inicial. A Netlify utiliza `404.html` para páginas não encontradas. O diretório público não contém PDFs pagos.

## Integrar a Hotmart posteriormente

Em `public/config.js`, manter `salesEnabled: false` enquanto reunir:

- `checkoutUrl`: URL HTTPS oficial do checkout do produto.
- `price`: preço definitivo já formatado para exibição.
- `supportEmail`: e-mail real de suporte.
- `responsible`: identificação comercial real do responsável.
- `deliveryDescription`: como o cliente recebe o material e quais são as condições/prazos de acesso, conforme a configuração efetiva.
- `refundDescription`: condições reais de garantia e reembolso aplicáveis. Não presumir prazos.

Atualizar as páginas legais para a operação comercial real, incluindo identificação e contato do responsável, condições de uso e tratamento efetivo de dados. Confirmar todo o conteúdo e só então marcar `legalApproved: true` e `commercialApproved: true`.

Depois, definir `salesEnabled: true`, executar `npm run check` e `npm run build`, revisar no navegador e testar o destino do checkout sem efetuar uma compra não autorizada. O build falha se a habilitação de vendas estiver incompleta; o navegador também mantém as vendas desabilitadas se faltar algum requisito. Todos os botões de compra usam a mesma URL central, sem preço ou destino duplicados no HTML. Inserir só checkout e preço não abre as vendas.

## Capa, prévias e compartilhamento

Adicionar apenas imagens autorizadas e otimizadas em `public/assets/`, preferencialmente WebP/AVIF. Definir `cover` e `previews: [{ src: '/assets/previa.webp', alt: 'Descrição da página real' }]`. A capa é exibida sem cortes; as prévias podem ser ampliadas por teclado e fechadas com Escape. Verificar nitidez após inserir os arquivos reais. O bloco tipográfico atual está identificado como apresentação editorial e não reproduz uma capa real.

Título, descrição, favicon, idioma e metadados Open Graph/Twitter estão presentes. Não foi inventada uma imagem social; adicionar `og:image` e `twitter:image` com uma imagem autorizada e sua URL pública quando disponível. A URL canônica só é inserida quando o domínio final for configurado.

## Meta Pixel

Inativo, sem cookies de marketing, eventos ou scripts externos. O campo `metaPixel` apenas reserva a configuração futura. Informar um ID bloqueia o build até implementar e testar política, consentimento revogável, CSP compatível, PageView único e clique de saída único. `Purchase` depende da confirmação da Hotmart e nunca deve ser disparado no clique.

## Pendências sem bloquear o pré-lançamento

Capa e prévias reais; dados comerciais acima; domínio final; revisão legal para a fase de vendas. O produto e os seis módulos seguem as informações fornecidas pelo usuário; não houve auditoria dos PDFs. Pagamento, checkout, entrega automática e rastreamento não foram testados. Consulte `VALIDACAO.md`.

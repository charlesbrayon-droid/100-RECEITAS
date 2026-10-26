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

Capa e prévias reais; suporte, responsável, entrega/acesso, garantia/reembolso, domínio final e revisão legal para vendas. Preço de R$ 19,90 e checkout https://pay.hotmart.com/Q108196211Y foram configurados conforme informação do usuário; a correspondência de produto/preço na Hotmart ainda não foi verificada. O produto e os seis módulos seguem as informações fornecidas pelo usuário; não houve auditoria dos PDFs. Pagamento, checkout, entrega automática e rastreamento não foram testados. Consulte `VALIDACAO.md`.

## Atualização da oferta

Preço inicial informado pela marca: R$ 19,90. Texto central dos botões: `purchaseLabel`, com “QUERO MINHAS 100 RECEITAS”. O preço é exibido na apresentação e na oferta, inclusive no pré-lançamento. Os dois botões ficam desabilitados até os requisitos de `sales.js` serem confirmados; quando ativados, ambos recebem exclusivamente `config.checkoutUrl`.

A tentativa de consulta a `pay.hotmart.com` foi bloqueada pelo proxy do ambiente com CONNECT 403, antes de alcançar o checkout. Não foi possível confirmar produto, preço, entrega, suporte ou reembolso no checkout. O domínio necessário foi acrescentado ao rascunho de rede do ambiente, mas salvar o rascunho não aplica a mudança ao runtime. As imagens mencionadas como anexadas não estavam disponíveis ao agente; a apresentação editorial existente foi preservada. Nenhum arquivo pago foi publicado.

## Material oficial — próxima revisão

O proprietário confirmou manualmente que o checkout oficial apresenta o produto correto por R$ 19,90. Isso não equivale a uma conferência direta realizada pelo agente. Entrega, suporte, responsável e reembolso continuam pendentes; vendas permanecem desabilitadas.

O arquivo `100_Marmitas_Edicao_Completa.pdf` foi enviado, mas sua transferência foi recusada por exceder 32 MiB. Seu conteúdo não foi analisado. É necessário fornecer uma versão de até 32 MiB ou partes menores com todas as páginas para selecionar exatamente seis receitas e extrair a capa oficial. Não inserir o PDF no repositório nem em `public/`.

A galeria agora oferece anterior/próxima, setas do teclado, contador, Escape e retorno de foco. Suporta `src` para miniatura leve e `fullSrc` para imagem nítida carregada apenas ao ampliar. Não há páginas fictícias no site. As alterações desta revisão aguardam aprovação antes de commit ou push.

## Partes recebidas e galeria real (revisão ainda sem commit)

Foram recebidos e analisados os módulos 01 (193 páginas, receitas 001–025), 02 (164 páginas, receitas 026–045) e 05 (93 páginas, receitas 081–090): 450 páginas e 55 receitas. Faltam os módulos 03, 04 e 06; não houve análise do eBook completo.

A capa foi extraída da página 1 do módulo 01, sem recortes ou alteração editorial. A seleção provisória inclui exatamente seis páginas de apresentação de receitas, em ordem de origem. As páginas de ingredientes e preparo não integram a amostra. Consulte `SELECAO_PREVIAS.md` para rastreabilidade e justificativas.

Somente a capa e seis páginas derivadas estão em `public/assets/ebook/` (miniaturas e versões ampliadas das mesmas páginas). Os PDFs originais ficam fora do checkout em `/workspace/attachments/` e não devem ser adicionados ao Git. Contatos de análise de outras páginas estão apenas em `/workspace/scratch/`, fora da pasta pública e do repositório. Imagens do material são identificadas como ilustrações geradas por IA. Não há fotografias de receitas testadas anunciadas.

A galeria oferece contador, anterior/próxima, setas do teclado, ampliação de detalhes com rolagem, Escape e retorno de foco. As versões maiores só carregam ao abrir a prévia. A publicação/commit desta revisão depende da aprovação do usuário. Vendas permanecem desabilitadas.

## Confirmações comerciais e visuais atuais

O proprietário aprovou a capa e as seis páginas escolhidas e confirmou produto, preço de R$ 19,90, checkout oficial e garantia de reembolso de 7 dias configurada na Hotmart. A garantia está na oferta, no FAQ e nos termos, sem inventar um procedimento de solicitação ou outras condições.

Continuam faltando: e-mail de suporte, identificação pública do responsável, confirmação de como ocorre a entrega/acesso e por quanto tempo o conteúdo fica disponível. Com essas informações, atualizar os textos legais para a operação real e confirmar as aprovações comercial/legal antes de habilitar `salesEnabled`. A falta dos outros módulos não impede o uso das seis páginas já aprovadas; a análise do eBook inteiro continua não realizada. Domínio próprio e rastreamento são opcionais.

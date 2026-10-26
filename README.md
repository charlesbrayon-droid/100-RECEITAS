# Alquimia do Sabor — 100 Receitas

Página estática premium, em português brasileiro, sem dependências de produção. A versão comercial está habilitada após confirmação dos dados pelo proprietário. Os botões usam exclusivamente o checkout oficial configurado em `public/config.js`. O PDF pago não está no site nem no repositório.

## Desenvolvimento e build

Requer Node.js 24. Python 3 é usado apenas para servir arquivos localmente, não no deploy.

```sh
npm run check
npm run build
npm run dev
```

- `npm run build`: gera `dist/` conforme o estado comercial validado da configuração.
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

ID público configurado: `2173554340182566`, informado pelo proprietário como o mesmo conjunto de dados da Hotmart. Não há token da API de Conversões no código e não foi implementada integração CAPI.

`public/tracking.js` carrega o bootstrap oficial somente após consentimento explícito de marketing. Há opções equivalentes de aceitar/recusar, sem impedir a compra. Preferência local versionada por até 180 dias e revisão/revogação disponível no rodapé em todas as páginas. A política de privacidade descreve finalidade, eventos, cookies e compartilhamento com a Meta. Não há pixel de imagem em `noscript`, para não contornar o consentimento.

Eventos: `PageView` uma vez por documento após consentimento; `InitiateCheckout` no clique/teclado dos links oficiais, com valor 19.90 BRL e nome do produto. O envio usa `trackSingle` para este Pixel. Inicialização e listener únicos, configuração automática desativada e proteção de 1 segundo para cliques duplicados. A navegação não é impedida nem atrasada. Nenhum evento `Purchase` é disparado pelo site; a integração Hotmart é responsável pela confirmação de compra.

A revogação chama `consent/revoke`, remove os cookies `_fbp`/`_fbc` acessíveis neste domínio e recarrega para encerrar o SDK. Dados anteriormente enviados não são apagados por isso. Se o navegador bloquear armazenamento, a preferência vale somente nesta página. Se bloquear o SDK, o checkout continua funcionando; eventos de marketing não são garantidos em navegadores com bloqueadores.

A CSP autoriza apenas os destinos Meta necessários ao SDK e aos eventos: `connect.facebook.net` e `www.facebook.com`, mantendo as demais restrições. Nenhuma correspondência avançada automática ou informação de suporte/fornecedor é passada como parâmetro de evento.

### Testes reproduzíveis

```sh
npm ci
# Se necessário, instale o navegador para os testes:
npx playwright install chromium
npm run check
npm run test:tracking
```

Playwright é uma dependência apenas de desenvolvimento. O teste usa Chromium instalado no sistema quando disponível; também aceita `CHROMIUM_PATH`. Um servidor temporário local serve o build com a CSP real. O SDK Meta e o destino de checkout são substituídos por fixtures locais para verificar as chamadas e a navegação sem poluir dados de produção ou realizar pagamentos.

A consulta ao SDK real foi bloqueada pelo proxy do ambiente (CONNECT 403). Os testes não confirmam recebimento no Gerenciador de Eventos da Meta, associação da Hotmart, métricas, atribuição nem eventos de compra. Essas verificações exigem o ambiente real e o Gerenciador de Eventos do proprietário.

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

## Atualização local: somente entrega e acesso

O fluxo previsto está descrito em `deliveryDescription`, reproduzido na oferta e no FAQ: produto 100% digital em PDF, sem envio físico; com a modalidade devidamente configurada, a Hotmart disponibiliza o acesso após confirmar o pagamento e envia as instruções ao comprador. Não há promessa de prazo de disponibilidade, acesso vitalício ou envio imediato.

A descrição do fluxo não comprova a configuração real. Antes da ativação comercial, o proprietário deve confirmar que o produto está configurado para entrega digital, que os PDFs corretos estão carregados e disponíveis ao comprador e que o acesso/instruções após o pagamento funcionam. Não foram acessados o painel de produtor nem uma compra real nesta revisão. O prazo de disponibilidade só poderá ser anunciado após confirmação. Suporte e identificação continuam em branco, e as aprovações comercial/legal e `salesEnabled` permanecem falsas.

Esta revisão foi feita localmente, sem commit, push ou publicação, conforme solicitação do usuário.

## Consolidação para implantação

Endereço oficial informado: https://alquimia-do-sabor-receitas.netlify.app/. A URL canônica e os metadados correspondentes são gerados no build para a raiz e para as páginas legais. `dist/release.json` identifica o commit gerado e o estado de vendas, sem credenciais; o cabeçalho desse arquivo impede cache para facilitar a conferência após o deploy.

As melhorias estão autorizadas para commit e envio à `main`, sem `--force`. As vendas permanecem desabilitadas: suporte, responsável, confirmação da entrega completa e aprovação dos textos legais/comerciais ainda são necessários. `deliveryConfirmed` exige confirmação explícita do fluxo real na Hotmart; inserir uma descrição não supre essa confirmação.

Pendência manual única para liberar vendas: validar a operação comercial completa na Hotmart (todos os PDFs destinados ao comprador disponíveis e acesso/instruções após pagamento funcionando), fornecer o e-mail de suporte e a identificação pública do responsável e conferir os textos legais com esses dados. Não há promessa de acesso vitalício ou prazo não confirmado. Essa validação não foi executada pelo agente.

O acesso ao endereço público foi bloqueado pelo proxy do ambiente com CONNECT 403. Não há integração/credencial Netlify disponível. Um push bem-sucedido não comprova o status Published; este status e a versão efetivamente servida precisam de evidência da plataforma. A autorização de domínio foi salva no rascunho de rede, sem afirmar aplicação ao runtime ou publicação desse ambiente.

## Identificação do fornecedor e entrega confirmadas pelo proprietário

Dados oficiais fornecidos pelo proprietário: razão social `69.295.622 CHARLES BRAYON AUGUSTO SCHOENROCK`, CNPJ `69.295.622/0001-90` e suporte `charles.brayon@icloud.com`. Constam no rodapé, nos termos e na política de privacidade. A validação matemática dos dígitos do CNPJ passou; isso não equivale a consulta cadastral à Receita Federal.

O proprietário confirmou produto com vendas ativas na Hotmart e PDF completo cadastrado para entrega digital. `deliveryConfirmed` foi marcado como verdadeiro com base nessa declaração; nenhum teste de pagamento ou entrega foi realizado pelo agente. A descrição de entrega não promete prazo de disponibilidade não confirmado.

Impedimento específico identificado na revisão: falta o endereço físico comercial do fornecedor, solicitado pelo art. 2º, II, do Decreto 7.962/2013 para ofertas por meio eletrônico. Referência: https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/decreto/d7962.htm. Não foi inventado endereço nem removido esse requisito para liberar a compra. `businessAddress` permanece vazio e integra a trava de ativação, junto à identificação e às aprovações comercial/legal. Ao receber o endereço verdadeiro, incluí-lo também nos textos legais e no rodapé, concluir a revisão e só então ativar as vendas.

Todos os demais dados aprovados, imagens e checkout foram preservados. A revisão atual está autorizada para commit e envio à `main`, sem `--force`, mesmo com vendas desabilitadas pelo dado faltante. A confirmação de publicação na Netlify depende de acesso ao endereço público ou à plataforma.

## Ativação comercial com endereço completo

Endereço cadastral confirmado pelo proprietário: Avenida Frederico Grulke, 1220, Santa Maria de Jetibá – ES, CEP 29645-012. Foi inserido no rodapé, nos termos e na política de privacidade, sempre com indicação de negócio exclusivamente digital, sem loja física ou atendimento presencial. Não foram inventados bairro ou complemento.

Com razão social, CNPJ, e-mail de suporte, endereço, preço, garantia, checkout e entrega cadastrada confirmados pelo proprietário, a revisão dos textos foi concluída e as flags `salesEnabled`, `commercialApproved`, `legalApproved` e `deliveryConfirmed` estão verdadeiras. Essas flags refletem as confirmações do proprietário e a revisão da implementação; não representam certificação jurídica independente nem teste de compra/entrega pelo agente.

O build comercial gera os links de compra, preço e capa oficial também no HTML estático, sem depender de JavaScript, e remove as mensagens de pré-lançamento. A galeria continua usando JavaScript para interação. O modo de pré-lançamento e as travas continuam disponíveis caso a configuração seja desativada ou fique incompleta.

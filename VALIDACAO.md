# Validação do pré-lançamento

- `npm run check`: passou. Verifica âncoras, arquivos essenciais, páginas legais e ausência de PDFs/editáveis públicos.
- Trava comercial: passou. Testes cobrem modo de pré-lançamento, cada requisito comercial ausente e URLs de checkout inválidas. Não fazem requisições à Hotmart nem compras.
- `npm run build`: passou e gerou `dist/` em modo de pré-lançamento, sem vendas. Não exige checkout, preço, capa ou prévias.
- Chromium headless, servindo o build `dist/`, em 360, 390, 768 e 1440 px: passou. Sem rolagem horizontal; âncoras existentes; FAQ funcional; atalho de teclado para o conteúdo; páginas legais com HTTP 200; nenhum erro de console/JavaScript observado.
- Em todas essas larguras, verificada a mensagem de lançamento em breve e ausência de links de compra habilitados.
- Ampliação: abertura, fechamento com Escape e retorno do foco passaram usando uma imagem de teste. Não valida qualidade de prévias reais, ainda ausentes.
- Raiz, CSS, JavaScript, configuração, regras de venda, favicon, página 404 e páginas legais responderam HTTP 200 nos seus caminhos locais. A resposta 404 automática da Netlify deve ser verificada após o deploy; não foi simulada como deploy real.
- Capturas atuais em `/workspace/scratch/alquimia-prelancamento/`, fora do checkout.
- Revisão do texto e da apresentação preservou a identidade existente. Não foram adicionadas fotografias, depoimentos, descontos, bônus ou alegações de resultados.

O servidor de teste usa somente os arquivos gerados; o site publicado não depende de Python ou de recursos do ambiente local. O `netlify.toml` mantém comando `npm run build`, diretório `dist` e Node.js 24. Cabeçalhos/roteamento efetivos da Netlify, pagamento, entrega automática e Meta Pixel não foram validados por deploy ou integração real. Nenhum rastreamento foi ativado e nenhuma publicação foi realizada.

Faltam capa e prévias reais, dados comerciais, domínio final e revisão legal para abertura de vendas. Esses itens não impedem a publicação técnica do pré-lançamento. As descrições do produto seguem o conteúdo informado pelo usuário; os PDFs não estavam disponíveis para auditoria.

## Atualização de preço e checkout

- Preço oficial informado pelo usuário configurado: R$ 19,90. Checkout central: `https://pay.hotmart.com/Q108196211Y`.
- Texto dos dois botões: “QUERO MINHAS 100 RECEITAS”. Permanecem desabilitados com mensagem explícita de lançamento em breve.
- `salesEnabled`, `commercialApproved` e `legalApproved` permanecem falsos. Suporte, responsável, entrega e reembolso não foram inventados.
- Consulta ao checkout: bloqueada pelo proxy, CONNECT 403. Não estabelece disponibilidade nem indisponibilidade do produto na Hotmart e não confirma preço ou condições.
- Capa e prévias anexadas não estavam acessíveis nesta tarefa. Nenhuma imagem foi inventada ou substituída.
- `npm run check` e `npm run build` passaram após a alteração. Nenhum pagamento, entrega, evento de rastreamento ou deploy Netlify foi testado.
- Build atualizado servido localmente e retestado em Chromium a 360, 390, 768 e 1440 px: preço presente duas vezes, dois botões desabilitados com o rótulo correto, sem overflow ou erros de console observados; FAQ, teclado e páginas legais passaram.
- Testes de interface com fixtures confirmaram que os dois CTAs recebem o mesmo checkout somente com os requisitos completos; ausência de entrega, suporte, reembolso, responsável ou aprovações mantém os botões desabilitados. Nenhuma navegação externa nem pagamento foi efetuado nesses testes.
- Capturas desta atualização em `/workspace/scratch/alquimia-oferta/`.

## Capa oficial e seis páginas reais — aguardando aprovação

- Recebidos módulos 01, 02 e 05: 450 páginas e 55 receitas. Faltam módulos 03, 04 e 06; análise do eBook completo permanece pendente.
- Capa extraída integralmente da página 1 do módulo 01; nenhuma recriação, corte ou alteração de textos. Seleção provisória e rastreabilidade em `SELECAO_PREVIAS.md`.
- Seis páginas reais selecionadas: receitas 002, 028, 039, 082, 084 e 087, nesta ordem. A amostra inclui páginas de apresentação, não fichas completas; essa limitação e a origem das ilustrações por IA estão visíveis na página.
- Capa 900 × 1500 px; seis miniaturas 480 × 800 px; versões ampliadas 1440 × 2400 px. Capa + miniaturas totalizam 484.488 bytes; versões maiores carregam somente ao ampliar.
- Build e verificações estruturais passaram. Chromium em 360, 390, 768 e 1440 px: seis miniaturas e seis ampliações carregaram, capa preservou proporção, navegação por botões e setas funcionou, ciclo entre primeira/última página funcionou, zoom/rolagem interna funcionou, Escape fechou e devolveu o foco. Sem rolagem horizontal ou erros de console observados. Páginas legais acessíveis e compra desabilitada.
- Nenhum PDF está em `public/` ou no conjunto de arquivos para Git. Fontes originais em `/workspace/attachments/`, fora do checkout. Contatos de outras páginas apenas em `/workspace/scratch/`.
- Capturas reais em `/workspace/scratch/alquimia-galeria/`. Sem commit, push ou publicação nesta revisão; o commit anterior permanece inalterado.

## Aprovação da amostra e garantia confirmada

O proprietário aprovou oficialmente a capa e as seis páginas e confirmou a garantia de reembolso de 7 dias configurada na Hotmart. A informação foi incluída na configuração central, na oferta, no FAQ e nos termos, sem inventar condições adicionais ou procedimento de solicitação.

Build e verificações passaram. Chromium a 360, 390, 768 e 1440 px confirmou a garantia na oferta/FAQ/termos, ausência de overflow, seis prévias preservadas, botões desabilitados e nenhum erro de console observado. Todos os arquivos anteriormente versionados continuam presentes; nenhum PDF foi incluído na pasta pública.

Continuam pendentes e-mail de suporte, identificação pública do responsável, forma de entrega e condições/prazo de acesso. Os textos legais precisam refletir esses dados antes da aprovação comercial/legal e da ativação de vendas. Domínio próprio não é requisito para utilizar o endereço HTTPS da Netlify.

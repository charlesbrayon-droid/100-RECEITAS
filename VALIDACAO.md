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

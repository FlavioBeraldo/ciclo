# Experimento de bloqueio de JavaScript na home

24 de novembro de 2026 · Base `1aeb60bcf53098e69e230f3936bed369be0eb605` · Home da Ciclo E-commerce.

## Decisão

Experimento encerrado. O PR contém somente este relatório. A aplicação permanece no código de referência.

O bundle ficou menor, mas a dispersão móvel aumentou e o ganho de TBT não se reproduziu. O LCP móvel mediano passou de aproximadamente 2,18 s para 2,25 s e o CLS mediano foi zero em ambos os dispositivos nos dois builds.

A variação da mediana do TBT móvel foi de 30,9% de aumento. A meta do teste era reduzir o TBT em pelo menos 20% e preservar LCP e CLS. A referência de desktop teve mediana de 0 ms, o que impede calcular uma redução percentual nesse dispositivo.

## Resultado das vinte navegações

Cinco carregamentos frios por combinação. A tabela mostra a mediana e, entre parênteses, o mínimo e o máximo. A dispersão absoluta mediana (MAD) e as execuções individuais acompanham os resultados.

| Dispositivo | Build | TBT (ms) | LCP (s) | CLS |
| --- | --- | ---: | ---: | ---: |
| mobile | base | 369 (234 a 495) | 2,18 (2,13 a 2,33) | 0 (0 a 0) |
| mobile | candidato | 484 (161 a 1337) | 2,25 (2,03 a 2,62) | 0 (0 a 0) |
| desktop | base | 0 (0 a 0) | 0,35 (0,33 a 0,44) | 0 (0 a 0) |
| desktop | candidato | 0 (0 a 0) | 0,35 (0,28 a 0,48) | 0 (0 a 0) |

| Dispositivo e build | Cinco execuções de TBT (ms), em ordem | MAD (ms) |
| --- | --- | ---: |
| mobile, base | 369, 387, 349, 495, 234 | 20,0 |
| mobile, candidato | 161, 484, 304, 1337, 645 | 179,2 |
| desktop, base | 0, 0, 0, 0, 0 | 0,0 |
| desktop, candidato | 0, 0, 0, 0, 0 | 0,0 |

## Atribuição das tarefas

O trace do navegador identifica recálculo de estilos e layout nas tarefas do documento. No primeiro trace móvel da base, a tarefa de 413 ms incluiu 240 ms de layout e 106 ms de atualização da árvore de estilos. A tarefa de 198 ms incluiu avaliação de script e microtarefas. O perfil de CPU, o manifesto de referências de cliente e o analisador do Turbopack identificaram o agendador do React, react-dom-client.production.js e o bootstrap do Next. Duas amostras independentes também mostraram a inicialização do módulo Contato (ID 85344 neste build) a partir do runtime, a construção de schemas Zod e a ordenação de países do react-phone-number-input. Um tempo atribuído ao scheduler pode incluir trabalho de componentes executados por ele.

A tabela usa a duração mediana da maior tarefa por grupo em cada rodada, em ms. Zero indica que o Lighthouse não apontou tarefa acima de 50 ms naquele grupo em pelo menos três das cinco rodadas. As durações podem incluir trabalho anterior à primeira pintura e, portanto, não devem ser somadas para calcular TBT.

| Grupo atribuído | Celular base | Celular candidato | Desktop base | Desktop candidato |
| --- | ---: | ---: | ---: | ---: |
| Documento / | 354 | 280 | 107 | 105 |
| React DOM, agendador e inicialização Next | 198 | 135 | 58 | 0 |
| Campo de telefone e metadados internacionais | 66 | 67 | 0 | 0 |
| Validação Zod e dependências do formulário | 0 | 0 | 0 | 0 |
| Sem atribuição | 140 | 211 | 0 | 0 |

No quarto carregamento móvel do candidato, o TBT chegou a 1.337 ms. O trace registrou uma tarefa de 963 ms no callback do agendador do React, presente também na base. Esse dado não identifica uma única função de negócio como causa do pico. A rodada foi mantida na dispersão.

## Alteração ensaiada

Em `src/components/ciclo/Contato.tsx`, o candidato substituiu o acesso ao namespace Zod por imports das mesmas funções de validação. O formulário continuou disponível na primeira interação. O build passou a referenciar 157.691 bytes a menos nos arquivos JavaScript listados no HTML da raiz, antes da compressão. A soma inclui scripts condicionais. A primeira navegação móvel registrou cerca de 33 kB a menos transferidos nos scripts locais, incluindo o campo de telefone carregado dinamicamente.

O primeiro ensaio mudou a mensagem de telefone vazio e foi descartado antes da série final. O candidato final aplicou ao resolver a mesma localização padrão que o Zod usava na base. As oito mensagens voltaram a coincidir, incluindo o texto preexistente em inglês do campo de telefone. Os arquivos de consentimento, integrações e tags ficaram fora do diff.

## Ambiente e limites

* Node 24.22.3, Next 16.2.6, Lighthouse 13.6.0 e Chromium Headless Shell 153.0.8010.0, Linux x86-64. Builds de produção locais, mesmo lockfile, sem chaves de produção, snapshot versionado de episódios. `npm run build`, TypeScript e ESLint dos arquivos alterados passaram. O build registrou o aviso existente de 1.712 redirects.
* Servidores locais pré-iniciados. Um navegador novo por execução, cache e cookies inicialmente vazios, sem interação com o aviso. Em cada série, alternamos celular e desktop, uma navegação Lighthouse por vez. O relatório identifica a variação entre rodadas do ambiente compartilhado.
* Celular 412 × 823 (DPR 1,75), CPU 4×, latência aplicada 562,5 ms, download 1.474,56 kbit/s e upload 675 kbit/s. Desktop 1350 × 940 (DPR 1), CPU 1×, preset desktop do Lighthouse. Com throttling aplicado pelo DevTools, esse preset tem latência e limites de transferência aplicados iguais a zero. O perfil informado em cada JSON permite reprodução.
* APIs locais substituídas por respostas de teste no Lighthouse. Solicitações HTTPS externas do navegador bloqueadas. O teste funcional executou separadamente uma cópia fixa do contêiner GTM com todos os destinos isolados. As medições não incluem os tempos reais dos SDKs de terceiros nem a variabilidade de produção.
* O Lighthouse alcançou o limite de espera pela página ociosa em rodadas dos dois builds. Os relatórios contêm LCP, CLS, TBT e trace, e a janela termina em aproximadamente 45 s no celular e 35 s no desktop. Interpretar as diferenças junto com a dispersão.
* A medição histórica de 24/11 informada no briefing foi 430 ms de TBT, 1,1 s de LCP e CLS 0 no celular, e 1.120 ms, 0,3 s e 0 no desktop. O bloqueio alto de desktop não se reproduziu na linha de base isolada. Os dois ambientes não compõem uma mesma série estatística.

## Fluxo comercial e interface

* Corpo do HTML inicial, H1, metadados, links e texto visível equivalentes nos builds da base e do candidato em /, /tiktok-shop e /servicos/agencia-ugc. Comparação de 871 títulos pré-renderizados, sem diferença no candidato de desempenho. Na home, zero pixels diferentes no primeiro viewport e no formulário, tanto no celular como no desktop.
* Primeiro acionamento do menu por teclado, Tab, Escape, foco devolvido ao botão, vídeo de depoimento com a mesma URL e autoplay solicitado somente após ativação. O conteúdo do player de terceiros ficou isolado. As escolhas de cookies e o comportamento de exibição, dispensa e proteção do formulário nos popups de TikTok Shop e UGC coincidiram.
* Para aceitar e recusar o aviso específico de Perfil A, exercitamos a navegação e o formulário. Um page_view próprio na home e outro em /obrigado, mesmo clique do CTA registrado pelo GTM, um form_submit e um generate_lead por envio. O sinal pa_pagina_autorizada apareceu após aceite e ficou ausente na recusa. utm_term e origem foram preservados.
* Teste integrado de ponta a ponta com credenciais fictícias. O contêiner chamou o Pixel simulado e a rota real /api/pipedrive gerou um negócio simulado e um Lead CAPI por envio. Os três receberam o mesmo event_id nas duas escolhas de consentimento. Nenhum contato criado e nenhuma recepção verificada nas plataformas de produção.
* Voltar de TikTok Shop restaurou a home. No ensaio isolado após o envio, Voltar restaurou a URL da home com o conteúdo de /obrigado ainda visível nos builds comparados. Registrar como limitação observada na referência.

## Reversão e acompanhamento

A mudança candidata foi retirada do experimento. O diff de aplicação da branch de desempenho é vazio. Fechar o PR descarta apenas o relato da investigação.

Se uma otimização de desempenho for publicada, registrar data e hora efetivas, SHA e URL. Comparar as duas janelas completas de 28 dias antes e depois da publicação, por dispositivo, no percentil 75 de LCP, INP e CLS. Preferir os dados da URL e identificar explicitamente se a amostra disponível é apenas da origem. Se o CrUX não fornecer amostra suficiente, registrar “sem dados” e manter os testes de laboratório reproduzíveis. TBT é uma medição de laboratório. INP exige observações de interação. Uma nova coleta de usuários reais depende de proposta separada de mensuração e privacidade.

O histórico informado foi de 127 URLs boas em desktop em 26/09, 108 em 20/10 e zero em 21/10/2026. Não havia falha ativa indicada para validação. Essa contagem não foi usada como meta. O experimento não mede efeito causal sobre tráfego ou conversões.

# Conclusão da investigação de desktop da home

Em 24/11/2026 foi recuperado o relatório original do PageSpeed Insights, iniciado às 11h58 de Brasília. O Lighthouse 13.6.0 registrou 1.123,5 ms de TBT (exibidos como 1.120 ms), 323 ms de LCP e CLS zero. Este relatório conserva a atribuição das tarefas daquela execução. O registro bruto do Chrome dessa execução não acompanha o relatório público. [Abrir o resultado original de desktop](https://pagespeed.web.dev/analysis/https-cicloecommerce-com-br/nno97rg7w0ui7wdg2thusn?form_factor=desktop)

| Atribuição original | Tarefas longas, ms |
|---|---|
| Google Ads, biblioteca de carregamento | 330 |
| GA4, biblioteca de carregamento | 327 |
| Meta, configuração do Pixel e biblioteca | 286 e 119 |
| TikTok, biblioteca do Pixel | 185 |
| Contêiner GTM | 131 e 124 |
| Runtime React DOM/Next servido pela Ciclo | 80 e 62 |
| Outro arquivo Next com código de roteamento servido pela Ciclo | 73 |
| Clarity | 73 |
| Documento da home | 57 |

O arquivo da Ciclo destacado no diagnóstico inicial teve 327 ms de CPU acumulada e duas tarefas longas de 80 e 62 ms. A duração das tarefas e os tempos acumulados de CPU não são parcelas somáveis do TBT. Conferimos que o conteúdo dos dois arquivos JavaScript de primeira parte é idêntico ao do build de referência por SHA-256. O arquivo que inclui React DOM e hydrateRoot tem digest iniciado em `0645d0b2e951`. O segundo, com código Next de roteamento e navegação, começa por `cf66c2368eaf`. A identificação usa o conteúdo dos módulos. O relatório original não separa um componente comercial responsável dentro dessas tarefas.

## Cinco reproduções frias

Usamos o HTML entregue pela raiz após a publicação do título, os ativos estáticos do domínio e cópias locais das bibliotecas públicas listadas no relatório original. O navegador abriu a origem HTTPS da Ciclo com todas as respostas permitidas servidas dentro do teste. Nenhum evento foi entregue em produção. Cache novo e consentimento pendente em cada navegador. Lighthouse 13.6.0 em simulação desktop, viewport 1350 × 940, RTT 40 ms, throughput 10.240 Kbps e CPU 1×.

| Rodada | TBT, ms | LCP, ms | CLS |
|---:|---:|---:|---:|
| 1 | 0 | 660 | 0 |
| 2 | 5,5 | 660 | 0 |
| 3 | 0 | 660 | 0 |
| 4 | 0 | 660 | 0 |
| 5 | 0 | 660 | 0 |

Mediana de TBT de 0 ms, faixa de 0 a 5,5 ms e desvio absoluto mediano de 0 ms. Foram capturados cinco novos traces. Nenhum reproduziu o pico histórico. O ambiente isolado usou Chromium 153, com índice de CPU do Lighthouse entre 2.725,5 e 2.825. O PageSpeed usou Chrome 157 com índice 681. O contêiner GTM carregou em todas as repetições. As bibliotecas de Ads, GA4, Meta e TikTok estavam disponíveis no arquivo local, mas não foram solicitadas pelo navegador nessas navegações. As coletas, gravações e outras requisições externas foram bloqueadas. Essas diferenças impedem usar os tempos locais como estimativa do desktop em produção.

## Encerramento

O pico original está confirmado. Os dados não isolam um componente próprio com ganho reproduzível. As melhorias experimentais anteriores já foram revertidas. O PR de desempenho é documental e não demanda deploy ou rollback da aplicação. As regras de cookies e as integrações continuam na versão publicada. Nenhum novo mecanismo de medição foi instalado.

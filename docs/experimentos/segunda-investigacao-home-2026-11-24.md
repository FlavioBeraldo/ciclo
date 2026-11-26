# Segunda investigação de desempenho da home

24 de novembro de 2026. Base de produção `8e47919f839a58608eb1cd767b75376d9d4aedb3`. O experimento de SEO já integra esta base.

## Resultado

As duas alterações de desempenho foram descartadas. O TBT mediano móvel dos logos caiu cerca de 56% na primeira série, mas a redução foi de 5,4% na repetição independente. A meta era de pelo menos 20% de redução reproduzível. O desktop teve mediana de 0 ms na referência. A grade de cases apresentou diferenças de pintura em capturas equivalentes.

Mediana e faixa mínima a máxima de cinco carregamentos frios por dispositivo e versão. Os valores de TBT estão em milissegundos.

| Versão | TBT celular e faixa | TBT desktop e faixa | LCP celular | LCP desktop | CLS mediano nos dois |
|---|---:|---:|---:|---:|---:|
| Versão publicada | 490 (241 a 726) | 0 (0 a 114) | 1,23 s | 0,36 s | 0,000 / 0,000 |
| Grade de cases | 218 (193 a 914) | 0 (0 a 4) | 1,23 s | 0,35 s | 0,000 / 0,000 |
| Logos estáticos | 218 (185 a 325) | 2 (0 a 47) | 1,23 s | 0,35 s | 0,000 / 0,000 |

| Versão | TBT móvel por rodada (ms) | TBT desktop por rodada (ms) | Rodadas móveis abaixo da referência |
|---|---|---|---:|
| Versão publicada | 647, 726, 265, 490, 241 | 0, 80, 114, 0, 0 |  |
| Grade de cases | 220, 914, 193, 218, 196 | 4, 0, 0, 0, 0 | 4 |
| Logos estáticos | 185, 325, 298, 218, 207 | 2, 3, 2, 47, 0 | 4 |

## Contraprova do candidato

Outros cinco pares frios em celular, alternando a ordem. TBT mediano de 212,5 ms na base (faixa de 144 a 565 ms) e 201 ms nos logos (faixa de 170,5 a 434,4 ms). O candidato ficou abaixo da referência em 3 dos cinco pares. A variação da mediana foi de -5,4%. LCP mediano de 1225,2 e 1229,2 ms, respectivamente. CLS mediano de 0 e 0. 

## Onde estava o trabalho

No teste de diagnóstico, a largura de cada seção foi alterada em um pixel e restaurada sob CPU 4×, em uma janela de 412 × 823. A mediana das sete repetições após a primeira foi de 9,2 ms nos cases, 6,3 ms nas soluções e 5,6 ms no contato. Esse teste separa o custo de recálculo das seções. Ele não estima a contribuição de cada seção para o TBT de produção.

Foram avaliadas duas mudanças independentes. A primeira aplicou contenção de layout e de largura apenas à grade de cases da raiz, conservando sua altura natural. A segunda passou a gerar no servidor as propriedades responsivas dos 20 logos da faixa de clientes, preservando carregamento nativo sob demanda, textos alternativos, tamanhos e os mesmos URLs. As duas hipóteses foram construídas desde a mesma árvore de produção. A mudança dos logos aumentou o HTML inicial da raiz de 188.217 para 192.290 bytes antes da compressão. O esquema de validação Zod continuou igual ao da versão publicada.

Na primeira rodada móvel da referência, o Lighthouse associou tarefas de aproximadamente 481 e 323 ms ao contêiner GTM. Na segunda rodada da grade, a maior tarefa foi atribuída ao arquivo do runtime React/Next, com aproximadamente 671 ms. Os registros contêm também tarefas de documento, estilo e layout. Nos logos, na primeira rodada móvel, as três maiores tarefas foram atribuídas ao documento (307 ms), ao runtime React/Next (150 ms) e ao contêiner GTM (94 ms). A atribuição de um arquivo pelo Lighthouse pode envolver outras funções chamadas por ele. A variação entre rodadas não permite atribuir o valor histórico de 1.120 ms a uma tag específica.

## Verificações de UX e mensuração

* HTTP inicial da raiz, TikTok Shop, UGC e Obrigado com títulos, H1, conteúdo textual, links, dimensões e opções responsivas das imagens equivalentes. Mesmo texto renderizado e mesmas posições e dimensões dos elementos conferidos na home, nos três viewports.
* Capturas nas larguras 390, 820 e 1440 px, em cinco posições da home. O candidato de logos coincidiu pixel a pixel com a base nas quinze capturas e também nos ensaios de imagem pendente e de falha. A contenção da grade produziu pequenas diferenças de pintura nos cartões apesar da geometria idêntica.
* Menu móvel por teclado, retorno do foco, acionamento do vídeo, URL do embed, CTA, serviço, popups e proteção do formulário durante interação conferidos em homologação. Ao voltar depois do envio simulado, a URL retornou à raiz e o conteúdo de Obrigado persistiu na referência e nas duas variantes. O player externo e a recepção em contas reais ficaram fora do teste.
* O contêiner GTM público foi executado a partir de uma cópia fixa. Com aceite e recusa do aviso de Perfil A, houve paridade dos eventos, da preferência, da origem e de utm_term. Para cada versão e escolha, um evento `generate_lead`, um Lead interceptado do Pixel, um Lead simulado de CAPI e um negócio simulado de CRM. O event_id foi igual nos quatro pontos. A rota real de servidor foi executada com credenciais fictícias e destinos interceptados.

## Método e limites

Lighthouse 13.6.0 e Chromium Headless Shell 153.0.8010.0. Cinco navegadores novos por dispositivo e build, em ordem alternada entre versões. Rede e CPU simuladas com os perfis padrão mobile e desktop do Lighthouse. A escolha inicial de consentimento estava pendente em todas as medições. As versões foram servidas localmente, com VERCEL_ENV=production, lockfile idêntico e sem credenciais de produção. Endpoints de teste responderam localmente. A inicialização do identificador de visita respondeu HTTP 204, como na rota original. As demais saídas para terceiros foram interceptadas. As rodadas usadas na tabela concluíram com métricas numéricas. A série é independente da primeira investigação, que usou outro método de limitação de CPU/rede e não executou o contêiner GTM no Lighthouse.

Um diagnóstico adicional carregou o HTML e o JavaScript do domínio público em navegador isolado. Os pedidos de coleta foram bloqueados. O título da aba se manteve após a hidratação em celular e desktop. O TBT de desktop de 1.120 ms relatado em 24/11 não se repetiu na mediana da referência. As medições de laboratório também não permitem deduzir o INP nem o impacto sobre tráfego.

O título da aba na versão pública é “Agência de E-commerce Full Funnel | Ciclo E-commerce”. O título Open Graph e o cabeçalho visível mantiveram o texto previsto no experimento de SEO. A atualização do título nos resultados de busca depende do rastreamento e da escolha de apresentação do Google.

## Reversão e acompanhamento

As duas alterações foram revertidas nos diretórios de experimento. O PR guarda os resultados. Não há commit de aplicação nem deploy de desempenho para desfazer. O PR de SEO #28 continua em produção. Para reabrir a investigação do pico de desktop, usar um trace do carregamento que apresenta o problema, registrar dispositivo, versão do navegador, estado de consentimento e cache e reproduzir as mesmas condições em preview. Isso permite identificar o módulo responsável antes de testar outro ajuste.

Após eventual publicação de uma otimização aprovada, comparar janelas independentes de 28 dias no p75 de LCP, INP e CLS, com o mesmo dispositivo e escopo de URL ou origem. Registrar amostra insuficiente se o CrUX não disponibilizar dados. A coleta de campo e a configuração de tags seguem as da versão publicada.

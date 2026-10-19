# Melhorias de conteúdo do plano de SEO — 19/10/2026

Implementação na branch de trabalho, **não publicada**. Produção revalidada em
`57f493a0540a011fbe50122596256a9881b15e07` antes de começar, e nada aqui a
altera.

Nenhum lead submetido, nenhuma mensuração tocada, nenhuma ação em GTM,
ambiente, domínio ou plano.

---

## 1. O que foi autorizado, e o limite disso

O Flávio autorizou, em 19/10, substituir os indicadores das páginas de serviço
pelos mesmos cases que a home já publica, e a revisão estendeu o saneamento às
páginas de solução.

**O limite, dito com todas as letras:** reutilizar esses cases é **autorização
editorial**, não verificação. `src/lib/cases.ts` é byte a byte igual à base de
produção anterior a todo o redesign, o que prova que o conteúdo **já estava
aprovado e publicado** — e não prova nada sobre os números em si. **Nenhuma
auditoria de dado de cliente foi feita**, e não cabia a esta tarefa fazer.
Presença no site nunca foi, aqui, prova de métrica.

Os números institucionais da empresa (`+300 marcas`, `+R$ 350MM em receita`,
`−35% de CAC`), que existem desde antes do redesign em cinco arquivos, **não
foram tocados** — não estavam na exceção.

---

## 2. Matriz ANTES / DEPOIS por URL

### 2.1 Páginas de serviço — 18 URLs

| | ANTES | DEPOIS |
|---|---|---|
| Bloco de resultados | 4 métricas por página, **68 no total**, sem origem (ex.: `4,2x ROAS médio nas contas gerenciadas`, `92% dos clientes renovam`) | Os **4 cases reais**, lidos de `cases.ts`: `+200% Mamô · Vendas YoY`, `+120% GoPro · Vendas YoY`, `+57% Jack Links · Branded Search YoY`, `+35% Gringa · Taxa de Recompra YoY` |
| Introdução do bloco | não havia | `Resultados de projetos da Ciclo. Cada case tem um escopo próprio e não representa uma previsão de desempenho para este serviço.` |
| Bloco de casos | 3 casos anônimos por página, **51 no total**, com nome genérico e número próprio (`E-commerce de eletrônicos`, `ROAS +152%`) | 3 narrativas de desafio e ação dos cases reais, **sem número**, com a categoria como destaque curto |
| Rótulo e título do bloco | `Casos práticos` · `Estratégia aplicada ao mundo real.` | **inalterados** — a contextualização entrou como parágrafo, não como renomeação (ver 9.1) |
| Contexto do bloco | não havia | `Conheça marcas que fazem parte da trajetória da Ciclo.` + link `Ver os cases completos` para `/#cases` |
| FAQ | 4 a 6 perguntas por página | as mesmas **mais uma pergunta nova por página**, específica do escopo |
| Alegações numéricas em texto | 17 sem fonte, em `why`, `what` e FAQ | reescritas mantendo o contexto (2.4) |

`/servicos/agencia-ugc` **continua sem os dois blocos**, como foi publicada em
17/10. Recebeu apenas uma pergunta de FAQ.

As 18 URLs: `tiktok-shop-social-commerce`, `gestao-creators-influenciadores`,
`agencia-ugc`, `creative-strategy`, `google-ads`, `bing-ads`, `meta-ads`,
`tiktok-ads`, `programatica`, `pinterest-ads`, `mercado-livre-ads`,
`shopee-ads`, `amazon-ads`, `crm-email-sms-push-whatsapp`,
`reguas-automacao-personalizadas`, `reativacao-fidelizacao`,
`programas-indicacao-reviews`, `analytics-bi`.

### 2.2 Páginas de solução — 4 URLs

| | ANTES | DEPOIS |
|---|---|---|
| Bloco de resultados | 4 métricas por página, **16 no total**, sem origem | Os mesmos 4 cases reais, pela mesma fonte |
| Introdução do bloco | não havia | a mesma ressalva de escopo |

URLs: `/solucoes/geracao-de-demanda`, `/captacao-de-demanda`,
`/expansao-de-demanda`, `/inteligencia-e-operacao`.

### 2.3 Home, consultorias e TikTok Shop

| URL | ANTES | DEPOIS |
|---|---|---|
| `/` | texto introdutório das soluções com um parágrafo | **mais dois parágrafos** no mesmo lugar: o institucional e o de orientação de escolha, com link em "serviços" para `#solucoes` e em "consultoria" para `/consultoria-para-e-commerce` |
| `/consultoria-para-e-commerce` | texto do método | **mais um parágrafo** sobre transformar dúvidas de crescimento em prioridades, distinguindo orientação de execução contínua |
| `/consultoria-ecom-shift` | 5 perguntas de FAQ | **mais 2**, no escopo atual: diferença entre consultoria e operação contínua, e o que precisa estar disponível do lado da empresa |
| `/tiktok-shop` | 6 perguntas de FAQ | **mais 1**, sobre o que avaliar antes de contratar agência. Toda a copy de SEO preservada |

Hero, title e slogan da home: **intocados nesta rodada**.

### 2.4 As 17 alegações numéricas reescritas

Correção localizada, mantendo o contexto da resposta. Nenhuma pergunta foi
removida.

| Página | ANTES | DEPOIS |
|---|---|---|
| google-ads | "convertem de 3 a 5 vezes mais que outras fontes" | "costuma estar mais perto da decisão" |
| google-ads | "desperdiça entre 30% e 50% do potencial do Shopping" | "reduz o alcance e a qualidade das impressões" |
| bing-ads | "CPCs de 30% a 50% abaixo do Google" | "a disputa por palavra-chave costuma ser menos acirrada, o que muda o custo por clique" |
| crm | "ROI médio de 4000% (R$40 para cada R$1)" | "canal de custo baixo por mensagem, e o retorno depende da base, da oferta e da frequência" |
| crm | "taxa de abertura acima de 95%" | "costuma ser lido com mais frequência do que e-mail" |
| crm | "abertura 3x maior e conversão 5x maior" | "costuma ser lida e convertida melhor do que disparo em massa" |
| réguas | "R$50-200 de receita adicional por novo cliente" | "aproveita o momento de maior atenção do novo cliente" |
| réguas | "captura 80% do valor das automações" | "cobrem os momentos mais frequentes da jornada" |
| reativação | "custa de 5 a 7 vezes menos" | "costuma custar menos, porque a marca já é conhecida" |
| reativação | "recompra 40-60% maior" | "dá um motivo a mais para a próxima compra" |
| indicação | "convertem 3-5x mais e LTV 25% maior" | "chega com a confiança de quem indicou, o que encurta a decisão" |
| indicação | "aumentam a conversão em até 30%" | "ajudam quem está em dúvida a decidir" |
| indicação | "60% mais conversão que e-mail genérico" | "costuma ter resposta melhor do que e-mail genérico" |
| analytics | "crescem 2-3x mais rápido" | "reduz a chance de insistir no que não funciona" |
| analytics | "recupera 15-30% das conversões" | "recupera parte das conversões que o pixel não captura" |
| tiktok-shop | "Para ticket acima de R$300" | "Em ticket mais alto" |
| creative-strategy | "hook rate, referência acima de 25%" | "hook rate (quem assiste aos primeiros segundos)" |

**O que ficou, e por quê.** Parâmetros que descrevem **como o trabalho é
feito** não foram removidos: cadência de criativos por faixa de verba
(creative-strategy e meta-ads), participação do canal Microsoft no
investimento de busca, faixas de ACoS no Mercado Livre e o exemplo hipotético
de CAC em indicação. São referência de método e exemplo de cálculo, não
promessa de resultado. Contagens de etapa e de pilar também ficaram.

### 2.5 Structured data

`FAQPage` é o único JSON-LD que carrega texto de FAQ, e o teste confere que as
perguntas do schema aparecem no HTML e que nenhuma das alegações corrigidas
sobrou nele. **Não havia `aggregateRating`, `reviewCount` nem `offers`** com
número inventado, antes ou depois.

---

## 3. Blog

### 3.1 As três pautas que já tinham artigo — complemento, não duplicata

| Pauta | URL reaproveitada | O que entrou |
|---|---|---|
| Escolher agência | `/blog/qual-e-o-melhor-momento-de-contratar-uma-agencia-de-marketing-para-meu-e-commerce` | "Como comparar propostas de agência sem olhar só o preço" e "Perguntas que ajudam a decidir" |
| Google Ads × Meta Ads | `/blog/facebook-ads-google-ads-ou-tiktok-qual-escolher-em-2025` | "Google Ads ou Meta Ads: como decidir por onde começar" e "Por que comparar o ROAS dos dois não resolve" |
| ROAS × margem | `/blog/markup-ou-margem-de-contribuicao-qual-usar-no-e-commerce` | "ROAS ou margem: qual indicador deve guiar a decisão de mídia" e "Como levar isso para a rotina" |

**Corpo, título, data, autor e slug originais ficaram intocados.** O
complemento vive em `src/lib/blog-complementos.ts`, fora do artigo, e o teste
confere que `src/data/wp-posts.json` não foi editado. Não há campo de "data de
atualização" no sistema, então nenhuma data foi inventada.

### 3.2 As cinco pautas sem cobertura — artigos novos

| Pauta | URL nova |
|---|---|
| Custo e modelos de contratação | `/blog/quanto-custa-uma-agencia-de-marketing-para-e-commerce` |
| Agência × equipe interna × consultoria | `/blog/agencia-equipe-interna-ou-consultoria-para-e-commerce` |
| Quando trocar de agência | `/blog/quando-trocar-de-agencia-de-marketing-no-e-commerce` |
| Escolher agência de TikTok Shop | `/blog/como-escolher-uma-agencia-de-tiktok-shop` |
| Medir CRM além da abertura | `/blog/como-medir-o-resultado-do-crm-alem-da-taxa-de-abertura` |

Todos em Markdoc, no template existente, com autoria institucional
`Time Ciclo`. **Nenhuma pessoa real aparece como revisora.** Sem valor
comercial inventado, sem ranking de "melhores" autoavaliado, sem imagem nova.

Cada um fecha com link para o serviço ou a consultoria pertinente e mais um ou
dois links para conteúdo real. São **16 links internos** nos cinco artigos, e
o teste confere que todos respondem 200.

**Nenhuma página duplicada de agência foi criada** para sinônimo de busca.

---

## 4. Escopo protegido

| | |
|---|---|
| `/playbook-social-commerce` | **intocado** — passo 5 compara DOM, estilo e geometria em desktop e celular |
| URLs e slugs | nenhum alterado; só URLs novas de artigo |
| CSS, fontes e layout | **nenhuma regra tocada**. O parágrafo de ressalva usa `.inner-lead`, classe que a própria página já usava no hero |
| Quantidade de cards | 4 em resultados e 3 em cases, como antes |
| Formulários, IDs de evento, atribuição | intocados — passos 6 e 15 |
| APIs, backend, integrações, regras comerciais | intocados. `src/lib` de integração não foi alterado; a exceção editorial cobriu `servicos.ts`, `solucoes.ts` e dois módulos novos só de conteúdo |
| GTM, ambiente, domínio, plano | nada tocado |

Os dois módulos novos (`cases-conteudo.ts` e `blog-complementos.ts`) estão
declarados em `hashes-excecoes.txt`, e o passo 1 confere isso.

---

## 5. Evidência dos cases

| | |
|---|---|
| Fonte | `src/lib/cases.ts`, lida por `cases-conteudo.ts`. Nenhum valor é digitado de novo |
| Prova de que não foi tocada | `git diff 7ae962b..HEAD -- src/lib/cases.ts` volta **vazio** — byte a byte igual à base de produção anterior ao redesign |
| Proteção contra erro silencioso | se alguém renomear um indicador em `cases.ts`, `cases-conteudo.ts` **lança e quebra o build**, em vez de publicar célula vazia |
| Repetição | os valores aparecem **só** no bloco de resultados. O bloco de cases não tem número, e o teste afirma isso |
| Atribuição | a ressalva diz que cada case tem escopo próprio e não representa previsão para aquele serviço. As ações descritas são full funnel, sem atribuir resultado a um canal |
| Linguagem interna | o teste reprova se "não temos dados", "números removidos", "sem atribuição comprovada" ou "não verificado" aparecerem na interface |

---

## 6. Testes

**Passo 25 novo**, em `docs/redesign/conteudo-seo.mjs`, sem rede externa e sem
criar lead:

1. nenhuma métrica ou destaque escrito à mão em `servicos.ts` e `solucoes.ts`;
2. 17 serviços e 4 soluções lendo a fonte central; as 8 frases corrigidas não voltaram;
3. `cases.ts` byte a byte igual à base; `cases-conteudo.ts` sem valor próprio;
4. no HTML servido: as 4 marcas com o valor certo, a ressalva presente, 3 cards no bloco de cases, **nenhum número** nele, link para `/#cases`, e nenhuma linguagem de auditoria;
5. `/servicos/agencia-ugc` segue sem os dois blocos;
6. FAQs anteriores preservadas em três páginas, títulos originais nos três artigos complementados, e `wp-posts.json` não editado;
7. as 57 URLs internas citadas respondem 200;
8. `FAQPage` consistente com o HTML em três páginas, sem alegação removida;
9. os 5 artigos novos com 200, h1, canonical próprio, autoria institucional e presença no sitemap.

**Suíte completa verde, 25 passos**, com build e typecheck. Os que mais
importam aqui:

| Passo | Resultado |
|---|---|
| 2. Typecheck e lint | limpo |
| 3. Build | **887 páginas** (eram 882; os 5 artigos novos) |
| 5. Playbook | **idêntico** em desktop e celular |
| 6. Mensuração | eventos e payloads **idênticos** nos 4 formulários |
| 7. Internas | 22 páginas com conteúdo, URLs e SEO preservados |
| 8. Blog | listagem e **92 artigos** (6 curados, 47 Keystatic, 39 do WordPress) preservados |
| 10. h1 | 38 páginas com um h1 só |
| 16. Responsivo | 11 rotas sem estouro em 1440 e 390 |
| 25. Conteúdo | TUDO OK |

**Medição extra de viewport**, além do passo 16, por causa dos rótulos mais
longos no bloco de resultados: `/servicos/google-ads`,
`/servicos/mercado-livre-ads`, `/solucoes/geracao-de-demanda`, dois artigos e a
home, em **1440 e 390** — sem estouro de página e **sem célula vazando** em
nenhum dos doze pares.

**Três passos ganharam o gancho de resolução** (`internas-seo.mjs`,
`h1-das-paginas.mjs`, `servicos-encerrados.mjs`): eles importam `servicos.ts`
direto, que passou a ter importação relativa sem extensão. Sem isso, falhavam
com `ERR_MODULE_NOT_FOUND` — e falharam, até o gancho entrar.

---

## 7. O que NÃO é implementação de conteúdo do site

Registrado para não ser lido como concluído:

- **Mídia externa, assessoria e menção em veículo** não foram feitas.
- **Certificações** não foram obtidas nem declaradas em lugar nenhum.
- **Dados primários** (pesquisa própria, benchmark com amostra) não existem, e
  por isso nenhum número novo foi criado.
- **Rankings** não foram produzidos, nem de "melhores agências" nem equivalente.
- **Reindexação** não acontece por este deploy. O calendário é do Google.

---

## 8. Limites

- **É local, não é o domínio.** O proxy desta sessão recusa
  `cicloecommerce.com.br`. Está provado o que o código entrega.
- **Reutilizar os cases é autorização editorial, não verificação** (seção 1).
- A escolha de **um indicador por case** é editorial: cada case tem dois ou
  três, e o bloco tem quatro células. Os escolhidos estão em
  `INDICADOR_POR_MARCA`, e trocar é uma linha.
- As **narrativas são as mesmas em todas as páginas de serviço**, porque os
  cases são da empresa, não do canal. Isso é deliberado, e a ressalva diz.
- **Nenhum conteúdo de outra pessoa foi modificado**: os artigos existentes
  receberam seção ao fim, com corpo e metadados originais intactos.


---

# 9. Segunda rodada — revisão de 19/10

Correções pedidas na revisão independente da primeira implementação, antes de
qualquer publicação. Produção continua em
`57f493a0540a011fbe50122596256a9881b15e07`.

## 9.1 Heading renomeado: revertido

Na primeira implementação eu troquei o rótulo e o H2 do bloco de casos nas
páginas de serviço:

| | |
|---|---|
| Base e agora | `Casos práticos` · **`Estratégia aplicada ao mundo real.`** |
| O que eu tinha posto | `Cases da Ciclo` · `Marcas que crescem com a Ciclo.` |

**Revertido.** O reforço do Flávio é explícito: complementar, não alterar
estrutura de conteúdo. A contextualização continua, mas como **parágrafo
complementar** abaixo do heading original, junto do link para `/#cases`.

O teste passou a afirmar os dois lados: que o heading e o rótulo originais
estão de pé, e que **nenhum heading renomeado sobrou**.

## 9.2 Diff auditado: só acréscimo

Conferi arquivo por arquivo contra a base. Nos sete arquivos de template e
conteúdo tocados, o diff tem **zero linhas removidas** e **nenhuma linha de
`h1`, `h2` ou `section` alterada** — com uma exceção declarada: o template do
blog, onde o apêndice editorial cria a própria `<section>` com `<h2>` por
bloco, que foi o que a revisão autorizou.

## 9.3 Os três ajustes nos complementos do blog

| Trecho | Antes | Agora |
|---|---|---|
| Google × Meta | "Busca atende quem já está procurando. Social apresenta a marca para quem ainda não procurou." | "Campanhas de busca podem captar intenção já expressa. Campanhas em redes sociais também podem apresentar produtos, estimular descoberta e alcançar pessoas que já conhecem a marca. A escolha depende do objetivo e do formato." |
| Google × Meta | "a busca tende a ser o caminho mais curto até a primeira venda" | "vale avaliar campanhas que respondam a essa intenção" |
| Soma de plataformas | "somar os dois costuma contar a mesma venda duas vezes" | "somar as receitas atribuídas pelas plataformas pode contar a mesma venda mais de uma vez" |
| ROAS | "quanto de receita veio para cada real investido" | "relaciona a receita **atribuída** aos anúncios ao investimento feito neles" |
| Margem | "quanto sobra depois dos custos do produto, do canal e da operação" | "receita menos os custos e as despesas **variáveis** do pedido — produto, comissão, taxa de pagamento, frete. **Não é o lucro depois de todos os custos**, porque não considera os fixos" |

**Apoio conceitual**, sem citação longa: a definição de ROAS como receita
atribuída sobre investimento vem da documentação de ajuda do Google Ads
(`support.google.com/google-ads/answer/13064207`), e a de margem de
contribuição como receita menos custos e despesas variáveis vem de material do
Sebrae (`meuatendimento.sebrae.com.br`, artigo sobre margem de contribuição).

**Nada do corpo original dos artigos foi tocado.**

## 9.4 Os cinco artigos novos, corrigidos

Só no conteúdo novo. Resumo por artigo:

**Custo.** Saíram "modelo mais usado", "a qualidade cai" e o "fee menor"
obrigatório no híbrido. Incentivo virou possibilidade ("o que ele **pode**
incentivar"), fee fixo deixou de garantir time dedicado, e cachê, direitos e
ferramentas passaram a ser "podem estar incluídos ou ser cobrados à parte,
confirme na proposta". A pergunta 6 passou a dizer margem **de contribuição** e
receita **atribuída pelas plataformas**.

**Agência × equipe × consultoria.** Os três deixaram de ser regra universal: o
texto agora diz que **o escopo pactuado define** o que é estratégia e o que é
execução. Saíram "agência absorve variação sem contratar", "interno conhece
melhor que qualquer pessoa de fora", "erro mais comum" e "raramente funciona".
A frase "nenhum modelo corrige problema de produto, preço ou operação" estava
errada e foi trocada: **contratar marketing não resolve automaticamente** esses
pontos, uma consultoria **pode identificar e recomendar ajustes**, e a decisão
depende da empresa.

**Troca de agência.** "Alguns meses até a operação voltar ao ritmo" virou
"período de transição". As três hipóteses passaram a ser exemplos, não
diagnóstico exaustivo. "Em geral se resolvem" virou "podem resolver parte".
Titularidade de conta e direitos de material passaram a depender de contrato,
sem afirmação jurídica absoluta.

**TikTok Shop.** "Imagem adequada ao formato vertical" virou "às
especificações do canal". "Direito de uso que não está em contrato não existe"
virou "vale ter autorização e condições de uso claras e registradas antes de
impulsionar". Saiu "a maioria dos projetos trava". As quatro frentes passaram a
ser **frentes que precisam ter responsável definido**, não serviços incluídos
em todo contrato. E o link para `/servicos/tiktok-shop-social-commerce`, que
**redireciona** para `/tiktok-shop`, foi trocado pela URL canônica, com um
segundo link para um artigo real distinto.

**CRM.** Corrigido o **erro conceitual**: intervalo entre compras e recência
são coisas diferentes, e agora aparecem separados, com definição de cada um.
Saíram "quase todo relatório" e "quase nunca aparece". A comparação de grupos
passou a dizer que **dá indícios, pode sofrer viés de seleção e de contexto, e
não equivale a experimento com sorteio**. "Não some canais" virou "não some
**receitas atribuídas** de fontes diferentes". E a receita atribuída ao CRM
passou a ser descrita como **subconjunto** das vendas, com reconciliação de
pedidos, não igualdade com a receita total. A abertura deixou de ser
apresentada como diagnóstico isolado.

**`readTime`** dos cinco recalculado pelo comprimento real, na convenção do
próprio blog (~158 palavras por minuto, mediana dos artigos existentes): 6, 5,
5, 4 e 5. Nenhum artigo antigo teve `readTime` alterado.

## 9.5 Os dois testes que podiam passar sem comprovar

**JSON-LD.** O `html.replace(/<[^>]+>/g,' ')` mantinha o conteúdo dos
`<script>`, então a pergunta era encontrada no próprio JSON-LD. Agora o texto
comparado **remove `script` e `style` antes**, e o teste afirma isso
explicitamente. Passou a comparar **pergunta e resposta**, normalizadas, e a
conferir **quantidade nos dois sentidos**: nenhuma pergunta do schema fora do
HTML, e nenhuma pergunta do accordion fora do schema.

**Base fixa.** A comparação do legado usava `HEAD`, o que deixava de proteger
assim que o commit era feito. Agora a base é **`57f493a`**, fixa. O teste
confere **byte a byte** 18 arquivos: `wp-posts.json`, `cases.ts`, os quatro
CSS, as fontes, o playbook e as integrações de mensuração.

Para `servicos.ts` e `solucoes.ts`, passou a conferir **campo a campo e na
ordem** — slug, title, tagline, heroHeadline, heroDescription, parentSlug e
relatedSlugs — e **todas as perguntas originais**: as **76 do serviço** e as
**16 da solução**, não três amostradas. As exceções autorizadas estão
declaradas no próprio teste: `results`, `examples`, `faq`, `what`, `why` e
`howItWorks`.

`agencia-ugc` tem bloco próprio de verificação, por causa do regex que engoliu
o `faq` dela na primeira tentativa: `results` vazio, `examples` vazio e as 7
perguntas inteiras.

**Um ajuste que o próprio teste exigiu.** A primeira versão contava 89 `title:`
na base contra 38 agora e acusava divergência. Não havia divergência: **51
daqueles `title` eram dos `examples` removidos por autorização**. O regex
passou a ancorar no campo de topo, com indentação exata.

## 9.6 As duas fontes de FAQ de `/tiktok-shop` — unificadas

`/tiktok-shop` tinha **duas fontes para o mesmo FAQ**: o accordion, que lê
`FAQ` de `tiktok/conteudo.ts`, e um `faqSchema` **escrito à mão** em
`page.tsx`.

**Primeiro achado, meu:** acrescentei a pergunta nova só no accordion, e o
schema sairia em desacordo com o HTML. Foi o teste novo que pegou.

**Segundo achado, herdado:** como as fontes eram independentes, **cinco das
seis respostas do schema já divergiam** do texto visível na base de produção.

**Resolvido na origem, por autorização da revisão:** o `faqSchema` passou a
derivar da **mesma constante `FAQ` que o accordion exibe**, exatamente como já
acontece nas páginas de serviço e de solução. Saíram 62 linhas de schema
escritas à mão; entraram 17 que geram o `mainEntity` da fonte única.

**Nenhuma pergunta ou resposta visível mudou.** O diff de `conteudo.ts` contra
a base tem só a pergunta nova, em linhas de acréscimo — as seis originais estão
intactas. O que mudou é **de onde o schema lê**, que é representação técnica,
não conteúdo exibido.

Com isso o teste deixou de tolerar divergência: a régua passou a ser
**correspondência completa**, pergunta e resposta, sem exceção. Resultado nas
três páginas conferidas: 5, 5 e **7 de 7**.

## 9.6b A verificação de ordem era tautologia

A expressão `antes.every((q, i) => depois.indexOf(q) >= i || depois.includes(q))`
passava sempre que todas as perguntas existissem, **mesmo invertidas** — o
segundo termo do `||` garantia isso.

Virou **subsequência com cursor crescente**: cada pergunta original precisa
aparecer depois da anterior, o que também trata pergunta repetida. E o teste
agora prova que a verificação morde, rodando a própria lógica contra sequências
embaralhadas de propósito:

| Caso | Esperado |
|---|---|
| ordem mantida, com itens novos no meio | passa |
| ordem invertida | **reprova** |
| troca de duas | **reprova** |
| pergunta sumida | **reprova** |
| pergunta repetida | tratada |
| repetida que virou uma só | **reprova** |

## 9.6c A frase sobre margem no artigo de custo

Tinha sobrado uma contradição com o próprio artigo:

| | |
|---|---|
| Antes | "Variável sobre margem empurra para o que dá lucro." |
| Agora | "Variável sobre margem de contribuição usa uma medida diferente da receita; a fórmula, os custos considerados e as responsabilidades precisam estar definidos no contrato." |

Só essa frase, só no conteúdo novo.

## 9.7 Limites desta rodada

- **É local, não é o domínio.** O proxy recusa `cicloecommerce.com.br`.
- **A estrutura foi provada pelo diff do fonte, não por render da base.**
  Comparar HTML exigiria compilar a árvore de `57f493a`; tentei e o Turbopack
  recusa `node_modules` fora da raiz do projeto. O diff do fonte prova o mesmo
  de forma exata: sem linha removida e sem linha de heading alterada, título,
  seção e ordem não mudaram.
- **As cinco respostas divergentes de `/tiktok-shop` continuam divergentes.**
- Reutilizar os cases segue sendo **autorização editorial, não verificação**
  (seção 1).


---

# 10. Evidência do candidato final

Produção revalidada em `57f493a0540a011fbe50122596256a9881b15e07`, intocada.

| | |
|---|---|
| Build | **verde, 887 páginas**, com `.next/standalone` apagado antes |
| `conteudo-seo.mjs` reforçado | **TUDO OK** — inclui a prova negativa da ordem e a correspondência completa do FAQPage |
| Passo 12, `/tiktok-shop` | **TUDO OK** — conteúdo, SEO e schema preservados, desktop e celular |
| **Crawl de links** | **83 URLs** do conteúdo novo, complementado, serviços, soluções e artigos: **0 fora de 200** |
| **Hashes protegidos** | **26 de 26 idênticos** a Production |

Os 26 conferidos: `conversions`, `attribution`, `meta-capi`, `pipedrive-server`,
`supabase-server`, `ga4-lead-events`, `pipedrive-fields`, `webhook-auth`,
`cases.ts`, `wp-posts.json`, os quatro CSS, `fonts.ts`, `globals.css`, o
playbook, as seis rotas de API, o cron, `next.config.ts`, `robots.ts` e
`sitemap.ts`.

A suíte completa de 25 passos permanece como evidência da rodada anterior
(44 asserções, 0 falhas). Não foi repetida: os arquivos protegidos não mudaram,
e o que mudou nesta rodada está coberto pelos testes acima.


---

# 11. Registro da publicação de 19/10, 14:41 BRT

Fechamento da rodada anterior, conforme conferência externa.

| | |
|---|---|
| SHA de merge | `6b05722180f36dfb3ae8a0d4c1a6f286adec443d` |
| Deployment **GitHub** | `7180619393` |
| Deployment **Vercel** | **`H68MaLgWmFAXFF4ZYE9TkLTuSebH`** |
| Estado | Ready, Production, domínio atribuído, **14:41:25 BRT de 19/10** |
| Compare `a3a31d7...6b05722` | **0 arquivos, 0 adições, 0 remoções** |

Verificado no domínio pela revisão independente: Google Ads com 4 cases,
contexto, H1, H2 e `formId` preservados; home e solução sem overflow; os 5
artigos com H1 e canonical próprios e `index, follow`; os 3 apêndices sob o H1
original; TikTok Shop com 7 perguntas e 7 respostas iguais ao schema. Mobile
390 sem overflow.

**Limite registrado:** o navegador da revisão bloqueia `sitemap.xml` e
`robots.txt` com `ERR_BLOCKED_BY_CLIENT`, e a ferramenta web não renderiza XML.
A validação desses dois arquivos é **do build e da árvore publicada**, não
leitura externa. Isso não é falha do site. Nenhum envio de formulário foi feito
nessa rodada, e nenhum teste ponta a ponta novo foi declarado.

---

# 12. Rodada de 19/10, ~14:54 — tese da Ciclo e cases em vídeo

Duas alterações autorizadas pelo Flávio. Base de produção
`6b05722180f36dfb3ae8a0d4c1a6f286adec443d`, revalidada; nenhum trabalho
concorrente (as árvores de produção e de trabalho são a mesma, `b37007e8`, e a
diferença é só topologia de merge).

## 12.1 (A) A tese da Ciclo em quatro artigos

Os parágrafos fornecidos entraram **no fim da seção indicada, antes do H2
seguinte**, como parágrafos normais. **Nenhum H2 novo**, para não mexer no
índice nem nas âncoras. A primeira frase de cada bloco entra em negrito, como
entrada editorial, no estilo que o blog já usa.

| Artigo | Seção que recebeu | Antes de |
|---|---|---|
| `quando-trocar-de-agencia-de-marketing-no-e-commerce` | Perguntas para fechar a decisão | `## Para seguir` |
| `quanto-custa-uma-agencia-de-marketing-para-e-commerce` | Um limite honesto sobre comparação de preços | `## Para seguir` |
| `como-escolher-uma-agencia-de-tiktok-shop` | Perguntas que a agência deveria fazer para você | `## Um limite honesto` |
| `agencia-equipe-interna-ou-consultoria-para-e-commerce` | Combinações que funcionam na prática | `## Um limite que vale dizer` |

Texto inserido **exatamente como enviado**. Nada foi substituído, removido ou
reordenado; frontmatter, URL e canonical intocados; nenhuma promessa, número
novo ou case novo.

## 12.2 (B) O bloco de indicadores virou cases em vídeo

**Inventário.** O bloco aparecia em **21 URLs**: as 4 de `/solucoes/*` e **17
de `/servicos/*`** — todas menos `/servicos/agencia-ugc`, que nunca o teve. A
aba que o Flávio tinha aberta, `/servicos/creative-strategy`, é uma delas.

| | Antes | Depois |
|---|---|---|
| Seção | `Resultados` · `O impacto da estratégia no negócio.` · ressalva · 4 indicadores | **`Cases em vídeo` · `Quem vive, recomenda.`** · 4 vídeos · CTA `/depoimentos` |
| Âncora `#resultados` | presente | **mantida, única na página** |
| Link do índice | `#resultados` | **inalterado, continua resolvendo** |

**Sem redesenhar e sem duplicar.** O bloco é o componente novo
`CasesEmVideo.tsx`, que usa o `VideosDepoimento` que a home e `/depoimentos`
já usavam, com os mesmos quatro vídeos. A lista saiu de `home/Depoimentos.tsx`
para esse módulo e a home passou a lê-la de lá: **mesma lista, mesma ordem,
render idêntico**. O envoltório é `section dark proof` com as duas faixas de
transição, igual ao de `/depoimentos` — não existe variante clara dessa grade,
porque a legenda do cartão é desenhada para fundo escuro.

**Acessibilidade e player, por reuso:** o iframe **só é montado depois do
clique**, o cartão é `<button>`, o modal tem `role="dialog"`, `aria-modal`,
`aria-label`, fecha no Escape e no clique fora, prende o Tab, devolve o foco ao
cartão de origem e trava a rolagem. Medido em desktop e em 390: **4 cards, sem
overflow, nenhum iframe antes do clique**, modal abrindo e fechando nos dois.

**Consequência registrada:** `RESSALVA_RESULTADOS` saiu de
`cases-conteudo.ts` — sem número na página, não há o que ressalvar. O campo
`results` continua nos dados porque é ele que decide **quais páginas têm o
bloco**; está dito no código.

**O que NÃO foi tocado:** o bloco narrativo `Casos práticos` segue com o
heading, os 3 cards e o parágrafo de contexto; home, `/depoimentos`, playbook,
e os serviços sem o bloco continuam como estavam.

## 12.3 Testes

O passo 25 foi reescrito na parte que cobria o bloco antigo — **ajustado para
a substituição autorizada, sem afrouxar o resto**:

- as **21 páginas** têm **exatamente um** bloco de vídeo com 4 cards;
- **nenhuma** mantém `result-grid` ou o H2 antigo;
- a âncora `#resultados` existe e é **única** em todas;
- marcas, título, CTA e link do índice conferidos em uma página de cada tipo;
- **nenhum iframe antes do clique**;
- o bloco narrativo e `agencia-ugc` intactos;
- home e `/depoimentos` com a grade como era.

Na verificação de diff contra a base, a remoção passou a ser permitida **só
nos dois templates de interior**, e mesmo ali o teste exige que **o que saiu
seja apenas o bloco de indicadores** — qualquer linha removida fora dele
reprova.

## 12.4 Limites

- **É local.** O proxy recusa o domínio.
- **As miniaturas do YouTube não carregam aqui**: `i.ytimg.com` responde `000`
  pelo proxy, então a captura local mostra o espaço da imagem vazio. O markup é
  o mesmo da home, que funciona em produção. **Não é defeito**, é o ambiente.
- O vídeo em si não foi reproduzido: o iframe aponta para o YouTube, também
  bloqueado daqui. O que foi verificado é que **o iframe só aparece após o
  clique** e que o modal se comporta como esperado.

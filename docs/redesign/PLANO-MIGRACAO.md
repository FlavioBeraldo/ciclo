# Plano de migração do redesign 2026

Documento operacional. Quem executa a publicação segue daqui, na ordem.
Atualizado em 17/10/2026.

**Estado: aguardando a liberação técnica do SHA exato.** A migração está
autorizada pelo Flávio; o que falta é a revisão independente aprovar o SHA.
Este documento existe para que, quando ela vier, a publicação seja uma
sequência conferida e não uma improvisação.

**Mudança de 17/10, 20:08.** A comprovação real das integrações passa para
**depois da publicação**, no domínio real. Ela não é mais pré-requisito, e
nunca poderia ter sido: as treze variáveis de integração existem só em
Production, então o Preview não tem com o que falar (seção 4). Se algo
quebrar, o conserto é **restaurar o comportamento da base** — não redesenhar
regra — e rollback se for crítico.

---

## 1. O que muda e o que não muda

| | |
|---|---|
| Muda | A camada visual de **todas** as rotas públicas, menos uma |
| Não muda | `/playbook-social-commerce` — **integralmente intocado**, inclusive efeitos indiretos de CSS e de componente compartilhado |
| Não muda | A camada de mensuração, CRM, atribuição e telemetria |
| Não muda | URLs, exceto as duas remoções já autorizadas |
| Muda, e é funcional | A busca dos episódios do podcast, que passou a rodar no servidor |

### 1.1 A mudança funcional do podcast, separada

Esta é a **única** mudança de comportamento do candidato que não é visual.
Fica isolada aqui de propósito, para poder ser avaliada e revertida por conta
própria.

| Antes | Depois |
|---|---|
| Busca no navegador, depois da montagem; o HTML saía com o fallback | Busca no servidor; o HTML já sai com episódio real |
| Fallback = 4 vídeos de depoimento reetiquetados como episódio | Fallback = os 8 episódios reais mais recentes, gravados no build |
| Sem tempo limite | `AbortSignal.timeout(3500)` por chamada |
| `/ofatorm` estática | `/ofatorm` com `revalidate = 3600` |

**Commits:** `4f9f6d6` (checkpoint) e `e0f5bc2` (tempo limite e correção do
gerador). **Reverter só o podcast** é possível revertendo esses dois sem
tocar no resto.

**Efeito em ISR:** a home não muda; `/ofatorm` acrescenta ~720 regenerações
por mês. Detalhe na seção 25 da auditoria.

---

## 2. Antes de publicar

Tudo abaixo é pré-requisito. Nenhum item é dispensável.

| # | Item | Como se confere | Quem |
|---|---|---|---|
| 1 | **SHA final revisado** | A revisão independente aprova um SHA exato, não "a branch" | revisão |
| 2 | **Build e testes verdes nesse SHA** | `bash docs/redesign/verificar.sh comparar` → 19 passos | automático |
| 3 | **Novo `git fetch` do HEAD de produção** | `git fetch origin claude/elegant-darwin-HVyvT && git rev-parse origin/claude/elegant-darwin-HVyvT`. Se tiver avançado, **rebase antes**, nunca force-push | quem publica |
| 4 | **Conteúdo novo preservado** | `git diff --stat <HEAD-prod>...<SHA> -- content/ src/data/`. Artigo publicado pelo Keystatic entra por commit em `content/blog`; se houver commit novo, ele precisa estar no SHA | quem publica |
| 5 | **Diff da camada protegida revisado** | `git diff <HEAD-prod>...<SHA> -- src/lib src/app/api`. Só pode conter os arquivos de `docs/redesign/hashes-excecoes.txt` | revisão |
| 6 | **Playbook congelado** | Passo 5 da suíte: impressão digital de fontes, estilo computado e três estados, em desktop e celular. Cobre efeito indireto de CSS compartilhado, porque mede o que o navegador aplicou, não o arquivo | automático |
| 7 | **Inventário de URLs conferido** | Seção 3 deste documento | quem publica |
| 8 | **Redirects permanentes sem laço** | Passo 11 da suíte | automático |
| 9 | **Variáveis e configurações de produção preservadas** | Seção 4 | quem publica |
| 10 | **Rollback disponível** | Seção 6 — e a prova é de **deployment**, não de commit | quem publica |
| 11 | ~~Teste real preparado~~ | **Deixou de ser pré-requisito em 17/10.** Vira verificação pós-publicação, seção 6.2. O que falta combinar está na seção 7 | — |

---

## 3. Inventário de URLs

**Regra: as mesmas URLs, com duas exceções já autorizadas.**

| URL | Depois | Status | Indexação |
|---|---|---|---|
| `/` | igual | 200 | index |
| `/blog`, `/blog/[slug]` (todas) | igual | 200 | index |
| `/servicos/[slug]` × 19 | igual | 200 | index |
| `/solucoes/[slug]` × 4 | igual | 200 | index |
| `/tiktok-shop` | igual | 200 | index |
| `/depoimentos` | igual | 200 | index |
| `/ofatorm` | igual | 200 | index |
| `/ecomshift` | igual | 200 | index |
| `/consultoria-para-e-commerce` | igual | 200 | index |
| `/consultoria-ecom-shift` | igual | 200 | index |
| `/mapa-do-site` | igual | 200 | index |
| `/politica-de-privacidade` | igual | 200 | index |
| `/obrigado` | igual | 200 | **noindex, nofollow** — já era |
| `/aplicacao` | igual | 200 | **noindex** — já era |
| `/link-bio` | igual | 200 | **noindex, nofollow**, fora do sitemap — já era |
| `/playbook-social-commerce` | **intocado** | 200 | como está |

**As duas remoções autorizadas:**

| URL antiga | Destino | Status |
|---|---|---|
| `/servicos/processos-playbooks` | `/solucoes/inteligencia-e-operacao` | **308** |
| `/servicos/growth-continuo` | `/solucoes/inteligencia-e-operacao` | **308** |

Conferido pelo passo 11: respondem 308, o destino responde 200, e **não há
cadeia nem laço** — um salto só.

**Sitemap:** 856 URLs, igual à contagem da base. **Canonical:** uma por
página, apontando para `https://cicloecommerce.com.br` + caminho. **robots:**
inalterado. Os três são conferidos nos passos 7 e 8.

---

## 4. Configurações e variáveis de produção

**Isto muda o caminho da publicação, e é o ponto mais fácil de errar.**

A leitura do painel em 17/10 mostrou que estas variáveis existem **somente
em Production**:

`META_CAPI_TOKEN`, `META_PIXEL_ID`, `SUPABASE_SERVICE_ROLE_KEY`,
`SUPABASE_URL`, `CRON_SECRET`, `ANTHROPIC_API_KEY`, `LINKEDIN_CLIENT_SECRET`,
`LINKEDIN_CLIENT_ID`, `NEXT_PUBLIC_LINKEDIN_ENABLED`, `GA4_API_SECRET`,
`GA4_MEASUREMENT_ID`, `PIPEDRIVE_WEBHOOK_SECRET`, `PIPEDRIVE_API_TOKEN`.

As do YouTube existem em Production **e** Preview.

Três consequências:

1. **A publicação tem de gerar um build novo de Production**, pelo fluxo da
   branch `claude/elegant-darwin-HVyvT`. **Promover o artefato de Preview
   NÃO é publicação**: ele foi compilado sem essas variáveis.
2. **Teste real em Preview não equivale a produção.** Sem token de Pipedrive,
   de Meta ou de Supabase, o Preview não exercita nenhuma dessas integrações.
   É por isso que os gates 12 a 18 da auditoria continuam **NÃO VALIDADOS**.
3. **Nenhuma variável deve ser criada, copiada ou alterada** na migração. O
   build novo de Production lê as que já existem.

**Cron:** `/api/cron/site-digest`, `0 12 * * *`, habilitado. Plano Hobby, com
janela de 1 hora. **Não executar manualmente** — a próxima execução natural
é a evidência.

---

## 5. Sequência da publicação

1. Reconferir o item 3 da seção 2: produção não avançou, ou rebase feito.
2. Abrir o PR da branch do redesign para `claude/elegant-darwin-HVyvT`.
3. Conferir que o diff do PR não traz nada fora do esperado — em especial
   `src/lib`, `src/app/api` e `src/app/playbook-social-commerce`.
4. Merge. **O merge dispara o build de Production**, que é o que carrega as
   variáveis certas.
5. Esperar o deployment ficar Ready. **Não promover artefato de Preview.**
6. Rodar a verificação pós-publicação da seção 6 imediatamente.

---

## 6. Verificação pós-publicação, no domínio real

Na ordem. **Evidência correlacionada por evento e horário, não apenas HTTP
200.** Anotar, para cada envio, o `event_id`, o horário UTC e o `deal_id`, e
procurar esse mesmo trio no destino.

### 6.1 Primeiros minutos

| # | O que | Evidência que vale |
|---|---|---|
| 1 | Crawl do domínio real | 0 destinos quebrados, 0 âncoras sem alvo |
| 2 | SEO | `robots.txt`, `sitemap.xml` com 856 URLs, canonical por amostragem, `noindex` nas três páginas que já eram |
| 3 | Páginas em desktop e celular | as 17 rotas em 200, sem estouro horizontal |
| 4 | Formulários | os quatro renderizam, validam e enviam |
| 5 | Tags | GTM `GTM-5NNPNZ` carrega; GA4, Ads, Meta Pixel, TikTok, LinkedIn Insight e Clarity presentes |

### 6.2 O teste real coordenado

Só depois de combinado. Ver seção 7.

| # | O que | Evidência que vale |
|---|---|---|
| 6 | Atribuição | entrar por URL com UTM conhecida; cookie `ciclo_attr` com a origem certa; `_fbp`/`_fbc` presentes |
| 7 | `generate_lead` | no dataLayer **e** no GA4 em tempo real, com o mesmo `event_id` |
| 8 | Pipedrive | negócio no **funil 2**, etapa de entrada, com os **8 campos** de atribuição preenchidos **e com os valores que foram enviados** |
| 9 | Supabase | linha em `conversion_events` com o mesmo `event_id` e horário compatível |
| 10 | Meta | `Lead` do navegador **e** do servidor, **deduplicados pelo mesmo `event_id`**, no Gerenciador de Eventos |
| 11 | Webhook | mover o negócio para a etapa 11 → `qualify_lead` no GA4 e `QualifiedLead` na Meta, com linha nova em `conversion_events` |
| 12 | Ganho | marcar como ganho → `close_convert_lead` e `purchase` |
| 13 | Idempotência | mover de novo para a mesma etapa → **nada é reenviado** |
| 14 | `/api/pipedrive/enrich` | o webhook "Criar negócio" responde 200 **e** o enriquecimento aparece no negócio |

### 6.3 Nas horas seguintes

| # | O que | Quando |
|---|---|---|
| 15 | **Podcast: API ou snapshot?** | Depois de o cache expirar. Se a lista exibida continuar igual ao snapshot do build por vários dias **depois de o canal publicar um episódio novo**, a chave não está respondendo em produção |
| 16 | **Cron** | Na **próxima execução natural** de `0 12 * * *`. **Não disparar manualmente** e **não gerar nota em cliente real** |
| 17 | ISR | Acompanhar o painel por causa do histórico de franquia estourada |

**Acompanhamento de 24 a 72 horas é plano, não automação.** Não há nada
monitorando sozinho; alguém precisa olhar.

---

## 7. Teste real: o que falta combinar

Registrado para não ser mascarado como pronto.

| Falta | Por quê |
|---|---|
| **Identidade de teste autorizada** | Nome, e-mail e telefone de alguém do time, **fora** de `INTERNAL_EMAIL_DOMAINS`. Com e-mail interno o CAPI pula o envio de propósito, e o teste **não prova a Meta**. Não invento dado de pessoa e não uso dado de terceiro |
| Janela combinada e time avisado | O teste cria negócio real no CRM e hits reais nos relatórios |
| Acesso de leitura ao Gerenciador de Eventos | Único lugar onde a dedup se confirma |
| Acesso ao Pipedrive | Conferir as 8 **chaves** de campo (os 8 **nomes** já foram confirmados) e os ids de funil e etapa da Aplicação |
| Combinação de limpeza | Arquivar o negócio de teste e registrar `event_id` e `deal_id` usados |

**Enquanto isso não acontecer, o estado da mensuração nesta branch é
NÃO VALIDADO.** Não "provavelmente ok".

Uma limitação a dizer com todas as letras: a lista de permissão da Meta tem
`cicloecommerce.com.br` e subdomínios, **sem `vercel.app`**. Isso impede o
teste do Pixel de navegador no Preview. **Não é prova de isolamento** do CAPI
nem do GA4 — só impede um dos testes. E a lista **não deve ser alterada**.

---

## 8. Rollback

| Item | Valor |
|---|---|
| Versão de retorno | `7ae962bad1758ef0c77e775af6a683e7e5a0e280` |
| Deployment | `Hb5TEUapVasyUCm9amGRnRzDyAhe` · Ready · Production · Current |
| Como | **Promote** desse deployment no painel. Ele é um artefato de **Production**, então tem as variáveis certas |
| Alternativa | `git revert` do merge — dispara build novo, mais lento |
| O que **não** fazer | force-push, reset, apagar deployment, trocar plano, mexer em variável |

**Duas provas diferentes:**

- **De commit:** a branch de produção aponta para `7ae962b`. Conferida por
  `git fetch`.
- **De deployment:** o build existe, está Ready e é promovível. Conferida na
  leitura do painel em 17/10. **A operação de Promote nunca foi executada nem
  testada** — isso é um risco conhecido, não uma garantia.

**Gatilho:** regressão crítica — página principal quebrada, formulário que
não envia, conversão que não dispara, ou perda de conteúdo.

**O rollback restaura o código. Não desfaz o que já saiu:** lead criado no
Pipedrive, evento aceito pelo GA4 ou pela Meta, linha gravada no Supabase.
Por isso a janela entre publicar e verificar precisa ser curta.

---

## 9. Histórico

| Data | Mudança |
|---|---|
| 17/10/2026 | Primeira versão, a pedido do Flávio |

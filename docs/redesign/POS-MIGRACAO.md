# Verificação depois da migração — 17/10/2026

**Rótulo, e ele vale para o documento inteiro: isto é LOCAL, não é
ponta a ponta.** O que está aqui foi medido contra a **árvore exata do
merge**, servida em `127.0.0.1:3100`. Prova o que o código entrega. **Não**
prova o que o domínio responde: não cobre DNS, CDN, cabeçalho de borda,
redirect de plataforma, nem nenhuma integração real.

A inspeção do domínio e dos painéis é da revisão independente.

---

## 1. O que foi publicado

| Item | Valor |
|---|---|
| Merge SHA | `df452e315b4a33fc67a5f8e782a07c0f53570a94` |
| Hora do merge | **17/10/2026, 20:29:23 BRT** |
| Deployment de Production | `7147282117` (GitHub) · `9wDAEozub4kNH11R6dsnRDmo1YjX` (Vercel) |
| Ready | **20:30:50 BRT**, Current, com domínio atribuído |
| SHA aprovado que entrou | `2dc1b31121cb285c6ea63b14702b285fead7173f` |
| Árvore | `fc601cf18310833d7976eaeea15abfaa3e7f82fc` — **idêntica** entre `2dc1b31` e o merge |
| Caminho | **merge pela branch → build novo de Production.** Nenhum Promote de artefato Preview |

O merge foi enviado com `sha=2dc1b31…` na chamada, então a API só o aceitaria
se o head fosse exatamente o aprovado. Base conferida em `7ae962b` no mesmo
instante, `mergeable_state: clean`, árvore de trabalho limpa, nenhum código
novo acrescentado depois da liberação.

## 2. O bloqueio de rede, dito como é

A rede desta sessão **recusa o domínio**, com 403 de política no CONNECT:

```
cicloecommerce.com.br:443       — 403 (policy denial)
www.cicloecommerce.com.br:443   — 403
*.vercel.app (inclusive o de Production) — 403
```

É o mesmo bloqueio que me impediu de abrir qualquer Preview durante toda a
construção. **Portanto: não executei crawl, SEO, sitemap, robots, imagens,
podcast nem checagem de erro no domínio real, e nada disso está relatado
como verificado.**

O que eu sei do domínio vem só da API do GitHub: o deployment de Production
está `success` e é o mais recente do repositório.

## 3. Suíte completa na árvore do merge

`bash docs/redesign/verificar.sh comparar` — **19 passos, tudo verde.**

| Passo | Resultado |
|---|---|
| 1 Camada protegida | 40 arquivos; só os 5 autorizados mudaram, cada um com motivo impresso |
| 2 Typecheck e lint | limpo; sem erro novo |
| 3 Build | verde, 883 páginas |
| 4 Rotas | 17 em 200 |
| 5 **Playbook** | **idêntico** em desktop e 390px |
| 6 Mensuração | eventos e payloads idênticos nos quatro formulários |
| 7–8 Conteúdo e SEO | 22 internas e 87 artigos preservados |
| 9 Tipografia | 18 rotas |
| 10 h1 | 38 páginas, um h1 cada, começando pelo título |
| 11 Rotas encerradas | dois 308 sem laço nem cadeia |
| 12 TikTok Shop | conteúdo, SEO e schema preservados |
| 13 Podcast | episódio real no HTML servido |
| 14 ECOM Shift | `begin_checkout` idêntico nos dois `placement` |
| 15 Formulários em etapas | etapas, conversão, idempotência, `/obrigado` sem contagem dupla |
| 16 Responsivo | 11 rotas sem estouro em 1440 e 390 |
| 17 Indicadores de case | 9 indicadores, 7 cenários, 3 rotas, medidos no nó dos dígitos |
| 18 Podcast no servidor | tempo limite, cota, sem chave, só Shorts, sem snapshot |
| 19 Webhooks do Pipedrive | regras e **11 arquivos byte a byte iguais à base** |

## 4. Crawl

| | |
|---|---|
| Páginas visitadas | 859 |
| Destinos internos distintos | 158 |
| **Destinos quebrados** | **0** |
| **Âncoras sem alvo** | **0** |
| Páginas órfãs | 739 — arquivo do WordPress, dívida herdada |
| Hierarquia de títulos | 340 — artigos do WordPress, dívida herdada |

As duas últimas linhas são anteriores ao redesign e estão registradas como
dívida desde a auditoria.

## 5. URLs, redirects e SEO

**Sitemap:** 856 URLs, a mesma contagem da base.

**robots.txt:** inalterado — `Disallow` em `/api/`, `/obrigado`, `/_next/`,
`/static/`, `/keystatic`, e os dois sitemaps declarados.

**As três páginas que já eram fora do índice continuam fora:**

| Rota | meta robots | No sitemap |
|---|---|---|
| `/obrigado` | `noindex, nofollow` | não |
| `/aplicacao` | `noindex, follow, nocache` | não |
| `/link-bio` | `noindex, nofollow, nocache` | não |

**As duas remoções autorizadas:**

| Rota antiga | Status | Destino | Destino responde |
|---|---|---|---|
| `/servicos/processos-playbooks` | **308** | `/solucoes/inteligencia-e-operacao` | 200 |
| `/servicos/growth-continuo` | **308** | `/solucoes/inteligencia-e-operacao` | 200 |

Um salto só, sem cadeia e sem laço.

**Canonical:** conferido em 12 rotas por amostragem; todas apontam para
`https://cicloecommerce.com.br` + o próprio caminho, nenhuma faltando.

## 6. Erros de servidor

| Verificação | Resultado |
|---|---|
| 37 rotas públicas (home, blog, 19 serviços, 4 soluções, especiais, playbook) | **todas 200**, nenhuma fora disso |
| `/api/youtube/latest` | 200 |
| `/api/pipedrive/webhook` sem segredo | **401**, como deve |
| `/api/pipedrive/enrich` sem segredo | **401**, como deve |
| Rota inexistente | **404** |
| Log do servidor | **0 erros** |

## 7. Imagens

**585 referências a imagem local em 10 rotas; 0 arquivo faltando.**

Pendência estética já conhecida, que a publicação não muda: `mamo.jpg` tem
399×501 num cartão de 546px, e os depoimentos de Líquido e KVRA não têm
`maxresdefault` no YouTube. Nenhuma das duas bloqueia.

## 8. Podcast: o que dá para dizer daqui

A rota devolveu **8 episódios**, com `cache-control: public, s-maxage=3600`.

Os ids batem exatamente com o snapshot gravado no build. **Localmente isso
era inevitável**: sem rede, a busca cai para o snapshot, e o `s-maxage=3600`
é justamente o cabeçalho do caminho de fallback.

**Isto não diz nada sobre produção.** Lá, o jeito de distinguir é o cabeçalho:
`s-maxage=600` quando veio da API, `s-maxage=3600` quando veio do snapshot.
E a prova de verdade é temporal: se a lista exibida continuar igual ao
snapshot do build depois de o canal publicar um episódio novo, a chave não
está respondendo.

## 9. O que continua NÃO VALIDADO

Sem mudança: GA4, Meta, Pipedrive, Supabase e o cron. Nada aqui os toca, por
decisão e por falta de alcance de rede. São os gates 12 a 18 da auditoria,
agora como verificação pós-publicação no domínio real.

**Nenhum lead foi criado, nenhum registro de CRM foi movido, nenhum cron foi
executado à mão.** Nos passos 14, 15, 18 e 19 a rede fica interceptada e as
rotas `/api/*` respondem por mock.

## 10. Rollback

Inalterado e pronto: Promote do deployment `Hb5TEUapVasyUCm9amGRnRzDyAhe`,
artefato de **Production** em `7ae962b`. A operação nunca foi executada nem
testada.

Se a inspeção de domínio achar regressão: **crítica → rollback**; não
crítica → conserto restaurando o comportamento da base, que o passo 19
descreve ramo por ramo.

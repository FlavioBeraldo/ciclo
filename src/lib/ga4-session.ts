// Leitura do id de sessão do GA4 a partir dos cookies do navegador.
//
// O gtag grava uma sessão POR PROPRIEDADE, em cookies chamados `_ga_<ID>` —
// para `G-EY1FLE5C0J`, o cookie é `_ga_EY1FLE5C0J`. Quem pega "o primeiro
// cookie que começa com _ga_" pega um cookie qualquer: a ordem de
// `document.cookie` é do navegador (caminho mais específico primeiro, depois
// ordem de criação), não tem nada a ver com a propriedade. Se houver mais de
// um `_ga_*` — outra propriedade no domínio, ou uma sobra de outro caminho —
// o id vem da propriedade errada e fica preso no valor antigo dela.
//
// Consequência prática: o `ga_session_id` gravado no negócio não casa com a
// sessão real, e o evento de receita enviado no "ganho" não cola na sessão de
// origem no GA4.
//
// Por isso aqui a escolha é pelo NOME EXATO do cookie da nossa propriedade.

/**
 * Id de medição do fluxo GA4 do container GTM-5NNPNZ.
 *
 * O mesmo padrão de `ga4-lead-events.ts` e do webhook: a env manda, e o valor
 * conhecido é o padrão, para não depender de configuração nova para funcionar.
 * No cliente precisa ser `NEXT_PUBLIC_` para existir no navegador.
 */
export const GA4_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || process.env.GA4_MEASUREMENT_ID || 'G-EY1FLE5C0J'

/** Nome do cookie de sessão da nossa propriedade: `G-ABC` -> `_ga_ABC`. */
export const GA4_SESSION_COOKIE = `_ga_${GA4_MEASUREMENT_ID.replace(/^G-/, '')}`

/**
 * Extrai a sessão do valor do cookie. Dois formatos convivem hoje:
 *
 *   GS1.1.<sessao>.<n>.<estado>.<ts>...
 *   GS2.1.s<sessao>$o<n>$g<0|1>$t<ts>$j<n>$l<0>$h<0>
 *
 * Em ambos a sessão é o terceiro campo separado por ponto; no GS2 ela vem com
 * o prefixo `s` e seguida de outros pares separados por `$`.
 */
export function parseGaSessionId(value: string): string | undefined {
  const third = value.split('.')[2]
  if (!third) return undefined
  const session = third.startsWith('s') ? third.slice(1).split('$')[0] : third
  // Só aceita número: formato desconhecido é melhor ficar sem valor do que
  // gravar lixo num campo que o GA4 vai usar para casar a sessão.
  return /^\d+$/.test(session) ? session : undefined
}

/**
 * Escolhe a sessão da NOSSA propriedade entre os cookies disponíveis.
 *
 * Só considera o cookie de nome exato, e só devolve valor quando a resposta é
 * inequívoca:
 *
 * - nenhum cookie nosso válido  -> `undefined`
 * - um valor, ou várias cópias dizendo a MESMA coisa -> esse valor
 * - duas cópias com valores DIFERENTES -> `undefined`
 *
 * O último caso é o que não dá para resolver sozinho. O navegador pode mandar
 * o mesmo nome mais de uma vez quando existe cópia em outro caminho ou
 * domínio, e `document.cookie` não diz de qual escopo cada uma veio. Qual
 * delas o gtag está realmente escrevendo é HIPÓTESE: não medi o comportamento
 * dele, e nenhuma regra daqui — a mais recente, a primeira, a de maior número
 * — tem evidência por trás. Entre arriscar a associação errada e não
 * responder, não responder é o honesto: campo vazio se vê, campo errado entra
 * no CRM como verdade e não dá para distinguir depois.
 *
 * Se esse caso aparecer na prática, o que resolve é ler os cookies do
 * navegador e limpar a cópia sobrando — não adivinhar aqui.
 */
export function pickGaSessionId(cookies: Iterable<{ name: string; value: string }>): string | undefined {
  const encontrados = new Set<string>()
  for (const { name, value } of cookies) {
    if (name !== GA4_SESSION_COOKIE) continue
    const session = parseGaSessionId(value)
    if (session) encontrados.add(session)
  }
  if (encontrados.size !== 1) return undefined
  return [...encontrados][0]
}

/** Os pares nome/valor de `document.cookie`, para uso no navegador. */
export function cookiesFromDocument(cookieString: string): { name: string; value: string }[] {
  const pares: { name: string; value: string }[] = []
  for (const bruto of cookieString.split('; ')) {
    if (!bruto) continue
    const i = bruto.indexOf('=')
    if (i <= 0) continue
    let value = bruto.slice(i + 1)
    try {
      value = decodeURIComponent(value)
    } catch {
      // valor não codificado — usa como veio
    }
    pares.push({ name: bruto.slice(0, i), value })
  }
  return pares
}

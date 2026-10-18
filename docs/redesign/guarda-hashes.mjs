// A trava da camada de mensuração e atribuição.
//
// A regra era simples: estes arquivos têm que estar byte a byte iguais à base
// de produção. Quando uma correção foi autorizada, afrouxei a trava para
// aceitar o arquivo mudado desde que ele estivesse declarado em
// `hashes-excecoes.txt`. Isso abriu um buraco: a declaração é POR CAMINHO, e
// uma vez declarado o arquivo passava a aceitar qualquer mudança futura.
//
// Agora a autorização é pelo CONTEÚDO REVISADO: o hash exato que foi lido na
// revisão. Mudou o arquivo de novo, mesmo estando declarado, reprova — e o
// conserto é a revisão olhar o novo conteúdo e atualizar o hash aqui.
//
// A decisão fica nesta função, pura e sem tocar em disco, para o teste
// conseguir exercitar a reprovação sem mexer em arquivo nenhum.

export const BASE_PROD = '7ae962bad1758ef0c77e775af6a683e7e5a0e280'

export const ARQUIVOS = [
  'src/app/api/pipedrive/webhook/route.ts',
  'src/app/api/pipedrive/enrich/route.ts',
  'src/lib/ga4-lead-events.ts',
  'src/lib/pipedrive-funnel-events.ts',
  'src/lib/pipedrive-server.ts',
  'src/lib/pipedrive-fields.ts',
  'src/lib/meta-capi.ts',
  'src/lib/attribution.ts',
  'src/lib/conversions.ts',
  'src/lib/supabase-server.ts',
  'src/lib/webhook-auth.ts',
  // Entrou com a correção da sessão do GA4. Não existia na base, então a
  // única referência possível é o conteúdo revisado.
  'src/lib/ga4-session.ts',
]

/**
 * Conteúdo exato aprovado na revisão de 18/10 — correção da sessão do GA4.
 * Qualquer outro conteúdo reprova, declarado ou não.
 */
export const REVISADOS = {
  'src/lib/attribution.ts': 'c18a08429f8aa06f482510543305fa4208b22605b8c38364308d8aaec4e3fb83',
  'src/lib/pipedrive-server.ts': 'bb382196edcd51e9d8e77bf75399c8f0641152ad09f5b733bd1129304a03cd66',
  'src/lib/ga4-session.ts': '6654d5e9c2adb88a3b567316817e2b68d7e8361e4425867cc69284d135d7b600',
}

/**
 * Decide o estado de cada arquivo.
 *
 * @param atual     mapa caminho -> sha256 do arquivo como está hoje
 * @param base      mapa caminho -> sha256 na base de produção, ou null se não existia
 * @param declarado (caminho) => está citado em hashes-excecoes.txt?
 */
export function avaliarHashes(atual, base, declarado) {
  const intactos = []
  const autorizados = []
  const problemas = []

  for (const arq of ARQUIVOS) {
    const agora = atual[arq]
    const antes = base[arq] ?? null

    if (agora === undefined) {
      problemas.push({ arq, motivo: 'arquivo sumiu' })
      continue
    }
    if (antes !== null && agora === antes) {
      intactos.push(arq)
      continue
    }

    const revisado = REVISADOS[arq]
    if (!revisado) {
      problemas.push({ arq, motivo: 'mudou sem revisão registrada', antes, agora })
      continue
    }
    if (agora !== revisado) {
      problemas.push({ arq, motivo: 'conteúdo diferente do revisado', esperado: revisado, agora })
      continue
    }
    if (!declarado(arq)) {
      problemas.push({ arq, motivo: 'conteúdo revisado, mas sem declaração em hashes-excecoes.txt' })
      continue
    }
    autorizados.push(arq)
  }

  return { intactos, autorizados, problemas }
}

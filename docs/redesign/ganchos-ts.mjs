// Gancho de resolução para importar os módulos TS do projeto fora do Next.
//
// O código-fonte usa importação sem extensão (`./youtube`), que é o que o
// empacotador entende. O Node, em ESM, exige a extensão. Em vez de mudar o
// código do site por causa do teste, o teste ensina o Node a tentar `.ts`
// quando o especificador relativo não resolve sozinho.
import { pathToFileURL } from 'node:url'

const RAIZ = process.env.RAIZ_CICLO ?? '/home/user/ciclo'

export async function resolve(especificador, contexto, proximo) {
  // Só em teste, e só quando pedido: troca `next/server` por um substituto
  // que neutraliza o `after()`. Ver docs/redesign/shim-next-server.mjs.
  if (process.env.SHIM_NEXT_AFTER === '1' && especificador === 'next/server') {
    return proximo(pathToFileURL(`${RAIZ}/docs/redesign/shim-next-server.mjs`).href, contexto)
  }

  // O código do site usa o atalho `@/` que o Next resolve para `src/`.
  if (especificador.startsWith('@/')) {
    const base = pathToFileURL(`${RAIZ}/src/${especificador.slice(2)}`).href
    for (const tentativa of [base, base + '.ts', base + '.tsx', base + '/index.ts']) {
      try {
        return await proximo(tentativa, contexto)
      } catch {
        // tenta o próximo sufixo
      }
    }
  }
  try {
    return await proximo(especificador, contexto)
  } catch (erro) {
    if (especificador.startsWith('.') && !/\.[cm]?[jt]s$/.test(especificador)) {
      return await proximo(especificador + '.ts', contexto)
    }
    // `next/server` existe como `next/server.js`; o empacotador do Next
    // resolve sem a extensão, o Node não.
    if (!/\.[cm]?js$/.test(especificador)) {
      try {
        return await proximo(especificador + '.js', contexto)
      } catch {
        throw erro
      }
    }
    throw erro
  }
}

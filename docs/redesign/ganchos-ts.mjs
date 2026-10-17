// Gancho de resolução para importar os módulos TS do projeto fora do Next.
//
// O código-fonte usa importação sem extensão (`./youtube`), que é o que o
// empacotador entende. O Node, em ESM, exige a extensão. Em vez de mudar o
// código do site por causa do teste, o teste ensina o Node a tentar `.ts`
// quando o especificador relativo não resolve sozinho.
export async function resolve(especificador, contexto, proximo) {
  try {
    return await proximo(especificador, contexto)
  } catch (erro) {
    if (especificador.startsWith('.') && !/\.[cm]?[jt]s$/.test(especificador)) {
      return await proximo(especificador + '.ts', contexto)
    }
    throw erro
  }
}

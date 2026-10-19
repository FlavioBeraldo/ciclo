import VideosDepoimento, { type Depoimento } from './VideosDepoimento'
import { Seta } from './Seta'

// O bloco "Cases em vídeo" das páginas de serviço e de solução.
//
// É o mesmo bloco da home, e de propósito: os quatro vídeos vêm da lista
// abaixo, que a home também lê, e a grade e o player são o `VideosDepoimento`
// que a home e `/depoimentos` já usam. Nada é duplicado e nada é redesenhado —
// o comportamento de teclado, o foco, o modal e a miniatura são os mesmos, e
// o iframe só é montado depois do clique.
//
// Substituiu o bloco de quatro indicadores que ficava em `#resultados`, por
// pedido do Flávio em 19/10. A âncora foi mantida para o índice da página
// continuar funcionando, e o id segue único na página.
//
// O envoltório é `section dark proof`, o mesmo de `/depoimentos`, com as duas
// faixas de transição em volta. Não há variante clara dessa grade: a legenda
// do cartão é desenhada para fundo escuro.

export const DEPOIMENTOS_EM_VIDEO: Depoimento[] = [
  { id: 'MlDyvGg7rGs', marca: 'Mamô Brasil' },
  { id: 'djykk9EFghg', marca: 'Líquido' },
  { id: 'xVdqhprwKWw', marca: 'KVRA' },
  { id: '6B2XYATbK3Q', marca: 'DANKI' },
]

export default function CasesEmVideo({ id }: { id?: string }) {
  return (
    <>
      <div className="section-fade paper-dark" aria-hidden="true" />

      <section className="section dark proof" id={id}>
        <div className="wrap narrow">
          <div className="section-head">
            <div>
              <div className="eyebrow">
                <span />
                Cases em vídeo
              </div>

              <h2 className="editorial-accent">Quem vive, recomenda.</h2>
            </div>

            <a className="textlink" href="/depoimentos">
              Ver todos os depoimentos <Seta />
            </a>
          </div>

          <VideosDepoimento itens={DEPOIMENTOS_EM_VIDEO} />
        </div>
      </section>

      <div className="section-fade dark-white" aria-hidden="true" />
    </>
  )
}

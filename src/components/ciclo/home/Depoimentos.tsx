import VideosDepoimento from '../VideosDepoimento'
import { DEPOIMENTOS_EM_VIDEO } from '../CasesEmVideo'
import { Seta } from '../Seta'

// Cases em vídeo na home. A grade e o player vivem em VideosDepoimento, que
// /depoimentos também usa — o comportamento de teclado e foco é um só.
//
// A lista dos quatro vídeos saiu daqui para `../CasesEmVideo`, porque as
// páginas de serviço e de solução passaram a mostrar o mesmo bloco. É a mesma
// lista, na mesma ordem: o que a home renderiza não muda.
const DEPOIMENTOS = DEPOIMENTOS_EM_VIDEO

export default function Depoimentos() {
  return (
    <section className="section dark proof" id="depoimentos">
      <div className="wrap">
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

        <VideosDepoimento itens={DEPOIMENTOS} />
      </div>
    </section>
  )
}

import VideosDepoimento from '../VideosDepoimento'
import { Seta } from '../Seta'

// Cases em vídeo na home. A grade e o player vivem em VideosDepoimento, que
// /depoimentos também usa — o comportamento de teclado e foco é um só.

const DEPOIMENTOS = [
  { id: 'MlDyvGg7rGs', marca: 'Mamô Brasil' },
  { id: 'djykk9EFghg', marca: 'Líquido' },
  { id: 'xVdqhprwKWw', marca: 'KVRA' },
  { id: '6B2XYATbK3Q', marca: 'DANKI' },
]

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

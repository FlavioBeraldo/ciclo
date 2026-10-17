import Image from 'next/image'

// Cases em vídeo. Os mesmos quatro depoimentos que a home já exibia, com as
// miniaturas servidas pelo YouTube (hqdefault existe para todos eles).

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
            Ver todos os depoimentos <span>↗</span>
          </a>
        </div>

        <div className="proof-grid">
          {DEPOIMENTOS.map((d) => (
            <a
              className="proof-card"
              key={d.id}
              href={`https://www.youtube.com/watch?v=${d.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="thumb">
                <span className="video-eyebrow">Depoimento</span>
                <Image
                  src={`https://img.youtube.com/vi/${d.id}/hqdefault.jpg`}
                  alt={`Depoimento ${d.marca}`}
                  width={480}
                  height={360}
                  loading="lazy"
                />
                <span className="play" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 5v14l11-7z" />
                  </svg>
                </span>
              </div>

              <div className="proof-caption">
                <span>{d.marca}</span>
                <small>
                  Assistir ao vídeo <b aria-hidden="true">↗</b>
                </small>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

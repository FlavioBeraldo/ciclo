import MiniaturaYouTube from '../MiniaturaYouTube'
import Link from 'next/link'
import { CANAL_URL, type YouTubeVideo } from '@/lib/youtube'
import { Seta } from '../Seta'

// O Fator M na home.
//
// A lista chega pronta da página, que a busca no SERVIDOR — o HTML já sai com
// episódio real. Antes a busca era no navegador e o HTML servido trazia o
// fallback; quem rastreia sem executar JavaScript via títulos que não existem.
//
// Sem episódio nenhum (API fora do ar e snapshot vazio), a seção não inventa
// nem reaproveita depoimento de cliente: diz que a lista está indisponível e
// manda para o canal.

export default function Podcast({ episodios }: { episodios: YouTubeVideo[] }) {
  return (
    <section className="section podcast" id="podcast">
      <div className="wrap">
        <div className="eyebrow">
          <span />O podcast da Ciclo
        </div>

        <div className="podcast-heading">
          <div>
            <h2>O Fator M.</h2>
            <div className="podcast-tagline">Conteúdo que gera crescimento de verdade.</div>
          </div>

          <div>
            <p>
              No nosso podcast, especialistas e líderes do mercado compartilham estratégias
              práticas para escalar marcas no digital.
            </p>

            <a
              className="button"
              href={`${CANAL_URL}?sub_confirmation=1`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Descubra o Fator M</span>
              <b aria-hidden="true"><Seta /></b>
            </a>
          </div>
        </div>

        {episodios.length ? (
          <div className="episodes">
            {episodios.slice(0, 6).map((v) => (
              <a
                className="episode"
                key={v.id}
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="episode-picture">
                  {/* A URL que a API devolve é a hqdefault; o componente pede
                      a maior que o vídeo tiver e cai para ela se não houver. */}
                  <MiniaturaYouTube
                    videoId={v.id}
                    alt={v.title}
                    sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  />
                  <span className="play" aria-hidden="true">
                    ▶
                  </span>
                </div>
                <small>O FATOR M · ASSISTA AO EPISÓDIO <Seta /></small>
                <h3>{v.title}</h3>
              </a>
            ))}
          </div>
        ) : (
          <p className="episodes-vazio">
            A lista de episódios está indisponível no momento.{' '}
            <a href={CANAL_URL} target="_blank" rel="noopener noreferrer">
              Veja os episódios no canal <Seta />
            </a>
          </p>
        )}

        <div className="training">
          <div>
            <h3>ECOM Shift</h3>
            <p>Aprenda nosso método.</p>
          </div>

          <Link className="button" href="/ecomshift">
            <span>Conheça o treinamento</span>
            <b aria-hidden="true"><Seta /></b>
          </Link>
        </div>
      </div>
    </section>
  )
}

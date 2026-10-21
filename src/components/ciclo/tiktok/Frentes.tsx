import { FRENTES } from './conteudo'
import { IconeFrente, MiniIlustracao } from './ilustracoes'

// A operação de TikTok Shop em dois tempos, como a auditoria pediu.
//
//   1. Visão geral compacta: o núcleo no centro e as quatro frentes em volta,
//      com rótulo curto. Dá para entender o serviço em poucos segundos e ver
//      tudo junto na mesma tela.
//   2. Os blocos completos logo abaixo, com os subtítulos de serviço, as
//      descrições e os entregáveis.
//
// A descrição inteira aparece uma vez só, no detalhe. Na visão geral vão os
// nomes dos serviços, que já são o conteúdo do bloco — serve de índice.
//
// O texto é HTML de verdade: selecionável, pesquisável e lido na ordem certa.
// O SVG entra só nos traços e nos anéis, que são decorativos. No celular tudo
// empilha numa coluna, sem traço e sem texto miúdo.
//
// A visão geral era um esquema branco genérico. Virou um painel escuro, na
// mesma linguagem do bloco "Nossa tese" da home: fundo #111, anéis finos em
// elipse, um ponto de luz roxo e tipografia Inter com o itálico da Playfair
// só no nome do núcleo. Os rótulos, os números, os links e os destinos são
// exatamente os de antes.

export default function Frentes() {
  return (
    <section className="inner-section tts-frentes" id="frentes" aria-labelledby="frentes-titulo">
      <div className="wrap narrow">
        <div className="inner-section-heading">
          <div className="eyebrow">
            <span />O que a Ciclo entrega
          </div>

          <h2 id="frentes-titulo">
            Como a Ciclo E-commerce pode ajudar sua marca no TikTok Shop?
          </h2>

          <p className="tts-frentes-lead">
            Uma solução completa, da configuração inicial à gestão e escala contínua. São
            quatro frentes que funcionam como uma operação só.
          </p>
        </div>

        {/* ── 1. Visão geral: painel escuro com as quatro frentes em órbita ── */}
        <div className="tts-painel">
          {/* A ligação entre as frentes e o núcleo são as próprias órbitas:
              três elipses que saem de trás do núcleo e passam por dentro dos
              quatro cartões, como no bloco "Nossa tese" da home.

              Tentei antes fios de cada cartão até o centro. Em qualquer
              largura eles cruzavam o nome "TikTok Shop", porque o nome ocupa
              quase toda a faixa central — e desviar deles deixava os fios
              rentes aos cartões, sem leitura. As órbitas resolvem o mesmo
              sem passar por cima de texto nenhum. */}
          <div className="tts-orbitas" aria-hidden="true">
            <span className="tts-anel" />
            <span className="tts-anel" />
            <span className="tts-anel" />
            <span className="tts-luz" />
          </div>

          <div className="tts-centro">
            <small>Operação integrada</small>
            <strong>TikTok Shop</strong>
          </div>

          {FRENTES.map((f) => (
            <a className={`tts-no tts-${f.id}`} href={`#${f.id}`} key={f.id}>
              <span className="tts-no-topo">
                <IconeFrente frente={f.id as never} />
                <span className="tts-numero">{f.numero}</span>
              </span>
              <strong>{f.titulo}</strong>
              <span className="tts-resumo-itens">
                {f.servicos.map((s) => s.titulo).join(' · ')}
              </span>
            </a>
          ))}
        </div>

        {/* ── 2. Os blocos completos ── */}
        <div className="tts-detalhes">
          {FRENTES.map((f, i) => (
            <article
              className={`tts-frente tts-frente-ed tts-ed-${i % 2 === 0 ? 'clara' : 'neutra'}`}
              key={f.id}
              id={f.id}
            >
              <div className="tts-frente-topo">
                <span className="tts-selo" aria-hidden="true">
                  <IconeFrente frente={f.id as never} />
                </span>

                <div className="tts-frente-nome">
                  <span className="tts-numero">Frente {f.numero}</span>
                  <h3>{f.titulo}</h3>
                </div>

                <MiniIlustracao frente={f.id as never} />
              </div>

              {f.servicos.map((s) => (
                <div className="tts-servico" key={s.titulo}>
                  <h4>{s.titulo}</h4>
                  <p>{s.texto}</p>
                  <ul className="tts-entregaveis" aria-label={`Entregáveis de ${s.titulo}`}>
                    {s.entregaveis.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

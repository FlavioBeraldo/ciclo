import Image from "next/image";
import PlayerVideo from "@/components/ciclo/PlayerVideo";
import ValorDeCase from "@/components/ciclo/ValorDeCase";
import type { EstudoDeCase } from "@/data/estudos-de-caso";
import { Comparacao, Etapas, Framework } from "./Frameworks";
import Imprensa from "./Imprensa";

// O conteúdo de um case — abertura, indicadores, vídeo, os quatro capítulos,
// depoimentos e imprensa — sem cabeçalho, rodapé, formulário nem convite.
//
// A página /cases/<slug> usa este componente sem opções, e o HTML sai igual ao
// que já estava publicado. A landing /maquina-de-receita-no-ecommerce usa o
// mesmo conteúdo num diálogo (`emDialogo`): o título vira h2 (a landing já tem
// o seu h1), o índice de âncoras sai e todos os ids ganham `prefixo`, para não
// colidirem com os da landing.

const CAPITULOS = [
  { id: "desafio", rotulo: "Desafio" },
  { id: "estrategia", rotulo: "Estratégia" },
  { id: "execucao", rotulo: "Execução" },
  { id: "resultados", rotulo: "Resultados" },
] as const;

function Capitulo({
  id,
  numero,
  rotulo,
  titulo,
  paragrafos,
  children,
}: {
  id: string;
  numero: number;
  rotulo: string;
  titulo: string;
  paragrafos: string[];
  children?: React.ReactNode;
}) {
  return (
    <section className="case-capitulo" id={id} aria-labelledby={`${id}-titulo`}>
      <div className="case-capitulo-head">
        <span className="case-capitulo-num">
          {String(numero).padStart(2, "0")}
        </span>
        <div className="eyebrow">
          <span />
          {rotulo}
        </div>
      </div>
      <h2 id={`${id}-titulo`}>{titulo}</h2>
      <div className="case-prosa">
        {paragrafos.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {children}
    </section>
  );
}

export default function ConteudoDoCase({
  caso,
  emDialogo = false,
  prefixo = "",
}: {
  caso: EstudoDeCase;
  emDialogo?: boolean;
  prefixo?: string;
}) {
  const { hero } = caso;
  const id = (nome: string) => `${prefixo}${nome}`;
  const Titulo = emDialogo ? "h2" : "h1";

  return (
    <>
      {/* ── Abertura ─────────────────────────────────────────── */}
      <header className="case-hero">
        <div className="case-hero-texto">
          <p className="case-tag">
            <span>Case</span>
            <span>{caso.marca}</span>
            <span>{caso.segmento}</span>
          </p>
          <Titulo id={id("case-titulo")}>
            {hero.titulo.map((parte, i) =>
              parte.destaque ? (
                <em key={i}>{parte.texto}</em>
              ) : (
                <span key={i}>{parte.texto}</span>
              ),
            )}
          </Titulo>
          <p className="case-resumo">{hero.resumo}</p>
          <p className="case-frente">
            <span>Frente</span> {caso.frente}
          </p>
        </div>

        <div className="case-hero-foto">
          <Image
            src={hero.foto.src}
            alt={hero.foto.alt}
            width={hero.foto.largura}
            height={hero.foto.altura}
            sizes="(max-width: 1023px) 100vw, 300px"
            priority
            style={
              hero.foto.posicao
                ? { objectPosition: hero.foto.posicao }
                : undefined
            }
          />
        </div>
      </header>

      {/* ── Indicadores ─────────────────────────────────────── */}
      <section
        className={`case-indicadores n${caso.indicadores.length}`}
        aria-label={caso.legendaIndicadores ?? "Indicadores do case"}
      >
        {caso.legendaIndicadores && (
          <p className="case-indicadores-legenda">{caso.legendaIndicadores}</p>
        )}
        <dl>
          {caso.indicadores.map((ind) => (
            <div key={ind.rotulo}>
              <dt>{ind.rotulo}</dt>
              <dd>
                <ValorDeCase valor={ind.valor} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Vídeo do case, no topo, antes da narrativa ──────── */}
      {caso.video && (
        <section
          className="case-video"
          aria-label={`Vídeo do case ${caso.marca}`}
        >
          <PlayerVideo
            videoId={caso.video.youtubeId}
            titulo={caso.video.titulo}
            sizes="(max-width: 1023px) 100vw, 780px"
          />
          {caso.video.legenda && <p>{caso.video.legenda}</p>}
        </section>
      )}

      {/* No diálogo da landing não há índice: as âncoras rolariam a página
          de trás, não o diálogo. */}
      {!emDialogo && (
        <nav className="case-indice" aria-label="Nesta página">
          {CAPITULOS.map((c) => (
            <a key={c.id} href={`#${c.id}`}>
              {c.rotulo}
            </a>
          ))}
        </nav>
      )}

      {/* ── Narrativa ───────────────────────────────────────── */}
      <Capitulo
        id={id("desafio")}
        numero={1}
        rotulo="O desafio"
        titulo={caso.desafio.titulo}
        paragrafos={caso.desafio.paragrafos}
      />

      <Capitulo
        id={id("estrategia")}
        numero={2}
        rotulo="A estratégia"
        titulo={caso.estrategia.titulo}
        paragrafos={caso.estrategia.paragrafos}
      >
        {caso.estrategia.frameworks.map((fw) => (
          <Framework fw={fw} key={fw.titulo} />
        ))}
      </Capitulo>

      <Capitulo
        id={id("execucao")}
        numero={3}
        rotulo="A execução"
        titulo={caso.execucao.titulo}
        paragrafos={caso.execucao.paragrafos}
      >
        {caso.execucao.etapas && caso.execucao.etapas.length > 0 && (
          <Etapas
            etapas={caso.execucao.etapas}
            sequencia={caso.execucao.sequencia}
          />
        )}
        {caso.execucao.materiais && caso.execucao.materiais.length > 0 && (
          <div className="case-materiais">
            {caso.execucao.materiais.map((m) => (
              <figure key={m.src}>
                <Image
                  src={m.src}
                  alt={m.alt}
                  width={m.largura}
                  height={m.altura}
                  sizes="(max-width: 1023px) 100vw, 380px"
                />
                {m.legenda && <figcaption>{m.legenda}</figcaption>}
              </figure>
            ))}
          </div>
        )}
      </Capitulo>

      <Capitulo
        id={id("resultados")}
        numero={4}
        rotulo="O impacto"
        titulo={caso.resultados.titulo}
        paragrafos={caso.resultados.paragrafos}
      >
        {caso.resultados.comparacao && (
          <Comparacao c={caso.resultados.comparacao} />
        )}
        {caso.resultados.nota && (
          <p className="case-nota">{caso.resultados.nota}</p>
        )}
      </Capitulo>

      {caso.depoimentos && caso.depoimentos.length > 0 && (
        <section className="case-depoimentos" aria-label="Depoimentos">
          {caso.depoimentos.map((d) => (
            <figure key={d.autor + d.citacao.slice(0, 20)}>
              <blockquote>
                <p>{d.citacao}</p>
              </blockquote>
              <figcaption>
                <strong>{d.autor}</strong>
                {d.cargo && <span>{d.cargo}</span>}
              </figcaption>
            </figure>
          ))}
        </section>
      )}

      {caso.imprensa && caso.imprensa.length > 0 && (
        <Imprensa
          marca={caso.nomeCurto}
          materias={caso.imprensa}
          idTitulo={id("imprensa-titulo")}
        />
      )}
    </>
  );
}

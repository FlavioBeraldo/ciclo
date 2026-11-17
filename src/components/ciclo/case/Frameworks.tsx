import type {
  ComparacaoDeCase,
  EtapaDeCase,
  FrameworkDeCase,
} from '@/data/estudos-de-caso'

// Os diagramas das páginas de case.
//
// Mesma linguagem dos capítulos ilustrados das páginas de serviço (fundo
// tinta, traço fino cinza-violeta, um único tom de violeta para o ponto que
// importa), mas montados em HTML com o SVG só como desenho de apoio. Assim o
// texto continua texto — selecionável, lido pelo leitor de tela uma única vez
// e com o tamanho de corpo da página —, e no celular o diagrama se REORGANIZA
// em coluna em vez de encolher até ficar ilegível.
//
// Todo SVG daqui é `aria-hidden`: ele não carrega informação que não esteja
// no HTML ao lado.

function Cabecalho({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="fw-head">
      <div className="eyebrow">
        <span />
        Framework
      </div>
      <h3>{titulo}</h3>
      <p>{texto}</p>
    </div>
  )
}

// ── Funil Ampulheta ─────────────────────────────────────────────────────────
// Cada coluna desenha o seu trecho da ampulheta: largo na criação, estreitando
// na captação, o gargalo da compra e alargando de novo na expansão. Como cada
// trecho vive na própria coluna, o contorno acompanha qualquer largura sem
// cálculo de posição.

const TRECHOS = [
  'M0 0 L100 14 L100 82 L0 96 Z',
  'M0 14 L100 34 L100 62 L0 82 Z',
  'M0 34 L100 0 L100 96 L0 62 Z',
]

function FunilAmpulheta({ fw }: { fw: Extract<FrameworkDeCase, { tipo: 'funil-ampulheta' }> }) {
  const [criacao, captacao, expansao] = fw.fases
  const fase = (f: typeof criacao, i: number) => (
    <li className={`amp-fase amp-fase-${i + 1}`} key={f.nome}>
      <svg className="amp-trecho" viewBox="0 0 100 96" preserveAspectRatio="none" aria-hidden="true">
        <path d={TRECHOS[i]} />
      </svg>
      <div className="amp-texto">
        <span className="fw-num">{String(i + 1).padStart(2, '0')}</span>
        <h4>{f.nome}</h4>
        <p className="amp-foco">{f.foco}</p>
        <p>{f.texto}</p>
        {f.pontoDePartida && (
          <div className="amp-partida">
            <small>Ponto de partida</small>
            <strong>{f.pontoDePartida.valor}</strong>
            <span>{f.pontoDePartida.rotulo}</span>
          </div>
        )}
      </div>
    </li>
  )

  return (
    <figure className="fw fw-ampulheta">
      <Cabecalho titulo={fw.titulo} texto={fw.texto} />
      <ol className="amp-fases">
        {fase(criacao, 0)}
        {fase(captacao, 1)}
        <li className="amp-gargalo">
          <svg className="amp-trecho" viewBox="0 0 100 96" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 34 L100 34 L100 62 L0 62 Z" />
          </svg>
          <span>{fw.gargalo}</span>
        </li>
        {fase(expansao, 2)}
      </ol>
      <figcaption className="fw-chave">{fw.chave}</figcaption>
    </figure>
  )
}

// ── Ciclo de relacionamento ─────────────────────────────────────────────────
// Quatro etapas em volta de um centro, no sentido horário. A órbita e as
// setas são desenho; a ordem de leitura é a da lista.

function CicloRelacionamento({
  fw,
}: {
  fw: Extract<FrameworkDeCase, { tipo: 'ciclo-relacionamento' }>
}) {
  return (
    <figure className="fw fw-ciclo">
      <Cabecalho titulo={fw.titulo} texto={fw.texto} />
      <div className="ciclo-mapa">
        <svg className="ciclo-orbita" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <ellipse cx="50" cy="50" rx="36" ry="38" />
        </svg>
        {[0, 1, 2, 3].map((i) => (
          <span className={`ciclo-seta ciclo-seta-${i + 1}`} aria-hidden="true" key={i}>
            <svg viewBox="0 0 12 12">
              <path d="M2 2 L10 6 L2 10" />
            </svg>
          </span>
        ))}
        <div className="ciclo-centro">
          <strong>{fw.centro.titulo}</strong>
          <span>{fw.centro.texto}</span>
        </div>
        <ol className="ciclo-etapas">
          {fw.etapas.map((e, i) => (
            <li className={`ciclo-etapa ciclo-etapa-${i + 1}`} key={e.titulo}>
              <span className="fw-num">{String(i + 1).padStart(2, '0')}</span>
              <h4>{e.titulo}</h4>
              <p>{e.texto}</p>
            </li>
          ))}
        </ol>
        <p className="ciclo-volta">
          <span aria-hidden="true">↺</span> De volta ao relacionamento, com o ciclo mais forte.
        </p>
      </div>
      <figcaption className="fw-chave">{fw.chave}</figcaption>
    </figure>
  )
}

// ── Ecossistema D2C ─────────────────────────────────────────────────────────
// Uma origem, três ambientes de venda. As ligações saem do centro da origem e
// chegam ao centro de cada coluna; as colunas têm a mesma largura, então os
// pontos de chegada são fixos (1/6, 3/6 e 5/6 da largura).

function EcossistemaD2C({ fw }: { fw: Extract<FrameworkDeCase, { tipo: 'ecossistema-d2c' }> }) {
  return (
    <figure className="fw fw-ecossistema">
      <Cabecalho titulo={fw.titulo} texto={fw.texto} />
      <div className="eco-origem">
        <strong>{fw.origem.titulo}</strong>
        <span>{fw.origem.texto}</span>
      </div>
      <svg className="eco-ligacoes" viewBox="0 0 300 56" preserveAspectRatio="none" aria-hidden="true">
        <path d="M150 0 V20 Q150 28 142 28 H58 Q50 28 50 36 V56" />
        <path d="M150 0 V56" />
        <path d="M150 0 V20 Q150 28 158 28 H242 Q250 28 250 36 V56" />
      </svg>
      <ol className="eco-ambientes">
        {fw.ambientes.map((a, i) => (
          <li key={a.nome}>
            <span className="fw-num">{String(i + 1).padStart(2, '0')}</span>
            <h4>{a.nome}</h4>
            <p className="eco-detalhe">{a.detalhe}</p>
            <p>{a.texto}</p>
            <div className="eco-indicador">
              <strong>{a.indicador.valor}</strong>
              <span>{a.indicador.rotulo}</span>
            </div>
          </li>
        ))}
      </ol>
      <figcaption className="fw-chave">{fw.chave}</figcaption>
    </figure>
  )
}

export function Framework({ fw }: { fw: FrameworkDeCase }) {
  switch (fw.tipo) {
    case 'funil-ampulheta':
      return <FunilAmpulheta fw={fw} />
    case 'ciclo-relacionamento':
      return <CicloRelacionamento fw={fw} />
    case 'ecossistema-d2c':
      return <EcossistemaD2C fw={fw} />
  }
}

// ── Etapas de execução ──────────────────────────────────────────────────────
// Lista numerada simples. Com `sequencia`, as etapas são lidas como uma
// ordem no tempo (lançamento → manutenção → evolução) e ganham a seta entre
// elas — sem datas, porque não há datas a mostrar.

export function Etapas({ etapas, sequencia }: { etapas: EtapaDeCase[]; sequencia?: boolean }) {
  return (
    <ol className={`case-etapas${sequencia ? ' em-sequencia' : ''}`}>
      {etapas.map((e, i) => (
        <li key={e.titulo}>
          <span className="fw-num">{String(i + 1).padStart(2, '0')}</span>
          <h3>{e.titulo}</h3>
          <p>{e.texto}</p>
        </li>
      ))}
    </ol>
  )
}

// ── Comparação de dois valores ──────────────────────────────────────────────
// Duas barras na mesma escala, de zero ao maior valor. Não há curva nem pontos
// intermediários: só existem os dois números medidos, e é isso que aparece.

export function Comparacao({ c }: { c: ComparacaoDeCase }) {
  const maximo = Math.max(c.antes.valor, c.depois.valor)
  const linha = (rotulo: string, valor: number, destaque: boolean) => (
    <div className={`cmp-linha${destaque ? ' destaque' : ''}`}>
      <span className="cmp-rotulo">{rotulo}</span>
      <div className="cmp-trilho" aria-hidden="true">
        <div className="cmp-barra" style={{ width: `${(valor / maximo) * 100}%` }} />
      </div>
      <strong className="cmp-valor">
        {valor} <small>{c.unidade}</small>
      </strong>
    </div>
  )

  return (
    <figure className="case-comparacao">
      <h3>{c.titulo}</h3>
      {linha(c.antes.rotulo, c.antes.valor, false)}
      {linha(c.depois.rotulo, c.depois.valor, true)}
      <figcaption>{c.legenda}</figcaption>
    </figure>
  )
}

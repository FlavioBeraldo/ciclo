// Funil ampulheta do E-com Shift.
//
// A silhueta é desenhada em SVG (só linhas, decorativa e escondida de leitores
// de tela) e as seis etapas são texto HTML de verdade, na ordem da jornada.
// O desenho é dividido em dois cones — o que estreita até a compra e o que se
// abre depois dela —, cada um esticado sobre o seu próprio bloco de etapas, de
// modo que o gargalo cai sempre exatamente entre Compra e Recompra.
// No mobile o SVG sai de cena e a lista vira uma sequência vertical simples.

const TOP_STEPS = [
  {
    name: 'Reconhecimento',
    desc: 'Ser lembrado antes de a necessidade de compra aparecer.',
    width: '100%',
  },
  {
    name: 'Consideração',
    desc: 'Entrar na decisão no momento em que a compra é avaliada.',
    width: '74%',
  },
  {
    name: 'Compra',
    desc: 'Converter no canal em que o cliente já está.',
    width: '52%',
  },
]

const BOTTOM_STEPS = [
  {
    name: 'Recompra',
    desc: 'Estimular a nova compra de quem já conhece a marca.',
    width: '52%',
  },
  {
    name: 'Fidelização',
    desc: 'Fortalecer a relação com a base de clientes.',
    width: '74%',
  },
  {
    name: 'Expansão',
    desc: 'Gerar indicação e abrir novos mercados.',
    width: '100%',
  },
]

const CHANNELS = [
  'Loja própria',
  'Marketplaces',
  'WhatsApp',
  'Televendas',
  'Loja física',
  'Social commerce',
]

function Step({
  step,
  number,
}: {
  step: { name: string; desc: string; width: string }
  number: number
}) {
  return (
    <li className="shift-step" style={{ ['--w' as string]: step.width }}>
      <span className="shift-step-num">Etapa {String(number).padStart(2, '0')}</span>
      <h3 className="shift-step-name">{step.name}</h3>
      <p className="shift-step-desc">{step.desc}</p>
    </li>
  )
}

export default function Hourglass() {
  return (
    <div className="shift-hourglass">
      {/* Cone que estreita: do reconhecimento até a compra */}
      <div className="shift-cone">
        <svg
          className="shift-cone-frame"
          viewBox="0 0 400 300"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <line x1="8" y1="2" x2="392" y2="2" vectorEffect="non-scaling-stroke" />
          <line x1="8" y1="2" x2="200" y2="298" vectorEffect="non-scaling-stroke" />
          <line x1="392" y1="2" x2="200" y2="298" vectorEffect="non-scaling-stroke" />
        </svg>
        <ol className="shift-steps">
          {TOP_STEPS.map((step, i) => (
            <Step key={step.name} step={step} number={i + 1} />
          ))}
        </ol>
      </div>

      <div className="shift-neck" aria-hidden="true">
        <span />
      </div>

      {/* Cone que se abre: da recompra à expansão */}
      <div className="shift-cone">
        <svg
          className="shift-cone-frame"
          viewBox="0 0 400 300"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <line x1="200" y1="2" x2="8" y2="298" vectorEffect="non-scaling-stroke" />
          <line x1="200" y1="2" x2="392" y2="298" vectorEffect="non-scaling-stroke" />
          <line x1="8" y1="298" x2="392" y2="298" vectorEffect="non-scaling-stroke" />
        </svg>
        <ol className="shift-steps">
          {BOTTOM_STEPS.map((step, i) => (
            <Step key={step.name} step={step} number={i + 4} />
          ))}
        </ol>
      </div>

      <p className="shift-hourglass-channels">
        <span className="shift-eyebrow">Canais de compra e recompra</span>
        <span className="shift-body block mt-1">{CHANNELS.join(' · ')}</span>
      </p>
    </div>
  )
}

// Funil ampulheta do E-com Shift.
//
// Um único bloco de conteúdo HTML, que muda de arranjo pelo CSS:
//  · desktop (>=1024px): diagrama horizontal, seis colunas da esquerda para a
//    direita, com os títulos acima do contorno e as descrições abaixo. O
//    contorno em SVG estreita no centro, entre Compra e Recompra, e se alarga
//    nas pontas.
//  · mobile: a mesma lista vira uma sequência vertical simples.
// O SVG é puramente decorativo (aria-hidden) e nenhum texto é duplicado, então
// o leitor de tela percorre as seis etapas uma única vez.

const STEPS = [
  { name: 'Reconhecimento', desc: 'Ser lembrado antes de a necessidade de compra aparecer.' },
  { name: 'Consideração', desc: 'Entrar na decisão no momento em que a compra é avaliada.' },
  { name: 'Compra', desc: 'Converter no canal em que o cliente já está.' },
  { name: 'Recompra', desc: 'Estimular a nova compra de quem já conhece a marca.' },
  { name: 'Fidelização', desc: 'Fortalecer a relação com a base de clientes.' },
  { name: 'Expansão', desc: 'Gerar indicação e abrir novos mercados.' },
]

const CHANNELS = [
  'Loja própria',
  'Marketplaces',
  'WhatsApp',
  'Televendas',
  'Loja física',
  'Social commerce',
]

export default function Hourglass() {
  return (
    <div className="shift-hourglass">
      <ol className="shift-steps">
        {/* Contorno da ampulheta — decorativo, só no desktop */}
        <svg
          className="shift-hg-band"
          viewBox="0 0 1200 150"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          {/* borda superior e inferior, estreitando até o centro */}
          <path d="M 3 3 L 600 62 L 1197 3" vectorEffect="non-scaling-stroke" />
          <path d="M 3 147 L 600 88 L 1197 147" vectorEffect="non-scaling-stroke" />
          {/* tampas das pontas */}
          <line x1="3" y1="3" x2="3" y2="147" vectorEffect="non-scaling-stroke" />
          <line x1="1197" y1="3" x2="1197" y2="147" vectorEffect="non-scaling-stroke" />
          {/* gargalo entre Compra e Recompra */}
          <line
            className="is-neck"
            x1="600"
            y1="62"
            x2="600"
            y2="88"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {STEPS.map((step, i) => (
          <li
            key={step.name}
            className="shift-step"
            style={{ ['--col' as string]: String(i + 1) }}
          >
            <div className="shift-step-head">
              <span className="shift-step-num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="shift-step-name">{step.name}</h3>
            </div>
            <p className="shift-step-desc">{step.desc}</p>
          </li>
        ))}
      </ol>

      <p className="shift-hourglass-channels">
        <span className="shift-eyebrow">Canais de compra e recompra</span>
        <span className="shift-body block mt-1">{CHANNELS.join(' · ')}</span>
      </p>
    </div>
  )
}

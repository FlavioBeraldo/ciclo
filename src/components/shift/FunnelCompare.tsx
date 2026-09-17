// Comparação visual entre a leitura tradicional do funil e o E-com Shift.
//
// Os dois painéis usam a MESMA tela de seis faixas. À esquerda o desenho
// afunila e para na compra, deixando a metade de baixo vazia — é a leitura
// focada no primeiro pedido. À direita a forma volta a se abrir depois da
// compra, e as três etapas seguintes ganham o roxo da continuidade.
// Os contornos são SVG decorativo; todo o texto é HTML.

const TRADICIONAL = ['Reconhecimento', 'Consideração', 'Compra']
const SHIFT = ['Reconhecimento', 'Consideração', 'Compra', 'Recompra', 'Fidelização', 'Expansão']

// Larguras que desenham a silhueta de cada etapa
const WIDTHS_FUNIL = ['100%', '74%', '50%']
const WIDTHS_SHIFT = ['100%', '74%', '50%', '50%', '74%', '100%']

export default function FunnelCompare() {
  return (
    <div className="shift-vs">
      {/* ── Funil tradicional ───────────────────────────────────────────── */}
      <section className="shift-vs-panel">
        <h3 className="shift-display shift-h3">Funil tradicional</h3>
        <p className="shift-body mt-3">A leitura se organiza para chegar ao primeiro pedido.</p>

        <div className="shift-vs-figure">
          <svg
            className="shift-vs-shape"
            viewBox="0 0 300 300"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <line x1="4" y1="2" x2="296" y2="2" vectorEffect="non-scaling-stroke" />
            <line x1="4" y1="2" x2="150" y2="150" vectorEffect="non-scaling-stroke" />
            <line x1="296" y1="2" x2="150" y2="150" vectorEffect="non-scaling-stroke" />
            <line
              className="is-end"
              x1="110"
              y1="150"
              x2="190"
              y2="150"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <ol className="shift-vs-stages">
            {TRADICIONAL.map((stage, i) => (
              <li key={stage} style={{ ['--w' as string]: WIDTHS_FUNIL[i] }}>
                {stage}
              </li>
            ))}
            <li className="shift-vs-void">A leitura termina no pedido fechado.</li>
          </ol>
        </div>

        <ul className="shift-list mt-6">
          <li>O objetivo se encerra na primeira venda.</li>
          <li>O resultado é lido pelo custo de aquisição do pedido.</li>
          <li>O que vem depois da compra fica fora do mesmo plano.</li>
        </ul>
      </section>

      {/* ── Modelo E-com Shift ──────────────────────────────────────────── */}
      <section className="shift-vs-panel is-shift">
        <h3 className="shift-display shift-h3">Modelo E-com Shift</h3>
        <p className="shift-body mt-3">A mesma jornada continua depois da compra.</p>

        <div className="shift-vs-figure">
          <svg
            className="shift-vs-shape"
            viewBox="0 0 300 300"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <line x1="4" y1="2" x2="296" y2="2" vectorEffect="non-scaling-stroke" />
            <line x1="4" y1="2" x2="150" y2="147" vectorEffect="non-scaling-stroke" />
            <line x1="296" y1="2" x2="150" y2="147" vectorEffect="non-scaling-stroke" />
            <line
              className="is-open"
              x1="150"
              y1="153"
              x2="4"
              y2="298"
              vectorEffect="non-scaling-stroke"
            />
            <line
              className="is-open"
              x1="150"
              y1="153"
              x2="296"
              y2="298"
              vectorEffect="non-scaling-stroke"
            />
            <line
              className="is-open"
              x1="4"
              y1="298"
              x2="296"
              y2="298"
              vectorEffect="non-scaling-stroke"
            />
            <line
              className="is-neck"
              x1="150"
              y1="147"
              x2="150"
              y2="153"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <ol className="shift-vs-stages">
            {SHIFT.map((stage, i) => (
              <li
                key={stage}
                className={i >= 3 ? 'is-after' : undefined}
                style={{ ['--w' as string]: WIDTHS_SHIFT[i] }}
              >
                {stage}
              </li>
            ))}
          </ol>
        </div>

        <ul className="shift-list shift-list--accent mt-6">
          <li>A compra é o meio do caminho, não o fim.</li>
          <li>Recompra, fidelização e expansão entram no mesmo plano.</li>
          <li>CAC, LTV e recompra são lidos juntos.</li>
        </ul>
      </section>
    </div>
  )
}

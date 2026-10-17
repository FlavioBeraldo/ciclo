// Bloco escuro da tese: os três ciclos e o painel de órbitas.
// Mesmo conteúdo dos três ciclos que alimenta /solucoes, resumido.

const CICLOS = [
  {
    titulo: 'Criação de Demanda para marca',
    texto:
      'Faça seu cliente te conhecer antes da compra. Construir preferência reduz o custo de mídia e de aquisição de clientes.',
  },
  {
    titulo: 'Captação de Demanda',
    texto: 'Converta interesse em primeira compra.',
  },
  {
    titulo: 'Expansão de Demanda',
    texto: 'Aumente frequência, ticket e lifetime value.',
  },
]

export default function Metodo() {
  return (
    <section id="metodo" className="method dark">
      <div className="wrap narrow">
        <div className="method-intro">
          <div className="eyebrow">
            <span />
            Nossa tese
          </div>

          <h2>
            Crescimento sustentável
            <br />
            <em className="editorial-accent">não é só conversão.</em>
          </h2>

          <p>Uma marca precisa gerar esses três ciclos de forma constante.</p>
        </div>

        <div className="method-layout">
          <div className="cycles">
            {CICLOS.map((c, i) => (
              <article className="cycle" key={c.titulo}>
                <div className="cycle-number">{i + 1}</div>
                <h3>{c.titulo}</h3>
                <p>{c.texto}</p>
              </article>
            ))}
          </div>

          <div className="orbit-panel">
            <div className="orbits" aria-hidden="true">
              <div className="orbit" />
              <div className="orbit" />
              <div className="orbit" />
              <div className="orbit" />
              <div className="orbit-dot" />
              <div className="orbit-word">
                <small>TRÊS CICLOS. UMA OPERAÇÃO.</small>
                <strong>
                  Full Funnel
                  <br />
                  Marketing
                </strong>
              </div>
            </div>

            <div className="orbit-result">
              <b>+ Receita</b>
              <b>+ Lucro</b>
              <b>− CAC</b>
            </div>
          </div>
        </div>

        <p className="method-foot">
          Alinhados, esses ciclos geram crescimento previsível, previsibilidade de caixa e
          vantagem competitiva sustentável.
        </p>
      </div>
    </section>
  )
}

import { icones } from '../icones'

// O erro comum das marcas, com o diagrama da jornada e o universo de canais.
// Os números das notas (01, 02, 04, 05) vêm do layout aprovado.

const NOTAS = [
  {
    n: '01',
    titulo: 'Reconhecimento & consideração',
    texto: 'A marca não é lembrada quando o cliente pensa em comprar.',
  },
  {
    n: '02',
    titulo: 'Performance da primeira compra',
    texto: 'Onde seu cliente toma a decisão de adquirir seu produto pela primeira vez.',
  },
  {
    n: '04',
    titulo: 'Recompra & fidelização',
    texto: 'Falta de estímulo para voltar a comprar e de programas de retenção.',
  },
  {
    n: '05',
    titulo: 'Expansão de aquisição',
    texto: 'Investimento desconectado de escala e novas audiências.',
  },
]

const CANAIS = [
  { icone: 'lojaPropria', rotulo: 'Loja Própria' },
  { icone: 'marketplaces', rotulo: 'Marketplaces' },
  { icone: 'whatsapp', rotulo: 'WhatsApp' },
  { icone: 'televendas', rotulo: 'Televendas' },
  { icone: 'iaCheckout', rotulo: 'IA Checkout' },
  { icone: 'lojaFisica', rotulo: 'Loja Física' },
  { icone: 'tiktok', rotulo: 'Social Commerce' },
] as const

export default function Problema() {
  return (
    <section className="problem">
      <div className="wrap narrow">
        <div className="problem-grid">
          <div className="problem-copy">
            <div className="eyebrow">
              <span />O erro comum das marcas
            </div>

            <h2>
              Investir exclusivamente no momento da conversão e não estar no ambiente
              transacional correto.
            </h2>

            <p className="problem-lead">
              Esse é o problema mais grave que as marcas estão enfrentando: elas não estão
              conseguindo conectar suas estratégias de marketing de ponta a ponta no
              e-commerce.
            </p>

            <div className="journey-notes">
              {NOTAS.map((nota) => (
                <div key={nota.n}>
                  <small>{nota.n}</small>
                  <p>
                    <strong>{nota.titulo}</strong>
                    {nota.texto}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="journey-illustration"
            role="group"
            aria-label="Investimento concentrado na primeira compra deixa lacunas antes e depois da conversão. É preciso conectar a jornada aos canais em que o cliente compra."
          >
            <div className="diagram-eyebrow">01 / A JORNADA NÃO TERMINA NA CONVERSÃO</div>

            <div className="journey-orbits">
              <div className="journey-stage">
                <div className="stage-orbit">
                  <i />
                  <span>
                    Reconhecimento
                    <br />& consideração
                  </span>
                </div>
                <small>Antes da compra</small>
              </div>

              <div className="journey-stage focused">
                <div className="concentration">Investimento concentrado ↓</div>
                <div className="stage-orbit">
                  <i />
                  <span>
                    Primeira
                    <br />
                    compra
                  </span>
                </div>
                <small>Conversão</small>
              </div>

              <div className="journey-stage">
                <div className="stage-orbit">
                  <i />
                  <span>
                    Recompra
                    <br />& expansão
                  </span>
                </div>
                <small>Depois da compra</small>
              </div>
            </div>

            <div className="diagram-bridge">
              <span>O cliente decide onde comprar</span>
            </div>

            <div className="channel-universe">
              <svg
                className="channel-orbits"
                viewBox="0 0 600 290"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <ellipse cx="300" cy="145" rx="245" ry="110" />
                <ellipse cx="300" cy="145" rx="140" ry="110" />
                <ellipse cx="300" cy="145" rx="245" ry="55" />
              </svg>

              <div className="channel-center">
                <span>03 / AMBIENTE TRANSACIONAL</span>
                <strong>
                  Esteja onde seu
                  <br />
                  cliente compra.
                </strong>
              </div>

              {CANAIS.map((canal, i) => (
                <div className={`channel-node node-${i + 1}`} key={canal.rotulo}>
                  {icones[canal.icone]}
                  <span>{canal.rotulo}</span>
                </div>
              ))}
            </div>

            <p className="diagram-caption">
              Conecte a descoberta, a primeira compra e a recompra aos ambientes certos.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

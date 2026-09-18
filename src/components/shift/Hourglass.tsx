import { Store, LayoutGrid, MessageCircle, Headset, Sparkles, MapPin, Share2 } from 'lucide-react'

// Funil ampulheta do E-com Shift.
//
// Um único bloco de conteúdo HTML, que muda de arranjo pelo CSS:
//  · desktop (>=1024px): diagrama horizontal, seis colunas da esquerda para a
//    direita, com os títulos acima do contorno e as descrições abaixo. O
//    contorno em SVG estreita no centro, entre Compra e Recompra.
//  · mobile: a mesma lista vira uma sequência vertical simples.
// Os canais transacionais vêm logo depois de Compra na ordem do documento, de
// modo que no mobile aparecem exatamente na virada Compra/Recompra; no desktop
// o CSS os leva para um bloco centralizado sob o gargalo, ligado a ele por um
// conector. O SVG é decorativo e nenhum texto é duplicado, então o leitor de
// tela percorre as seis etapas uma única vez.

const TOP_STEPS = [
  { name: 'Reconhecimento', desc: 'Ser lembrado antes de a necessidade aparecer.' },
  { name: 'Consideração', desc: 'Entrar na lista antes de o cliente comparar preço.' },
  { name: 'Compra', desc: 'Converter no canal onde o cliente já está.' },
]

const BOTTOM_STEPS = [
  { name: 'Recompra', desc: 'Fazer a segunda compra acontecer sem pagar de novo pelo cliente.' },
  { name: 'Fidelização', desc: 'Transformar o cliente recorrente em base previsível.' },
  { name: 'Expansão', desc: 'Fazer o cliente trazer o próximo cliente.' },
]

// Canais transacionais conforme o material da metodologia
const CHANNELS = [
  { label: 'Loja Própria', Icon: Store },
  { label: 'Marketplaces', Icon: LayoutGrid },
  { label: 'WhatsApp', Icon: MessageCircle },
  { label: 'Televendas', Icon: Headset },
  { label: 'IA Checkout', Icon: Sparkles },
  { label: 'Loja Física', Icon: MapPin },
  { label: 'Social Commerce', Icon: Share2 },
]

function Step({ name, desc, index }: { name: string; desc: string; index: number }) {
  return (
    <li className="shift-step" style={{ ['--col' as string]: String(index) }}>
      <div className="shift-step-head">
        <span className="shift-step-num">{String(index).padStart(2, '0')}</span>
        <h3 className="shift-step-name">{name}</h3>
      </div>
      <p className="shift-step-desc">{desc}</p>
    </li>
  )
}

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
          <path d="M 3 3 L 600 62 L 1197 3" vectorEffect="non-scaling-stroke" />
          <path d="M 3 147 L 600 88 L 1197 147" vectorEffect="non-scaling-stroke" />
          <line x1="3" y1="3" x2="3" y2="147" vectorEffect="non-scaling-stroke" />
          <line x1="1197" y1="3" x2="1197" y2="147" vectorEffect="non-scaling-stroke" />
          <line
            className="is-neck"
            x1="600"
            y1="62"
            x2="600"
            y2="88"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {TOP_STEPS.map((step, i) => (
          <Step key={step.name} name={step.name} desc={step.desc} index={i + 1} />
        ))}

        {/* Onde a transação acontece — na virada entre Compra e Recompra */}
        <li className="shift-hg-channels">
          <span className="shift-hg-connector" aria-hidden="true" />
          <div className="shift-hg-channels-box">
            <h4 className="shift-eyebrow shift-eyebrow--purple">Canais transacionais de venda</h4>
            <ul className="shift-chips">
              {CHANNELS.map(({ label, Icon }) => (
                <li key={label} className="shift-chip">
                  <Icon className="shift-chip-icon" aria-hidden="true" strokeWidth={1.5} />
                  {label}
                </li>
              ))}
            </ul>
            <p className="shift-step-desc shift-hg-channels-note">
              Seu cliente compra e recompra no canal que oferece mais comodidade e menos fricção.
            </p>
          </div>
        </li>

        {BOTTOM_STEPS.map((step, i) => (
          <Step key={step.name} name={step.name} desc={step.desc} index={i + 4} />
        ))}
      </ol>
    </div>
  )
}

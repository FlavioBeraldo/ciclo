// A setinha de "vai para lá" do site.
//
// Antes era o caractere U+2197 escrito direto no texto. O problema é que
// iOS e parte do Android tratam esse caractere como EMOJI: em vez da seta
// tipográfica, o sistema desenha o quadradinho azul com a seta branca. Por
// isso o botão aparecia com um ícone colorido que não é da marca — e não dava
// para alinhar, redimensionar nem colorir, porque emoji ignora `color`.
//
// Aqui ela é um SVG de verdade: herda a cor do texto com `currentColor`,
// acompanha o `font-size` do pai (1em, igual o caractere fazia) e tem traço
// próprio. Como é um elemento, também dá para animar — o movimento no hover
// está em `.ciclo2026 .seta`, em base.css.
//
// Decorativa em todos os usos: quem lê por leitor de tela já tem o texto do
// link ao lado, então `aria-hidden`.

export function Seta({ className }: { className?: string }) {
  return (
    <svg
      className={className ? `seta ${className}` : 'seta'}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4.5 11.5 11.5 4.5" />
      <path d="M5.75 4.5h5.75v5.75" />
    </svg>
  )
}

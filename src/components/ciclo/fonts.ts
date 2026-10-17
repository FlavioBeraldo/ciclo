// Tipografia do design 2026.
//
// Inter já vem do layout raiz, em `--font-inter`. Aqui entra só a Playfair
// Display Italic 400, usada exclusivamente nas frases editoriais curtas.
// A variável tem nome próprio para não colidir com a `--font-playfair` que a
// página do playbook carrega por conta dela — aquela página está congelada.
import { Playfair_Display } from 'next/font/google'

export const playfair2026 = Playfair_Display({
  weight: '400',
  style: 'italic',
  subsets: ['latin', 'latin-ext'],
  variable: '--font-playfair-2026',
  display: 'swap',
})

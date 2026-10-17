import { Playfair_Display } from 'next/font/google'

// Playfair Display em itálico, para as frases editoriais do design 2026.
//
// A variável tem nome próprio, `--font-playfair-2026`, e não `--font-playfair`:
// essa já é usada pelo /playbook-social-commerce, que está congelado e carrega
// a fonte dele por conta própria. Dois nomes diferentes garantem que mexer
// aqui nunca alcance aquela página.
export const playfair2026 = Playfair_Display({
  weight: '400',
  style: 'italic',
  subsets: ['latin', 'latin-ext'],
  variable: '--font-playfair-2026',
  display: 'swap',
})

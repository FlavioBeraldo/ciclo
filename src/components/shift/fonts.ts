// Tipografia de display da identidade E-COM SHIFT.
//
// Anton é a fonte condensada em caixa alta identificada no material impresso
// da metodologia. Fica restrita às páginas da consultoria (a variável CSS só é
// aplicada na raiz delas), então nenhuma outra página do site carrega o arquivo.
import { Anton } from 'next/font/google'

export const anton = Anton({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
  variable: '--font-anton',
  display: 'swap',
})

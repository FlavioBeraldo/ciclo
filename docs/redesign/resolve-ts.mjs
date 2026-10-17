// Registra o gancho acima. Use com:
//   node --experimental-strip-types --import ./resolve-ts.mjs <script>
import { register } from 'node:module'
register('./ganchos-ts.mjs', import.meta.url)

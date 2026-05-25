// Copies public/ and .next/static/ into .next/standalone/ after build.
// Required for standalone output to serve static assets correctly.
const { cpSync, existsSync, mkdirSync } = require('fs')
const { join } = require('path')

const root = process.cwd()
const standalone = join(root, '.next', 'standalone')

if (!existsSync(standalone)) {
  console.log('No standalone folder found — skipping asset copy.')
  process.exit(0)
}

const copies = [
  [join(root, 'public'), join(standalone, 'public')],
  [join(root, '.next', 'static'), join(standalone, '.next', 'static')],
]

for (const [src, dest] of copies) {
  if (existsSync(src)) {
    mkdirSync(dest, { recursive: true })
    cpSync(src, dest, { recursive: true })
    console.log(`Copied: ${src} → ${dest}`)
  }
}
console.log('Post-build asset copy complete.')

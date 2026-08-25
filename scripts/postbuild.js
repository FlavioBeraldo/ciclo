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
  // Keystatic posts are read from the filesystem at runtime (blog listing,
  // ISR revalidation and sitemap), so content/ must ship with the server.
  [join(root, 'content'), join(standalone, 'content')],
]

for (const [src, dest] of copies) {
  if (existsSync(src)) {
    mkdirSync(dest, { recursive: true })
    cpSync(src, dest, { recursive: true })
    console.log(`Copied: ${src} → ${dest}`)
  }
}
console.log('Post-build asset copy complete.')

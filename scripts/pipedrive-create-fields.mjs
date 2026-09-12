#!/usr/bin/env node
// Cria os campos personalizados de Deal para atribuição GA4 no Pipedrive e grava
// as chaves hash retornadas em src/lib/pipedrive-fields.ts.
//
// Uso:  PIPEDRIVE_API_TOKEN=xxx node scripts/pipedrive-create-fields.mjs
// (ou defina o token em .env / .env.local — ex.: `vercel env pull .env.local`)
//
// Idempotente: lista GET /v1/dealFields antes e reutiliza campos com o mesmo nome.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// Mesmos nomes de src/lib/pipedrive-fields.ts (fonte da verdade).
// Esquema consolidado (limite de 30 campos de Deal na conta):
// 7 varchar + 1 text que recebe JSON {term, content, fbclid, referrer, first_visit}.
const FIELDS = {
  source: { name: 'Origem (GA)', type: 'varchar' },
  medium: { name: 'Mídia (GA)', type: 'varchar' },
  campaign: { name: 'Campanha (GA)', type: 'varchar' },
  ga_client_id: { name: 'GA Client ID', type: 'varchar' },
  ga_session_id: { name: 'GA Session ID', type: 'varchar' },
  landing_page: { name: 'Landing Page', type: 'varchar' },
  gclid: { name: 'gclid', type: 'varchar' },
  extra: { name: 'Atribuição extra (GA)', type: 'text' },
}

function loadToken() {
  if (process.env.PIPEDRIVE_API_TOKEN) return process.env.PIPEDRIVE_API_TOKEN
  for (const file of ['.env.local', '.env']) {
    const p = resolve(ROOT, file)
    if (!existsSync(p)) continue
    const m = readFileSync(p, 'utf8').match(/^PIPEDRIVE_API_TOKEN\s*=\s*"?([^"\n]+)"?/m)
    if (m) return m[1].trim()
  }
  return null
}

const token = loadToken()
if (!token) {
  console.error('PIPEDRIVE_API_TOKEN não encontrado (env, .env.local ou .env). Rode: vercel env pull .env.local')
  process.exit(1)
}

const url = (path, params = {}) =>
  `https://api.pipedrive.com/v1${path}?${new URLSearchParams({ api_token: token, ...params })}`

// 1. Lista os campos existentes (paginado) para não duplicar
const existing = new Map()
let start = 0
for (;;) {
  const res = await fetch(url('/dealFields', { limit: '500', start: String(start) }))
  const data = await res.json()
  if (!data.success) {
    console.error('Falha ao listar dealFields:', data.error ?? data)
    process.exit(1)
  }
  for (const f of data.data ?? []) existing.set(f.name, f.key)
  const pag = data.additional_data?.pagination
  if (!pag?.more_items_in_collection) break
  start = pag.next_start
}

// 2. Cria os que faltam e monta o mapa final
const keys = {}
for (const [localKey, { name, type }] of Object.entries(FIELDS)) {
  const found = existing.get(name)
  if (found) {
    keys[localKey] = found
    console.log(`= já existia  ${name.padEnd(24)} ${found}`)
    continue
  }
  const res = await fetch(url('/dealFields'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, field_type: type }),
  })
  const data = await res.json()
  if (!data.success || !data.data?.key) {
    console.error(`Falha ao criar "${name}":`, data.error ?? data)
    process.exit(1)
  }
  keys[localKey] = data.data.key
  console.log(`+ criado      ${name.padEnd(24)} ${data.data.key}`)
}

// 3. Grava as chaves em src/lib/pipedrive-fields.ts
const target = resolve(ROOT, 'src/lib/pipedrive-fields.ts')
const source = readFileSync(target, 'utf8')
const block = [
  'export const ATTRIBUTION_FIELD_KEYS: Record<AttributionFieldKey, string> = {',
  ...Object.entries(keys).map(
    ([localKey, key]) => `  ${localKey}: '${key}', // ${FIELDS[localKey].name} [${FIELDS[localKey].type}]`
  ),
  '}',
].join('\n')
const updated = source.replace(
  /export const ATTRIBUTION_FIELD_KEYS[^=]*=\s*\{[^}]*\}/,
  block
)
writeFileSync(target, updated)
console.log(`\nChaves gravadas em ${target}. Faça commit do arquivo atualizado.`)

// Roda antes do `next build`. Grava em src/data/episodios-fator-m.ts o último
// conjunto REAL de episódios de "O Fator M".
//
// Esse arquivo é o fallback do site: é o que aparece quando a API do YouTube
// não responde em tempo de execução. Antes o passo existia mas ninguém lia o
// resultado, e o fallback de verdade era uma lista fixa de vídeos de
// depoimento de cliente reetiquetados como episódio. Agora src/lib/youtube.ts
// lê este módulo, então o fallback é um retrato real do canal, do dia do
// build. É .ts e não .json para o teste do passo 18 conseguir importá-lo sem
// o resolvedor do Next.
//
// O filtro aqui é O MESMO de src/lib/youtube-server.ts (nada abaixo de 300s,
// nada marcado como short, nada vertical). Se divergirem, o fallback mostra
// uma lista que o site nunca mostraria.
//
// Sem YOUTUBE_API_KEY, ou com a API fora do ar, o arquivo existente fica como
// está — nunca é apagado nem substituído por conteúdo inventado.
const { writeFileSync } = require('fs')
const { join } = require('path')

const API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_HANDLE = process.env.YOUTUBE_CHANNEL_HANDLE || '@ofatorm'
const OUT = join(__dirname, '..', 'src', 'data', 'episodios-fator-m.ts')

function segundos(iso) {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return 0
  return parseInt(m[1] || '0') * 3600 + parseInt(m[2] || '0') * 60 + parseInt(m[3] || '0')
}

async function pedir(url, oque) {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`${oque}: HTTP ${r.status}`)
  return r.json()
}

// Escreve o módulo com o mesmo formato que src/lib/youtube.ts espera.
//
// Os valores saem por JSON.stringify, não por aspas montadas à mão. Descrição
// de vídeo do YouTube tem quebra de linha, aspas e emoji; uma versão anterior
// disto montava a string na unha e gerava TypeScript inválido assim que a
// primeira descrição real chegava — o build local passava porque sem chave o
// script nem roda, e quebrava no Preview, que tem chave. Literal JSON é
// literal JavaScript válido, e escapa tudo.
function moduloTs(episodios) {
  const aspas = (v) => JSON.stringify(String(v ?? ''))
  const item = (e) =>
    '  {\n' +
    ['id', 'title', 'description', 'publishedAt', 'thumbnail', 'url']
      .map((k) => `    ${k}: ${aspas(e[k])},`)
      .join('\n') +
    '\n  },'
  return [
    '// GERADO POR scripts/fetch-youtube.js antes do `next build`. Não edite à mão:',
    '// o próximo build sobrescreve.',
    '//',
    '// Último conjunto REAL de episódios de "O Fator M". É o que o site mostra',
    '// quando a API do YouTube não responde. Era um arquivo .json; virou módulo',
    '// para o teste do passo 18 conseguir importá-lo sem o resolvedor do Next.',
    '',
    'export interface EpisodioGravado {',
    '  id: string',
    '  title: string',
    '  description: string',
    '  publishedAt: string',
    '  thumbnail: string',
    '  url: string',
    '}',
    '',
    'export const EPISODIOS: EpisodioGravado[] = [',
    ...episodios.map(item),
    ']',
    '',
  ].join('\n')
}

async function main() {
  if (!API_KEY) {
    console.log('[youtube] YOUTUBE_API_KEY ausente — mantendo o snapshot atual.')
    return
  }

  try {
    const canal = await pedir(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${CHANNEL_HANDLE}&key=${API_KEY}`,
      'canal'
    )
    const uploads = canal.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
    if (!uploads) throw new Error('playlist de uploads não encontrada')

    const playlist = await pedir(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploads}&maxResults=30&key=${API_KEY}`,
      'playlist'
    )
    const ids = (playlist.items || []).map((i) => i.snippet.resourceId.videoId).join(',')
    if (!ids) throw new Error('playlist vazia')

    const detalhes = await pedir(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,player&id=${ids}&key=${API_KEY}`,
      'detalhes'
    )

    const episodios = (detalhes.items || [])
      .filter((v) => {
        const titulo = v.snippet?.title?.toLowerCase() || ''
        const vertical = (v.player?.embedHeight ?? 0) > (v.player?.embedWidth ?? 1)
        return !(
          segundos(v.contentDetails?.duration || '') < 300 ||
          titulo.includes('#short') ||
          titulo.includes('#shorts') ||
          vertical
        )
      })
      .slice(0, 8)
      .map((v) => ({
        id: v.id,
        title: v.snippet.title,
        description: v.snippet.description,
        publishedAt: v.snippet.publishedAt,
        thumbnail:
          v.snippet.thumbnails?.high?.url ||
          v.snippet.thumbnails?.medium?.url ||
          `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${v.id}`,
      }))

    // Lista vazia não substitui o snapshot: seria trocar episódio real por
    // nada, e o site passaria a mostrar "indisponível" por causa do build.
    if (!episodios.length) throw new Error('nenhum episódio horizontal na resposta')

    writeFileSync(OUT, moduloTs(episodios))
    console.log(`[youtube] snapshot atualizado com ${episodios.length} episódios.`)
  } catch (err) {
    console.warn('[youtube] falhou, mantendo o snapshot atual:', err.message)
  }
}

async function prepararSandboxPlaybook() {
  if (process.env.VERCEL_ENV !== 'preview' ||
      process.env.VERCEL_GIT_COMMIT_REF !== 'feat/perfil-comercial-playbook' ||
      process.env.SUPABASE_URL !== 'https://zlbpaawgzycaopobfxva.supabase.co') {
    throw Error('Este build temporário é exclusivo da homologação do Playbook.')
  }
  const host = 'flavio-sandbox3.pipedrive.com'
  const {readFileSync,writeFileSync} = require('node:fs')
  const token=process.env.PIPEDRIVE_API_TOKEN
  if (!token) throw Error('Token de sandbox ausente')
  async function api(path, data) {
    const response=await fetch('https://'+host+'/api/'+path,{
      method:data?'POST':'GET',headers:{'x-api-token':token,'Content-Type':'application/json'},
      body:data?JSON.stringify(data):undefined,
    })
    const body=await response.json().catch(()=>({}))
    if(!response.ok || body.success!==true) throw Error('Sandbox '+path+' HTTP '+response.status+' '+String(body.error||'').slice(0,240))
    return body.data
  }
  const me=await api('v1/users/me')
  if (me.company_domain!=='flavio-sandbox3') throw Error('Identidade do sandbox não confirmada')
  let pipe=(await api('v2/pipelines')).find(p=>p.name==='9 - Playbooks')
  if (!pipe) pipe=await api('v2/pipelines',{name:'9 - Playbooks'})
  const stages=await api('v2/stages?pipeline_id='+pipe.id)
  let stage=stages.find(s=>s.name==='Baixou material')
  if (!stage) stage=await api('v2/stages',{pipeline_id:pipe.id,name:'Baixou material'})
  const stageList=await api('v2/stages?pipeline_id='+pipe.id)
  if(stageList.sort((a,b)=>a.order_nr-b.order_nr)[0]?.id!==stage.id)throw Error('A primeira etapa do sandbox deve ser Baixou material')
  const dir=process.cwd(), f=dir+'/src/lib/pipedrive-fields.ts', r=dir+'/src/app/api/playbook/perfil/route.ts'
  if (process.env.META_CAPI_TOKEN) throw Error('Token de mídia presente no preview')
  const layoutFile=dir+'/src/app/layout.tsx'
  const layout=readFileSync(layoutFile,'utf8').replace(/<Script\s+id="gtm-head"[\s\S]*?\/>/,'<script dangerouslySetInnerHTML={{ __html: "window.dataLayer = window.dataLayer || [];" }} />').replace(/<noscript>[\s\S]*?<\/noscript>/,'')
  if(layout.includes('googletagmanager.com'))throw Error('Isolamento web incompleto')
  writeFileSync(layoutFile,layout)
  let fields=readFileSync(f,'utf8'),route=readFileSync(r,'utf8')
  const all=await api('v2/dealFields?limit=500')
  for(const [old,name,kind] of [
    ['308abcb1e691a74448516e2aa0e47627707c5d03','Origem (GA)','varchar'],
    ['d8b3af3c093a3ee1e0bbd66084f4cc15672d5789','Mídia (GA)','varchar'],
    ['97e93aa5129c31beb3180fc43c61567f1e7dc427','Campanha (GA)','varchar'],
    ['f1be9c93fa7a0d8c092e25b3ec924e69e458e0b3','GA Client ID','varchar'],
    ['ffe34e9a1b798b607fb3f937e219cb3a3d0506ca','GA Session ID','varchar'],
    ['ba466eb264179c77139d91f732fd16dbb05f37ad','Site / URL da loja','varchar'],
    ['ff38db9997ba5fca25f1e176d5733b0b57dbb4ac','Landing Page','varchar'],
    ['9a5237229b3c4f35d8ccd24b35fc373acae8a93b','gclid','varchar'],
    ['344f9e4ae525229bb3f275c1429ac7841c379da3','Atribuição extra (GA)','text'],
    ['34b57523aeb4efdfe90674f07fc548ccd3da2769','Objetivo','text'],
    ['678b296293c7b91b687cd94f012f3aa38c42563e','Linkedin','varchar'],
    ['3581ad9c8d4612bf6cfce83ba340c2dc80af539c','Perfil comercial (Playbook)','varchar'],
  ]) {
    let field=all.find(f=>f.field_name===name)
    if(!field)field=await api('v2/dealFields',{field_name:name,field_type:kind})
    if(!/^[a-f0-9]{40}$/.test(field.field_code))throw Error('Chave de campo indisponível: '+name)
    fields=fields.replaceAll(old,field.field_code)
    route=route.replaceAll(old,field.field_code)
  }
  route=route.replaceAll('cicloe-commerce.pipedrive.com',host)
    .replace("pipeline_id: '13'", "pipeline_id: '"+pipe.id+"'")
    .replace('d.pipeline_id === 13','d.pipeline_id === '+pipe.id)
  writeFileSync(f,fields);writeFileSync(r,route)
  console.log('[Perfil A] Homologação preparada no sandbox; funil '+pipe.id+', etapa '+stage.id+'.')
}

prepararSandboxPlaybook().then(main).catch(e=>{ console.error(e.message);process.exitCode=1 })

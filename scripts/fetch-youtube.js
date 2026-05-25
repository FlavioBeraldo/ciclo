// Runs before `next build`. Fetches the latest videos from the Fator M
// YouTube channel and writes them to src/data/youtube-videos.json.
// If YOUTUBE_API_KEY is not set or the request fails, the existing
// fallback file is left untouched.
const { writeFileSync, existsSync } = require('fs')
const { join } = require('path')

const API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_HANDLE = process.env.YOUTUBE_CHANNEL_HANDLE || '@ofatorm'
const OUT = join(__dirname, '..', 'src', 'data', 'youtube-videos.json')

function parseIsoDuration(iso) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  return parseInt(match[1] || '0') * 3600 + parseInt(match[2] || '0') * 60 + parseInt(match[3] || '0')
}

async function main() {
  if (!API_KEY) {
    console.log('[youtube] YOUTUBE_API_KEY not set — keeping existing fallback data.')
    return
  }

  try {
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${CHANNEL_HANDLE}&key=${API_KEY}`
    )
    const channelData = await channelRes.json()
    const uploadsId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
    if (!uploadsId) throw new Error('Uploads playlist not found')

    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=30&key=${API_KEY}`
    )
    const playlistData = await playlistRes.json()
    const ids = (playlistData.items || []).map((i) => i.snippet.resourceId.videoId).join(',')

    const detailsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${ids}&key=${API_KEY}`
    )
    const detailsData = await detailsRes.json()

    const videos = (detailsData.items || [])
      .filter((v) => {
        const dur = parseIsoDuration(v.contentDetails?.duration || '')
        const title = v.snippet?.title?.toLowerCase() || ''
        return dur > 60 && !title.includes('#short')
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

    writeFileSync(OUT, JSON.stringify(videos, null, 2))
    console.log(`[youtube] Wrote ${videos.length} videos to youtube-videos.json`)
  } catch (err) {
    console.warn('[youtube] Fetch failed, keeping existing fallback:', err.message)
  }
}

main()

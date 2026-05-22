import { NextResponse } from 'next/server'
import { FALLBACK_VIDEOS, type YouTubeVideo } from '@/lib/youtube'

const API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_HANDLE = process.env.YOUTUBE_CHANNEL_HANDLE || '@ofatorm'

function parseIsoDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  const h = parseInt(match[1] || '0')
  const m = parseInt(match[2] || '0')
  const s = parseInt(match[3] || '0')
  return h * 3600 + m * 60 + s
}

async function fetchLatestVideos(): Promise<YouTubeVideo[]> {
  if (!API_KEY) {
    console.warn('[YouTube API] YOUTUBE_API_KEY not set, using fallback videos')
    return FALLBACK_VIDEOS
  }

  // 1. Get channel ID from handle
  const channelRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${CHANNEL_HANDLE}&key=${API_KEY}`,
    { next: { revalidate: 3600 } }
  )
  if (!channelRes.ok) throw new Error('Failed to fetch channel')
  const channelData = await channelRes.json()
  const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
  if (!uploadsPlaylistId) throw new Error('Uploads playlist not found')

  // 2. Fetch more items to compensate for Shorts being filtered out
  const playlistRes = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=30&key=${API_KEY}`,
    { next: { revalidate: 3600 } }
  )
  if (!playlistRes.ok) throw new Error('Failed to fetch playlist items')
  const playlistData = await playlistRes.json()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items: any[] = playlistData.items || []
  const videoIds = items.map((item: any) => item.snippet.resourceId.videoId).join(',')

  // 3. Fetch video details to get duration (to filter out Shorts < 60s)
  const detailsRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${API_KEY}`,
    { next: { revalidate: 3600 } }
  )
  if (!detailsRes.ok) throw new Error('Failed to fetch video details')
  const detailsData = await detailsRes.json()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const horizontalVideos = (detailsData.items || []).filter((v: any) => {
    const duration = parseIsoDuration(v.contentDetails?.duration || '')
    // Shorts are <= 60s; also skip videos with #Shorts in title
    const isShort =
      duration <= 60 ||
      v.snippet?.title?.toLowerCase().includes('#short') ||
      v.snippet?.title?.toLowerCase().includes('#shorts')
    return !isShort
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return horizontalVideos.slice(0, 8).map((v: any) => ({
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
}

export async function GET() {
  try {
    const videos = await fetchLatestVideos()
    return NextResponse.json(videos, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
    })
  } catch (err) {
    console.error('[YouTube API] Error:', err)
    return NextResponse.json(FALLBACK_VIDEOS, {
      headers: { 'Cache-Control': 'public, s-maxage=3600' },
    })
  }
}

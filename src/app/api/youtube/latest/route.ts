import { NextResponse } from 'next/server'
import { FALLBACK_VIDEOS, type YouTubeVideo } from '@/lib/youtube'

const API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_HANDLE = process.env.YOUTUBE_CHANNEL_HANDLE || '@ofatorm'

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

  // 2. Get latest videos from uploads playlist
  const playlistRes = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=8&key=${API_KEY}`,
    { next: { revalidate: 3600 } }
  )
  if (!playlistRes.ok) throw new Error('Failed to fetch playlist items')
  const playlistData = await playlistRes.json()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (playlistData.items || []).map((item: any) => ({
    id: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    publishedAt: item.snippet.publishedAt,
    thumbnail:
      item.snippet.thumbnails?.high?.url ||
      `https://img.youtube.com/vi/${item.snippet.resourceId.videoId}/hqdefault.jpg`,
    url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
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

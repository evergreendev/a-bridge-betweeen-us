import React from 'react'
import { cn } from '@/utilities/ui'

type Props = {
  url?: string
  title?: string
  caption?: string
  className?: string
  disableInnerContainer?: boolean
}

function extractYouTubeId(input?: string): string | undefined {
  if (!input) return undefined
  try {
    // Handle bare IDs
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input

    const url = new URL(input)
    const host = url.hostname.replace('www.', '')

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com' || host === 'youtu.be' || host === 'youtube-nocookie.com') {
      // youtu.be/<id>
      if (host === 'youtu.be') {
        const id = url.pathname.split('/').filter(Boolean)[0]
        return id
      }

      // /watch?v=<id>
      const v = url.searchParams.get('v')
      if (v) return v

      // /shorts/<id> or /embed/<id>
      const parts = url.pathname.split('/').filter(Boolean)
      const idx = parts.findIndex((p) => p === 'shorts' || p === 'embed')
      if (idx !== -1 && parts[idx + 1]) return parts[idx + 1]
    }
  } catch (_) {
    // fall through
  }
  return undefined
}

export const YouTubeBlock: React.FC<Props> = (props) => {
  const { url, title, caption, className } = props
  const videoId = extractYouTubeId(url)

  if (!videoId) return null

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`

  return (
    <div className={cn('container', className)}>
      <div className="relative w-full overflow-hidden rounded-[0.8rem] border border-border" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute left-0 top-0 h-full w-full"
          src={embedUrl}
          title={title || 'YouTube video player'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      {caption && <p className="mt-4 text-sm text-muted-foreground">{caption}</p>}
    </div>
  )
}

export default YouTubeBlock

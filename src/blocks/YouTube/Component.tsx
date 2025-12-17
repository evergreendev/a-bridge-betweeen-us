"use client"
import React, { useState } from 'react'
import { cn } from '@/utilities/ui'
import { ImageMedia } from '@/components/Media/ImageMedia'
import type { Media } from '@/payload-types'

type Props = {
  url: string
  title?: string|null
  caption?: string|null
  className?: string|null
  disableInnerContainer?: boolean|null
  thumbnail?: number | Media | null
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
        return url.pathname.split('/').filter(Boolean)[0]
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
  const { url, title, caption, className, thumbnail } = props
  const videoId = extractYouTubeId(url)
  const [isPlaying, setIsPlaying] = useState(false)

  if (!videoId) return null

  const baseEmbedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`

  const hasThumb = thumbnail && typeof thumbnail === 'object'
  const embedUrl = isPlaying ? `${baseEmbedUrl}&autoplay=1` : baseEmbedUrl

  return (
    <div className={cn('container', className)}>
      <div className="relative w-full overflow-hidden rounded-[0.8rem] border border-border" style={{ paddingBottom: '56.25%' }}>
        {hasThumb && !isPlaying ? (
          <button
            type="button"
            aria-label="Play video"
            className="group absolute left-0 top-0 h-full w-full"
            onClick={() => setIsPlaying(true)}
          >
            {/* Cover image */}
            <div className="absolute inset-0">
              <ImageMedia resource={thumbnail as Media} fill imgClassName="object-cover" />
            </div>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" />
            {/* Play button */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 p-4 shadow-md ring-1 ring-black/5 transition-transform group-hover:scale-[1.04]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-black">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        ) : (
          <iframe
            className="absolute left-0 top-0 h-full w-full"
            src={embedUrl}
            title={title || 'YouTube video player'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}
      </div>
      {caption && <p className="mt-4 text-sm text-muted-foreground">{caption}</p>}
    </div>
  )
}

export default YouTubeBlock

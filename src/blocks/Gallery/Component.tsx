"use client"
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/utilities/ui'
import { Media as PayloadMedia } from '@/payload-types'
import { Media } from '@/components/Media'

type Item = {
  media: PayloadMedia | string | number | null | undefined
  alt?: string | null
  caption?: string | null
}

type Props = {
  images?: Item[]
  columns?: number
  gap?: '0' | '2' | '4' | '6'
  className?: string
  disableInnerContainer?: boolean
}

export const GalleryBlock: React.FC<Props> = (props) => {
  const { images = [], columns = 3, gap = '4', className, disableInnerContainer } = props

  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const total = images.length
  const clampedIndex = useMemo(() => {
    if (total === 0) return 0
    return Math.max(0, Math.min(index, total - 1))
  }, [index, total])

  const openAt = useCallback((i: number) => {
    setIndex(() => Math.max(0, Math.min(i, images.length - 1)))
    setOpen(true)
  }, [images.length])

  const close = useCallback(() => setOpen(false), [])
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % Math.max(total, 1)), [total])
  const next = useCallback(() => setIndex((i) => (i + 1) % Math.max(total, 1)), [total])

  // Keyboard navigation when lightbox open
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close, prev, next])

  // Focus trap basic: focus close button when open
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    if (open) closeBtnRef.current?.focus()
  }, [open])

  if (!images || images.length === 0) return null

  // Compute responsive columns using Tailwind utilities
  // Use a static map so Tailwind can see the class names during build.
  const mdCols = Math.max(1, Math.min(columns, 6))
  const colsClassMap: Record<number, string> = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
    6: 'md:grid-cols-6',
  }
  const gridColsClass = colsClassMap[mdCols]
  const gapClass = ({
    '0': 'gap-0',
    '2': 'gap-2',
    '4': 'gap-4',
    '6': 'gap-6',
  } as const)[gap]

  return (
    <div className={cn({ container: !disableInnerContainer }, className)}>
      <div className={cn('grid grid-cols-2', gridColsClass, gapClass)}>
        {images.map((item, i) => (
          <button
            key={i}
            type="button"
            className={cn('group relative aspect-square overflow-hidden rounded-md border border-border bg-card')}
            onClick={() => openAt(i)}
            aria-label={`Open image ${i + 1} of ${total}`}
          >
            <Media
              resource={item.media}
              imgClassName={cn('h-full w-full object-cover transition-transform duration-300 group-hover:scale-105')}
              htmlElement={null}
            />
            {item.caption ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/40 p-2 text-xs text-white">
                {item.caption}
              </div>
            ) : null}
          </button>
        ))}
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={close}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Media
              resource={images[clampedIndex]?.media}
              imgClassName={cn('max-h-[90vh] max-w-[90vw] object-contain rounded-md')}
              htmlElement={null}
            />
            {images[clampedIndex]?.caption ? (
              <div className="absolute inset-x-0 bottom-0 bg-black/50 p-3 text-sm text-white">
                {images[clampedIndex]?.caption}
              </div>
            ) : null}

            {/* Controls */}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={close}
              aria-label="Close lightbox"
              className="absolute right-2 top-2 rounded-md bg-black/60 px-3 py-1 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white"
            >
              ✕
            </button>
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-md bg-black/60 px-3 py-2 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-black/60 px-3 py-2 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default GalleryBlock

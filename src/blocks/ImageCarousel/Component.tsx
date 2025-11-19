"use client"
import React, { useMemo, useState } from 'react'
import { cn } from '@/utilities/ui'
import { Media as PayloadMedia } from '@/payload-types'
import { Media } from '@/components/Media'

type Slide = {
  media: PayloadMedia | string | number | null | undefined
  alt?: string | null
  caption?: string | null
}

type Props = {
  slides?: Slide[]
  className?: string
  disableInnerContainer?: boolean
}

export const ImageCarouselBlock: React.FC<Props> = (props) => {
  const { slides = [], className, disableInnerContainer } = props

  const [index, setIndex] = useState(0)
  const total = slides.length

  const clampedIndex = useMemo(() => {
    if (total === 0) return 0
    return Math.max(0, Math.min(index, total - 1))
  }, [index, total])

  if (!slides || slides.length === 0) return null

  const goTo = (i: number) => setIndex(() => Math.max(0, Math.min(i, total - 1)))
  const prev = () => goTo(clampedIndex - 1)
  const next = () => goTo(clampedIndex + 1)

  return (
    <div className={cn({ container: !disableInnerContainer }, className)}>
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: 400, height: 300 }}>
          <div
            className="absolute inset-0 overflow-hidden rounded-[0.8rem] border border-border bg-card"
            role="group"
            aria-roledescription="carousel"
            aria-label="Image carousel"
          >
            <div
              className="h-full w-full"
              style={{
                /* Using a translated flex track for simple sliding */
                overflow: 'hidden',
              }}
            >
              <div
                className="flex h-full"
                style={{
                  width: slides.length * 400,
                  transform: `translateX(-${clampedIndex * 400}px)`,
                  transition: 'transform 300ms ease',
                }}
              >
                {slides.map((slide, i) => (
                  <div key={i} className="h-full" style={{ width: 400, minWidth: 400 }}>
                    <Media
                      resource={slide.media}
                      imgClassName={cn('w-[400px] h-[300px] object-cover')}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Optional prev/next controls for convenience */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-md bg-black/30 px-2 py-1 text-white hover:bg-black/40"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-black/30 px-2 py-1 text-white hover:bg-black/40"
          >
            ›
          </button>
        </div>

        {/* Rectangular indicators: 50x7; active white, inactive warm gray */}
        <div className="mt-3 flex items-center gap-2" aria-label="Slide indicators">
          {slides.map((_, i) => {
            const isActive = i === clampedIndex
            return (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1} of ${total}`}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => goTo(i)}
                className={cn(
                  'h-[7px] w-[50px] rounded-sm border border-border transition-colors',
                  isActive ? 'bg-white' : 'bg-stone-400'
                )}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

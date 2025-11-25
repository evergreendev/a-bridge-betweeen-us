"use client"
import { cn } from '@/utilities/ui'
import React, { useEffect, useRef, useState } from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const {
    columns,
    overlap = 0,
    style = 'default',
    paddingBottom = 28,
    paddingTop = 28,
    backgroundImage,
  } = props

  // New optional flag to render a narrow section (max width 700px)
  const narrowSection = (props)?.narrowSection as boolean | undefined

  // Optional vertical alignment for grid items: start | center | end (default: center)
  const verticalAlign = ((props)?.verticalAlign as 'start' | 'center' | 'end' | undefined) ?? 'center'
  const verticalAlignClasses: Record<'start' | 'center' | 'end', string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
  }

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  const styleClasses = {
    default: '',
    gradient: 'bg-gradient-to-t from-brand-blue from-60% to-transparent to-100% text-white',
    background: 'bg-cover bg-center',
  }

  // Track which columns have been revealed when the section first enters the viewport
  const [revealed, setRevealed] = useState<boolean[]>([])
  const colRefs = useRef<(HTMLDivElement | null)[]>([])

  // Initialize revealed flags when columns change
  useEffect(() => {
    if (columns && columns.length) {
      setRevealed((prev) => (prev.length === columns.length ? prev : Array(columns.length).fill(false)))
    }
  }, [columns])

  // Observe columns and reveal them once when entering the viewport
  useEffect(() => {
    if (!columns || columns.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idxAttr = (entry.target as HTMLElement).getAttribute('data-col-index')
            const idx = idxAttr ? parseInt(idxAttr, 10) : -1
            if (idx >= 0) {
              setRevealed((prev) => {
                if (prev[idx]) return prev
                const next = prev.slice()
                next[idx] = true
                return next
              })
              observer.unobserve(entry.target)
            }
          }
        })
      },
      {
        root: null,
        // Trigger a bit before fully in view for a smoother feel
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.15,
      },
    )

    colRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [columns])

  return (
    <div
      style={{
        marginTop: overlap ? '-' + overlap + 'px' : undefined,
        paddingBottom: paddingBottom + 'px',
        paddingTop: paddingTop + 'px',
        backgroundImage:
          style === 'background' && backgroundImage && typeof backgroundImage !== "number"
            ? `url(${backgroundImage.url})` : undefined,
      }}
      className={`${styleClasses[style!]}`}
    >
      <div
        className={cn(
          // When narrow, constrain width to 700px and center it; otherwise use the default container
          narrowSection ? 'mx-auto max-w-[950px] px-6' : 'container',
          'grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16',
          verticalAlignClasses[verticalAlign],
        )}
      >
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size } = col

            return (
              <div
                ref={(el) => {
                  colRefs.current[index] = el
                }}
                data-col-index={index}
                className={cn(
                  `col-span-4 max-w-[400px] lg:col-span-${colsSpanClasses[size!]}`,
                  {
                    'md:col-span-2': size !== 'full',
                  },
                  // Animation classes: fade + slide in from the left on reveal
                  'transition-all duration-700 ease-out will-change-transform will-change-opacity motion-reduce:transition-none',
                  revealed[index]
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-6 motion-reduce:opacity-100 motion-reduce:translate-x-0',
                )}
                style={{ transitionDelay: `${300 + index * 150}ms` }}
                key={index}
              >
                {richText && <RichText data={richText} enableGutter={false} />}

                {enableLink && (
                  <div className="text-center mt-6">
                    <CMSLink {...link} className="text-lg z-10" />
                  </div>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

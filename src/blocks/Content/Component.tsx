import { cn } from '@/utilities/ui'
import React from 'react'
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
                className={cn(`col-span-4 max-w-[400px] lg:col-span-${colsSpanClasses[size!]}`, {
                  'md:col-span-2': size !== 'full',
                })}
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

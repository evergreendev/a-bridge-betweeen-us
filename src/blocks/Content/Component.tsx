import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '../../components/Link'

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns, overlap = 0, style = 'default', paddingBottom = 28, paddingTop = 28 } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  const styleClasses = {
    default: '',
    gradient: 'bg-gradient-to-t from-brand-blue from-60% to-transparent to-100% text-white',
    background: '',
  }

  return (
    <div
      style={{
        marginTop: overlap ? '-' + overlap + 'px' : undefined,
        paddingBottom: paddingBottom + 'px',
        paddingTop: paddingTop + 'px',
      }}
      className={`my-16 ${styleClasses[style!]}`}
    >
      <div className="container grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size } = col

            return (
              <div
                className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size!]}`, {
                  'md:col-span-2': size !== 'full',
                })}
                key={index}
              >
                {richText && <RichText data={richText} enableGutter={false} />}

                {enableLink && (
                  <div className="text-center mt-6">
                    <CMSLink {...link} className="text-lg" />
                  </div>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

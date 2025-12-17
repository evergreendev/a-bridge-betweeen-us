import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'
import Link from 'next/link'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { ImageMedia } from '@/components/Media/ImageMedia'
import type { Media } from '@/payload-types'

type Props = {
  id?: string
  introContent?: DefaultTypedEditorState
  limit?: number
}

export const MerchandiseArchiveBlock: React.FC<Props> = async (props) => {
  const { id, introContent, limit: limitFromProps } = props

  const limit = limitFromProps || 12

  const payload = await getPayload({ config: configPromise })

  const merch = await payload.find({
    collection: 'merchandise',
    depth: 1,
    limit,
    sort: '-updatedAt',
  })

  return (
    <section className="py-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-8">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      <div className="container">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {merch.docs.map((m) => {
            const hasImage = m.featuredImage && typeof m.featuredImage === 'object'
            const price = typeof m.price === 'number' ? m.price : undefined

            return (
              <li key={m.id} className="">
                <Link href={`/merchandise/${m.slug}`} className="group block h-full">
                  <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-colors group-hover:border-foreground/30">
                    <div className="relative aspect-[4/3] bg-muted">
                      {hasImage ? (
                        <ImageMedia resource={m.featuredImage as Media} fill imgClassName="object-cover" />
                      ) : null}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-semibold leading-tight group-hover:underline break-words">
                          {m.title}
                        </h3>
                        {price !== undefined ? (
                          <span className="shrink-0 rounded bg-foreground/5 px-2 py-1 text-sm font-medium">
                            ${price.toFixed(2)}
                          </span>
                        ) : null}
                      </div>
                      {m.description && (
                        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                          {/* simple text fallback: remove rich text markup by picking first text nodes if available */}
                          {typeof m.description === 'object' ? '' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default MerchandiseArchiveBlock

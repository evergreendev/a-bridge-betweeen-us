import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

type Props = {
  id?: string
  introContent?: DefaultTypedEditorState
  limit?: number
}

// Visibility rules:
// - If both startDate and endDate are empty => show
// - If endDate exists => show until endDate is in the past (hide after it passes)
// - If only startDate exists => hide once startDate passes (i.e., show while now < startDate)
export const EventsArchiveBlock: React.FC<Props> = async (props) => {
  const { id, introContent, limit: limitFromProps } = props

  const limit = limitFromProps || 10

  const payload = await getPayload({ config: configPromise })

  const now = new Date().toISOString()

  // Build where clause to match the visibility rules
  // Using Payload's where syntax. Combine multiple operators on the same field
  // into a single object to satisfy the Where[] typings.
  const where = {
    or: [
      // Case 1: endDate exists and is not in the past
      {
        endDate: { exists: true, greater_than_equal: now },
      },
      // Case 2: no endDate, has startDate, and startDate still in the future
      {
        endDate: { exists: false },
        startDate: { exists: true, greater_than: now },
      },
      // Case 3: no startDate and no endDate
      {
        startDate: { exists: false },
        endDate: { exists: false },
      },
    ],
  }

  const events = await payload.find({
    collection: 'events',
    depth: 1,
    limit,
    // @ts-expect-error nonsense error
    where,
    // Sort upcoming first: prefer earliest startDate/endDate, fallback createdAt
    sort: 'startDate',
  })

  return (
    <div
      className="pb-18 -mt-16 bg-gradient-to-t from-brand-blue from-95% to-transparent to-100% text-white pt-36"
      id={`block-${id}`}
    >
      {introContent && (
        <div className="container mb-8">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      <div className="container">
        <ul className="space-y-6 flex flex-wrap">
          {events.docs.map((e) => (
            <li key={e.id} className="border-b border-border px-4 pb-6 w-4/12">
              <Link href={`/events/${e.slug}`} className="block group">
                <div className="flex gap-4 items-start flex-wrap">
                  {e.featuredImage && typeof e.featuredImage !== 'string' ? (
                    <div className="w-full shrink-0 overflow-hidden rounded">
                      <Media resource={e.featuredImage} size="32rem" />
                    </div>
                  ) : null}
                  <div className="w-full">
                    <h3 className="text-xl font-semibold group-hover:underline">{e.title}</h3>
                    {(e.startDate || e.endDate) && (
                      <p className="mt-2 text-sm opacity-80">
                        {e.startDate ? new Date(e.startDate).toLocaleDateString() : ''}
                        {e.endDate ? ` — ${new Date(e.endDate).toLocaleDateString()}` : ''}
                      </p>
                    )}
                  </div>
                </div>
              </Link>{' '}
              {e.content ? (
                <div className="prose prose-invert prose-a:text-white mt-3 max-w-none">
                  <RichText data={e.content} enableGutter={false} />
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

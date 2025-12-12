import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'
import Link from 'next/link'
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
        <ul className="flex flex-wrap -mx-4">
          {events.docs.map((e) => {
            const primaryDate = e.startDate || e.endDate
            const d = primaryDate ? new Date(primaryDate) : null
            const month = d
              ? d.toLocaleString(undefined, { month: 'short' }).toUpperCase()
              : '-'
            const day = d ? d.getDate() : 'TBD'
            const dateRange = e.startDate || e.endDate
              ? `${e.startDate ? new Date(e.startDate).toLocaleDateString() : ''}${
                  e.endDate
                    ? (e.startDate ? ' — ' : '') + new Date(e.endDate).toLocaleDateString()
                    : ''
                }`
              : ''

            return (
              <li key={e.id} className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
                <Link href={`/events/${e.slug}`} className="block group h-full">
                  <div className="h-full rounded-md border border-white/20 bg-white/5 p-4 backdrop-blur-sm transition-colors group-hover:bg-white/10">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-16 text-center rounded-md overflow-hidden bg-white text-brand-blue">
                        <div className="text-[10px] font-semibold uppercase tracking-wider py-1 border-b border-brand-blue/20">
                          {month}
                        </div>
                        <div className="text-2xl font-bold leading-none py-2">{day}</div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl font-semibold group-hover:underline break-words">{e.title}</h3>
                        {dateRange ? (
                          <p className="mt-2 text-sm opacity-80">{dateRange}</p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

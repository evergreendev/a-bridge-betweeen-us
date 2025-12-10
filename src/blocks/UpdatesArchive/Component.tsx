import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

type Props = {
  id?: string
  introContent?: any
  limit?: number
}

export const UpdatesArchiveBlock: React.FC<Props> = async (props) => {
  const { id, introContent, limit: limitFromProps } = props

  const limit = limitFromProps || 5

  const payload = await getPayload({ config: configPromise })

  const updates = await payload.find({
    collection: 'updates',
    limit,
    where: {},
    sort: '-createdAt',
  })

  return (
    <div
      className="my-16 bg-gradient-to-t from-brand-blue from-60% to-transparent to-100% text-white pt-28"
      id={`block-${id}`}
    >
      {introContent && (
        <div className="container mb-8">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      <div className="container">
        <ul className="space-y-6">
          {updates.docs.map(u => (
            <li key={u.id} className="border-b border-border pb-6">
              <h3 className="text-xl font-semibold">{u.title}</h3>
              {/* content is richText, render brief preview if available */}
              {u.content ? (
                <div className="prose prose-invert mt-3 max-w-none">
                  <RichText data={u.content} enableGutter={false} />
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

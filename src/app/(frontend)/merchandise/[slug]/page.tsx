import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { generateMeta } from '@/utilities/generateMeta'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const items = await payload.find({
    collection: 'merchandise',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return items.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function MerchandisePage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/merchandise/' + decodedSlug
  const item = await queryMerchBySlug({ slug: decodedSlug })

  if (!item) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16">
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      <div className="container">
        <header className="mx-auto max-w-[52rem]">
          <h1 className="text-3xl font-bold">{item.title}</h1>
          {typeof item.price === 'number' ? (
            <p className="mt-2 text-lg font-semibold">${item.price.toFixed(2)}</p>
          ) : null}
          {item.featuredImage && typeof item.featuredImage !== 'string' ? (
            <div className="mt-6 overflow-hidden rounded">
              <Media resource={item.featuredImage} size="90vw" />
            </div>
          ) : null}
        </header>

        {item.description ? (
          <div className="mt-8 mx-auto max-w-[52rem]">
            <RichText data={item.description} />
          </div>
        ) : null}
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const item = await queryMerchBySlug({ slug: decodedSlug })

  return generateMeta({ doc: item })
}

const queryMerchBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'merchandise',
    draft,
    depth: 1,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})

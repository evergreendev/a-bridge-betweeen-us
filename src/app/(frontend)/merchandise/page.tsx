import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { ImageMedia } from '@/components/Media/ImageMedia'
import type { Media } from '@/payload-types'

export default async function MerchandiseListPage() {
  const payload = await getPayload({ config: configPromise })
  const items = await payload.find({
    collection: 'merchandise',
    depth: 1,
    limit: 60,
    sort: '-updatedAt',
  })

  return (
    <main className="pt-16 pb-20">
      <div className="container">
        <h1 className="text-3xl font-bold mb-6">Merchandise</h1>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.docs.map((m) => {
            const hasImage = m.featuredImage && typeof m.featuredImage === 'object'
            const price = typeof m.price === 'number' ? m.price : undefined
            return (
              <li key={m.id}>
                <Link href={`/merchandise/${m.slug}`} className="group block h-full">
                  <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-colors group-hover:border-foreground/30">
                    <div className="relative aspect-[4/3] bg-muted">
                      {hasImage ? (
                        <ImageMedia resource={m.featuredImage as Media} fill imgClassName="object-cover" />
                      ) : null}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="text-lg font-semibold group-hover:underline break-words">{m.title}</h2>
                        {price !== undefined ? (
                          <span className="shrink-0 rounded bg-foreground/5 px-2 py-1 text-sm font-medium">
                            ${price.toFixed(2)}
                          </span>
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
    </main>
  )
}

import type { Metadata } from 'next'

import type { Media, Page, Post } from '@/payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

const getImageURL = (image?: Media | string | number | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

let cachedSiteTitle: string | null = null

export const getSiteTitle = async (): Promise<string> => {
  if (cachedSiteTitle) return cachedSiteTitle
  const payload = await getPayload({ config: configPromise })
  try {
    const siteGlobal = await payload.findGlobal({ slug: 'site' })
    cachedSiteTitle = siteGlobal?.siteTitle || 'Site'
  } catch (e) {
    // If global not found or during build before migration, fall back safely
    cachedSiteTitle = 'Site'
  }
  return cachedSiteTitle
}

export const composeTitle = async (
  pageTitle?: string | null,
  opts?: { isHome?: boolean },
): Promise<string> => {
  const siteTitle = await getSiteTitle()
  if (opts?.isHome) return siteTitle
  if (pageTitle && pageTitle.trim().length > 0) return `${siteTitle} - ${pageTitle}`
  return siteTitle
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
  isHome?: boolean
}): Promise<Metadata> => {
  const { doc, isHome: isHomeArg } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const isHome = isHomeArg ?? ((doc as Partial<Page> | undefined)?.slug === 'home')
  const pageTitle = doc?.meta?.title || (doc as Partial<Post> | Partial<Page> | undefined)?.title
  const title = await composeTitle(pageTitle || null, { isHome })

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}

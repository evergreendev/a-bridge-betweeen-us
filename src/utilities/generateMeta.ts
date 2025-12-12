import type { Metadata } from 'next'

import type { Page, Post, Event } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

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
  doc: Partial<Page> | Partial<Post> | Partial<Event> | null
  isHome?: boolean
}): Promise<Metadata> => {
  const { doc, isHome: isHomeArg } = args

  const isHome = isHomeArg ?? ((doc as Partial<Page> | undefined)?.slug === 'home')
  const pageTitle = doc?.meta?.title || (doc as Partial<Post> | Partial<Page> | undefined)?.title
  const title = await composeTitle(pageTitle || null, { isHome })

  return {
    description: doc?.meta?.description,
    title,
  }
}

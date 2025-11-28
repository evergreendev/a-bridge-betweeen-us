import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'
import { getSiteTitle } from './generateMeta'

export const mergeOpenGraph = async (
  og?: Metadata['openGraph'],
): Promise<Metadata['openGraph']> => {
  const siteTitle = await getSiteTitle()

  const defaultOpenGraph: Metadata['openGraph'] = {
    type: 'website',
    description: 'An open-source website built with Payload and Next.js.',
    images: [
      {
        url: `${getServerSideURL()}/website-template-OG.webp`,
      },
    ],
    siteName: siteTitle,
    title: siteTitle,
  }

  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}

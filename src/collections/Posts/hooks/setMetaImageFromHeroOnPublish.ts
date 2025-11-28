import type { CollectionBeforeChangeHook } from 'payload'

// When publishing a post, if there is no SEO Meta image set yet,
// default it to the hero image.
export const setMetaImageFromHeroOnPublish: CollectionBeforeChangeHook = ({
  data,
  operation,
}) => {
  if (!data) return data

  // Only act on create/update operations
  if (operation !== 'create' && operation !== 'update') return data

  const heroImage = data.heroImage
  const meta = data.meta || {}
  const hasMetaImage = Boolean(meta && meta.image)

  if (heroImage && !hasMetaImage) {
    return {
      ...data,
      meta: {
        ...meta,
        image: heroImage,
      },
    }
  }

  return data
}

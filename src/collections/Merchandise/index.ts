import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { slugField } from 'payload'
import { defaultLexical } from '@/fields/defaultLexical'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'

export const Merchandise: CollectionConfig<'merchandise'> = {
  slug: 'merchandise',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    price: true,
    featuredImage: true,
    description: true,
  },
  labels: {
    singular: 'Merchandise',
    plural: 'Merchandise',
  },
  admin: {
    defaultColumns: ['title', 'price', 'slug', 'updatedAt'],
    useAsTitle: 'title',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'merchandise',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'merchandise',
        req,
      }),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              required: false,
              label: 'Featured Image',
            },
            {
              name: 'price',
              type: 'number',
              required: true,
              min: 0,
              admin: {
                description: 'Price in your default currency',
              },
            },
            {
              name: 'description',
              type: 'richText',
              editor: defaultLexical,
              label: 'Description',
            },
          ],
        },
      ],
    },
    slugField(),
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
  },
}

export default Merchandise

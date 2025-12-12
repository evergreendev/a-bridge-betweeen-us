import type { CollectionConfig } from 'payload'

import { Archive } from '@/blocks/ArchiveBlock/config'
import { UpdatesArchive } from '@/blocks/UpdatesArchive/config'
import { EventsArchive } from '@/blocks/EventsArchive/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { FormBlock } from '@/blocks/Form/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { ImageCarousel } from '@/blocks/ImageCarousel/config'
import { Gallery } from '@/blocks/Gallery/config'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { slugField } from 'payload'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { MetaDescriptionField, MetaImageField, MetaTitleField, OverviewField, PreviewField } from '@payloadcms/plugin-seo/fields'

export const Events: CollectionConfig<'events'> = {
  slug: 'events',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    startDate: true,
    endDate: true,
    featuredImage: true,
  },
  admin: {
    defaultColumns: ['title', 'startDate', 'endDate', 'slug', 'updatedAt'],
    useAsTitle: 'title',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'events',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'events',
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
          fields: [
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Optional image to represent this event',
              },
              label: 'Featured Image (optional)',
            },
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                UpdatesArchive,
                EventsArchive,
                FormBlock,
                ImageCarousel,
                Gallery,
              ],
              required: true,
              admin: {
                initCollapsed: true,
              },
              label: 'Content',
            },
          ],
          label: 'Content',
        },
        {
          fields: [
            {
              name: 'startDate',
              type: 'date',
              required: false,
              admin: {
                position: 'sidebar',
                date: {
                  pickerAppearance: 'dayOnly',
                },
              },
              label: 'Start Date (optional)',
            },
            {
              name: 'endDate',
              type: 'date',
              required: false,
              admin: {
                position: 'sidebar',
                date: {
                  pickerAppearance: 'dayOnly',
                },
              },
              label: 'End Date (optional)',
            },
          ],
          label: 'Meta',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    slugField()
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

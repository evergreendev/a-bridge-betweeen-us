import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const EventsArchive: Block = {
  slug: 'eventsArchive',
  interfaceName: 'EventsArchiveBlock',
  fields: [
    {
      name: 'introContent',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      label: 'Intro Content',
    },
    {
      name: 'limit',
      type: 'number',
      admin: {
        step: 1,
      },
      defaultValue: 10,
      label: 'Limit',
    },
  ],
  labels: {
    plural: 'Events Archives',
    singular: 'Events Archive',
  },
}

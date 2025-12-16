import type { Block, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  BlocksFeature,
  lexicalEditor,
  UploadFeature,
  OrderedListFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'
import { ImageCarousel } from '@/blocks/ImageCarousel/config'
import { Divider } from '@/blocks/Divider/config'
import { Donation } from '@/blocks/Donation/config'
import { YouTube } from '@/blocks/YouTube/config'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'oneThird',
    options: [
      {
        label: 'One Third',
        value: 'oneThird',
      },
      {
        label: 'Half',
        value: 'half',
      },
      {
        label: 'Two Thirds',
        value: 'twoThirds',
      },
      {
        label: 'Full',
        value: 'full',
      },
    ],
  },
  {
    name: 'richText',
    type: 'richText',
    editor: lexicalEditor({
      features: ({ rootFeatures }) => {
        return [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          // Enable list features
          UnorderedListFeature(),
          OrderedListFeature(),
          UploadFeature({
            collections: {
              media: {
                // Example showing how to customize the built-in fields
                // of the Upload feature
                fields: [
                  {
                    name: 'caption',
                    type: 'richText',
                    editor: lexicalEditor(),
                  },
                ],
              },
            },
          }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          BlocksFeature({
            blocks: [ImageCarousel, Divider, Donation, YouTube],
          }),
        ]
      },
    }),
    label: false,
  },
  {
    name: 'enableLink',
    type: 'checkbox',
  },
  link({
    overrides: {
      admin: {
        condition: (_data, siblingData) => {
          return Boolean(siblingData?.enableLink)
        },
      },
    },
  }),
]

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'narrowSection',
      type: 'checkbox',
      label: 'Narrow section (700px max width)',
      defaultValue: false,
    },
    {
      name: 'verticalAlign',
      type: 'select',
      label: 'Vertical alignment',
      defaultValue: 'center',
      options: [
        { label: 'Start', value: 'start' },
        { label: 'Center', value: 'center' },
        { label: 'End', value: 'end' },
      ],
    },
    {
      name: 'columns',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: columnFields,
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'default',
      options: ['default', 'gradient', 'background'],
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data, siblingData) => siblingData.style === 'background',
      },
    },
    {
      name: 'overlap',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'paddingTop',
      type: 'number',
      defaultValue: 28,
    },
    {
      name: 'paddingBottom',
      type: 'number',
      defaultValue: 28,
    },
  ],
}

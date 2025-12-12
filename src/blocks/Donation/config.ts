import type { Block, Field } from 'payload'
import { lexicalEditor, FixedToolbarFeature, InlineToolbarFeature, HeadingFeature } from '@payloadcms/richtext-lexical'
import { link } from '@/fields/link'

const donationFields: Field[] = [
  {
    name: 'title',
    type: 'text',
    required: true,
    label: 'Title',
  },
  {
    name: 'body',
    type: 'richText',
    editor: lexicalEditor({
      features: ({ rootFeatures }) => [
        ...rootFeatures,
        HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
        FixedToolbarFeature(),
        InlineToolbarFeature(),
      ],
    }),
    label: 'Body',
  },
  {
    name: 'suggestedAmount',
    type: 'text',
    label: 'Suggested amount (optional)',
  },
  {
    name: 'enableLink',
    type: 'checkbox',
    label: 'Add donate button',
    defaultValue: true,
  },
  link({
    overrides: {
      admin: {
        condition: (_data, siblingData) => Boolean(siblingData?.enableLink),
      },
    },
  }),
  {
    name: 'theme',
    type: 'radio',
    defaultValue: 'default',
    options: [
      { label: 'Default', value: 'default' },
      { label: 'Emphasis', value: 'emphasis' },
    ],
  },
]

export const Donation: Block = {
  slug: 'donation',
  interfaceName: 'DonationBlock',
  labels: {
    singular: 'Donation',
    plural: 'Donations',
  },
  fields: donationFields,
}

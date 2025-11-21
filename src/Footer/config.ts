import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    // Social links
    {
      name: 'facebook',
      label: 'Facebook URL',
      type: 'text',
      admin: {
        description: 'Link to your Facebook profile or page (e.g., https://facebook.com/yourpage).',
      },
    },
    {
      name: 'instagram',
      label: 'Instagram URL',
      type: 'text',
      admin: {
        description: 'Link to your Instagram profile (e.g., https://instagram.com/yourhandle).',
      },
    },
    {
      name: 'email',
      label: 'Contact Email',
      type: 'email',
      admin: {
        description: 'Public contact email to display in the footer.',
      },
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'rightColumn',
      label: 'Right column (rich text)',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      admin: {
        description: 'Content to display in the right side of the footer. Supports headings, links, and formatting.',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}

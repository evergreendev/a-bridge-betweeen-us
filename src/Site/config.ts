import type { GlobalConfig } from 'payload'

export const Site: GlobalConfig = {
  slug: 'site',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteTitle',
      label: 'Site Title',
      type: 'text',
      required: true,
      admin: {
        description: 'Primary site title used for page <title> composition and SEO.',
      },
    },
  ],
}

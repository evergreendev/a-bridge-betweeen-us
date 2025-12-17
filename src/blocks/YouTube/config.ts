import type { Block } from 'payload'

export const YouTube: Block = {
  slug: 'youtube',
  interfaceName: 'YouTubeBlock',
  labels: {
    singular: 'YouTube',
    plural: 'YouTube',
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'YouTube URL or ID',
      admin: {
        description: 'Paste a full YouTube URL (watch, youtu.be, shorts) or a 11-character video ID',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: false,
    },
    {
      name: 'caption',
      type: 'text',
      required: false,
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Custom thumbnail (optional)',
      admin: {
        description: 'Optional image shown before playback. If omitted, the video will load immediately.',
      },
    },
  ],
}

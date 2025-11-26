import type { Block } from 'payload'

export const Gallery: Block = {
  slug: 'gallery',
  interfaceName: 'Gallery',
  labels: {
    singular: 'Gallery',
    plural: 'Galleries',
  },
  fields: [
    {
      name: 'images',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          admin: {
            description: 'Optional alt text to override the media alt.',
          },
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'columns',
          type: 'number',
          defaultValue: 3,
          min: 2,
          max: 6,
          admin: {
            step: 1,
            description: 'Number of columns in the grid on larger screens.',
          },
        },
        {
          name: 'gap',
          type: 'select',
          defaultValue: '4',
          options: [
            { label: 'None', value: '0' },
            { label: 'Small', value: '2' },
            { label: 'Default', value: '4' },
            { label: 'Large', value: '6' },
          ],
          admin: { description: 'Spacing between images.' },
        },
      ],
    },
  ],
}

export default Gallery

import type { Block } from 'payload'

export const ImageCarousel: Block = {
  slug: 'imageCarousel',
  interfaceName: 'ImageCarousel',
  labels: {
    singular: 'Image Carousel',
    plural: 'Image Carousels',
  },
  fields: [
    {
      name: 'slides',
      type: 'array',
      required: true,
      labels: {
        singular: 'Slide',
        plural: 'Slides',
      },
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
            description: 'Alt text for accessibility',
          },
        },
        {
          name: 'caption',
          type: 'text',
          admin: {
            description: 'Optional caption displayed under the image',
          },
        },
      ],
    },
  ],
}

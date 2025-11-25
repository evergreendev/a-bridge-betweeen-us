import type { Block } from 'payload'

export const Divider: Block = {
  slug: 'divider',
  interfaceName: 'DividerBlock',
  fields: [
    {
      name: 'color',
      type: 'radio',
      defaultValue: 'blue',
      options: [
        { label: 'Blue', value: 'blue' },
        { label: 'Red', value: 'red' },
      ],
      required: true,
    },
  ],
  labels: {
    singular: 'Divider',
    plural: 'Dividers',
  },
}

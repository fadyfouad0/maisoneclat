import {defineType, defineField, defineArrayMember} from 'sanity'

export const AVAILABILITY = ['New', 'In the showroom', 'Made to order', 'Last piece']

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Web address',
      description: 'Click Generate. This becomes the product page link.',
      type: 'slug',
      options: {source: 'name', maxLength: 60},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      description: 'Pick one. Add new ones under Categories.',
      type: 'reference',
      to: [{type: 'category'}],
      options: {disableNew: true},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'availability',
      title: 'Availability label',
      type: 'string',
      options: {list: AVAILABILITY, layout: 'radio'},
      validation: (r) => r.required(),
    }),
    defineField({name: 'material', title: 'Material', description: 'e.g. Crystal, chrome', type: 'string'}),
    defineField({
      name: 'price',
      title: 'Price (EGP)',
      description: 'Numbers only, e.g. 96000. Leave empty to show "On request".',
      type: 'number',
      validation: (r) => r.min(0),
    }),
    defineField({name: 'image', title: 'Main image', type: 'image', options: {hotspot: true}, validation: (r) => r.required()}),
    defineField({
      name: 'gallery',
      title: 'Gallery images',
      description: 'Extra photos for the product page. The first one is shown as the cut-out.',
      type: 'array',
      of: [defineArrayMember({type: 'image', options: {hotspot: true}})],
    }),
    defineField({name: 'reference', title: 'Reference number', description: 'e.g. 021 (shown as No. 021)', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 4}),
    defineField({
      name: 'sizes',
      title: 'Sizes',
      description: 'Leave empty if the piece comes in one size.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'size',
          fields: [
            defineField({name: 'label', title: 'Size', description: 'e.g. 80 cm', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'details', title: 'Details', description: 'e.g. 80 × 120 cm high · 12 lights', type: 'string'}),
            defineField({name: 'price', title: 'Price (EGP)', description: 'Empty = "Price on request"', type: 'number', validation: (r) => r.min(0)}),
          ],
          preview: {select: {title: 'label', subtitle: 'details'}},
        }),
      ],
    }),
    defineField({
      name: 'specs',
      title: 'Details accordion',
      description: 'e.g. Materials & finish, Light, Lead time, Care.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'spec',
          fields: [
            defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'text', type: 'text', rows: 2}),
          ],
          preview: {select: {title: 'title', subtitle: 'text'}},
        }),
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Show on the home page',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      description: 'Lower numbers appear first.',
      type: 'number',
    }),
  ],
  orderings: [{title: 'Display order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', subtitle: 'category', media: 'image'},
  },
})

import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Name (plural)',
      description: 'Shown on the collection filter, e.g. Table lamps.',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'singular',
      title: 'Name (singular)',
      description: 'Shown on each product card, e.g. Table lamp.',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      description: 'Lower numbers appear first in the collection filter.',
      type: 'number',
    }),
  ],
  orderings: [{title: 'Display order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'singular'}},
})

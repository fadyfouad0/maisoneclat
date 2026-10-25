import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'subcategory',
  title: 'Subcategory',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Name',
      description: 'e.g. Classic collection.',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'parent',
      title: 'Belongs to category',
      description: 'The category this subcategory sits under, e.g. Chandeliers.',
      type: 'reference',
      to: [{type: 'category'}],
      options: {disableNew: true},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      description: 'Lower numbers appear first.',
      type: 'number',
    }),
  ],
  orderings: [{title: 'Display order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'parent.title'}},
})

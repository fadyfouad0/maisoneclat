// Creates the Chandeliers subcategories. Safe to re-run.
// Run from studio/:  npx sanity exec scripts/add-chandelier-subcategories.ts --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-01-01'})

const SUBS = [
  {key: 'classic-collection', title: 'Classic collection'},
  {key: 'modern-collection', title: 'Modern collection'},
  {key: 'glass-collection', title: 'Glass collection'},
]

async function run() {
  for (const [i, s] of SUBS.entries()) {
    await client.createOrReplace({
      _id: `subcategory-${s.key}`,
      _type: 'subcategory',
      title: s.title,
      parent: {_type: 'reference', _ref: 'category-chandelier'},
      order: i + 1,
    })
    console.log(`✔ ${s.title}`)
  }
}
run().catch((e) => {
  console.error(e)
  process.exit(1)
})

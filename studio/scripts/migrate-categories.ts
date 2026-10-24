// One-time migration: product.category changes from a text value to a reference to a category document.
// Run from studio/:  npx sanity exec scripts/migrate-categories.ts --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-01-01'})

const CATEGORIES = [
  {key: 'chandelier', title: 'Chandeliers', singular: 'Chandelier'},
  {key: 'pendant', title: 'Pendants', singular: 'Pendant'},
  {key: 'wall-light', title: 'Wall lights', singular: 'Wall light'},
  {key: 'table-lamp', title: 'Table lamps', singular: 'Table lamp'},
  {key: 'floor-lamp', title: 'Floor lamps', singular: 'Floor lamp'},
  {key: 'outdoor', title: 'Outdoor', singular: 'Outdoor'},
]

async function run() {
  for (const [i, c] of CATEGORIES.entries()) {
    await client.createOrReplace({_id: `category-${c.key}`, _type: 'category', title: c.title, singular: c.singular, order: i + 1})
    console.log(`✔ category ${c.singular}`)
  }
  // Only products whose category is still plain text (published and draft); safe to re-run.
  const products: {_id: string; category: string}[] = await client.fetch(
    '*[_type=="product" && defined(category) && category._type != "reference" && category in $names]{_id, category}',
    {names: CATEGORIES.map((c) => c.singular)},
  )
  for (const p of products) {
    const c = CATEGORIES.find((x) => x.singular === p.category)!
    await client.patch(p._id).set({category: {_type: 'reference', _ref: `category-${c.key}`}}).commit()
    console.log(`✔ ${p._id} -> ${c.singular}`)
  }
  console.log(`Migrated ${products.length} products`)
}
run().catch((e) => {
  console.error(e)
  process.exit(1)
})

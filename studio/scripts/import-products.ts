// One-time import of the products that were hardcoded in docs/collection.html.
// Run from studio/:  npx sanity exec scripts/import-products.ts --with-user-token
import fs from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-01-01'})
const docs = path.resolve(process.cwd(), '../docs')

const html = fs.readFileSync(path.join(docs, 'collection.html'), 'utf8')
const m = html.match(/const ALL = (\[.*?\]);/s)
if (!m) throw new Error('Could not find ALL in collection.html')
const ALL: {cat: string; img: string; name: string; mat: string; price: string; lt: string}[] = JSON.parse(m[1])

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const parsePrice = (p: string) => (/^EGP/.test(p) ? Number(p.replace(/[^\d]/g, '')) : undefined)

const SPECS_COMMON = [
  {title: 'Light', text: 'G9 LED, warm white 2700 K, dimmable. Bulbs included.'},
  {title: 'Lead time & delivery', text: 'In stock in Cairo: 3–5 days with installation. Made to order: 6–8 weeks.'},
]

// Details that only existed on the two hand-built product pages
const EXTRA: Record<string, any> = {
  Spiral: {
    reference: '021',
    description:
      'Ribbons of cut crystal wound around a chrome frame. Lit, it throws small points of light across the walls and ceiling, which is why it suits a double-height room.',
    sizes: [
      {label: '80 cm', details: '80 × 120 cm high · 12 lights', price: 96000},
      {label: '100 cm', details: '100 × 160 cm high · 18 lights', price: 138000},
      {label: '130 cm', details: '130 × 220 cm high · 26 lights'},
    ],
    specs: [
      {title: 'Dimensions', text: '80 / 100 / 130 cm across, 120 / 160 / 220 cm high. The hanging drop is set on site.'},
      {title: 'Materials & finish', text: 'Cut crystal ribbons on a polished chrome frame. Chrome or gold finish.'},
      ...SPECS_COMMON,
      {title: 'Care', text: 'Crystal is cleaned by hand. Our team can do it once a year.'},
    ],
    gallery: ['7345e2e78b6c7c5b1e20e24486b006a8.webp'],
  },
  'Desert Rose': {
    reference: '014',
    description: undefined,
    sizes: [
      {label: '90 cm', details: '90 × 70 cm drop · 9 lights', price: 148000},
      {label: '120 cm', details: '120 × 85 cm drop · 14 lights', price: 196000},
      {label: '150 cm', details: '150 × 100 cm drop · 21 lights'},
    ],
    specs: [
      {title: 'Dimensions', text: '90 / 120 / 150 cm. Drop adjustable on site, from 70 cm up to 2 m of chain.'},
      {title: 'Materials & finish', text: 'Hand-blown glass petals on a gilded metal branch. Gold or champagne finish.'},
      ...SPECS_COMMON,
      {title: 'Care', text: 'Dust with a soft dry cloth. Our team can clean it once a year.'},
    ],
    gallery: [
      '8eb5a50016f0941ad30b67f2dba96575.webp',
      '08678e18053df47d63132d088241079a.jpg',
      'a4b8b376e276896c95cb366ce54e6f5d.jpg',
    ],
  },
}

const cache = new Map<string, any>()
async function upload(file: string) {
  const f = file.replace(/^assets\//, '')
  if (!cache.has(f)) {
    const asset = await client.assets.upload('image', fs.createReadStream(path.join(docs, 'assets', f)), {filename: f})
    cache.set(f, asset._id)
  }
  return {_type: 'image', asset: {_type: 'reference', _ref: cache.get(f)}}
}
const key = () => Math.random().toString(36).slice(2, 10)

async function run() {
  for (const [i, p] of ALL.entries()) {
    const slug = slugify(p.name)
    const x = EXTRA[p.name] || {}
    const doc: any = {
      _id: `product-${slug}`,
      _type: 'product',
      name: p.name,
      slug: {_type: 'slug', current: slug},
      category: p.cat,
      availability: p.lt,
      material: p.mat,
      price: parsePrice(p.price),
      image: await upload(p.img),
      reference: x.reference,
      description: x.description,
      sizes: x.sizes?.map((s: any) => ({_key: key(), _type: 'size', ...s})),
      specs: x.specs?.map((s: any) => ({_key: key(), _type: 'spec', ...s})),
      gallery: x.gallery ? await Promise.all(x.gallery.map(async (g: string) => ({_key: key(), ...(await upload(g))}))) : undefined,
      featured: false,
      order: i + 1,
    }
    Object.keys(doc).forEach((k) => doc[k] === undefined && delete doc[k])
    await client.createOrReplace(doc)
    console.log(`✔ ${p.name}`)
  }
}
run().catch((e) => {
  console.error(e)
  process.exit(1)
})

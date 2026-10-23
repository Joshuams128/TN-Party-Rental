import { productDetails } from '@/lib/inventory-data'
import { parseMoneyToCents } from '@/lib/money'

export type Item = {
  id: string
  name: string
  description: string
  category: string
  price_cents: number
  image_path: string | null
  active: boolean
}

export type ItemInput = Omit<Item, 'id'>

// Item photos live in Supabase Storage; imported catalog items point at the website's own /images files.
export function itemImageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith('/') || path.startsWith('http')) return path
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/item-images/${path}`
}

// Turns the website's catalog into invoice items: one per variant, or one per product for fixed/tiered pricing.
export function catalogToItems(): ItemInput[] {
  const items: ItemInput[] = []
  const priceByName = new Map<string, number>()

  const add = (name: string, cents: number, category: string, description: string, image?: string) => {
    const known = priceByName.get(name.toLowerCase())
    if (known === cents) return
    const finalName = known === undefined ? name : `${name} (${description})`
    priceByName.set(finalName.toLowerCase(), cents)
    items.push({ name: finalName, description, category, price_cents: cents, image_path: image ?? null, active: true })
  }

  for (const p of productDetails) {
    if (p.pricingType === 'variants' && p.variants?.length) {
      for (const v of p.variants) {
        add(v.name, parseMoneyToCents(v.price) ?? 0, p.category, p.name, v.image ?? p.image)
      }
    } else {
      const price = p.price ?? p.tiers?.[0]?.price ?? ''
      add(p.name, parseMoneyToCents(price) ?? 0, p.category, p.name, p.image)
    }
  }
  return items
}

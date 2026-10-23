import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import ItemsGrid from '@/components/admin/ItemsGrid'
import ImportCatalogButton from '@/components/admin/ImportCatalogButton'
import type { Item } from '@/lib/items'

export const dynamic = 'force-dynamic'

export default async function ItemsPage() {
  const { data, error } = await createClient().from('items').select('*').order('name')
  const items = (data ?? []) as Item[]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Items</h1>
        <Link href="/admin/items/new" className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 font-semibold text-black hover:bg-gold-dark">
          <Plus size={18} /> Add item
        </Link>
      </div>

      {error && (
        <p className="rounded-lg bg-red-950 p-3 text-sm text-red-300">
          Couldn&apos;t load items: {error.message}. Make sure the database setup SQL has been run.
        </p>
      )}

      <ImportCatalogButton existingNames={items.map((i) => i.name)} />

      {items.length === 0 && !error ? (
        <p className="py-8 text-center text-gray-400">No items yet. Add one, or import from the website catalog.</p>
      ) : (
        <ItemsGrid items={items} />
      )}
    </div>
  )
}

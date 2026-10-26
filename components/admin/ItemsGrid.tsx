'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import ItemImage from './ItemImage'
import { formatMoney } from '@/lib/money'
import type { Item } from '@/lib/items'

export default function ItemsGrid({ items }: { items: Item[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category).filter(Boolean))).sort(),
    [items]
  )

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter(
      (i) =>
        (!category || i.category === category) &&
        (!q || `${i.name} ${i.description} ${i.category}`.toLowerCase().includes(q))
    )
  }, [items, query, category])

  return (
    <div className="space-y-4">
      {/* Search + categories stay pinned while scrolling a long list on a phone. */}
      <div className="sticky top-0 z-10 -mx-4 space-y-3 bg-gray-950/95 px-4 pb-2 pt-2 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items…"
            className="w-full rounded-lg border border-gray-700 bg-gray-900 py-3 pl-10 pr-3 text-white placeholder-gray-500"
            enterKeyHint="search"
          />
        </div>
        <Link
          href="/admin/items/new"
          aria-label="Add item"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gold/60 text-gold hover:bg-gold hover:text-black sm:hidden"
        >
          <Plus size={22} />
        </Link>
      </div>

      {categories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['', ...categories].map((c) => (
            <button
              key={c || 'all'}
              onClick={() => setCategory(c)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm capitalize ${
                category === c ? 'border-gold bg-gold text-black' : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
              }`}
            >
              {c || 'All'}
            </button>
          ))}
        </div>
      )}
      </div>

      {shown.length === 0 ? (
        <p className="py-8 text-center text-gray-400">No items match.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((item) => (
            <li key={item.id}>
              <Link
                href={`/admin/items/${item.id}`}
                className={`flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 p-3 hover:border-gold ${item.active ? '' : 'opacity-50'}`}
              >
                <ItemImage path={item.image_path} className="h-16 w-16" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 font-medium leading-snug">{item.name}</p>
                  <p className="truncate text-xs capitalize text-gray-400">{item.category || 'Uncategorized'}{item.active ? '' : ' · hidden'}</p>
                </div>
                <span className="shrink-0 font-semibold">{formatMoney(item.price_cents)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Search } from 'lucide-react'
import ItemImage from './ItemImage'
import { formatMoney } from '@/lib/money'
import type { Item } from '@/lib/items'

type Props = {
  items: Item[]
  quantities: Record<string, number> // item id -> qty already on the invoice
  onAdd: (item: Item) => void
}

function rank(items: Item[], query: string, category: string): Item[] {
  const q = query.trim().toLowerCase()
  const tokens = q.split(/\s+/).filter(Boolean)
  return items
    .filter((i) => i.active && (!category || i.category === category))
    .map((i) => {
      const name = i.name.toLowerCase()
      const hay = `${name} ${i.category} ${i.description}`.toLowerCase()
      if (!tokens.every((t) => hay.includes(t))) return null
      const score = !q ? 2 : name.startsWith(q) ? 0 : name.includes(q) ? 1 : 2
      return { i, score }
    })
    .filter((x): x is { i: Item; score: number } => x !== null)
    .sort((a, b) => a.score - b.score || a.i.name.localeCompare(b.i.name))
    .map((x) => x.i)
}

export default function ItemPicker({ items, quantities, onAdd }: Props) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const categories = useMemo(
    () => Array.from(new Set(items.filter((i) => i.active).map((i) => i.category).filter(Boolean))).sort(),
    [items]
  )
  const results = useMemo(() => rank(items, query, category).slice(0, 60), [items, query, category])

  useEffect(() => setActive(0), [query, category])

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  useEffect(() => {
    listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' })
  }, [active])

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (open && results[active]) onAdd(results[active])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search your items to add…"
          className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pl-10 pr-3 text-white placeholder-gray-500"
          role="combobox"
          aria-expanded={open}
          aria-controls="item-picker-list"
          autoComplete="off"
        />
      </div>

      {open && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 rounded-xl border border-gray-700 bg-gray-900 shadow-2xl">
          {categories.length > 0 && (
            <div className="flex gap-2 overflow-x-auto border-b border-gray-800 p-2">
              {['', ...categories].map((c) => (
                <button
                  key={c || 'all'}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs capitalize ${
                    category === c ? 'border-gold bg-gold text-black' : 'border-gray-700 hover:bg-gray-800'
                  }`}
                >
                  {c || 'All'}
                </button>
              ))}
            </div>
          )}

          {results.length === 0 ? (
            <p className="p-6 text-center text-sm text-gray-400">No items match “{query}”.</p>
          ) : (
            <ul id="item-picker-list" ref={listRef} role="listbox" className="max-h-[50vh] overflow-y-auto p-1">
              {results.map((item, idx) => {
                const qty = quantities[item.id] ?? 0
                return (
                  <li key={item.id} role="option" aria-selected={idx === active}>
                    <button
                      type="button"
                      onClick={() => onAdd(item)}
                      onMouseEnter={() => setActive(idx)}
                      className={`flex w-full items-center gap-3 rounded-lg p-2 text-left ${idx === active ? 'bg-gray-800' : ''}`}
                    >
                      <ItemImage path={item.image_path} className="h-12 w-12" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{item.name}</p>
                        <p className="truncate text-xs capitalize text-gray-400">{item.category || 'Uncategorized'}</p>
                      </div>
                      {qty > 0 && (
                        <span className="flex items-center gap-1 rounded-full bg-gold/20 px-2 py-0.5 text-xs font-semibold text-gold">
                          <Check size={12} /> {qty}
                        </span>
                      )}
                      <span className="w-20 text-right font-semibold">{formatMoney(item.price_cents)}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}

          <div className="flex items-center justify-between border-t border-gray-800 px-3 py-2 text-xs text-gray-400">
            <span>Tap an item to add it. Tap again for more.</span>
            <button type="button" onClick={() => setOpen(false)} className="rounded-md bg-gray-800 px-3 py-1 font-medium text-white hover:bg-gray-700">
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

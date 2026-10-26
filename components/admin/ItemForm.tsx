'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Upload } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatMoney, parseMoneyToCents } from '@/lib/money'
import type { Item } from '@/lib/items'
import ItemImage from './ItemImage'

const MAX_EDGE = 1200

// Shrinks phone photos (often 4000px+) before upload so pages and emails stay fast.
async function resizeToWebp(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not process image'))), 'image/webp', 0.85)
  )
}

const field = 'mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500'

export default function ItemForm({ item, categories }: { item?: Item; categories: string[] }) {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState(item?.name ?? '')
  const [category, setCategory] = useState(item?.category ?? '')
  const [price, setPrice] = useState(item ? (item.price_cents / 100).toFixed(2) : '')
  const [description, setDescription] = useState(item?.description ?? '')
  const [active, setActive] = useState(item?.active ?? true)
  const [imagePath, setImagePath] = useState<string | null>(item?.image_path ?? null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const originalPath = item?.image_path ?? null
  const isStoragePath = (p: string | null) => !!p && !p.startsWith('/') && !p.startsWith('http')

  async function removeFromStorage(path: string | null) {
    if (isStoragePath(path)) await supabase.storage.from('item-images').remove([path!])
  }

  async function onPickImage(file: File | undefined) {
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const blob = await resizeToWebp(file)
      const path = `${crypto.randomUUID()}.webp`
      const { error: upErr } = await supabase.storage.from('item-images').upload(path, blob, { contentType: 'image/webp' })
      if (upErr) throw upErr
      // A photo uploaded earlier in this same edit session but never saved is now orphaned.
      if (imagePath !== originalPath) await removeFromStorage(imagePath)
      setImagePath(path)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const cents = parseMoneyToCents(price || '0')
    if (!name.trim()) return setError('Give the item a name.')
    if (cents === null) return setError('Enter a valid price, like 25 or 25.00.')

    setSaving(true)
    const row = { name: name.trim(), category: category.trim().toLowerCase(), price_cents: cents, description: description.trim(), image_path: imagePath, active }
    const { error: dbErr } = item
      ? await supabase.from('items').update(row).eq('id', item.id)
      : await supabase.from('items').insert(row)
    if (dbErr) {
      setSaving(false)
      return setError(dbErr.message)
    }
    if (originalPath && originalPath !== imagePath) await removeFromStorage(originalPath)
    router.push('/admin/items')
    router.refresh()
  }

  async function remove() {
    if (!item) return
    if (!confirm(`Delete "${item.name}"? Invoices that already used it are not affected.`)) return
    setSaving(true)
    const { error: dbErr } = await supabase.from('items').delete().eq('id', item.id)
    if (dbErr) {
      setSaving(false)
      return setError(dbErr.message)
    }
    await removeFromStorage(imagePath)
    router.push('/admin/items')
    router.refresh()
  }

  return (
    <form onSubmit={save} className="mx-auto max-w-xl space-y-5">
      <div className="flex items-center gap-4">
        <ItemImage path={imagePath} className="h-24 w-24" />
        <div className="space-y-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-medium hover:bg-gray-800">
            <Upload size={16} /> {uploading ? 'Uploading…' : imagePath ? 'Change photo' : 'Add photo'}
            <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => onPickImage(e.target.files?.[0])} />
          </label>
          {imagePath && (
            <button type="button" onClick={() => setImagePath(null)} className="block py-2 text-sm text-gray-400 hover:text-white">
              Remove photo
            </button>
          )}
        </div>
      </div>

      <label className="block text-sm font-medium">
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} className={field} placeholder="e.g. Chiavari Chair – Gold" required />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Price
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" className={`${field} pl-7`} placeholder="0.00" />
          </div>
        </label>
        <label className="block text-sm font-medium">
          Category
          <input value={category} onChange={(e) => setCategory(e.target.value)} list="categories" className={field} placeholder="e.g. chairs" />
          <datalist id="categories">{categories.map((c) => <option key={c} value={c} />)}</datalist>
        </label>
      </div>

      <label className="block text-sm font-medium">
        Description <span className="font-normal text-gray-400">(optional, shown on the invoice)</span>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={field} />
      </label>

      <label className="flex min-h-[44px] items-center gap-3 text-sm">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-5 w-5 accent-[#D4AF37]" />
        Available when creating invoices
      </label>

      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <button type="submit" disabled={saving || uploading} className="min-h-[48px] flex-1 rounded-lg bg-gold px-5 py-2.5 font-semibold text-black hover:bg-gold-dark disabled:opacity-60 sm:flex-none">
            {saving ? 'Saving…' : item ? 'Save changes' : `Add item${price ? ` · ${formatMoney(parseMoneyToCents(price) ?? 0)}` : ''}`}
          </button>
          <button type="button" onClick={() => router.push('/admin/items')} className="min-h-[48px] rounded-lg px-4 py-2.5 text-gray-300 hover:bg-gray-800">
            Cancel
          </button>
        </div>
        {item && (
          <button type="button" onClick={remove} disabled={saving} className="flex min-h-[44px] items-center justify-center gap-1 text-sm text-red-400 hover:text-red-300 sm:justify-start">
            <Trash2 size={16} /> Delete
          </button>
        )}
      </div>
    </form>
  )
}

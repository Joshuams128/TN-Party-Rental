'use client'

import { useRef, useState } from 'react'
import { Camera, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { resizeToWebp } from '@/lib/image-resize'
import { itemImageUrl } from '@/lib/items'

type Props = {
  path: string | null
  onChange: (path: string | null) => void
}

// The photo tile on a custom line (an item typed in by hand, e.g. a painting): tap it to upload a photo straight
// from the phone or computer. Tap again to replace it; the small ✕ removes it. Catalog items keep their own photo.
export default function CustomLineImage({ path, onChange }: Props) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const src = itemImageUrl(path)

  async function pick(file: File | undefined) {
    if (!file) return
    setError('')
    setBusy(true)
    try {
      const blob = await resizeToWebp(file)
      const filePath = `custom/${crypto.randomUUID()}.webp`
      const { error: upErr } = await createClient().storage.from('item-images').upload(filePath, blob, { contentType: 'image/webp' })
      if (upErr) throw upErr
      onChange(filePath)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setBusy(false)
      if (input.current) input.current.value = '' // lets the same photo be chosen again
    }
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => input.current?.click()}
        disabled={busy}
        aria-label={src ? 'Change the photo for this item' : 'Add a photo for this item'}
        className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-600 bg-gray-800 text-gray-400 hover:border-gold hover:text-gold disabled:opacity-60"
      >
        {busy ? (
          <span aria-hidden className="h-5 w-5 animate-spin rounded-full border-2 border-gray-600 border-t-[#D4AF37]" />
        ) : src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-0.5 text-[10px] leading-none">
            <Camera size={18} />
            Photo
          </span>
        )}
      </button>
      {src && !busy && (
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label="Remove the photo from this item"
          className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center text-gray-300 hover:text-red-400"
        >
          {/* the visible badge is small; the button around it is a comfortable 40px tap area */}
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-950 ring-1 ring-gray-600">
            <X size={12} />
          </span>
        </button>
      )}
      <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
      {error && <p role="alert" className="absolute left-0 top-full z-10 mt-1 w-48 rounded bg-red-950 p-2 text-xs text-red-300">{error}</p>}
    </div>
  )
}

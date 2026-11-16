import sharp from 'sharp'
import { itemImageUrl } from '@/lib/items'

// @react-pdf only embeds JPG/PNG, but uploads are WebP. Convert everything to a small JPEG/PNG buffer.
async function fetchBuffer(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000), cache: 'no-store' })
    if (!res.ok) return null
    return Buffer.from(await res.arrayBuffer())
  } catch {
    return null
  }
}

// The first address that answers wins; the others are not waited for (a slow or wrong host can't hold the PDF up).
async function firstBuffer(urls: string[]): Promise<Buffer | null> {
  if (urls.length === 0) return null
  return new Promise((resolve) => {
    let pending = urls.length
    for (const u of urls) {
      fetchBuffer(u).then((b) => {
        if (b) resolve(b)
        else if (--pending === 0) resolve(null)
      })
    }
  })
}

// Small converted images are kept for a few minutes on a warm server, so repeat views of an invoice are quick.
const CACHE_MS = 10 * 60 * 1000
const cache = new Map<string, { at: number; buf: Buffer }>()

export async function loadPdfImage(
  path: string | null,
  origins: string[],
  opts: { format: 'jpeg' | 'png'; size: number }
): Promise<Buffer | null> {
  const url = itemImageUrl(path)
  if (!url) return null
  const key = `${url}|${opts.format}|${opts.size}`
  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.buf

  const raw = await firstBuffer(url.startsWith('/') ? origins.map((o) => `${o}${url}`) : [url])
  if (!raw) return null
  try {
    const img = sharp(raw).rotate()
    const buf =
      opts.format === 'png'
        ? await img.resize({ width: opts.size, withoutEnlargement: true }).png().toBuffer()
        : await img.resize(opts.size, opts.size, { fit: 'cover' }).flatten({ background: '#ffffff' }).jpeg({ quality: 80 }).toBuffer()
    if (cache.size > 200) cache.clear()
    cache.set(key, { at: Date.now(), buf })
    return buf
  } catch {
    return null
  }
}

import sharp from 'sharp'
import { itemImageUrl } from '@/lib/items'

// @react-pdf only embeds JPG/PNG, but uploads are WebP. Convert everything to a small JPEG/PNG buffer.
async function fetchBuffer(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(6000), cache: 'no-store' })
    if (!res.ok) return null
    return Buffer.from(await res.arrayBuffer())
  } catch {
    return null
  }
}

export async function loadPdfImage(
  path: string | null,
  origins: string[],
  opts: { format: 'jpeg' | 'png'; size: number }
): Promise<Buffer | null> {
  const url = itemImageUrl(path)
  if (!url) return null
  const candidates = url.startsWith('/') ? origins.map((o) => `${o}${url}`) : [url]

  for (const candidate of candidates) {
    const raw = await fetchBuffer(candidate)
    if (!raw) continue
    try {
      const img = sharp(raw).rotate()
      return opts.format === 'png'
        ? await img.resize({ width: opts.size, withoutEnlargement: true }).png().toBuffer()
        : await img.resize(opts.size, opts.size, { fit: 'cover' }).flatten({ background: '#ffffff' }).jpeg({ quality: 80 }).toBuffer()
    } catch {
      continue
    }
  }
  return null
}

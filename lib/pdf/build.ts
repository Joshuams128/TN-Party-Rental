import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer'
import { createElement, type ReactElement } from 'react'
import type { InvoiceDoc } from '@/lib/invoice-data'
import { loadPdfImage } from './images'
import InvoicePdf from './InvoicePdf'

// Renders the invoice to a PDF buffer. `requestOrigin` is only used to find site-hosted images (e.g. the logo).
export async function buildInvoicePdf(doc: InvoiceDoc, requestOrigin: string): Promise<Buffer> {
  const origins = Array.from(
    new Set([process.env.NEXT_PUBLIC_URL, 'https://www.truenorthpartyrentals.com', requestOrigin].filter(Boolean) as string[])
  ).map((o) => o.replace(/\/$/, ''))

  const cache = new Map<string, Promise<Buffer | null>>()
  const thumbFor = (path: string | null) => {
    if (!path) return Promise.resolve(null)
    if (!cache.has(path)) cache.set(path, loadPdfImage(path, origins, { format: 'jpeg', size: 120 }))
    return cache.get(path)!
  }

  const [logo, thumbList] = await Promise.all([
    loadPdfImage('/images/logo.png', origins, { format: 'png', size: 400 }),
    Promise.all(doc.lines.map((l) => thumbFor(l.image_path))),
  ])
  const thumbs: Record<string, Buffer | null> = {}
  doc.lines.forEach((l, i) => (thumbs[l.id] = thumbList[i]))

  // InvoicePdf's root element is a <Document>; the library's types just can't see through our wrapper.
  return renderToBuffer(createElement(InvoicePdf, { doc, logo, thumbs }) as unknown as ReactElement<DocumentProps>)
}

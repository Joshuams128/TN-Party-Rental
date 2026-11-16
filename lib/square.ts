import { createHmac, randomUUID, timingSafeEqual } from 'crypto'

// Square payments, called straight from the server with fetch (no SDK). The access token never leaves the server.
//
// Which Square we talk to: the live site (Vercel "production") uses the real Square; previews and local runs use
// Square's sandbox (fake cards). SQUARE_ENVIRONMENT=sandbox|production overrides that, SQUARE_BASE_URL is for tests.
const SQUARE_VERSION = '2024-11-20'

export function squareBaseUrl(): string {
  if (process.env.SQUARE_BASE_URL) return process.env.SQUARE_BASE_URL.replace(/\/$/, '')
  const env = process.env.SQUARE_ENVIRONMENT || (process.env.VERCEL_ENV === 'production' ? 'production' : 'sandbox')
  return env === 'production' ? 'https://connect.squareup.com' : 'https://connect.squareupsandbox.com'
}

export function squareConfigured(): boolean {
  return !!process.env.SQUARE_ACCESS_TOKEN && !!process.env.SQUARE_LOCATION_ID
}

type SquareErrorBody = { errors?: { code?: string; detail?: string }[] }

async function call<T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${squareBaseUrl()}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
      'Square-Version': SQUARE_VERSION,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  })
  const json = (await res.json().catch(() => ({}))) as T & SquareErrorBody
  if (!res.ok) {
    const first = json.errors?.[0]
    throw new Error(`Square ${res.status}${first?.code ? ` ${first.code}` : ''}${first?.detail ? `: ${first.detail}` : ''}`)
  }
  return json
}

export type PaymentLink = { url: string; orderId: string }

// A one-time Square checkout page for exactly this amount. The order's reference ties it back to the invoice.
export async function createPaymentLink(opts: {
  amountCents: number
  invoiceNumber: number
  buyerEmail: string
  redirectUrl: string
}): Promise<PaymentLink> {
  const data = await call<{ payment_link?: { url?: string; order_id?: string } }>('POST', '/v2/online-checkout/payment-links', {
    idempotency_key: randomUUID(),
    order: {
      location_id: process.env.SQUARE_LOCATION_ID,
      reference_id: `invoice-${opts.invoiceNumber}`,
      line_items: [
        {
          name: `Deposit (50%) - Invoice #${opts.invoiceNumber}`,
          quantity: '1',
          base_price_money: { amount: opts.amountCents, currency: 'CAD' },
        },
      ],
    },
    checkout_options: { redirect_url: opts.redirectUrl, ask_for_shipping_address: false },
    pre_populated_data: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(opts.buyerEmail) ? { buyer_email: opts.buyerEmail } : undefined,
  })
  const link = data.payment_link
  if (!link?.url || !link.order_id) throw new Error('Square did not return a payment link.')
  return { url: link.url, orderId: link.order_id }
}

type Tender = { id?: string; amount_money?: { amount?: number; currency?: string }; card_details?: { status?: string } }
type Order = { id?: string; location_id?: string; tenders?: Tender[] }

// How much has really been paid on an order, asked of Square itself (never taken from the browser).
export async function paidOnOrder(orderId: string): Promise<{ cents: number; paymentId: string | null }> {
  const data = await call<{ order?: Order }>('GET', `/v2/orders/${encodeURIComponent(orderId)}`)
  const order = data.order
  if (!order || order.location_id !== process.env.SQUARE_LOCATION_ID) return { cents: 0, paymentId: null }
  const paid = (order.tenders ?? []).filter(
    (t) => t.amount_money?.currency === 'CAD' && (!t.card_details?.status || t.card_details.status === 'CAPTURED')
  )
  return { cents: paid.reduce((s, t) => s + (t.amount_money?.amount ?? 0), 0), paymentId: paid[0]?.id ?? null }
}

// Square signs each webhook: base64(HMAC-SHA256(signature key, notification URL + raw body)).
export function webhookSignatureValid(rawBody: string, header: string | null, notificationUrl: string): boolean {
  const key = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY
  if (!key || !header) return false
  const expected = createHmac('sha256', key).update(notificationUrl + rawBody).digest('base64')
  const a = Buffer.from(expected)
  const b = Buffer.from(header)
  return a.length === b.length && timingSafeEqual(a, b)
}

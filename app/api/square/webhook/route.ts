import { NextRequest, NextResponse } from 'next/server'
import { recordPaymentForOrder } from '@/lib/payment-sync'
import { requestOrigin } from '@/lib/signing'
import { webhookSignatureValid } from '@/lib/square'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Square tells us a payment changed. We verify the signature, then ask Square itself whether the order is paid.
export async function POST(request: NextRequest) {
  const raw = await request.text()
  const url = process.env.SQUARE_WEBHOOK_URL || `${requestOrigin(request.headers, request.nextUrl.origin)}/api/square/webhook`
  if (!webhookSignatureValid(raw, request.headers.get('x-square-hmacsha256-signature'), url)) {
    return NextResponse.json({ message: 'Invalid signature.' }, { status: 401 })
  }

  let event: { type?: string; data?: { object?: { payment?: { order_id?: string; status?: string } } } }
  try {
    event = JSON.parse(raw)
  } catch {
    return NextResponse.json({ message: 'Invalid payload.' }, { status: 400 })
  }

  const payment = event.data?.object?.payment
  if (event.type?.startsWith('payment.') && payment?.order_id && payment.status === 'COMPLETED') {
    try {
      await recordPaymentForOrder(payment.order_id)
    } catch (e) {
      console.error('Recording Square payment failed:', e)
      return NextResponse.json({ message: 'Try again.' }, { status: 500 }) // Square retries
    }
  }
  return NextResponse.json({ ok: true })
}

import { DEFAULT_SEND_FROM, type BusinessSettings } from '@/lib/invoice-data'

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Resend may only send from a verified domain, so the "from" address can differ from where replies should go.
export function emailRoute(s: Pick<BusinessSettings, 'business_name' | 'email' | 'send_from_email'>) {
  const replyTo = s.email.trim()
  const fromAddress = (s.send_from_email || '').trim() || DEFAULT_SEND_FROM
  return { from: `${s.business_name} <${fromAddress}>`, fromAddress, replyTo }
}

// Turn Resend's "domain not verified" rejection into something the owner can act on.
export function friendlySendError(message: string, fromAddress: string): string {
  if (/not verified|verify (your|the) domain/i.test(message)) {
    const domain = fromAddress.split('@')[1] ?? 'that domain'
    return `Couldn’t send: ${domain} isn’t a verified sending domain, so “${fromAddress}” can’t be used. In Settings, set “Send invoices from” to an address on your verified website domain (for example info@truenorthpartyrentals.com).`
  }
  return `Couldn’t send: ${message}`
}

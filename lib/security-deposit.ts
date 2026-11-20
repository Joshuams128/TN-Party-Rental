import { formatMoney } from '@/lib/money'

// Refundable security deposit options the owner picks from on each invoice. The list lives in Settings, so the
// client can change the amounts (and give them names) without touching code. It is NOT part of the invoice total.
export type SecurityTier = { label: string; cents: number }

export const DEFAULT_SECURITY_TIERS: SecurityTier[] = [5000, 10000, 25000, 50000, 100000, 200000].map((cents) => ({ label: '', cents }))

// Never trust stored data blindly: keep only sensible rows. Nothing stored yet (null / column missing) = the standard list;
// a stored empty list is respected (the owner removed every option).
export function parseSecurityTiers(raw: unknown): SecurityTier[] {
  if (!Array.isArray(raw)) return DEFAULT_SECURITY_TIERS
  const out: SecurityTier[] = []
  for (const r of raw as { label?: unknown; cents?: unknown }[]) {
    const cents = Math.round(Number(r?.cents))
    if (!Number.isFinite(cents) || cents <= 0 || cents > 10_000_000) continue
    out.push({ label: typeof r?.label === 'string' ? r.label.trim().slice(0, 40) : '', cents })
  }
  return out.sort((a, b) => a.cents - b.cents)
}

export const tierText = (t: SecurityTier): string => `${t.label ? `${t.label}: ` : ''}${formatMoney(t.cents)}`

export const SECURITY_DEPOSIT_NOTE =
  'Not included in the total above. Refundable: returned after pickup, less any charges for damage or loss, as described in the payment terms.'

const REFUNDABLE = 'Refundable: returned after pickup, less any charges for damage or loss, as described in the payment terms.'

// What the invoice says about the security deposit, depending on whether it is paid online through Square.
export function securityDepositNote(opts: { online: boolean; paid: boolean }): string {
  if (!opts.online) return SECURITY_DEPOSIT_NOTE
  return opts.paid
    ? `Paid online through Square. Not included in the total above. ${REFUNDABLE}`
    : `Paid online through Square before signing, as a separate payment. Not included in the total above. ${REFUNDABLE}`
}

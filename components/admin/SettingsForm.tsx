'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { BusinessSettings } from '@/lib/invoice-data'
import { DEFAULT_KEY_POINTS, DEFAULT_TERMS, termsPlaceholders } from '@/lib/terms'
import { DEFAULT_SECURITY_TIERS } from '@/lib/security-deposit'
import { parseMoneyToCents } from '@/lib/money'

const input = 'mt-1 min-h-[44px] w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500'

export default function SettingsForm({ initial }: { initial: BusinessSettings }) {
  const [s, setS] = useState({ ...initial, tax_rate: String(initial.tax_rate) })
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [error, setError] = useState('')
  // Terms columns come from a newer database update, so they are only written once used.
  const termsTouched = useRef(!!(initial.terms_text || initial.terms_key_points))
  const set = (k: keyof typeof s, v: string) => {
    if (k === 'terms_text' || k === 'terms_key_points') termsTouched.current = true
    setS((cur) => ({ ...cur, [k]: v }))
    setState('idle')
  }
  const blanks = termsPlaceholders(s.terms_text + '\n' + s.terms_key_points)

  // Security deposit options: one row per amount, editable. Only written once the owner changes them.
  type Row = { id: string; label: string; amount: string }
  const toRows = (tiers: { label: string; cents: number }[]): Row[] => tiers.map((t) => ({ id: crypto.randomUUID(), label: t.label, amount: String(t.cents / 100) }))
  const [tiers, setTiers] = useState<Row[]>(() => toRows(initial.security_deposit_options))
  const tiersTouched = useRef(false)
  const editTiers = (fn: (rows: Row[]) => Row[]) => {
    tiersTouched.current = true
    setTiers(fn)
    setState('idle')
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const rate = Number(s.tax_rate)
    if (!Number.isFinite(rate) || rate < 0 || rate > 100) return setError('Tax rate must be between 0 and 100.')
    const fromValue = s.send_from_email.trim()
    if (fromValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromValue)) return setError('“Send invoices from” must be a valid email address.')
    // Security deposit options: every row needs a positive dollar amount.
    const tierRows: { label: string; cents: number }[] = []
    for (const r of tiers) {
      const cents = parseMoneyToCents(r.amount)
      if (cents === null || cents <= 0) return setError('Each security deposit option needs an amount greater than $0.')
      tierRows.push({ label: r.label.trim().slice(0, 40), cents })
    }
    tierRows.sort((a, b) => a.cents - b.cents)
    setError('')
    setState('saving')
    const { error: dbErr } = await createClient()
      .from('business_settings')
      .update({
        business_name: s.business_name.trim(),
        address: s.address.trim(),
        phone: s.phone.trim(),
        email: s.email.trim(),
        send_from_email: s.send_from_email.trim(),
        tax_number: s.tax_number.trim(),
        tax_label: s.tax_label.trim() || 'HST',
        tax_rate: rate,
        invoice_footer: s.invoice_footer.trim(),
        ...(termsTouched.current ? { terms_key_points: s.terms_key_points.trim(), terms_text: s.terms_text.trim() } : {}),
        ...(tiersTouched.current ? { security_deposit_options: tierRows } : {}),
      })
      .eq('id', 1)
    if (dbErr) {
      setState('error')
      return setError(dbErr.message)
    }
    setState('saved')
  }

  return (
    <form onSubmit={save} className="max-w-xl space-y-5">
      <label className="block text-sm font-medium">
        Business name
        <input value={s.business_name} onChange={(e) => set('business_name', e.target.value)} className={input} required />
      </label>
      <label className="block text-sm font-medium">
        Address
        <textarea value={s.address} onChange={(e) => set('address', e.target.value)} rows={3} className={input} placeholder={'Street\nCity, Province, Postal code'} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Phone
          <input value={s.phone} onChange={(e) => set('phone', e.target.value)} className={input} />
        </label>
        <label className="block text-sm font-medium">
          Email <span className="font-normal text-gray-400">(replies and your copy go here)</span>
          <input type="email" value={s.email} onChange={(e) => set('email', e.target.value)} className={input} placeholder="you@gmail.com" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm font-medium">
          Tax name
          <input value={s.tax_label} onChange={(e) => set('tax_label', e.target.value)} className={input} />
        </label>
        <label className="block text-sm font-medium">
          Tax rate (%)
          <input inputMode="decimal" value={s.tax_rate} onChange={(e) => set('tax_rate', e.target.value)} className={input} />
        </label>
        <label className="block text-sm font-medium">
          Tax number <span className="font-normal text-gray-400">(optional)</span>
          <input value={s.tax_number} onChange={(e) => set('tax_number', e.target.value)} className={input} />
        </label>
      </div>
      <label className="block text-sm font-medium">
        Invoice footer <span className="font-normal text-gray-400">(optional, printed at the bottom of every page)</span>
        <input value={s.invoice_footer} onChange={(e) => set('invoice_footer', e.target.value)} className={input} placeholder="Thank you for your business!" />
      </label>

      <label className="block text-sm font-medium">
        Send invoices from <span className="font-normal text-gray-400">(the address customers see)</span>
        <input type="email" value={s.send_from_email} onChange={(e) => set('send_from_email', e.target.value)} className={input} placeholder="noreply@truenorthpartyrentals.com" />
      </label>
      <p className="rounded-lg bg-gray-900 p-3 text-xs text-gray-400">
        Use an address on your website’s domain (the one verified in Resend). It doesn’t need a real inbox, because replies go to
        your Email above. Gmail, Yahoo and similar addresses can’t be used here.
      </p>

      <div className="space-y-3 border-t border-gray-800 pt-5">
        <h2 className="text-lg font-semibold">Payment terms</h2>
        <p className="text-xs text-gray-400">
          Sent with every invoice: a short “key terms” box on the invoice, a “Please read full terms here” link, and the full terms as the
          second part of the PDF. Customers agree to them when they sign. Each invoice keeps the wording it was sent with, so changing
          this later never affects invoices already sent. Leave both boxes empty to send invoices without terms.
        </p>
        <button
          type="button"
          onClick={() => {
            if ((s.terms_text.trim() || s.terms_key_points.trim()) && !confirm('Replace what is in the boxes with the standard True North terms?')) return
            set('terms_key_points', DEFAULT_KEY_POINTS)
            set('terms_text', DEFAULT_TERMS)
          }}
          className="min-h-[44px] rounded-lg border border-gray-700 px-4 text-sm hover:bg-gray-800"
        >
          Load the standard True North terms
        </button>
        <label className="block text-sm font-medium">
          Key terms <span className="font-normal text-gray-400">(shown on the invoice, one short point per line)</span>
          <textarea value={s.terms_key_points} onChange={(e) => set('terms_key_points', e.target.value)} rows={6} className={input} />
        </label>
        <label className="block text-sm font-medium">
          Full terms
          <textarea value={s.terms_text} onChange={(e) => set('terms_text', e.target.value)} rows={16} className={input + ' font-mono text-xs leading-relaxed'} />
        </label>
        {blanks.length > 0 && (
          <p role="status" className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
            <strong>{blanks.length} blank{blanks.length > 1 ? 's' : ''} still to fill in.</strong> Replace each part in [square brackets] with your
            final wording, for example {blanks.slice(0, 2).join(' and ')}. Invoices can’t be sent until none are left.
          </p>
        )}
      </div>

      <div className="space-y-3 border-t border-gray-800 pt-5">
        <h2 className="text-lg font-semibold">Security deposit options</h2>
        <p className="text-xs text-gray-400">
          The refundable amounts offered in the “Security deposit” dropdown on every invoice, for example more for fragile or high-value
          rentals. Change, rename, add or remove them any time. Each invoice keeps the amount it was saved with, so changing this list
          never alters an invoice that was already sent.
        </p>
        <ul className="space-y-2">
          {tiers.map((r, i) => (
            <li key={r.id} className="flex items-center gap-2">
              <input
                value={r.label}
                onChange={(e) => editTiers((rows) => rows.map((x) => (x.id === r.id ? { ...x, label: e.target.value } : x)))}
                aria-label={`Name for option ${i + 1} (optional)`}
                placeholder="Name (optional)"
                maxLength={40}
                className={`${input} mt-0 min-w-0 flex-1`}
              />
              <label className="relative w-28 shrink-0">
                <span className="sr-only">Amount for option {i + 1}</span>
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  inputMode="decimal"
                  value={r.amount}
                  onChange={(e) => editTiers((rows) => rows.map((x) => (x.id === r.id ? { ...x, amount: e.target.value } : x)))}
                  className={`${input} mt-0 pl-6 text-right`}
                />
              </label>
              <button
                type="button"
                onClick={() => editTiers((rows) => rows.filter((x) => x.id !== r.id))}
                aria-label={`Remove option ${i + 1}`}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-800 hover:text-red-400"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        {tiers.length === 0 && <p className="text-sm text-gray-400">No options: the dropdown on invoices will only show “None”.</p>}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => editTiers((rows) => [...rows, { id: crypto.randomUUID(), label: '', amount: '' }])}
            className="min-h-[44px] rounded-lg border border-gray-700 px-4 text-sm hover:bg-gray-800"
          >
            + Add an option
          </button>
          <button
            type="button"
            onClick={() => editTiers(() => toRows(DEFAULT_SECURITY_TIERS))}
            className="min-h-[44px] rounded-lg px-4 text-sm text-gray-400 hover:text-gold"
          >
            Reset to $50 – $2,000
          </button>
        </div>
      </div>

      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={state === 'saving'} className="rounded-lg bg-gold px-5 py-2.5 font-semibold text-black hover:bg-gold-dark disabled:opacity-60">
          {state === 'saving' ? 'Saving…' : 'Save settings'}
        </button>
        {state === 'saved' && <span className="text-sm text-green-400">Saved</span>}
      </div>
    </form>
  )
}

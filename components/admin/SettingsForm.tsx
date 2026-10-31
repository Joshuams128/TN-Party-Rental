'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { BusinessSettings } from '@/lib/invoice-data'

const input = 'mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500'

export default function SettingsForm({ initial }: { initial: BusinessSettings }) {
  const [s, setS] = useState({ ...initial, tax_rate: String(initial.tax_rate) })
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [error, setError] = useState('')
  const set = (k: keyof typeof s, v: string) => {
    setS((cur) => ({ ...cur, [k]: v }))
    setState('idle')
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const rate = Number(s.tax_rate)
    if (!Number.isFinite(rate) || rate < 0 || rate > 100) return setError('Tax rate must be between 0 and 100.')
    const fromValue = s.send_from_email.trim()
    if (fromValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromValue)) return setError('“Send invoices from” must be a valid email address.')
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

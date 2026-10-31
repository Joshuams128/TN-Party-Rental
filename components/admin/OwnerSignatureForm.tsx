'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import SignaturePad from '@/components/SignaturePad'

// The owner signs once; it is applied to any invoice that has "Include my signature" ticked.
export default function OwnerSignatureForm({ initial }: { initial: string }) {
  const [saved, setSaved] = useState(initial)
  const [drawn, setDrawn] = useState<string | null>(null)
  const [padKey, setPadKey] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function write(value: string) {
    setBusy(true)
    setError('')
    const { error: dbErr } = await createClient().from('business_settings').update({ owner_signature_image: value }).eq('id', 1)
    setBusy(false)
    if (dbErr) return setError(dbErr.message)
    setSaved(value)
    setDrawn(null)
    setPadKey((k) => k + 1)
  }

  return (
    <section className="max-w-xl space-y-3 rounded-xl border border-gray-800 bg-gray-900 p-4 sm:p-5">
      <div>
        <h2 className="font-semibold">Your signature</h2>
        <p className="text-sm text-gray-400">Draw it once. It is added to invoices where you tick “Include my signature”.</p>
      </div>

      {saved && (
        <div className="flex items-center gap-4 rounded-lg bg-white p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={saved} alt="Your saved signature" className="h-16 w-auto" />
          <button type="button" onClick={() => write('')} disabled={busy} className="ml-auto min-h-[44px] text-sm text-red-600 hover:underline">
            Remove
          </button>
        </div>
      )}

      <div className="rounded-lg bg-gray-950 p-2">
        <SignaturePad key={padKey} onChange={setDrawn} label={saved ? 'Draw a new signature to replace it' : 'Sign here with your finger or mouse'} />
      </div>

      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      <button
        type="button"
        onClick={() => drawn && write(drawn)}
        disabled={!drawn || busy}
        className="min-h-[48px] rounded-lg bg-gold px-5 font-semibold text-black hover:bg-gold-dark disabled:opacity-50"
      >
        {busy ? 'Saving…' : saved ? 'Replace signature' : 'Save signature'}
      </button>
    </section>
  )
}

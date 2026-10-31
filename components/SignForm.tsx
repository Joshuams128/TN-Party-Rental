'use client'

import { useState } from 'react'
import { CheckCircle2, Download } from 'lucide-react'
import SignaturePad, { typedSignatureImage } from './SignaturePad'

type Props = { token: string; hash: string; number: number }

export default function SignForm({ token, hash, number }: Props) {
  const [mode, setMode] = useState<'draw' | 'type'>('draw')
  const [name, setName] = useState('')
  const [drawn, setDrawn] = useState<string | null>(null)
  const [agree, setAgree] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const typedOk = name.trim().length >= 2
  const ready = typedOk && agree && (mode === 'type' || !!drawn) && !busy

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!ready) return
    setBusy(true)
    setError('')
    try {
      const image = mode === 'draw' ? drawn! : typedSignatureImage(name.trim())
      const res = await fetch(`/api/sign/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), type: mode, image, hash, consent: true }),
      })
      const body = await res.json().catch(() => ({}))
      if (res.status === 409 && body.code === 'already_signed') return setDone(true)
      if (!res.ok) throw new Error(body.message || 'Something went wrong. Please try again.')
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <CheckCircle2 className="mx-auto text-green-600" size={40} />
        <h2 className="mt-3 text-xl font-bold text-green-900">Thank you, your invoice is signed</h2>
        <p className="mt-1 text-sm text-green-800">A signed copy is being emailed to you. You can also download it now.</p>
        <a
          href={`/api/sign/${token}/pdf?download=1`}
          className="mt-4 inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-green-700 px-5 font-semibold text-white hover:bg-green-800"
        >
          <Download size={18} /> Download signed invoice #{number}
        </a>
      </div>
    )
  }

  const tab = (m: 'draw' | 'type', label: string) => (
    <button
      type="button"
      onClick={() => setMode(m)}
      aria-pressed={mode === m}
      className={`min-h-[44px] flex-1 rounded-lg px-4 text-sm font-semibold ${mode === m ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
    >
      {label}
    </button>
  )

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-lg font-bold">Sign this invoice</h2>
        <p className="text-sm text-gray-500">Draw your signature or type your name. It takes about 10 seconds.</p>
      </div>

      <label className="block text-sm font-medium">
        Your full name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          className="mt-1 h-12 w-full rounded-lg border border-gray-300 px-3 text-base"
          placeholder="First and last name"
        />
      </label>

      <div>
        <div className="mb-3 flex gap-1 rounded-xl bg-gray-100 p-1">
          {tab('draw', 'Draw')}
          {tab('type', 'Type')}
        </div>
        {mode === 'draw' ? (
          <SignaturePad onChange={setDrawn} disabled={busy} label="Sign here with your finger or mouse" />
        ) : (
          <div className="flex min-h-[8rem] items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white px-4 py-6 text-center">
            {typedOk ? (
              <span className="text-5xl text-gray-900" style={{ fontFamily: '"Brush Script MT","Snell Roundhand","Segoe Script","Apple Chancery",cursive', fontStyle: 'italic' }}>
                {name.trim()}
              </span>
            ) : (
              <span className="text-sm text-gray-400">Type your name above to see your signature</span>
            )}
          </div>
        )}
      </div>

      <label className="flex items-start gap-3 text-sm leading-snug">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-black" />
        <span>I have reviewed this invoice and agree that my electronic signature has the same effect as my handwritten signature.</span>
      </label>

      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={!ready}
        className="h-14 w-full rounded-xl bg-black text-base font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy ? 'Signing…' : 'Sign invoice'}
      </button>
    </form>
  )
}

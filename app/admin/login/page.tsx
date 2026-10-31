'use client'

import { useFormState, useFormStatus } from 'react-dom'
import Image from 'next/image'
import { login } from './actions'
import PoweredBy from '@/components/admin/PoweredBy'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-gold px-4 py-3 font-semibold text-black transition hover:bg-gold-dark disabled:opacity-60"
    >
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  )
}

export default function LoginPage() {
  const [state, action] = useFormState(login, undefined)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
      <form action={action} className="w-full max-w-sm space-y-4 rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-2xl">
        <Image src="/images/logo.png" alt="True North Party Rentals" width={240} height={80} className="mx-auto h-16 w-auto" />
        <h1 className="text-center text-lg font-semibold">Owner sign in</h1>
        <label className="block text-sm font-medium">
          Email
          <input name="email" type="email" autoComplete="username" required className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white" />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input name="password" type="password" autoComplete="current-password" required className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white" />
        </label>
        {state?.error && <p role="alert" className="text-sm text-red-400">{state.error}</p>}
        <SubmitButton />
      </form>
      <PoweredBy className="mt-6" />
    </div>
  )
}

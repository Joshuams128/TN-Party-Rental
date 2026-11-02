'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Minus, Plus, PlusCircle, Trash2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatMoney, parseMoneyToCents } from '@/lib/money'
import { pruneOrphanCustomers } from '@/lib/customers'
import { deleteInvoiceMessage } from './DeleteInvoiceButton'
import { blankDiscount, computeTotals, lineDiscountCents, lineTotalCents, type InvoiceFields, type Line } from '@/lib/invoice'
import { formatRentalPeriod, rentalHours } from '@/lib/rental'
import type { Item } from '@/lib/items'
import ItemImage from './ItemImage'
import ItemPicker from './ItemPicker'

// Thrown when the invoice was saved by someone/something else since this page loaded.
class ConflictError extends Error {}

export type CustomerOption = { id: string; name: string; email: string; address: string }

type Props = {
  items: Item[]
  customers: CustomerOption[]
  taxLabel: string
  taxRate: number
  initial: {
    id: string | null
    number: number | null
    status: 'draft' | 'sent'
    updatedAt: string | null // when the invoice was last saved, as loaded; used to detect stale pages
    fields: InvoiceFields
    lines: Line[]
  }
}

const input = 'mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500'
const card = 'rounded-xl border border-gray-800 bg-gray-900 p-4 sm:p-5'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export default function InvoiceBuilder({ items, customers, taxLabel, taxRate, initial }: Props) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [fields, setFields] = useState<InvoiceFields>(initial.fields)
  const [lines, setLines] = useState<Line[]>(initial.lines)
  const [invoiceId, setInvoiceId] = useState(initial.id)
  const [number, setNumber] = useState(initial.number)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [saveError, setSaveError] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showDetails, setShowDetails] = useState(
    !!(initial.fields.due_date || initial.fields.notes || initial.fields.discount)
  )

  // Latest values for the async saver (state captured in closures would be stale).
  const latest = useRef({ fields, lines, invoiceId })
  latest.current = { fields, lines, invoiceId }
  const saving = useRef(false)
  const dirty = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const firstRender = useRef(true)
  const deleted = useRef(false) // once deleted, autosave must not recreate or touch the invoice
  // The owner-signature column comes from a later migration, so only write it once the owner has used it.
  const ownerSigTouched = useRef(initial.fields.owner_signature)
  // Same idea for the rental period and line discounts: columns from newer migrations are only written once used.
  const knownUpdatedAt = useRef<string | null>(initial.updatedAt)
  const conflictRef = useRef(false)
  const [conflict, setConflict] = useState(false)
  const rentalTouched = useRef(!!(initial.fields.rental_start || initial.fields.rental_end))

  const totals = computeTotals(lines, fields.discount, fields.apply_tax, taxRate)
  const [discountOpen, setDiscountOpen] = useState<Record<string, boolean>>({})
  const rentalText = formatRentalPeriod(fields.rental_start, fields.rental_end)
  const rentalBad = !!fields.rental_start && !!fields.rental_end && rentalHours(fields.rental_start, fields.rental_end) === null

  const persist = useCallback(async () => {
    const { fields: f, lines: ls, invoiceId: currentId } = latest.current

    // Remember the customer for type-ahead next time.
    let customerId: string | null = null
    const name = f.customer_name.trim()
    const email = f.customer_email.trim()
    const emailKey = email.toLowerCase()
    if (name && email) {
      const { data: existing } = await supabase.from('customers').select('id').eq('email', emailKey).maybeSingle()
      const row = { name, email: emailKey, address: f.customer_address.trim() }
      if (existing) {
        customerId = existing.id
        await supabase.from('customers').update(row).eq('id', existing.id)
      } else {
        const { data: created } = await supabase.from('customers').insert(row).select('id').single()
        customerId = created?.id ?? null
      }
    }

    const row = {
      customer_id: customerId,
      customer_name: name,
      customer_email: email,
      customer_address: f.customer_address.trim(),
      issue_date: f.issue_date,
      due_date: f.due_date || null,
      notes: f.notes.trim(),
      discount_cents: parseMoneyToCents(f.discount) ?? 0,
      apply_tax: f.apply_tax,
      ...(ownerSigTouched.current ? { include_owner_signature: f.owner_signature } : {}),
      ...(rentalTouched.current ? { rental_start: f.rental_start || null, rental_end: f.rental_end || null } : {}),
      updated_at: new Date().toISOString(),
    }

    let id = currentId
    if (!id) {
      const { data: s, error: sErr } = await supabase.from('business_settings').select('next_invoice_number').eq('id', 1).single()
      if (sErr) throw sErr
      const { data: created, error: iErr } = await supabase
        .from('invoices')
        .insert({ ...row, tax_rate: taxRate, number: s.next_invoice_number })
        .select('id, number')
        .single()
      if (iErr) throw iErr
      await supabase.from('business_settings').update({ next_invoice_number: created.number + 1 }).eq('id', 1)
      id = created.id as string
      setInvoiceId(id)
      setNumber(created.number)
      latest.current.invoiceId = id
      window.history.replaceState(null, '', `/admin/invoices/${id}`)
    } else {
      // Only save if nobody saved a newer version meanwhile; otherwise this (older) page would overwrite their items.
      let update = supabase.from('invoices').update(row).eq('id', id)
      if (knownUpdatedAt.current) update = update.eq('updated_at', knownUpdatedAt.current)
      const { data: hit, error } = await update.select('id')
      if (error) throw error
      if (knownUpdatedAt.current && (!hit || hit.length === 0)) throw new ConflictError()
    }
    knownUpdatedAt.current = row.updated_at

    // Replace the lines wholesale: simple and safe for a single-user app.
    const { error: delErr } = await supabase.from('invoice_lines').delete().eq('invoice_id', id)
    if (delErr) throw delErr
    if (ls.length > 0) {
      const anyDiscount = ls.some((l) => l.discountName.trim() || Number(l.discountValue) > 0)
      const { error: insErr } = await supabase.from('invoice_lines').insert(
        ls.map((l, position) => ({
          invoice_id: id,
          item_id: l.item_id,
          position,
          name: l.name.trim() || 'Item',
          description: l.description,
          image_path: l.image_path,
          unit_price_cents: parseMoneyToCents(l.price) ?? 0,
          quantity: l.quantity,
          ...(anyDiscount
            ? { discount_name: l.discountName.trim(), discount_type: l.discountType, discount_value: Number(l.discountValue) || 0 }
            : {}),
        }))
      )
      if (insErr) throw insErr
    }
  }, [supabase, taxRate])

  const flush = useCallback(async (): Promise<boolean> => {
    if (deleted.current) return true
    if (conflictRef.current) return false
    if (saving.current) {
      dirty.current = true
      return true
    }
    const { fields: f, lines: ls, invoiceId: id } = latest.current
    const hasContent = !!id || ls.length > 0 || f.customer_name.trim() || f.customer_email.trim() || f.notes.trim()
    if (!hasContent) return true

    saving.current = true
    dirty.current = false
    setSaveState('saving')
    let ok = true
    try {
      await persist()
      setSaveState('saved')
      setSaveError('')
    } catch (e) {
      ok = false
      if (e instanceof ConflictError) {
        conflictRef.current = true
        setConflict(true)
      }
      setSaveState('error')
      setSaveError(e instanceof Error ? e.message : (e as { message?: string })?.message ?? 'Could not save')
    } finally {
      saving.current = false
      if (dirty.current) void flush()
    }
    return ok
  }, [persist])

  // Save everything right now (skipping the debounce), then open the review screen.
  const [opening, setOpening] = useState(false)
  async function openReview() {
    setOpening(true)
    clearTimeout(timer.current)
    while (saving.current) await new Promise((r) => setTimeout(r, 100))
    const ok = await flush()
    while (saving.current) await new Promise((r) => setTimeout(r, 100))
    const id = latest.current.invoiceId
    setOpening(false)
    if (ok && id) router.push(`/admin/invoices/${id}/review`)
  }
  const canReview = lines.length > 0 && !opening

  // Autosave shortly after the owner stops typing.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    setSaveState('idle')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => void flush(), 800)
    return () => clearTimeout(timer.current)
  }, [fields, lines, flush])

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (saving.current || timer.current) {
        if (saveState === 'idle' || saveState === 'saving') e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [saveState])

  const setField = <K extends keyof InvoiceFields>(key: K, value: InvoiceFields[K]) =>
    setFields((f) => ({ ...f, [key]: value }))

  function addItem(item: Item) {
    setLines((ls) => {
      const existing = ls.find((l) => l.item_id === item.id)
      if (existing) return ls.map((l) => (l.key === existing.key ? { ...l, quantity: l.quantity + 1 } : l))
      return [
        ...ls,
        {
          key: crypto.randomUUID(),
          item_id: item.id,
          name: item.name,
          description: item.description,
          image_path: item.image_path,
          price: (item.price_cents / 100).toFixed(2),
          quantity: 1,
          ...blankDiscount,
        },
      ]
    })
  }

  function addCustom() {
    setLines((ls) => [
      ...ls,
      { key: crypto.randomUUID(), item_id: null, name: '', description: '', image_path: null, price: '', quantity: 1, ...blankDiscount },
    ])
  }

  const updateLine = (key: string, patch: Partial<Line>) =>
    setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)))
  const removeLine = (key: string) => setLines((ls) => ls.filter((l) => l.key !== key))

  const quantities = useMemo(() => {
    const q: Record<string, number> = {}
    for (const l of lines) if (l.item_id) q[l.item_id] = (q[l.item_id] ?? 0) + l.quantity
    return q
  }, [lines])

  const suggestions = useMemo(() => {
    const q = fields.customer_name.trim().toLowerCase()
    if (q.length < 1) return []
    return customers.filter((c) => c.name.toLowerCase().includes(q) && c.name.toLowerCase() !== q).slice(0, 5)
  }, [customers, fields.customer_name])

  function pickCustomer(c: CustomerOption) {
    setFields((f) => ({ ...f, customer_name: c.name, customer_email: c.email, customer_address: c.address }))
    setShowSuggestions(false)
  }

  async function deleteDraft() {
    if (!invoiceId) {
      deleted.current = true
      clearTimeout(timer.current)
      return router.push('/admin/invoices')
    }
    if (!confirm(deleteInvoiceMessage(number ?? 0, initial.status))) return
    deleted.current = true
    clearTimeout(timer.current)
    while (saving.current) await new Promise((r) => setTimeout(r, 100))
    const { error } = await supabase.from('invoices').delete().eq('id', invoiceId)
    if (error) {
      deleted.current = false
      return setSaveError(error.message)
    }
    await pruneOrphanCustomers(supabase)
    router.push('/admin/invoices')
    router.refresh()
  }

  const statusText =
    saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Draft saved' : saveState === 'error' ? 'Not saved' : ''

  return (
    <div className="grid gap-5 pb-24 lg:grid-cols-[1fr_320px]">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-bold">
            {number ? `Invoice #${number}` : 'New invoice'}{' '}
            <span className="ml-2 rounded-full bg-gray-800 px-2 py-0.5 align-middle text-xs font-medium capitalize text-gray-300">
              {initial.status}
            </span>
          </h1>
          <span className={`text-sm ${saveState === 'error' ? 'text-red-400' : 'text-gray-400'}`} aria-live="polite">
            {statusText}
          </span>
        </div>
        {conflict ? (
          <div role="alert" className="space-y-3 rounded-lg border border-red-800 bg-red-950 p-4 text-sm text-red-200">
            <p className="font-semibold">This invoice was changed somewhere else, so your edits here were not saved.</p>
            <p>This usually means it&apos;s open in another tab, or this page is an older copy. Reload to see the latest version, then re-apply what you just changed. Nothing has been overwritten.</p>
            <button type="button" onClick={() => window.location.reload()} className="min-h-[44px] rounded-lg bg-white px-4 font-semibold text-black">
              Reload the latest version
            </button>
          </div>
        ) : (
          saveError && <p role="alert" className="rounded-lg bg-red-950 p-3 text-sm text-red-300">Couldn&apos;t save: {saveError}</p>
        )}

        {/* Customer */}
        <section className={card}>
          <h2 className="mb-3 font-semibold">Customer</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="relative block text-sm font-medium">
              Name
              <input
                value={fields.customer_name}
                onChange={(e) => {
                  setField('customer_name', e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                className={input}
                autoComplete="off"
                placeholder="Customer name"
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-gray-700 bg-gray-900 shadow-xl">
                  {suggestions.map((c) => (
                    <li key={c.id}>
                      <button type="button" onMouseDown={() => pickCustomer(c)} className="block w-full px-3 py-2 text-left hover:bg-gray-800">
                        <span className="font-medium">{c.name}</span>
                        <span className="block text-xs text-gray-400">{c.email}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </label>
            <label className="block text-sm font-medium">
              Email
              <input type="email" value={fields.customer_email} onChange={(e) => setField('customer_email', e.target.value)} className={input} placeholder="name@example.com" />
            </label>
            <label className="block text-sm font-medium sm:col-span-2">
              Mailing address
              <textarea value={fields.customer_address} onChange={(e) => setField('customer_address', e.target.value)} rows={2} className={input} placeholder="Street, city, province, postal code" />
            </label>
            <div className="sm:col-span-2">
              <p className="text-sm font-medium">Rental period <span className="font-normal text-gray-400">(optional)</span></p>
              <div className="mt-1 grid gap-3 sm:grid-cols-2">
                <label className="block text-xs text-gray-400">
                  Starts
                  <input
                    type="datetime-local"
                    value={fields.rental_start}
                    onChange={(e) => {
                      rentalTouched.current = true
                      setField('rental_start', e.target.value)
                    }}
                    className={`${input} h-12 text-base text-white`}
                  />
                </label>
                <label className="block text-xs text-gray-400">
                  Ends
                  <input
                    type="datetime-local"
                    value={fields.rental_end}
                    min={fields.rental_start || undefined}
                    onChange={(e) => {
                      rentalTouched.current = true
                      setField('rental_end', e.target.value)
                    }}
                    className={`${input} h-12 text-base text-white`}
                  />
                </label>
              </div>
              {rentalBad ? (
                <p role="alert" className="mt-2 text-sm text-red-400">The end needs to be after the start.</p>
              ) : (
                rentalText && <p className="mt-2 text-sm font-medium text-gold">{rentalText}</p>
              )}
            </div>
          </div>
        </section>

        {/* Items */}
        <section className={card}>
          <h2 className="mb-3 font-semibold">Items</h2>
          <ItemPicker items={items} quantities={quantities} onAdd={addItem} />

          {lines.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">Search above to add items to this invoice.</p>
          ) : (
            <ul className="mt-4 divide-y divide-gray-800">
              {lines.map((l) => (
                // Phone: photo + name + remove on one row, quantity / price / total on the next. Desktop: a single row.
                <li key={l.key} className="py-4 sm:py-3">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-3 sm:flex-nowrap sm:gap-y-0">
                  <ItemImage path={l.image_path} className="h-14 w-14" />
                  <div className="min-w-0 flex-1 basis-0">
                    {l.item_id ? (
                      <p className="font-medium leading-snug">{l.name}</p>
                    ) : (
                      <input
                        value={l.name}
                        onChange={(e) => updateLine(l.key, { name: e.target.value })}
                        placeholder="Custom item (e.g. Delivery)"
                        className="h-11 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 text-white placeholder-gray-500"
                        autoFocus={!l.name}
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${l.name || 'item'}`}
                    onClick={() => removeLine(l.key)}
                    className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-800 hover:text-red-400 sm:order-1"
                  >
                    <X size={18} />
                  </button>
                  <span aria-hidden className="h-0 w-full sm:hidden" />
                  <div className="flex h-11 shrink-0 items-center rounded-lg border border-gray-700">
                    <button type="button" aria-label="Decrease quantity" onClick={() => updateLine(l.key, { quantity: Math.max(1, l.quantity - 1) })} className="flex h-11 w-10 items-center justify-center rounded-l-lg hover:bg-gray-800">
                      <Minus size={16} />
                    </button>
                    <input
                      aria-label="Quantity"
                      inputMode="numeric"
                      value={l.quantity}
                      onChange={(e) => updateLine(l.key, { quantity: Math.max(1, parseInt(e.target.value.replace(/\D/g, ''), 10) || 1) })}
                      className="w-10 bg-transparent text-center"
                    />
                    <button type="button" aria-label="Increase quantity" onClick={() => updateLine(l.key, { quantity: l.quantity + 1 })} className="flex h-11 w-10 items-center justify-center rounded-r-lg hover:bg-gray-800">
                      <Plus size={16} />
                    </button>
                  </div>
                  <label className="relative min-w-[5.5rem] flex-1 sm:flex-none">
                    <span className="sr-only">Unit price</span>
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      inputMode="decimal"
                      value={l.price}
                      onChange={(e) => updateLine(l.key, { price: e.target.value })}
                      placeholder="0.00"
                      className="h-11 w-full min-w-0 rounded-lg border border-gray-700 bg-gray-800 pl-6 pr-3 text-right text-white sm:w-28"
                    />
                  </label>
                  <span className="ml-auto min-w-[4.5rem] text-right font-semibold sm:ml-0 sm:w-24">{formatMoney(lineTotalCents(l))}</span>
                  </div>

                  {/* Optional discount on just this item or service, with a name the customer sees. */}
                  {discountOpen[l.key] || l.discountName || Number(l.discountValue) > 0 ? (
                    <div className="mt-3 rounded-lg border border-gray-800 bg-gray-950/60 p-3 sm:ml-[68px]">
                      <div className="grid gap-3 sm:grid-cols-[1fr_auto_8rem]">
                        <label className="block text-xs font-medium text-gray-400">
                          Discount name
                          <input
                            value={l.discountName}
                            onChange={(e) => updateLine(l.key, { discountName: e.target.value })}
                            placeholder="e.g. Repeat customer"
                            className="mt-1 h-11 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 text-base text-white placeholder-gray-500"
                          />
                        </label>
                        <div role="group" aria-label="Discount type" className="flex h-11 self-end overflow-hidden rounded-lg border border-gray-700">
                          {(['amount', 'percent'] as const).map((t) => (
                            <button
                              key={t}
                              type="button"
                              aria-pressed={l.discountType === t}
                              onClick={() => updateLine(l.key, { discountType: t })}
                              className={`w-16 text-sm font-semibold ${l.discountType === t ? 'bg-gold text-black' : 'text-gray-300 hover:bg-gray-800'}`}
                            >
                              {t === 'amount' ? '$ off' : '% off'}
                            </button>
                          ))}
                        </div>
                        <label className="block text-xs font-medium text-gray-400">
                          {l.discountType === 'percent' ? 'Percent' : 'Amount'}
                          <input
                            inputMode="decimal"
                            value={l.discountValue}
                            onChange={(e) => updateLine(l.key, { discountValue: e.target.value })}
                            placeholder={l.discountType === 'percent' ? '10' : '0.00'}
                            className="mt-1 h-11 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 text-right text-base text-white"
                          />
                        </label>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                        <span className={`min-w-0 ${lineDiscountCents(l) > 0 ? 'font-medium text-green-400' : 'text-gray-500'}`}>
                          {lineDiscountCents(l) > 0 ? `${l.discountName.trim() || 'Discount'}: −${formatMoney(lineDiscountCents(l))}` : 'Enter an amount to apply'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            updateLine(l.key, { ...blankDiscount })
                            setDiscountOpen((o) => ({ ...o, [l.key]: false }))
                          }}
                          className="min-h-[44px] shrink-0 whitespace-nowrap text-gray-400 hover:text-red-400"
                        >
                          Remove discount
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDiscountOpen((o) => ({ ...o, [l.key]: true }))}
                      className="mt-1 min-h-[44px] text-sm text-gray-400 hover:text-gold sm:ml-[68px]"
                    >
                      + Discount this item
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          <button type="button" onClick={addCustom} className="mt-2 flex min-h-[44px] items-center gap-2 text-sm text-gray-300 hover:text-gold">
            <PlusCircle size={16} /> Add a custom item
          </button>
        </section>

        {/* Optional details */}
        <section className={card}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Details</h2>
            <label className="flex min-h-[44px] items-center gap-3 text-sm">
              <input type="checkbox" checked={fields.apply_tax} onChange={(e) => setField('apply_tax', e.target.checked)} className="h-5 w-5 accent-[#D4AF37]" />
              Charge {taxLabel} ({taxRate}%)
            </label>
          </div>
          <label className="mt-3 block text-sm font-medium">
            Invoice date
            <input type="date" value={fields.issue_date} onChange={(e) => setField('issue_date', e.target.value)} className={`${input} sm:w-56`} />
          </label>

          <label className="mt-2 flex min-h-[44px] items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={fields.owner_signature}
              onChange={(e) => {
                ownerSigTouched.current = true
                setField('owner_signature', e.target.checked)
              }}
              className="h-5 w-5 accent-[#D4AF37]"
            />
            <span>Include my signature <span className="text-gray-400">(save it once under Settings. The customer always signs online.)</span></span>
          </label>

          {!showDetails ? (
            <button type="button" onClick={() => setShowDetails(true)} className="mt-2 min-h-[44px] text-sm text-gray-300 hover:text-gold">
              + Add due date, discount, or notes
            </button>
          ) : (
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Due date <span className="font-normal text-gray-400">(optional)</span>
                <input type="date" value={fields.due_date} onChange={(e) => setField('due_date', e.target.value)} className={input} />
              </label>
              <label className="block text-sm font-medium">
                Discount <span className="font-normal text-gray-400">(optional)</span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input inputMode="decimal" value={fields.discount} onChange={(e) => setField('discount', e.target.value)} className={`${input} pl-7`} placeholder="0.00" />
                </div>
              </label>
              <label className="block text-sm font-medium sm:col-span-2">
                Notes <span className="font-normal text-gray-400">(optional, shown on the invoice)</span>
                <textarea value={fields.notes} onChange={(e) => setField('notes', e.target.value)} rows={3} className={input} placeholder="Event date, delivery details, thank-you message…" />
              </label>
            </div>
          )}
        </section>

        <button type="button" onClick={deleteDraft} className="flex min-h-[44px] items-center gap-1 text-sm text-gray-400 hover:text-red-400">
          <Trash2 size={14} /> {invoiceId ? 'Delete this invoice' : 'Discard'}
        </button>
      </div>

      {/* Summary */}
      <aside className="hidden lg:block">
        <div className={`${card} sticky top-4 space-y-3`}>
          <Summary totals={totals} taxLabel={taxLabel} taxRate={taxRate} applyTax={fields.apply_tax} />
          <ReviewButton onClick={openReview} disabled={!canReview} busy={opening} resend={initial.status === 'sent'} />
          {lines.length === 0 && <p className="text-xs text-gray-500">Add an item to continue.</p>}
        </div>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-800 bg-gray-950/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span>
            <span className="block text-lg font-bold leading-tight">{formatMoney(totals.total)}</span>
            <span className="text-xs text-gray-400">{lines.length} item{lines.length === 1 ? '' : 's'}</span>
          </span>
          <div className="w-44"><ReviewButton onClick={openReview} disabled={!canReview} busy={opening} resend={initial.status === 'sent'} /></div>
        </div>
      </div>
    </div>
  )
}

function Summary({ totals, taxLabel, taxRate, applyTax }: { totals: ReturnType<typeof computeTotals>; taxLabel: string; taxRate: number; applyTax: boolean }) {
  const row = 'flex justify-between text-sm'
  return (
    <>
      <h2 className="font-semibold">Summary</h2>
      <div className={row}><span className="text-gray-400">Subtotal</span><span>{formatMoney(totals.subtotal)}</span></div>
      {totals.discount > 0 && <div className={row}><span className="text-gray-400">Discount</span><span>−{formatMoney(totals.discount)}</span></div>}
      {applyTax && <div className={row}><span className="text-gray-400">{taxLabel} ({taxRate}%)</span><span>{formatMoney(totals.tax)}</span></div>}
      <div className="flex justify-between border-t border-gray-800 pt-3 text-lg font-bold"><span>Total</span><span>{formatMoney(totals.total)}</span></div>
    </>
  )
}

function ReviewButton({ onClick, disabled, busy, resend }: { onClick: () => void; disabled: boolean; busy: boolean; resend: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-lg bg-gold px-4 py-3 font-semibold text-black hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-50"
    >
      {busy ? 'Saving…' : resend ? 'Review & resend' : 'Review & send'}
    </button>
  )
}

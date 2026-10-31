import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loadBuilderData } from '@/lib/builder-data'
import InvoiceBuilder from '@/components/admin/InvoiceBuilder'
import type { Line } from '@/lib/invoice'

export const dynamic = 'force-dynamic'

export default async function EditInvoicePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: invoice }, { data: rows }, builder] = await Promise.all([
    supabase.from('invoices').select('*').eq('id', params.id).maybeSingle(),
    supabase.from('invoice_lines').select('*').eq('invoice_id', params.id).order('position'),
    loadBuilderData(),
  ])
  if (!invoice) notFound()
  // A signed invoice is a record of what the customer agreed to, so it can't be edited.
  if (invoice.signed_at) redirect(`/admin/invoices/${invoice.id}/review`)

  const lines: Line[] = (rows ?? []).map((r) => ({
    key: r.id,
    item_id: r.item_id,
    name: r.name,
    description: r.description,
    image_path: r.image_path,
    price: (r.unit_price_cents / 100).toFixed(2),
    quantity: r.quantity,
  }))

  return (
    <InvoiceBuilder
      items={builder.items}
      customers={builder.customers}
      taxLabel={builder.taxLabel}
      taxRate={builder.taxRate}
      initial={{
        id: invoice.id,
        number: invoice.number,
        status: invoice.status,
        fields: {
          customer_name: invoice.customer_name,
          customer_email: invoice.customer_email,
          customer_address: invoice.customer_address,
          issue_date: invoice.issue_date,
          due_date: invoice.due_date ?? '',
          notes: invoice.notes,
          discount: invoice.discount_cents ? (invoice.discount_cents / 100).toFixed(2) : '',
          apply_tax: invoice.apply_tax,
          owner_signature: !!invoice.include_owner_signature,
        },
        lines,
      }}
    />
  )
}

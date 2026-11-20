import { loadBuilderData } from '@/lib/builder-data'
import InvoiceBuilder from '@/components/admin/InvoiceBuilder'
import { todayISO } from '@/lib/invoice'

export const dynamic = 'force-dynamic'

export default async function NewInvoicePage() {
  const { items, customers, taxLabel, taxRate, securityTiers } = await loadBuilderData()
  return (
    <InvoiceBuilder
      items={items}
      customers={customers}
      taxLabel={taxLabel}
      taxRate={taxRate}
      securityTiers={securityTiers}
      initial={{
        id: null,
        number: null,
        status: 'draft',
        updatedAt: null,
        fields: {
          customer_name: '',
          customer_email: '',
          customer_phone: '',
          customer_address: '',
          rental_start: '',
          rental_end: '',
          issue_date: todayISO(),
          due_date: '',
          notes: '',
          discount: '',
          apply_tax: taxRate > 0,
          owner_signature: false,
          collect_payment: false,
          collect_percent: 50 as const,
          cash_payment: false,
          security_deposit_cents: 0,
        },
        lines: [],
      }}
    />
  )
}

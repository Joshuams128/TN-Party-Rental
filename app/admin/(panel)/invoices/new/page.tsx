import { loadBuilderData } from '@/lib/builder-data'
import InvoiceBuilder from '@/components/admin/InvoiceBuilder'
import { todayISO } from '@/lib/invoice'

export const dynamic = 'force-dynamic'

export default async function NewInvoicePage() {
  const { items, customers, taxLabel, taxRate } = await loadBuilderData()
  return (
    <InvoiceBuilder
      items={items}
      customers={customers}
      taxLabel={taxLabel}
      taxRate={taxRate}
      initial={{
        id: null,
        number: null,
        status: 'draft',
        fields: {
          customer_name: '',
          customer_email: '',
          customer_address: '',
          issue_date: todayISO(),
          due_date: '',
          notes: '',
          discount: '',
          apply_tax: taxRate > 0,
          owner_signature: false,
        },
        lines: [],
      }}
    />
  )
}

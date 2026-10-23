import { createClient } from '@/lib/supabase/server'
import type { Item } from '@/lib/items'
import type { CustomerOption } from '@/components/admin/InvoiceBuilder'

// Everything the invoice builder needs to render, fetched in parallel.
export async function loadBuilderData() {
  const supabase = createClient()
  const [{ data: items }, { data: customers }, { data: settings }] = await Promise.all([
    supabase.from('items').select('*').eq('active', true).order('name'),
    supabase.from('customers').select('id, name, email, address').order('name'),
    supabase.from('business_settings').select('tax_label, tax_rate').eq('id', 1).maybeSingle(),
  ])
  return {
    items: (items ?? []) as Item[],
    customers: (customers ?? []) as CustomerOption[],
    taxLabel: (settings?.tax_label as string | undefined) ?? 'HST',
    taxRate: Number(settings?.tax_rate ?? 13),
  }
}

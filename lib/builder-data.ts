import { createClient } from '@/lib/supabase/server'
import type { Item } from '@/lib/items'
import type { CustomerOption } from '@/components/admin/InvoiceBuilder'
import { parseSecurityTiers } from '@/lib/security-deposit'

// Everything the invoice builder needs to render, fetched in parallel.
export async function loadBuilderData() {
  const supabase = createClient()
  const [{ data: items }, { data: customers }, { data: usedBy }, { data: settings }, { data: tierRow }] = await Promise.all([
    supabase.from('items').select('*').eq('active', true).order('name'),
    supabase.from('customers').select('id, name, email, address').order('name'),
    supabase.from('invoices').select('customer_id').not('customer_id', 'is', null),
    supabase.from('business_settings').select('tax_label, tax_rate').eq('id', 1).maybeSingle(),
    // Best effort: this column comes from a newer database update (missing = the standard list).
    supabase.from('business_settings').select('security_deposit_options').eq('id', 1).maybeSingle(),
  ])
  const used = new Set((usedBy ?? []).map((r) => r.customer_id as string))
  return {
    items: (items ?? []) as Item[],
    // Only customers that still appear on a draft or sent invoice are worth suggesting.
    customers: ((customers ?? []) as CustomerOption[]).filter((c) => used.has(c.id)),
    taxLabel: (settings?.tax_label as string | undefined) ?? 'HST',
    taxRate: Number(settings?.tax_rate ?? 13),
    securityTiers: parseSecurityTiers(tierRow?.security_deposit_options),
  }
}

import type { SupabaseClient } from '@supabase/supabase-js'

// A saved customer only matters while some invoice (draft or sent) still uses them.
// Call after deleting an invoice to drop customers nothing refers to anymore.
export async function pruneOrphanCustomers(supabase: SupabaseClient): Promise<void> {
  const [{ data: customers }, { data: used }] = await Promise.all([
    supabase.from('customers').select('id'),
    supabase.from('invoices').select('customer_id').not('customer_id', 'is', null),
  ])
  const inUse = new Set((used ?? []).map((r) => r.customer_id as string))
  const orphans = (customers ?? []).map((c) => c.id as string).filter((id) => !inUse.has(id))
  if (orphans.length > 0) await supabase.from('customers').delete().in('id', orphans)
}

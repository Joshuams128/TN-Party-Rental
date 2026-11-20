import type { SupabaseClient } from '@supabase/supabase-js'

// Lists of invoices for the owner. "Deleted" invoices are archived, not erased, so the normal lists leave them out.
// Until the database update that adds the archive column has been run, the plain list is used so nothing breaks.
export async function fetchInvoiceRows<T>(
  supabase: SupabaseClient,
  select: string,
  mode: 'active' | 'deleted'
): Promise<{ rows: T[]; error: string | null }> {
  if (mode === 'deleted') {
    const { data, error } = await supabase.from('invoices').select(select).not('deleted_at', 'is', null).order('number', { ascending: false })
    return { rows: error ? [] : ((data ?? []) as T[]), error: null }
  }
  const first = await supabase.from('invoices').select(select).is('deleted_at', null).order('number', { ascending: false })
  if (!first.error) return { rows: (first.data ?? []) as T[], error: null }
  const plain = await supabase.from('invoices').select(select).order('number', { ascending: false })
  return { rows: (plain.data ?? []) as T[], error: plain.error?.message ?? null }
}

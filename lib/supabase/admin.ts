import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js'

// Server-only client that can write a payment onto an invoice when there is no logged-in owner (the customer coming
// back from Square, or Square's own webhook). It must never be imported into browser code.
export function adminConfigured(): boolean {
  return !!process.env.SUPABASE_SERVICE_ROLE_KEY && !!process.env.NEXT_PUBLIC_SUPABASE_URL
}

export function createAdminClient(): SupabaseClient {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

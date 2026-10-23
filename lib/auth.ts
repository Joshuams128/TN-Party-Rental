import { createClient } from '@/lib/supabase/server'

// API routes aren't covered by the /admin middleware, so each one checks the session itself.
export async function requireOwner() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user ? { supabase, user } : null
}

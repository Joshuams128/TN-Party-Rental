import { createClient } from '@/lib/supabase/server'
import { loadSettings } from '@/lib/invoice-data'
import SettingsForm from '@/components/admin/SettingsForm'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const settings = await loadSettings(createClient())
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Business settings</h1>
      <p className="text-sm text-gray-400">These details appear at the top of every invoice.</p>
      <SettingsForm initial={settings} />
    </div>
  )
}

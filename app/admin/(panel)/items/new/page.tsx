import { createClient } from '@/lib/supabase/server'
import ItemForm from '@/components/admin/ItemForm'

export const dynamic = 'force-dynamic'

export default async function NewItemPage() {
  const { data } = await createClient().from('items').select('category')
  const categories = Array.from(new Set((data ?? []).map((r) => r.category).filter(Boolean))).sort()

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Add item</h1>
      <ItemForm categories={categories} />
    </div>
  )
}

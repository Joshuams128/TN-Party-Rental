import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ItemForm from '@/components/admin/ItemForm'
import type { Item } from '@/lib/items'

export const dynamic = 'force-dynamic'

export default async function EditItemPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: item }, { data: cats }] = await Promise.all([
    supabase.from('items').select('*').eq('id', params.id).maybeSingle(),
    supabase.from('items').select('category'),
  ])
  if (!item) notFound()
  const categories = Array.from(new Set((cats ?? []).map((r) => r.category).filter(Boolean))).sort()

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Edit item</h1>
      <ItemForm item={item as Item} categories={categories} />
    </div>
  )
}

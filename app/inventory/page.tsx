import type { Metadata } from 'next'
import { Suspense } from 'react'
import { InventoryPage } from '@/components/Inventory'

export const metadata: Metadata = {
  title: 'Inventory | True North Party Rentals',
  description: 'Browse our extensive inventory of event rental equipment including tables, chairs, linens, decor, and more.',
}

export default function Page() {
  return (
    <Suspense>
      <InventoryPage />
    </Suspense>
  )
}

import type { Metadata } from 'next'
import { InventoryPage } from '@/components/Inventory'

export const metadata: Metadata = {
  title: 'Inventory | True North Party Rentals',
  description: 'Browse our extensive inventory of event rental equipment including tables, chairs, linens, décor, and more.',
}

export default function Page() {
  return <InventoryPage />
}

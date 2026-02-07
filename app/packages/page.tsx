import type { Metadata } from 'next'
import { PackagesPage } from '@/components/Packages'

export const metadata: Metadata = {
  title: 'Event Packages | True North Party Rentals',
  description: 'Pre-curated event packages for weddings, birthdays, corporate events, and more. Simplify your planning with our all-inclusive packages.',
}

export default function Page() {
  return <PackagesPage />
}

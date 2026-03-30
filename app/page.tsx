import type { Metadata } from 'next'
import { Home } from '@/components/Home'

export const metadata: Metadata = {
  title: 'True North Party Rentals | Event Rentals in Scarborough',
  description: 'Premier event rental company in Scarborough. Photo booths, balloon garlands, backdrop packages, and more for weddings, birthdays, and corporate events across the GTA.',
  keywords: ['party rentals', 'event rentals', 'Scarborough', 'GTA', 'wedding rentals', 'corporate events', 'photo booth', 'balloon garlands', 'backdrop packages'],
}

export default function Page() {
  return <Home />
}

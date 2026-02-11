import type { Metadata } from 'next'
import { Corporate } from '@/components/Corporate'

export const metadata: Metadata = {
  title: 'Corporate Event Solutions | True North Party Rentals',
  description: 'Professional corporate event services for meetings, conferences, team building, and networking events.',
}

export default function CorporatePage() {
  return <Corporate />
}

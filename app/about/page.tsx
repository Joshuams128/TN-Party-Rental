import type { Metadata } from 'next'
import { About } from '@/components/About'

export const metadata: Metadata = {
  title: 'About Us | True North Party Rentals',
  description: 'Learn about True North Party Rentals - Scarborough\'s trusted event rental company with years of experience creating unforgettable events.',
}

export default function AboutPage() {
  return <About />
}

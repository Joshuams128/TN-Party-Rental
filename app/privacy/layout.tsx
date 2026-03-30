import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | True North Party Rentals',
  description: 'Privacy policy for True North Party Rentals. Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}

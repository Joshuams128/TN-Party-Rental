import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | True North Party Rentals',
  description: 'Terms of service for True North Party Rentals. Review our rental policies, cancellation terms, and conditions.',
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}

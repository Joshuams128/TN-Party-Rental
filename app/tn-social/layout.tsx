import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TN Social Events | True North Party Rentals',
  description: 'Upcoming soca and Caribbean events in the GTA. Get tickets to Summer Soca, Soca Social, Wicked, and more.',
  keywords: ['soca events', 'Caribbean events', 'Toronto events', 'GTA events', 'soca party'],
  openGraph: {
    title: 'TN Social Events | True North Party Rentals',
    description: 'Upcoming soca and Caribbean events in the GTA.',
    type: 'website',
    images: [{ url: '/images/truesocial.png', width: 600, height: 600, alt: 'TN Social Logo' }],
  },
}

export default function TNSocialLayout({ children }: { children: React.ReactNode }) {
  return children
}

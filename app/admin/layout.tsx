import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin | True North Party Rentals',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-950 text-gray-100 [color-scheme:dark]">{children}</div>
}

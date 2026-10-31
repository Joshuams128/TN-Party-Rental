'use client'

import { usePathname } from 'next/navigation'

// Hides the public header/footer on the private /admin area and the customer signing page.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/sign')) return null
  return <>{children}</>
}

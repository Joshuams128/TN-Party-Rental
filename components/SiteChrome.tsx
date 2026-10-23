'use client'

import { usePathname } from 'next/navigation'

// Hides the public header/footer on the private /admin area.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  return <>{children}</>
}

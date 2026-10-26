'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, LayoutDashboard, Package, Settings } from 'lucide-react'

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/invoices', label: 'Invoices', icon: FileText },
  { href: '/admin/items', label: 'Items', icon: Package },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

// Four equal tabs that always fit on a phone (icon above label); a row of pills on wider screens.
export default function AdminNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="Admin" className="mb-6 grid grid-cols-4 gap-1 border-b border-gray-800 pb-3 sm:flex sm:gap-2">
      {nav.map(({ href, label, icon: Icon }) => {
        const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`flex min-h-[3.25rem] flex-col items-center justify-center gap-1 rounded-lg px-2 text-xs font-medium sm:min-h-0 sm:flex-row sm:gap-2 sm:px-3 sm:py-2 sm:text-sm ${
              active ? 'bg-gray-800 text-gold' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Icon size={18} /> {label}
          </Link>
        )
      })}
    </nav>
  )
}

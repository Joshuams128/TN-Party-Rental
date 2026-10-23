import Link from 'next/link'
import { FileText, LayoutDashboard, Package, LogOut } from 'lucide-react'
import { logout } from '../login/actions'

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/invoices', label: 'Invoices', icon: FileText },
  { href: '/admin/items', label: 'Items', icon: Package },
]

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <header className="flex items-center justify-between py-4">
        <span className="font-semibold">True North · Invoicing</span>
        <form action={logout}>
          <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-white">
            <LogOut size={16} /> Sign out
          </button>
        </form>
      </header>
      <nav className="mb-6 flex gap-2 overflow-x-auto border-b border-gray-800 pb-3">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-800">
            <Icon size={16} /> {label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  )
}

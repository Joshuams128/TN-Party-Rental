import { LogOut } from 'lucide-react'
import { logout } from '../login/actions'
import AdminNav from '@/components/admin/AdminNav'
import PoweredBy from '@/components/admin/PoweredBy'

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <header className="flex items-center justify-between py-4">
        <span className="font-semibold">True North · Invoicing</span>
        <form action={logout}>
          <button className="flex min-h-[44px] items-center gap-1 px-1 text-sm text-gray-400 hover:text-white">
            <LogOut size={16} /> Sign out
          </button>
        </form>
      </header>
      <AdminNav />
      {children}
      <footer className="mt-12 border-t border-gray-800 py-2">
        <PoweredBy />
      </footer>
    </div>
  )
}

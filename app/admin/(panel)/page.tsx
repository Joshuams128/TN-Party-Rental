import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <Link href="/admin/invoices/new" className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-3 font-semibold text-black hover:bg-gold-dark">
        <Plus size={18} /> New invoice
      </Link>
      <p className="text-sm text-gray-600">Recent invoices and items will appear here.</p>
    </div>
  )
}

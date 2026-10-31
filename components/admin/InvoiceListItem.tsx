import Link from 'next/link'
import { formatMoney } from '@/lib/money'
import { formatDateShort } from '@/lib/invoice'
import DeleteInvoiceButton from './DeleteInvoiceButton'

type Props = {
  id: string
  number: number
  status: 'draft' | 'sent' | 'signed'
  customerName: string
  issueDate: string
  totalCents: number
  deletable?: boolean
}

// Contents of one invoice row: customer + total on top, number/date + status below (holds up at 320px).
// The caller renders the <li key={id}>: React Flight drops keys on server components, so a key here
// would let a deleted row's client state (e.g. a busy delete button) leak into the row that moves up.
export default function InvoiceListItem({ id, number, status, customerName, issueDate, totalCents, deletable }: Props) {
  return (
    <>
      <Link href={`/admin/invoices/${id}`} className="grid min-w-0 flex-1 grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 px-4 py-3">
        <span className="truncate font-medium">{customerName || 'No customer yet'}</span>
        <span className="text-right font-semibold">{formatMoney(totalCents)}</span>
        <span className="truncate text-xs text-gray-400">
          #{number} · {formatDateShort(issueDate)}
        </span>
        <span
          className={`justify-self-end rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
            status === 'signed' ? 'bg-green-900 text-green-200' : status === 'sent' ? 'bg-blue-950 text-blue-300' : 'bg-gray-800 text-gray-300'
          }`}
        >
          {status === 'sent' ? 'Awaiting signature' : status}
        </span>
      </Link>
      {deletable && (
        <div className="pr-1">
          <DeleteInvoiceButton id={id} number={number} status={status} />
        </div>
      )}
    </>
  )
}

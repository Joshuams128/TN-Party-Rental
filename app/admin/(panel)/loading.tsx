// Shown the moment an admin page is clicked, while the next page is fetched, so the screen never looks frozen.
export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-3 py-24 text-gray-400">
      <span aria-hidden className="h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-[#D4AF37]" />
      <span className="text-sm">Loading…</span>
    </div>
  )
}

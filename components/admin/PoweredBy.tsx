// Developer credit shown at the bottom of the admin app.
const SITE = 'https://acersites.com'

export default function PoweredBy({ className = '' }: { className?: string }) {
  return (
    <p className={`text-center text-xs text-gray-500 ${className}`}>
      App by{' '}
      <a href={SITE} target="_blank" rel="noopener noreferrer" className="inline-block px-1 py-3 font-medium text-gray-400 underline-offset-2 hover:text-gold hover:underline">
        AcerSites
      </a>
    </p>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Event Packages | True North Party Rentals',
  description: 'Pre-curated event packages for weddings, birthdays, corporate events, and more. Simplify your planning with our all-inclusive packages.',
}

export default function PackagesPage() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">Event Packages</h1>
        <p className="text-xl text-gray-600 mb-12">
          Simplify your planning with our pre-curated packages designed for various event types
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PackageCard
            name="Intimate Gathering"
            capacity="Up to 25 guests"
            price="Starting at $499"
            features={[
              '3 round tables (60")',
              '25 chiavari chairs',
              'Basic linens (choice of colors)',
              'Simple centerpieces',
              'Setup & takedown',
            ]}
          />
          <PackageCard
            name="Classic Celebration"
            capacity="Up to 75 guests"
            price="Starting at $1,299"
            features={[
              '10 round tables (60")',
              '75 chiavari chairs',
              'Premium linens & runners',
              'Elegant centerpieces',
              'Accent lighting',
              'Setup & takedown',
            ]}
            featured
          />
          <PackageCard
            name="Grand Event"
            capacity="Up to 150 guests"
            price="Starting at $2,499"
            features={[
              '20+ tables (mix of sizes)',
              '150 premium chairs',
              'Luxury linens & décor',
              'Custom centerpieces',
              'Full lighting package',
              'Tent option available',
              'Setup & takedown',
            ]}
          />
          <PackageCard
            name="Corporate Event"
            capacity="Up to 100 guests"
            price="Starting at $1,799"
            features={[
              'Conference tables',
              '100 comfortable chairs',
              'Professional linens',
              'Podium & AV stand',
              'Coffee station setup',
              'Setup & takedown',
            ]}
          />
          <PackageCard
            name="Backyard BBQ"
            capacity="Up to 50 guests"
            price="Starting at $799"
            features={[
              'Picnic tables or farm tables',
              '50 folding chairs',
              'Casual linens',
              'Beverage station',
              'Pop-up canopy',
              'Setup & takedown',
            ]}
          />
          <PackageCard
            name="Custom Package"
            capacity="Any size"
            price="Contact for pricing"
            features={[
              'Fully customizable',
              'Mix & match items',
              'Your vision, our expertise',
              'Dedicated event planner',
              'Flexible options',
            ]}
          />
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-gold-light p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Package Details</h2>
          <ul className="space-y-3 text-gray-800">
            <li className="flex items-start">
              <span className="text-gold-dark font-bold mr-2">✓</span>
              All packages include delivery, setup, and takedown within Scarborough
            </li>
            <li className="flex items-start">
              <span className="text-gold-dark font-bold mr-2">✓</span>
              Additional items can be added to any package
            </li>
            <li className="flex items-start">
              <span className="text-gold-dark font-bold mr-2">✓</span>
              Discounts available for multi-day rentals
            </li>
            <li className="flex items-start">
              <span className="text-gold-dark font-bold mr-2">✓</span>
              Flexible payment options available
            </li>
          </ul>
          <Link
            href="/contact"
            className="inline-block mt-6 bg-gold hover:bg-gold-dark text-gray-900 font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Request a Quote
          </Link>
        </div>
      </div>
    </div>
  )
}

function PackageCard({
  name,
  capacity,
  price,
  features,
  featured = false,
}: {
  name: string
  capacity: string
  price: string
  features: string[]
  featured?: boolean
}) {
  return (
    <div
      className={`bg-white rounded-lg p-6 border-2 ${
        featured ? 'border-gold shadow-lg' : 'border-gray-200'
      } hover:shadow-xl transition-shadow`}
    >
      {featured && (
        <span className="inline-block bg-gold text-gray-900 text-sm font-semibold px-3 py-1 rounded-full mb-4">
          Most Popular
        </span>
      )}
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <p className="text-gray-600 mb-1">{capacity}</p>
      <p className="text-3xl font-bold text-gold mb-6">{price}</p>
      <ul className="space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start text-gray-700">
            <span className="text-gold mr-2">✓</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}

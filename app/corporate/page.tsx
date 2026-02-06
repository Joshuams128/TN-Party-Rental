import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Corporate Event Solutions | True North Party Rentals',
  description: 'Professional corporate event services for meetings, conferences, team building, and networking events.',
}

export default function CorporatePage() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">Corporate Event Solutions</h1>
        <p className="text-xl text-gray-600 mb-12">
          Professional event services tailored for businesses and organizations
        </p>

        {/* Hero Content */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg p-12 mb-16">
          <h2 className="text-3xl font-bold mb-4">Elevate Your Corporate Events</h2>
          <p className="text-lg mb-6">
            From small business meetings to large-scale conferences, we provide the equipment, 
            planning, and support to ensure your corporate event is a success.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-gold hover:bg-gold-dark text-gray-900 font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Request a Quote
          </Link>
        </div>

        {/* Corporate Services */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold mb-8">Corporate Event Types</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CorporateServiceCard
              title="Conferences & Seminars"
              description="Complete setup for professional conferences, including stage equipment, seating, and AV support"
            />
            <CorporateServiceCard
              title="Team Building Events"
              description="Outdoor and indoor setups for team activities, workshops, and retreats"
            />
            <CorporateServiceCard
              title="Networking Events"
              description="Cocktail tables, lounge furniture, and elegant décor for professional networking"
            />
            <CorporateServiceCard
              title="Holiday Parties"
              description="Festive setups for company celebrations and seasonal events"
            />
            <CorporateServiceCard
              title="Product Launches"
              description="Professional staging, lighting, and presentation equipment"
            />
            <CorporateServiceCard
              title="Board Meetings"
              description="Executive tables, comfortable seating, and professional amenities"
            />
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-4xl font-bold mb-8 text-center">Why Businesses Choose Us</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <FeatureItem
              title="Professional Service"
              description="White-glove service with attention to detail and corporate professionalism"
            />
            <FeatureItem
              title="Flexible Scheduling"
              description="Early morning and after-hours delivery to accommodate business schedules"
            />
            <FeatureItem
              title="Volume Discounts"
              description="Competitive pricing for recurring events and bulk orders"
            />
            <FeatureItem
              title="Invoicing Options"
              description="Flexible billing and payment terms for corporate clients"
            />
            <FeatureItem
              title="Dedicated Account Manager"
              description="Single point of contact for all your event needs"
            />
            <FeatureItem
              title="Last-Minute Requests"
              description="Responsive service for urgent and time-sensitive events"
            />
          </div>
        </div>

        {/* Equipment Highlights */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold mb-8">Corporate Equipment & Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <EquipmentCategory
              title="Furniture"
              items={['Conference tables', 'Executive chairs', 'Lounge seating', 'Bar tables', 'Registration desks']}
            />
            <EquipmentCategory
              title="Presentation"
              items={['Podiums', 'AV stands', 'Display easels', 'Stage platforms', 'Backdrop walls']}
            />
            <EquipmentCategory
              title="Hospitality"
              items={['Coffee stations', 'Buffet tables', 'Bar setups', 'Table linens', 'Professional glassware']}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gold-light p-12 rounded-lg">
          <h2 className="text-4xl font-bold mb-4">Partner With Us</h2>
          <p className="text-xl text-gray-800 mb-8">
            Join the businesses that trust True North for their corporate events
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-gold hover:bg-gold-dark text-gray-900 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/packages"
              className="inline-block bg-white hover:bg-gray-100 text-gray-900 font-semibold px-8 py-3 rounded-lg transition-colors border border-gray-300"
            >
              View Packages
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function CorporateServiceCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-3 text-gold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start">
      <span className="text-gold text-2xl mr-3">✓</span>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}

function EquipmentCategory({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-2xl font-semibold mb-4 text-gold">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start text-gray-700">
            <span className="text-gold mr-2">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-700">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Making Your Events <span className="text-gold">Unforgettable</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Premium event rentals and planning services in Scarborough
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inventory"
              className="bg-gold hover:bg-gold-dark text-gray-900 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              View Inventory
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border-2 border-gold hover:bg-gold hover:text-gray-900 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard
              title="Event Rentals"
              description="High-quality tables, chairs, linens, and décor for any occasion"
              href="/inventory"
            />
            <ServiceCard
              title="Curated Packages"
              description="Pre-designed packages to simplify your event planning"
              href="/packages"
            />
            <ServiceCard
              title="Event Planning"
              description="Professional planning services to bring your vision to life"
              href="/event-planning"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose True North?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon="✓" title="Quality Equipment" description="Well-maintained, modern inventory" />
            <FeatureCard icon="⚡" title="Fast Setup" description="Professional delivery and setup services" />
            <FeatureCard icon="💰" title="Competitive Pricing" description="Transparent pricing with no hidden fees" />
            <FeatureCard icon="🎯" title="Local Expertise" description="Serving Scarborough and the GTA" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-gold-dark to-gold">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Plan Your Perfect Event?
          </h2>
          <p className="text-xl text-gray-800 mb-8">
            Contact us today for a free consultation and quote
          </p>
          <Link
            href="/contact"
            className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}

function ServiceCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link href={href} className="block p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow border border-gray-200">
      <h3 className="text-2xl font-semibold mb-3 text-gold">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <span className="inline-block mt-4 text-gold-dark font-medium">Learn More →</span>
    </Link>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

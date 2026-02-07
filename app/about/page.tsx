import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | True North Party Rentals',
  description: 'Learn about True North Party Rentals - Scarborough\'s trusted event rental company with years of experience creating unforgettable events.',
}

export default function AboutPage() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">About True North Party Rentals</h1>
        
        {/* Company Story */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4 text-gold">Our Story</h2>
          <div className="prose prose-lg text-gray-700">
            <p className="mb-4">
              True North Party Rentals was founded with a simple mission: to help people create 
              unforgettable events without the stress and hassle of coordinating multiple vendors 
              and managing countless details.
            </p>
            <p className="mb-4">
              Based in Scarborough, we&apos;ve been serving the Greater Toronto Area for years, building 
              a reputation for quality equipment, professional service, and genuine care for our 
              clients&apos; special moments.
            </p>
            <p className="mb-4">
              What started as a small inventory of tables and chairs has grown into a comprehensive 
              event rental and planning service. Today, we offer everything from intimate backyard 
              gatherings to large-scale corporate events, all with the same attention to detail 
              and commitment to excellence that defined our beginning.
            </p>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="mb-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-gold">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <ValueCard
              title="Quality First"
              description="We maintain our equipment to the highest standards and regularly update our inventory with the latest trends."
            />
            <ValueCard
              title="Customer Service"
              description="Your event is our priority. We're responsive, flexible, and dedicated to exceeding your expectations."
            />
            <ValueCard
              title="Transparency"
              description="Clear pricing, honest communication, and no hidden fees. You deserve to know exactly what you're getting."
            />
            <ValueCard
              title="Community Focus"
              description="As a local business, we're committed to serving our Scarborough community and supporting local events."
            />
          </div>
        </section>

        {/* What Sets Us Apart */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-gold">What Sets Us Apart</h2>
          <div className="space-y-4">
            <FeatureItem
              title="Extensive Inventory"
              description="From classic to contemporary, we have the equipment and décor to match any event style."
            />
            <FeatureItem
              title="Professional Team"
              description="Our experienced staff handles delivery, setup, and breakdown with efficiency and care."
            />
            <FeatureItem
              title="Flexible Packages"
              description="Choose from our curated packages or create a custom solution that fits your exact needs."
            />
            <FeatureItem
              title="Planning Support"
              description="Not sure where to start? Our event planning team can guide you through every step."
            />
            <FeatureItem
              title="Local Expertise"
              description="We know the Scarborough and GTA area, including venues, vendors, and local regulations."
            />
          </div>
        </section>

        {/* Service Area */}
        <section className="mb-16 bg-gold-light rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Service Area</h2>
          <p className="text-gray-800 mb-4">
            While we&apos;re proudly based in Scarborough, we serve clients throughout the Greater Toronto Area, including:
          </p>
          <ul className="grid md:grid-cols-2 gap-2 text-gray-800">
            <li className="flex items-center"><span className="text-gold-dark mr-2">•</span> Scarborough</li>
            <li className="flex items-center"><span className="text-gold-dark mr-2">•</span> North York</li>
            <li className="flex items-center"><span className="text-gold-dark mr-2">•</span> Markham</li>
            <li className="flex items-center"><span className="text-gold-dark mr-2">•</span> Pickering</li>
            <li className="flex items-center"><span className="text-gold-dark mr-2">•</span> Ajax</li>
            <li className="flex items-center"><span className="text-gold-dark mr-2">•</span> Whitby</li>
          </ul>
          <p className="text-gray-800 mt-4">
            Need service outside this area? Contact us - we&apos;re often able to accommodate special requests!
          </p>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">Let&apos;s Create Something Amazing Together</h2>
          <p className="text-xl text-gray-600 mb-6">
            Ready to start planning your event?
          </p>
          <a
            href="/contact"
            className="inline-block bg-gold hover:bg-gold-dark text-gray-900 font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Get in Touch
          </a>
        </section>
      </div>
    </div>
  )
}

function ValueCard({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start">
      <span className="text-gold text-2xl mr-3">✓</span>
      <div>
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}

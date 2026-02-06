import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Event Planning Services | True North Party Rentals',
  description: 'Professional event planning services for all occasions. Let our experienced team bring your vision to life.',
}

export default function EventPlanningPage() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">Event Planning Services</h1>
        <p className="text-xl text-gray-600 mb-12">
          Let our experienced team transform your vision into an unforgettable event
        </p>

        {/* Services */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-4 text-gold">Full-Service Planning</h2>
            <p className="text-gray-600 mb-6">
              Comprehensive planning from concept to completion. We handle every detail so you can enjoy your event stress-free.
            </p>
            <ul className="space-y-3">
              <ServiceItem text="Initial consultation & vision development" />
              <ServiceItem text="Venue selection & coordination" />
              <ServiceItem text="Vendor management" />
              <ServiceItem text="Timeline & budget creation" />
              <ServiceItem text="Design & décor planning" />
              <ServiceItem text="Day-of coordination" />
              <ServiceItem text="Post-event breakdown" />
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-4 text-gold">Partial Planning</h2>
            <p className="text-gray-600 mb-6">
              Need help with specific aspects of your event? We offer flexible planning services tailored to your needs.
            </p>
            <ul className="space-y-3">
              <ServiceItem text="Design consultation" />
              <ServiceItem text="Vendor recommendations" />
              <ServiceItem text="Timeline creation" />
              <ServiceItem text="Rental coordination" />
              <ServiceItem text="Setup supervision" />
              <ServiceItem text="Day-of assistance" />
            </ul>
          </div>
        </div>

        {/* Event Types */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-center">Events We Plan</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <EventTypeCard title="Weddings" description="From intimate ceremonies to grand celebrations" />
            <EventTypeCard title="Corporate Events" description="Meetings, conferences, and team building" />
            <EventTypeCard title="Birthdays" description="Milestone celebrations for all ages" />
            <EventTypeCard title="Anniversaries" description="Romantic celebrations and vow renewals" />
            <EventTypeCard title="Graduations" description="Celebrate academic achievements" />
            <EventTypeCard title="Special Occasions" description="Baby showers, engagements, and more" />
          </div>
        </div>

        {/* Process */}
        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-4xl font-bold mb-8 text-center">Our Planning Process</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <ProcessStep
              number="1"
              title="Consultation"
              description="We meet to discuss your vision, budget, and requirements"
            />
            <ProcessStep
              number="2"
              title="Planning"
              description="We create a detailed plan and coordinate all vendors"
            />
            <ProcessStep
              number="3"
              title="Preparation"
              description="We handle all logistics and finalize every detail"
            />
            <ProcessStep
              number="4"
              title="Execution"
              description="We manage your event from start to finish"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-gold-dark to-gold p-12 rounded-lg">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Start Planning?</h2>
          <p className="text-xl text-gray-800 mb-8">
            Schedule a free consultation to discuss your event
          </p>
          <Link
            href="/contact"
            className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Book Consultation
          </Link>
        </div>
      </div>
    </div>
  )
}

function ServiceItem({ text }: { text: string }) {
  return (
    <li className="flex items-start text-gray-700">
      <span className="text-gold mr-2 font-bold">✓</span>
      {text}
    </li>
  )
}

function EventTypeCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
      <h3 className="text-2xl font-semibold mb-2 text-gold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function ProcessStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="inline-block bg-gold text-gray-900 font-bold text-2xl w-12 h-12 rounded-full flex items-center justify-center mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

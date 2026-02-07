import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us | True North Party Rentals',
  description: 'Get in touch with True North Party Rentals. Contact us for quotes, inquiries, or to discuss your upcoming event.',
}

export default function ContactPage() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 text-center">Contact Us</h1>
        <p className="text-xl text-gray-600 mb-12 text-center">
          Let&apos;s discuss your event and how we can help make it unforgettable
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gold">Get in Touch</h2>
            
            <div className="space-y-6 mb-8">
              <ContactItem
                icon="📞"
                title="Phone"
                content={
                  <a href="tel:+14165551234" className="text-gold-dark hover:text-gold transition-colors">
                    (416) 555-1234
                  </a>
                }
              />
              <ContactItem
                icon="📧"
                title="Email"
                content={
                  <a href="mailto:info@truenorthpartyrentals.com" className="text-gold-dark hover:text-gold transition-colors">
                    info@truenorthpartyrentals.com
                  </a>
                }
              />
              <ContactItem
                icon="📍"
                title="Location"
                content="Scarborough, Ontario"
              />
              <ContactItem
                icon="🕒"
                title="Hours"
                content={
                  <div>
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: By appointment</p>
                  </div>
                }
              />
            </div>

            {/* Social Media */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <SocialLink href="https://facebook.com" label="Facebook" />
                <SocialLink href="https://instagram.com" label="Instagram" />
                <SocialLink href="https://linkedin.com" label="LinkedIn" />
              </div>
            </div>

            {/* Quick Info */}
            <div className="mt-8 bg-gold-light rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Quick Response Times</h3>
              <p className="text-gray-800">
                We typically respond to inquiries within 24 hours during business days. 
                For urgent requests, please call us directly.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg">
              <h2 className="text-3xl font-bold mb-6 text-gold">Send Us a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <InfoCard
            title="Request a Quote"
            description="Fill out the contact form with your event details and we'll provide a customized quote within 24 hours."
          />
          <InfoCard
            title="Schedule a Consultation"
            description="Book a free consultation to discuss your event in detail and explore our inventory."
          />
          <InfoCard
            title="Emergency Service"
            description="Need last-minute rentals? Call us directly - we'll do our best to accommodate urgent requests."
          />
        </div>
      </div>
    </div>
  )
}

function ContactItem({ icon, title, content }: { icon: string; title: string; content: React.ReactNode }) {
  return (
    <div className="flex items-start">
      <span className="text-3xl mr-4">{icon}</span>
      <div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <div className="text-gray-700">{content}</div>
      </div>
    </div>
  )
}

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-gold hover:bg-gold-dark text-gray-900 font-semibold px-4 py-2 rounded transition-colors"
    >
      {label}
    </a>
  )
}

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold mb-3 text-gold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

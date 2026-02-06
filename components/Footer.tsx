import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              True North <span className="text-gold">Party Rentals</span>
            </h3>
            <p className="text-gray-400 mb-4">
              Creating unforgettable events in Scarborough and the GTA since [Year].
            </p>
            <div className="flex space-x-4">
              <SocialIcon href="https://facebook.com" label="Facebook" />
              <SocialIcon href="https://instagram.com" label="Instagram" />
              <SocialIcon href="https://linkedin.com" label="LinkedIn" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold">Quick Links</h4>
            <ul className="space-y-2">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/inventory">Inventory</FooterLink>
              <FooterLink href="/packages">Packages</FooterLink>
              <FooterLink href="/about">About Us</FooterLink>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold">Services</h4>
            <ul className="space-y-2">
              <FooterLink href="/event-planning">Event Planning</FooterLink>
              <FooterLink href="/corporate">Corporate Events</FooterLink>
              <FooterLink href="/contact">Get a Quote</FooterLink>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="tel:+14165551234" className="hover:text-gold transition-colors">
                  (416) 555-1234
                </a>
              </li>
              <li>
                <a href="mailto:info@truenorthpartyrentals.com" className="hover:text-gold transition-colors">
                  info@truenorthpartyrentals.com
                </a>
              </li>
              <li>Scarborough, Ontario</li>
              <li className="mt-4">
                <Link href="/contact" className="text-gold hover:text-gold-light transition-colors">
                  Contact Us →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} True North Party Rentals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-gray-400 hover:text-gold transition-colors">
        {children}
      </Link>
    </li>
  )
}

function SocialIcon({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-gold transition-colors"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
      <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gold-dark transition-colors">
        {label.charAt(0)}
      </div>
    </a>
  )
}

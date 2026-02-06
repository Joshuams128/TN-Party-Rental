'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">
              True North <span className="text-gold">Party Rentals</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/inventory">Inventory</NavLink>
            <NavLink href="/packages">Packages</NavLink>
            <NavLink href="/event-planning">Event Planning</NavLink>
            <NavLink href="/corporate">Corporate</NavLink>
            <NavLink href="/about">About</NavLink>
            <Link
              href="/contact"
              className="bg-gold hover:bg-gold-dark text-gray-900 font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-gold"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </MobileNavLink>
              <MobileNavLink href="/inventory" onClick={() => setMobileMenuOpen(false)}>
                Inventory
              </MobileNavLink>
              <MobileNavLink href="/packages" onClick={() => setMobileMenuOpen(false)}>
                Packages
              </MobileNavLink>
              <MobileNavLink href="/event-planning" onClick={() => setMobileMenuOpen(false)}>
                Event Planning
              </MobileNavLink>
              <MobileNavLink href="/corporate" onClick={() => setMobileMenuOpen(false)}>
                Corporate
              </MobileNavLink>
              <MobileNavLink href="/about" onClick={() => setMobileMenuOpen(false)}>
                About
              </MobileNavLink>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-gold hover:bg-gold-dark text-gray-900 font-semibold px-6 py-2 rounded-lg transition-colors text-center"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-gray-700 hover:text-gold transition-colors font-medium"
    >
      {children}
    </Link>
  )
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-gray-700 hover:text-gold transition-colors font-medium px-4 py-2"
    >
      {children}
    </Link>
  )
}

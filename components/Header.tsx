'use client'

import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-black via-[var(--color-gray-dark)] to-black text-white fixed w-full top-0 z-50 shadow-2xl border-b border-[var(--color-gold)] border-opacity-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="hover:opacity-90 transition-all duration-300">
              <Image
                src="/images/logo.png"
                alt="True North Party Rentals"
                width={240}
                height={80}
                className="h-16 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="relative hover:text-[var(--color-gold)] transition-all duration-300 group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-gold)] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/inventory" className="relative hover:text-[var(--color-gold)] transition-all duration-300 group">
              Inventory
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-gold)] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/packages" className="relative hover:text-[var(--color-gold)] transition-all duration-300 group">
              Packages
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-gold)] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/event-planning" className="relative hover:text-[var(--color-gold)] transition-all duration-300 group">
              Event Planning
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-gold)] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/corporate" className="relative hover:text-[var(--color-gold)] transition-all duration-300 group">
              Corporate
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-gold)] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/entertainment" className="relative hover:text-[var(--color-gold)] transition-all duration-300 group">
              Entertainment
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-gold)] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/about" className="relative hover:text-[var(--color-gold)] transition-all duration-300 group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-gold)] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/#contact" className="bg-[var(--color-gold)] text-black px-6 py-2 rounded-full font-semibold hover:bg-[var(--color-gold-light)] hover:shadow-lg hover:scale-105 transition-all duration-300">
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white hover:text-[var(--color-gold)] transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-3 animate-fade-in">
            <Link href="/" onClick={closeMenu} className="block w-full text-left py-3 px-4 hover:bg-[var(--color-gold)] hover:bg-opacity-10 rounded-lg hover:text-[var(--color-gold)] transition-all duration-300">
              Home
            </Link>
            <Link href="/inventory" onClick={closeMenu} className="block w-full text-left py-3 px-4 hover:bg-[var(--color-gold)] hover:bg-opacity-10 rounded-lg hover:text-[var(--color-gold)] transition-all duration-300">
              Inventory
            </Link>
            <Link href="/packages" onClick={closeMenu} className="block w-full text-left py-3 px-4 hover:bg-[var(--color-gold)] hover:bg-opacity-10 rounded-lg hover:text-[var(--color-gold)] transition-all duration-300">
              Packages
            </Link>
            <Link href="/event-planning" onClick={closeMenu} className="block w-full text-left py-3 px-4 hover:bg-[var(--color-gold)] hover:bg-opacity-10 rounded-lg hover:text-[var(--color-gold)] transition-all duration-300">
              Event Planning
            </Link>
            <Link href="/corporate" onClick={closeMenu} className="block w-full text-left py-3 px-4 hover:bg-[var(--color-gold)] hover:bg-opacity-10 rounded-lg hover:text-[var(--color-gold)] transition-all duration-300">
              Corporate
            </Link>
            <Link href="/entertainment" onClick={closeMenu} className="block w-full text-left py-3 px-4 hover:bg-[var(--color-gold)] hover:bg-opacity-10 rounded-lg hover:text-[var(--color-gold)] transition-all duration-300">
              Entertainment
            </Link>
            <Link href="/about" onClick={closeMenu} className="block w-full text-left py-3 px-4 hover:bg-[var(--color-gold)] hover:bg-opacity-10 rounded-lg hover:text-[var(--color-gold)] transition-all duration-300">
              About
            </Link>
            <Link href="/#contact" onClick={closeMenu} className="block w-full text-left py-3 px-4 bg-[var(--color-gold)] text-black rounded-lg font-semibold hover:bg-[var(--color-gold-light)] transition-all duration-300">
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;

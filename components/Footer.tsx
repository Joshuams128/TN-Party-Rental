'use client'

import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-black via-[var(--color-gray-dark)] to-black text-white py-16 border-t border-[var(--color-gold)]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h3 className="text-3xl font-bold mb-3">
              <span className="gold-gradient-text">True North</span> <span className="text-white">Party Rentals</span>
            </h3>
            <p className="text-gray-400 text-lg">Making your events unforgettable</p>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-3 text-gray-400">
              <span>Crafted with</span>
              <Heart size={16} className="text-[var(--color-gold)] fill-[var(--color-gold)] animate-pulse" />
              <span>in Scarborough</span>
            </div>
          </div>
          <div className="text-center md:text-right">
            <div className="flex flex-col gap-2">
              <p className="text-gray-300 text-lg">📍 Scarborough, Ontario</p>
              <p className="text-gray-400">Serving the Greater Toronto Area</p>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--color-gold)]/30 to-transparent my-2"></div>
              <p className="text-gray-500 text-sm">© 2026 True North Party Rentals</p>
              <p className="text-gray-500 text-sm">All rights reserved.</p>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-[var(--color-gold)]/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <button className="hover:text-[var(--color-gold)] transition-colors">Privacy Policy</button>
              <span className="text-gray-600">•</span>
              <button className="hover:text-[var(--color-gold)] transition-colors">Terms of Service</button>
              <span className="text-gray-600">•</span>
              <button className="hover:text-[var(--color-gold)] transition-colors">Rental Agreement</button>
            </div>
            <div className="flex gap-4">
              <button className="w-10 h-10 rounded-full bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30 flex items-center justify-center hover:bg-[var(--color-gold)] hover:scale-110 transition-all duration-300 group">
                <span className="text-[var(--color-gold)] group-hover:text-black transition-colors">f</span>
              </button>
              <button className="w-10 h-10 rounded-full bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30 flex items-center justify-center hover:bg-[var(--color-gold)] hover:scale-110 transition-all duration-300 group">
                <span className="text-[var(--color-gold)] group-hover:text-black transition-colors">in</span>
              </button>
              <button className="w-10 h-10 rounded-full bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30 flex items-center justify-center hover:bg-[var(--color-gold)] hover:scale-110 transition-all duration-300 group">
                <span className="text-[var(--color-gold)] group-hover:text-black transition-colors">📷</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

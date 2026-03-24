'use client';

import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[var(--color-gray-dark)] to-black flex flex-col items-center justify-center text-center px-4">
      <div className="bg-gradient-to-br from-[var(--color-gray-dark)] to-black p-12 rounded-3xl border-2 border-[var(--color-gold)]/40 shadow-2xl max-w-lg">
        <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-black" size={48} />
        </div>
        
        <h1 className="text-4xl font-bold text-[var(--color-gold)] mb-4">
          Purchase Successful! 🎉
        </h1>
        
        <p className="text-lg text-gray-300 mb-8">
          Thank you for your purchase! You will receive a confirmation email shortly with your ticket details.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/tn-social" 
            className="bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-8 py-4 rounded-full font-bold hover:shadow-xl hover:shadow-[var(--color-gold)]/30 transition-all duration-300 transform hover:scale-105"
          >
            Back to Events
          </Link>
          <Link 
            href="/" 
            className="border-2 border-[var(--color-gold)] text-[var(--color-gold)] px-8 py-4 rounded-full font-bold hover:bg-[var(--color-gold)] hover:text-black transition-all duration-300"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

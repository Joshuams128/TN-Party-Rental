'use client'

import Image from 'next/image';
import Link from 'next/link';

export default function EntertainmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[var(--color-gray-dark)] to-black flex flex-col items-center justify-center text-white">
      <div className="max-w-2xl w-full mx-auto text-center py-24">
        <div className="mb-8 pt-24 sm:pt-32">
          <h1 className="text-5xl font-bold gold-gradient-text mb-4">Entertainment</h1>
          <p className="text-xl text-gray-300 mb-6">Coming Soon</p>
          <p className="text-lg text-gray-400 mb-8">This page will showcase upcoming events and venues available for rent. Stay tuned for exciting updates!</p>
        </div>
        <div className="relative w-full h-96 rounded-2xl overflow-hidden mx-auto shadow-2xl border-2 border-[var(--color-gold)]">
          <Image
            src="/images/eventspace.jpeg"
            alt="Event Space Preview"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="mt-12">
          <Link href="/" className="inline-block bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-10 py-4 rounded-full text-lg font-bold hover:shadow-2xl hover:shadow-[var(--color-gold)]/50 transition-all duration-300 transform hover:scale-105">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { ChevronDown, ImageIcon } from 'lucide-react';

const venues = [
  {
    id: 'galaxy-event-space',
    name: 'Galaxy Event Space',
    image: '',
    description:
      'A premium event space perfect for private parties, celebrations, and corporate gatherings. Featuring elegant décor, versatile layouts, and full event support from the True North team.',
  },
  {
    id: 'basketball-court-morningside',
    name: 'Basketball Court at Morningside',
    image: '',
    description:
      'An indoor basketball court venue ideal for sports events, tournaments, birthday parties, and community gatherings. Spacious layout with seating and amenities.',
  },
];

export default function TNSocialPage() {
  const [selectedVenue, setSelectedVenue] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    notes: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBook = (venueId: string) => {
    setSelectedVenue(venueId);
    document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          eventType: 'Venue Booking',
          eventDate: formData.eventDate,
          guestCount: '',
          message: formData.notes || 'No additional notes.',
          addedItems: [
            {
              category: 'Venue Booking',
              name: venues.find((v) => v.id === selectedVenue)?.name || selectedVenue,
              variants: [],
            },
          ],
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', eventDate: '', notes: '' });
        setSelectedVenue('');
      } else {
        const data = await response.json();
        setStatus('error');
        setErrorMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[var(--color-gray-dark)] to-black text-white">
      {/* Hero */}
      <section className="pt-32 pb-16 text-center px-4">
        <h1 className="text-5xl font-bold gold-gradient-text mb-4">TN Social</h1>
        <p className="text-xl text-gray-300 mb-2">Venue Bookings</p>
        <p className="text-gray-400 max-w-xl mx-auto">
          Explore our premier venues and book the perfect space for your next event.
        </p>
      </section>

      {/* Venue Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="bg-gradient-to-br from-[var(--color-gray-dark)] to-black rounded-2xl overflow-hidden border-2 border-[var(--color-gold)]/40 shadow-2xl flex flex-col"
            >
              {/* Image */}
              <div className="relative h-64 w-full bg-black">
                {venue.image ? (
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <ImageIcon size={48} className="text-[var(--color-gold)] opacity-50" />
                    <span className="text-sm text-gray-500 font-medium">Image Coming Soon</span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-[var(--color-gold)] mb-3">{venue.name}</h3>
                <p className="text-gray-300 mb-6 flex-grow">{venue.description}</p>
                <button
                  onClick={() => handleBook(venue.id)}
                  className="w-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-8 py-4 rounded-full text-lg font-bold hover:shadow-xl hover:shadow-[var(--color-gold)]/30 transition-all duration-300 transform hover:scale-105"
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking-form" className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-2xl border-2 border-[var(--color-gold)]/30">
          <h2 className="text-3xl font-bold text-black mb-2 text-center">Book a Venue</h2>
          <div className="h-1 w-16 bg-gradient-to-r from-[var(--color-gold)] to-transparent mx-auto mb-8" />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Venue Select */}
            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">
                Select Venue *
              </label>
              <div className="relative">
                <select
                  id="venue"
                  required
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent appearance-none text-black"
                >
                  <option value="">Choose a venue</option>
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent text-black"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent text-black"
                placeholder="john@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent text-black"
                placeholder="(416) 555-1234"
              />
            </div>

            {/* Event Date */}
            <div>
              <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
                Desired Date *
              </label>
              <input
                type="date"
                id="eventDate"
                name="eventDate"
                required
                value={formData.eventDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent text-black"
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent text-black"
                placeholder="Tell us about your event, guest count, special requirements..."
              />
            </div>

            {/* Status Messages */}
            {status === 'success' && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                Thank you! Your booking request has been submitted. We&apos;ll contact you within 24 hours.
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {errorMessage}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black font-bold px-8 py-4 rounded-full text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? 'Submitting...' : 'Submit Booking Request'}
            </button>
          </form>
        </div>
      </section>

      {/* Back Link */}
      <div className="text-center pb-16">
        <Link
          href="/"
          className="inline-block border-2 border-[var(--color-gold)] text-[var(--color-gold)] px-10 py-4 rounded-full text-lg font-bold hover:bg-[var(--color-gold)] hover:text-black transition-all duration-300 transform hover:scale-105"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

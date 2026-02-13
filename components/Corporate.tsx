'use client';

import { Building2, Users, Presentation, Coffee, Award, CheckCircle, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';

const packages = [
  {
    name: 'Essential',
    price: 'Starting at $499',
    description: 'Perfect for small team meetings and presentations',
    attendees: 'Up to 25 attendees',
    features: [
      'Professional folding chairs',
      'Standard tables (6ft)',
      'Basic white linens',
      'Podium with microphone',
      'Basic audio system',
      'Setup & breakdown'
    ]
  },
  {
    name: 'Professional',
    price: 'Starting at $1,299',
    description: 'Ideal for conferences and corporate gatherings',
    attendees: 'Up to 100 attendees',
    features: [
      'Premium chiavari chairs',
      'Conference tables with skirting',
      'Custom color linens',
      'Stage platform',
      'Advanced audio/visual system',
      'Podium & presentation equipment',
      'Cocktail tables for networking',
      'Custom balloon decorations',
      'Setup, coordination & breakdown'
    ],
    popular: true
  },
  {
    name: 'Executive',
    price: 'Starting at $2,999',
    description: 'For large-scale events and galas',
    attendees: 'Up to 300+ attendees',
    features: [
      'Luxury seating arrangements',
      'Custom table configurations',
      'Premium designer linens',
      'Complete stage setup with backdrop',
      'Professional lighting system',
      'Full audio/visual suite',
      'Lounge furniture areas',
      'Premium balloon installations',
      '360° Camera Experience',
      'Mirror Photo Booth',
      'Complete event coordination team',
      'Setup, management & breakdown'
    ]
  }
];

const eventTypes = [
  {
    icon: Presentation,
    title: 'Corporate Conferences',
    description: 'Professional setups for presentations, seminars, and training sessions'
  },
  {
    icon: Users,
    title: 'Team Building Events',
    description: 'Create memorable experiences that bring your team together'
  },
  {
    icon: Coffee,
    title: 'Networking Events',
    description: 'Elegant spaces for professional connections and business relationships'
  },
  {
    icon: Award,
    title: 'Award Ceremonies',
    description: 'Celebrate achievements with style and sophistication'
  }
];

export function Corporate() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-black via-[var(--color-gray-dark)] to-black text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-gold)] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[var(--color-gold)] opacity-5 rounded-full blur-3xl"></div>
        
        {/* Animated overlay */}
        <div className="absolute inset-0 animate-shimmer"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-block mb-4">
                <span className="text-sm font-bold text-[var(--color-gold)] bg-[var(--color-gold)]/10 px-4 py-2 rounded-full border border-[var(--color-gold)]/30">
                  FOR BUSINESSES
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="gold-gradient-text">Corporate</span> Event Solutions
              </h1>
              <div className="h-1 w-20 bg-gradient-to-r from-[var(--color-gold)] to-transparent mb-8"></div>
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                Elevate your corporate events with professional equipment and exceptional service designed for business excellence.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed mb-8">
                From intimate board meetings to large-scale conferences, we provide everything you need to create a lasting impression.
              </p>
              <Link href="/#contact" className="group relative inline-block bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-12 py-5 rounded-full text-lg font-bold hover:shadow-2xl hover:shadow-[var(--color-gold)]/50 transition-all duration-300 transform hover:scale-110 overflow-hidden">
                <span className="relative z-10">Request Corporate Quote</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] opacity-20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-[var(--color-gray-dark)] to-[var(--color-gray-medium)] p-8 rounded-3xl border-2 border-[var(--color-gold)]/30">
                <div className="relative h-80 w-full overflow-hidden rounded-2xl">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1511578314322-379afb476865?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBldmVudHxlbnwxfHx8fDE3Mzg0NDU1MDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Corporate event setup"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-black">
              Corporate Event <span className="gold-gradient-text">Expertise</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We specialize in a wide range of corporate events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {eventTypes.map((type, index) => (
              <div
                key={index}
                className="group relative bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-[var(--color-gold)] shadow-smooth hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <type.icon className="text-black" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[var(--color-gold)]">
                  {type.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-24 bg-gradient-to-b from-[var(--color-gray-light)] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-black">
              Corporate <span className="gold-gradient-text">Packages</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our tailored packages or customize to your exact specifications
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-smooth hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-[var(--color-gold)] flex flex-col h-full"
              >
                {pkg.popular && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg z-10">
                    ⭐ MOST POPULAR
                  </div>
                )}

                <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] p-8 text-black">
                  <h3 className="text-3xl font-bold mb-2">{pkg.name}</h3>
                  <p className="text-black/80 mb-4">{pkg.description}</p>
                  <div className="text-2xl font-bold mb-1">{pkg.price}</div>
                  <div className="text-sm text-black/70">{pkg.attendees}</div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <ul className="space-y-4 mb-8 flex-1">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="text-[var(--color-gold)] flex-shrink-0 mt-1" size={20} />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/#contact" className="block w-full text-center bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-8 py-4 rounded-full text-lg font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105 mt-auto">
                    Get Quote
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-black via-[var(--color-gray-dark)] to-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Building2 className="text-[var(--color-gold)] mx-auto mb-6" size={64} />
          <h2 className="text-5xl font-bold mb-6">
            Ready to Plan Your <span className="gold-gradient-text">Corporate Event?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Let our experienced team help you create a professional, memorable event that reflects your brand&apos;s excellence.
          </p>
          <Link 
            href="/#contact"
            className="group relative inline-block bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-12 py-5 rounded-full text-lg font-bold hover:shadow-2xl hover:shadow-[var(--color-gold)]/50 transition-all duration-300 transform hover:scale-110 overflow-hidden"
          >
            <span className="relative z-10">Contact Our Corporate Team</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </Link>
        </div>
      </section>
    </div>
  );
}

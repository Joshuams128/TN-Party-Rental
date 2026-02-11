'use client'

import { Check, Sparkles, Heart, Briefcase, PartyPopper, Users } from 'lucide-react';
import Link from 'next/link';

const packages = [
  {
    id: 'intimate',
    name: 'Intimate Gathering',
    subtitle: 'Perfect for small celebrations',
    price: 'Starting at $499',
    icon: Heart,
    color: 'from-rose-400 to-pink-500',
    guests: 'Up to 25 guests',
    features: [
      '2 x 6ft rectangular tables',
      '25 folding chairs',
      'Basic table linens (choice of color)',
      '25 place settings (plates, glasses, flatware)',
      'Setup and teardown included',
      'Delivery within 10km',
    ],
    addons: [
      'Balloon garland (+$150)',
      'Basic sound system (+$100)',
    ]
  },
  {
    id: 'celebration',
    name: 'Celebration Package',
    subtitle: 'Most popular for parties & events',
    price: 'Starting at $1,299',
    icon: PartyPopper,
    color: 'from-[var(--color-gold)] to-[var(--color-gold-light)]',
    guests: '50-75 guests',
    popular: true,
    features: [
      '6 x 60" round tables',
      '75 chiavari chairs with cushions',
      'Premium table linens & runners',
      '75 place settings (premium dishware)',
      '10x20 tent with sidewalls',
      'String lighting',
      'Setup and teardown included',
      'Delivery within 25km',
      'Dedicated event coordinator',
    ],
    addons: [
      '360° Camera Experience (+$500)',
      'Magic Mirror Photo Booth (+$600)',
      'Custom balloon arch (+$300)',
    ]
  },
  {
    id: 'premium',
    name: 'Premium Wedding',
    subtitle: 'Everything for your dream wedding',
    price: 'Starting at $2,999',
    icon: Sparkles,
    color: 'from-purple-400 to-pink-400',
    guests: '100-150 guests',
    features: [
      '15 x 60" round tables',
      '150 chiavari chairs with cushions',
      'Luxury linens in your wedding colors',
      '150 premium place settings',
      '20x40 tent with elegant draping',
      'Dance floor (12x12)',
      'Ambient lighting package',
      'Cocktail tables & lounge furniture',
      'Ceremony seating setup',
      'Complete bar setup',
      'Setup and teardown included',
      'Delivery anywhere in GTA',
      'Dedicated event coordinator',
      'Day-of assistance',
    ],
    addons: [
      '360° Camera + Magic Mirror Bundle (+$900)',
      'Custom balloon installation (+$500)',
      'Upgraded lighting (+$300)',
    ]
  },
  {
    id: 'corporate',
    name: 'Corporate Event',
    subtitle: 'Professional events made easy',
    price: 'Starting at $1,799',
    icon: Briefcase,
    color: 'from-blue-400 to-indigo-400',
    guests: '75-100 guests',
    features: [
      'Conference tables or rounds (your choice)',
      '100 professional seating',
      'Branded table linens available',
      'Complete AV system with microphones',
      'Projector & screen',
      'Professional lighting',
      '15x30 tent (if outdoor)',
      'Networking area furniture',
      'Beverage station setup',
      'Setup and teardown included',
      'Delivery within GTA',
      'On-site tech support',
    ],
    addons: [
      '360° Camera branded experience (+$600)',
      'Additional AV equipment',
      'Custom staging (+$500)',
    ]
  },
  {
    id: 'ultimate',
    name: 'Ultimate Experience',
    subtitle: 'The complete True North package',
    price: 'Custom Quote',
    icon: Users,
    color: 'from-amber-400 to-yellow-400',
    guests: '150+ guests',
    featured: true,
    features: [
      'All furniture & seating needed',
      'Custom tent sizing',
      'Complete lighting design',
      'Premium sound system',
      '360° Camera Experience INCLUDED',
      'Magic Mirror Photo Booth INCLUDED',
      'Custom balloon installation INCLUDED',
      'Dance floor (any size)',
      'Lounge areas & cocktail spaces',
      'Full bar setup',
      'All dishware, glassware, flatware',
      'Luxury linens in custom colors',
      'Complete setup & teardown',
      'Delivery anywhere in Ontario',
      'Dedicated event team',
      'Day-of coordination & support',
    ],
    addons: [
      'Custom requests accommodated',
      'Additional entertainment',
      'Specialty furniture',
    ]
  },
];

export function PackagesPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-black via-[var(--color-gray-dark)] to-black text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-gold)] opacity-10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-gold)] opacity-10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center animate-fade-in-up">
            <div className="inline-block mb-4">
              <span className="text-xs font-bold text-[var(--color-gold)] bg-[var(--color-gold)]/10 px-4 py-2 rounded-full border border-[var(--color-gold)]/30 backdrop-blur-sm">
                ✨ CURATED PACKAGES
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Event <span className="gold-gradient-text">Packages</span>
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent mx-auto mb-6"></div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Simplified event planning with carefully curated packages designed for every occasion
            </p>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-0 w-72 h-72 bg-[var(--color-gold)] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-0 w-72 h-72 bg-[var(--color-gold)] opacity-5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {packages.map((pkg, index) => (
              <div
                key={pkg.id}
                className={`group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 ${
                  pkg.popular || pkg.featured 
                    ? 'shadow-2xl border-2 border-[var(--color-gold)]' 
                    : 'shadow-lg border border-gray-200 hover:border-[var(--color-gold)] hover:shadow-2xl'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Popular/Featured Badge */}
                {(pkg.popular || pkg.featured) && (
                  <div className="absolute top-0 right-0 z-20">
                    <div className="bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black text-[10px] font-bold px-3 py-1.5 rounded-bl-lg shadow-lg">
                      {pkg.popular ? '⭐ MOST POPULAR' : '✨ FEATURED'}
                    </div>
                  </div>
                )}

                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${pkg.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}></div>

                {/* Header with Icon */}
                <div className="relative p-6 bg-gradient-to-br from-black via-[var(--color-gray-dark)] to-black text-white">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                      <p className="text-xs text-gray-300">{pkg.subtitle}</p>
                    </div>
                    <div className={`bg-gradient-to-br ${pkg.color} w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                      <pkg.icon className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-[var(--color-gold)]">{pkg.price}</span>
                    <span className="text-xs text-gray-400">{pkg.guests}</span>
                  </div>
                </div>

                {/* Package Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                      <Check className="text-[var(--color-gold)]" size={14} />
                      What&apos;s Included
                    </h4>
                    <ul className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-[var(--color-gold)] mt-0.5 flex-shrink-0">•</span>
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4 pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                      <Sparkles className="text-[var(--color-gold)]" size={14} />
                      Popular Add-ons
                    </h4>
                    <ul className="space-y-2">
                      {pkg.addons.map((addon, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                          <span className="text-[var(--color-gold)] mt-0.5">+</span>
                          <span className="leading-snug">{addon}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link 
                    href="/#contact"
                    className="block w-full text-center bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-6 py-3 rounded-xl text-sm font-bold hover:shadow-xl hover:shadow-[var(--color-gold)]/30 transition-all duration-300 transform hover:scale-105"
                  >
                    Request This Package
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Package CTA */}
          <div className="relative mt-12 bg-gradient-to-br from-black via-[var(--color-gray-dark)] to-black text-white rounded-3xl p-10 overflow-hidden shadow-2xl border border-[var(--color-gold)]/20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-gold)] opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-gold)] opacity-10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] rounded-2xl mb-6 shadow-lg">
                <Sparkles className="text-black" size={32} />
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold mb-4">
                Need a <span className="gold-gradient-text">Custom Package?</span>
              </h3>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Every event is unique. Let us create a custom package tailored specifically to your vision and budget.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/#contact"
                  className="group relative bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-10 py-4 rounded-full text-base font-bold hover:shadow-2xl hover:shadow-[var(--color-gold)]/50 transition-all duration-300 transform hover:scale-110 overflow-hidden"
                >
                  <span className="relative z-10">Build Your Custom Package</span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </Link>
                <Link 
                  href="/event-planning"
                  className="group relative glass-effect text-white border-2 border-[var(--color-gold)] px-10 py-4 rounded-full text-base font-bold hover:bg-[var(--color-gold)] hover:text-black transition-all duration-300 transform hover:scale-110"
                >
                  View Planning Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 bg-gradient-to-b from-[var(--color-gray-light)] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-black">
              Choose the <span className="gold-gradient-text">Perfect Package</span>
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Not sure which package is right for you? We&apos;re here to help guide your decision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-[var(--color-gold)] shadow-smooth hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] rounded-xl flex items-center justify-center mb-4 shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--color-gold)] transition-colors">Flexible Pricing</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                All packages are customizable. Add or remove items to fit your budget perfectly.
              </p>
            </div>

            <div className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-[var(--color-gold)] shadow-smooth hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] rounded-xl flex items-center justify-center mb-4 shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <span className="text-2xl">📞</span>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--color-gold)] transition-colors">Free Consultation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Talk to our team to discuss your needs and get personalized recommendations.
              </p>
            </div>

            <div className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-[var(--color-gold)] shadow-smooth hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] rounded-xl flex items-center justify-center mb-4 shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--color-gold)] transition-colors">Quality Guaranteed</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Premium equipment, professional service, and on-time delivery — every time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

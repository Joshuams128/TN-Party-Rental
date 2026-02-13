'use client'

import { Tent, Armchair, UtensilsCrossed, Music, Sparkles, PartyPopper, Camera, Video, Utensils, Wine, Lightbulb, Gift } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';
import Link from 'next/link';

const categories = [
  { id: 'all', name: 'All Items', icon: Gift },
  { id: 'signature', name: 'Signature', icon: Sparkles },
  { id: 'structures', name: 'Structures', icon: Tent },
  { id: 'furniture', name: 'Furniture', icon: Armchair },
  { id: 'tableware', name: 'Tableware', icon: Utensils },
  { id: 'entertainment', name: 'Entertainment', icon: Music },
];

const inventoryItems = [
  {
    id: 1,
    category: 'signature',
    name: '360° Camera Experience',
    description: 'State-of-the-art 360° slow-motion video booth with custom backdrops and instant social sharing',
    features: ['Slow-motion capture', 'Custom branding', 'Social media sharing', 'Professional lighting'],
    image: '/images/360.PNG',
    featured: true
  },
  {
    id: 2,
    category: 'signature',
    name: 'Mirror Photo Booth',
    description: 'Full-length interactive mirror with touchscreen interface, voice guidance, and instant prints',
    features: ['Touchscreen interface', 'Voice guidance', 'Instant prints', 'Digital gallery'],
    image: '/images/mirror.PNG',
    objectPosition: 'center 40%',
    featured: true
  },
  {
    id: 3,
    category: 'signature',
    name: 'Custom Balloon Decorations',
    description: 'Professional balloon artistry including arches, garlands, columns, and themed sculptures',
    features: ['Balloon arches', 'Garlands', 'Sculptures', 'Themed designs'],
    image: '/images/6.5ft.jpg',
    featured: true
  },
  {
    id: 4,
    category: 'structures',
    name: 'Event Tents & Canopies',
    description: 'Weather-proof tents in multiple sizes - from intimate 10x10 to large 40x60 structures',
    features: ['Multiple sizes', 'Weather-proof', 'Sidewalls available', 'Professional setup'],
    image: '/images/bigtent.png',
    featured: false
  },
  {
    id: 5,
    category: 'furniture',
    name: 'Tables - Round & Rectangular',
    description: 'Premium banquet tables in various sizes with professional-grade construction',
    features: ['60" & 72" rounds', '6ft & 8ft rectangles', 'Cocktail tables', 'Folding tables'],
    image: 'https://images.unsplash.com/photo-1677768061409-3d4fbd0250d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcmVjZXB0aW9uJTIwdGFibGVzfGVufDF8fHx8MTc2OTQ2Njk4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    featured: false
  },
  {
    id: 6,
    category: 'furniture',
    name: 'Chairs & Seating',
    description: 'Elegant seating options including chiavari, folding, and lounge furniture',
    features: ['Chiavari chairs', 'Folding chairs', 'Lounge furniture', 'Cushions available'],
    image: 'https://images.unsplash.com/photo-1759124650320-d629a3d73d9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJ0eSUyMGNoYWlycyUyMGV2ZW50fGVufDF8fHx8MTc2OTQ2Njk4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    featured: false
  },
  {
    id: 7,
    category: 'tableware',
    name: 'Linens & Table Covers',
    description: 'High-quality tablecloths, runners, and napkins in a wide range of colors',
    features: ['Multiple colors', 'Various sizes', 'Table runners', 'Cloth napkins'],
    image: null,
    featured: false
  },
  {
    id: 8,
    category: 'tableware',
    name: 'Dishware & Glassware',
    description: 'Complete place settings including plates, glasses, and flatware',
    features: ['Dinner plates', 'Wine glasses', 'Flatware sets', 'Serving platters'],
    image: null,
    featured: false
  },
  {
    id: 9,
    category: 'entertainment',
    name: 'Audio & Sound Systems',
    description: 'Professional PA systems, microphones, and speakers for any venue size',
    features: ['PA systems', 'Wireless mics', 'Speakers', 'Audio mixing'],
    image: null,
    featured: false
  },
  {
    id: 10,
    category: 'entertainment',
    name: 'Lighting & Ambiance',
    description: 'Uplighting, string lights, and decorative lighting to set the perfect mood',
    features: ['LED uplighting', 'String lights', 'Spotlights', 'Color options'],
    image: null,
    featured: false
  },
  {
    id: 11,
    category: 'structures',
    name: 'Dance Floors',
    description: 'Portable dance floors in various sizes with professional installation',
    features: ['Multiple sizes', 'Black & white', 'Professional install', 'Indoor/outdoor'],
    image: null,
    featured: false
  },
  {
    id: 12,
    category: 'tableware',
    name: 'Serving Equipment',
    description: 'Chafing dishes, beverage dispensers, and serving utensils',
    features: ['Chafing dishes', 'Beverage dispensers', 'Serving utensils', 'Coolers'],
    image: null,
    featured: false
  },
];

export function InventoryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredItems = selectedCategory === 'all' 
    ? inventoryItems 
    : inventoryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-black via-[var(--color-gray-dark)] to-black text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-gold)] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[var(--color-gold)] opacity-5 rounded-full blur-3xl"></div>
        
        {/* Animated overlay */}
        <div className="absolute inset-0 animate-shimmer"></div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 text-[var(--color-gold)] opacity-20 animate-float">
          <Sparkles size={40} />
        </div>
        <div className="absolute bottom-32 right-16 text-[var(--color-gold)] opacity-20 animate-float" style={{ animationDelay: '1s' }}>
          <Sparkles size={50} />
        </div>
        <div className="absolute top-40 right-24 text-[var(--color-gold)] opacity-20 animate-float" style={{ animationDelay: '2s' }}>
          <Sparkles size={30} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center animate-fade-in-up">
            <div className="inline-block mb-4">
              <span className="text-sm font-bold text-[var(--color-gold)] bg-[var(--color-gold)]/10 px-4 py-2 rounded-full border border-[var(--color-gold)]/30">
                FULL CATALOG
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Our Complete <span className="gold-gradient-text">Inventory</span>
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Browse our extensive collection of premium event rentals — from signature experiences to essential equipment
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 bg-white sticky top-20 z-40 shadow-lg border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`group flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <category.icon size={20} />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Inventory Grid */}
      <section className="py-20 bg-gradient-to-b from-white via-[var(--color-gray-light)] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-smooth hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-[var(--color-gold)]"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {item.featured && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)] via-[var(--color-gold-light)] to-[var(--color-gold)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl -z-10"></div>
                )}

                {item.image && (
                  <div className="h-56 overflow-hidden relative">
                    {item.featured && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black text-xs font-bold px-4 py-2 rounded-full z-10 shadow-lg">
                        ⭐ SIGNATURE
                      </div>
                    )}
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      style={item.objectPosition ? { objectPosition: item.objectPosition } : undefined}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-white text-lg font-bold">{item.name}</h3>
                    </div>
                  </div>
                )}

                <div className={`p-6 ${!item.image ? 'pt-12' : ''}`}>
                  {!item.image && item.featured && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                      ⭐ SIGNATURE
                    </div>
                  )}
                  
                  {!item.image && (
                    <h3 className="text-2xl font-bold mb-3 text-black">
                      {item.name}
                    </h3>
                  )}
                  <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-semibold text-gray-700">Features:</p>
                    <ul className="grid grid-cols-2 gap-2">
                      {item.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-1">
                          <span className="text-[var(--color-gold)] mt-1">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href="/#contact" className="block w-full text-center bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    Request Quote
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-black via-[var(--color-gray-dark)] to-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Need Something <span className="gold-gradient-text">Custom?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Don&apos;t see what you&apos;re looking for? We offer custom solutions for unique events and special requests.
          </p>
          <Link 
            href="/#contact"
            className="group relative inline-block bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-12 py-5 rounded-full text-lg font-bold hover:shadow-2xl hover:shadow-[var(--color-gold)]/50 transition-all duration-300 transform hover:scale-110 overflow-hidden"
          >
            <span className="relative z-10">Contact Us for Custom Quote</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </Link>
        </div>
      </section>
    </div>
  );
}

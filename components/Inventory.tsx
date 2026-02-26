'use client'

import { Tent, Armchair, Music, Sparkles, Utensils, Gift, X, Palette, Package, Menu } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';
import Link from 'next/link';

const categories = [
  { id: 'all', name: 'All Items', icon: Gift },
  { id: 'signature', name: 'Signature', icon: Sparkles },
  { id: 'packages', name: 'Packages', icon: Package },
  { id: 'decor', name: 'Décor', icon: Palette },
  { id: 'structures', name: 'Structures', icon: Tent },
  { id: 'furniture', name: 'Furniture', icon: Armchair },
  { id: 'tableware', name: 'Tableware', icon: Utensils },
  { id: 'entertainment', name: 'Entertainment', icon: Music },
];

const inventoryItems = [
  {
    id: 1,
    slug: '360-camera',
    category: 'signature',
    name: '360° Camera Experience',
    description: 'State-of-the-art 360° slow-motion video booth with custom backdrops and instant social sharing',
    features: ['Slow-motion capture', 'Custom branding', 'Social media sharing', 'Professional lighting'],
    image: '/images/360.PNG',
    featured: true
  },
  {
    id: 2,
    slug: 'mirror-photobooth',
    category: 'signature',
    name: 'Mirror Photo Booth',
    description: 'Full-length interactive mirror with touchscreen interface, voice guidance, and instant prints',
    features: ['Touchscreen interface', 'Voice guidance', 'Instant prints', 'Digital gallery'],
    image: '/images/mirrorp.png',
    objectPosition: 'center 40%',
    featured: true
  },
  {
    id: 3,
    slug: 'custom-balloons',
    category: 'signature',
    name: 'Custom Balloon Decorations',
    description: 'Professional balloon artistry including arches, garlands, columns, and themed sculptures',
    features: ['Balloon arches', 'Garlands', 'Sculptures', 'Themed designs'],
    image: '/images/Custom_Balloon_Decorations_Image.PNG',
    featured: true
  },
  {
    id: 13,
    slug: 'premium-packages',
    category: 'packages',
    name: 'Premium Packages',
    description: 'Curated all-in-one event packages for proposals, celebrations, and special occasions',
    features: ['Proposal packages', 'LED décor packages', 'Marquee setups', 'All-inclusive'],
    image: '/images/Home_Page_1.png',
    featured: true
  },
  {
    id: 14,
    slug: 'backdrop-packages',
    category: 'decor',
    name: 'Backdrop Packages',
    description: 'Stunning backdrop options for any theme — florals, characters, custom designs, and more',
    features: ['30+ themes available', 'Character backdrops', 'Floral designs', 'Custom wording'],
    image: '/images/eventspace.jpeg',
    featured: false
  },
  {
    id: 15,
    slug: 'marquee-letters',
    category: 'decor',
    name: 'Marquee Letters & Signs',
    description: 'Illuminated marquee letters, numbers, and neon signs to spell out your celebration',
    features: ['LED letters & numbers', 'Neon signs', 'Heart & ring shapes', 'Custom wording'],
    image: '/images/eventspace.jpeg',
    featured: false
  },
  {
    id: 16,
    slug: 'decor-props',
    category: 'decor',
    name: 'Décor & Props',
    description: 'Elegant props and décor pieces to elevate any event space with a personal touch',
    features: ['Cherry blossom trees', 'Rose hearts', 'White arches', 'Champagne walls'],
    image: '/images/eventspace.jpeg',
    featured: false
  },
  {
    id: 17,
    slug: 'carpet-ropes',
    category: 'decor',
    name: 'Carpet & Ropes',
    description: 'Make a grand entrance with red carpet and velvet rope packages for VIP-style arrivals',
    features: ['8ft red carpet', 'Velvet ropes', 'VIP entrance', 'Photo-ready'],
    image: '/images/eventspace.jpeg',
    featured: false
  },
  {
    id: 4,
    slug: 'event-tents',
    category: 'structures',
    name: 'Event Tents & Canopies',
    description: 'Weather-proof pop-up canopy tents in multiple sizes — perfect for outdoor events',
    features: ['Multiple sizes', 'Weather-proof', 'Sidewalls available', 'Professional setup'],
    image: '/images/bigtent.png',
    featured: false
  },
  {
    id: 11,
    slug: 'dance-floors',
    category: 'structures',
    name: 'Dance Floors',
    description: 'Portable dance floors in various sizes with professional installation',
    features: ['Multiple sizes', 'Black & white', 'Professional install', 'Indoor/outdoor'],
    image: '/images/dance.png',
    featured: false
  },
  {
    id: 18,
    slug: 'inflatables',
    category: 'structures',
    name: 'Inflatables & Bounce Houses',
    description: 'Fun and safe inflatable entertainment for kids and adults at any event',
    features: ['Bouncy houses', 'Inflatable igloos', 'Party houses', 'Safe & clean'],
    image: '/images/bigtent.png',
    featured: false
  },
  {
    id: 5,
    slug: 'tables-linens',
    category: 'furniture',
    name: 'Tables & Linens',
    description: 'Premium banquet tables in various sizes with professional-grade construction',
    features: ['60" & 72" rounds', '6ft & 8ft rectangles', 'Cocktail tables', 'Cake stands'],
    image: '/images/Tables_and_Linen_Image.png',
    featured: false
  },
  {
    id: 6,
    slug: 'chairs-seating',
    category: 'furniture',
    name: 'Chairs & Seating',
    description: 'Elegant seating options including chiavari, folding, throne, and lounge furniture',
    features: ['Chiavari chairs', 'Throne chairs', 'Folding chairs', 'LED benches'],
    image: '/images/Chairs_and_Seating_Image.png',
    featured: false
  },
  {
    id: 19,
    slug: 'linens-covers',
    category: 'furniture',
    name: 'Linens & Covers',
    description: 'Professional-grade tablecloths and chair covers in a variety of colours and sizes',
    features: ['Multiple colours', 'All table sizes', 'Chair covers', 'LED furniture'],
    image: '/images/Tables_and_Linen_Image.png',
    featured: false
  },
  {
    id: 8,
    slug: 'dishware',
    category: 'tableware',
    name: 'Dishware & Glassware',
    description: 'Complete place settings including plates, glasses, and flatware',
    features: ['Dinner plates', 'Wine glasses', 'Flatware sets', 'Serving platters'],
    image: '/images/dishware.png',
    featured: false
  },
  {
    id: 12,
    slug: 'serving-equipment',
    category: 'tableware',
    name: 'Serving Equipment',
    description: 'Chafing dishes, beverage dispensers, and serving utensils',
    features: ['Chafing dishes', 'Beverage dispensers', 'Serving utensils', 'Coolers'],
    image: '/images/serving.png',
    featured: false
  },
  {
    id: 10,
    slug: 'lighting',
    category: 'entertainment',
    name: 'Lighting & Ambiance',
    description: 'Uplighting, string lights, and decorative lighting to set the perfect mood',
    features: ['LED uplighting', 'String lights', 'Spotlights', 'Color options'],
    image: '/images/lighting.png',
    featured: false
  },
];

export function InventoryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filteredItems = selectedCategory === 'all' 
    ? inventoryItems 
    : inventoryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="pt-20">
      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-[var(--color-gold)] transition-colors z-50"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={selectedImage.src} 
            alt={selectedImage.alt}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-black via-[var(--color-gray-dark)] to-black text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-gold)] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[var(--color-gold)] opacity-5 rounded-full blur-3xl"></div>
        
        {/* Animated overlay */}
        <div className="absolute inset-0 animate-shimmer"></div>

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
          {/* Mobile Hamburger Menu */}
          <div className="md:hidden flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Filter by Category</h3>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Menu size={24} className="text-gray-700" />
            </button>
          </div>

          {/* Desktop Category Buttons */}
          <div className="hidden md:flex flex-wrap justify-center gap-4">
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

          {/* Mobile Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 space-y-2 bg-gray-50 rounded-lg p-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <category.icon size={20} />
                  {category.name}
                </button>
              ))}
            </div>
          )}
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
                  <div 
                    className="h-56 overflow-hidden relative cursor-pointer"
                    onClick={() => setSelectedImage({ src: item.image!, alt: item.name })}
                  >
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

                  <Link
                    href={`/inventory/${(item as any).slug}`}
                    className="block w-full text-center bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    View Details & Pricing
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

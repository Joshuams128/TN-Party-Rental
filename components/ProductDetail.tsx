'use client';

import Link from 'next/link';
import { ChevronLeft, Phone, Mail, Tag, ImageIcon } from 'lucide-react';
import type { ProductDetail } from '@/lib/inventory-data';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

interface Props {
  product: ProductDetail;
}

export function ProductDetailPage({ product }: Props) {
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  const handleQuoteClick = () => {
    window.location.href = '/#contact';
  };

  return (
    <div className="pt-20">
      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-[var(--color-gold)] transition-colors z-50"
            onClick={() => setSelectedImage(null)}
          >
            ✕
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

      {/* Hero */}
      <section className="relative py-10 bg-gradient-to-br from-black via-[var(--color-gray-dark)] to-black text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-gold)] opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[var(--color-gold)] opacity-5 rounded-full blur-3xl" />
        <div className="absolute inset-0 animate-shimmer" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Title + back link */}
            <div className="flex-1 animate-fade-in-up">
              <Link
                href="/inventory"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-gold)] mb-4 hover:underline"
              >
                <ChevronLeft size={16} />
                Back to Inventory
              </Link>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                <span className="gold-gradient-text">{product.name}</span>
              </h1>
              <div className="h-1 w-20 bg-gradient-to-r from-[var(--color-gold)] to-transparent mt-4" />
            </div>

            {/* Image */}
            {product.image && (
              <div className="relative w-full lg:w-80 shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] opacity-20 rounded-2xl blur-xl" />
                <div className="relative bg-gradient-to-br from-[var(--color-gray-dark)] to-[var(--color-gray-medium)] p-4 rounded-2xl border-2 border-[var(--color-gold)]/30">
                  <div className="relative h-48 w-full overflow-hidden rounded-xl">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="object-cover"
                      style={product.objectPosition ? { objectPosition: product.objectPosition } : undefined}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-black">
              {product.pricingType === 'quote'
                ? 'Custom Pricing'
                : product.pricingType === 'tiered'
                ? 'Rental Packages'
                : 'Available Options'}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent mx-auto mb-4" />
            {product.note && (
              <p className="text-gray-500 text-sm max-w-xl mx-auto">{product.note}</p>
            )}
          </div>

          {/* Quote-only */}
          {product.pricingType === 'quote' && (
            <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-black via-[var(--color-gray-dark)] to-black text-white rounded-3xl p-12 border-2 border-[var(--color-gold)]/40">
              <Tag size={48} className="text-[var(--color-gold)] mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-4">Request a Quote</h3>
              <p className="text-gray-300 mb-8">
                Pricing for {product.name.toLowerCase()} is customized based on your event details.
                Contact us today and we&apos;ll get back to you quickly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+1-647-555-0000"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-8 py-4 rounded-full font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Phone size={18} /> Call Us
                </a>
                <Link
                  href="/#contact"
                  className="flex items-center justify-center gap-2 border-2 border-[var(--color-gold)] text-[var(--color-gold)] px-8 py-4 rounded-full font-bold hover:bg-[var(--color-gold)] hover:text-black transition-all duration-300 transform hover:scale-105"
                >
                  <Mail size={18} /> Send Message
                </Link>
              </div>
            </div>
          )}

          {/* Tiered pricing */}
          {product.pricingType === 'tiered' && product.tiers && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {product.tiers.map((tier, i) => (
                <div
                  key={tier.label}
                  className={`relative rounded-2xl border-2 p-8 text-center shadow-smooth hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                    i === 1
                      ? 'border-[var(--color-gold)] bg-gradient-to-br from-black to-[var(--color-gray-dark)] text-white'
                      : 'border-[var(--color-gold)]/40 bg-white text-black'
                  }`}
                >
                  {i === 1 && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black text-xs font-bold px-4 py-1 rounded-full">
                      POPULAR
                    </div>
                  )}
                  <p className={`text-sm font-semibold mb-2 ${i === 1 ? 'text-[var(--color-gold)]' : 'text-gray-500'}`}>
                    {tier.label}
                  </p>
                  <p className="text-4xl font-bold mb-2">{tier.price}</p>
                  {tier.note && (
                    <p className={`text-xs mt-2 ${i === 1 ? 'text-gray-300' : 'text-gray-500'}`}>{tier.note}</p>
                  )}
                  <button
                    onClick={handleQuoteClick}
                    className={`mt-6 w-full py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                      i === 1
                        ? 'bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black hover:shadow-xl'
                        : 'border-2 border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-black'
                    }`}
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Variants pricing — card grid */}
          {product.pricingType === 'variants' && product.variants && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {product.variants.map((variant) => (
                <div
                  key={variant.name}
                  className="group bg-white rounded-2xl overflow-hidden shadow-smooth hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-[var(--color-gold)]"
                >
                  {/* Image area */}
                  <div
                    className="h-52 overflow-hidden relative cursor-pointer"
                    onClick={() =>
                      variant.image
                        ? setSelectedImage({ src: variant.image, alt: variant.name })
                        : undefined
                    }
                  >
                    {variant.image ? (
                      <>
                        <ImageWithFallback
                          src={variant.image}
                          alt={variant.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <h3 className="text-white text-base font-bold leading-tight">{variant.name}</h3>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--color-gray-dark)] to-black flex flex-col items-center justify-center gap-3">
                        <ImageIcon size={36} className="text-[var(--color-gold)] opacity-50" />
                        <span className="text-xs text-gray-500 font-medium">Image Coming Soon</span>
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-5">
                    {!variant.image && (
                      <h3 className="text-base font-bold text-black mb-1 leading-tight">{variant.name}</h3>
                    )}
                    {variant.description && (
                      <p className="text-sm text-gray-500 mb-3">{variant.description}</p>
                    )}
                    <div className="flex items-center justify-between gap-3 mt-2">
                      <span className="text-2xl font-bold text-[var(--color-gold)] whitespace-nowrap">{variant.price}</span>
                      <button
                        onClick={handleQuoteClick}
                        className="text-sm bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-5 py-2 rounded-full font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                      >
                        Inquire
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-black via-[var(--color-gray-dark)] to-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to <span className="gold-gradient-text">Book?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Contact us today to check availability and confirm your reservation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="group relative inline-block bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-12 py-5 rounded-full text-lg font-bold hover:shadow-2xl hover:shadow-[var(--color-gold)]/50 transition-all duration-300 transform hover:scale-110 overflow-hidden"
            >
              <span className="relative z-10">Contact Us</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </Link>
            <Link
              href="/inventory"
              className="inline-block border-2 border-[var(--color-gold)] text-[var(--color-gold)] px-12 py-5 rounded-full text-lg font-bold hover:bg-[var(--color-gold)] hover:text-black transition-all duration-300 transform hover:scale-110"
            >
              Browse More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client'

import { useState, useEffect } from 'react';
import { Tent, Armchair, UtensilsCrossed, Music, Sparkles, PartyPopper, Camera, Video, Phone, Mail, MapPin, Clock, Star, Award, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';

const heroImages = [
  {
    src: 'https://images.unsplash.com/photo-1768508951126-f90917cc510e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwcGFydHklMjBldmVudHxlbnwxfHx8fDE3Njk0MjY3MTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Elegant party event'
  },
  {
    src: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    alt: 'Wedding reception setup'
  },
  {
    src: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    alt: 'Outdoor event celebration'
  }
];

const services = [
  {
    icon: Camera,
    title: 'Mirror Photo Booth',
    description: 'Elegant full-length interactive mirror with touchscreen, voice guidance, and instant prints. A showstopper at any event.',
    image: '/images/mirror.PNG',
    objectPosition: 'center 40%',
    featured: true
  },
  {
    icon: Sparkles,
    title: 'Custom Balloon Decorations',
    description: 'Professional balloon artistry including arches, garlands, sculptures, and themed installations to transform your venue.',
    image: '/images/6.5ft.jpg',
    featured: true
  },
  {
    icon: Music,
    title: 'Audio & Sound Systems',
    description: 'Professional PA systems, microphones, and speakers for any venue size.',
    image: '/images/dj.png'
  },
  {
    icon: UtensilsCrossed,
    title: 'Tables & Linens',
    description: 'Premium tables, tablecloths, and runners in various colors and styles to match your event theme.',
    image: '/images/tables-lines.png'
  },
  {
    icon: Armchair,
    title: 'Chairs & Seating',
    description: 'Comfortable and elegant seating options including chiavari chairs, folding chairs, and lounge furniture.',
    image: '/images/chairs.png'
  }
];

export function Home() {
  const featuredServices = services.filter(s => s.featured);
  const standardServices = services.filter(s => !s.featured);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload hero images
  useEffect(() => {
    const imagePromises = heroImages.map((image) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = image.src;
        img.onload = resolve;
        img.onerror = resolve;
      });
    });
    Promise.all(imagePromises).then(() => setImagesLoaded(true));
  }, []);

  // Auto-rotate hero images
  useEffect(() => {
    if (!imagesLoaded) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [imagesLoaded]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
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
          <img 
            src={selectedImage.src} 
            alt={selectedImage.alt}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-40 sm:pt-40 pb-16 bg-black">
        {/* Background Image Slider */}
        <div 
          className={`absolute inset-0 z-0 bg-black transition-opacity duration-500 ${imagesLoaded ? 'opacity-100' : 'opacity-0'}`}
        >
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transition: 'opacity 1000ms ease-in-out' }}
            >
              <ImageWithFallback
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover scale-110"
                priority={index === 0}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black opacity-80"></div>
        </div>

        {/* Slider Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-[var(--color-gold)] text-white hover:text-black p-2 rounded-full transition-all duration-300 opacity-60 hover:opacity-100"
          aria-label="Previous slide"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-[var(--color-gold)] text-white hover:text-black p-2 rounded-full transition-all duration-300 opacity-60 hover:opacity-100"
          aria-label="Next slide"
        >
          <ChevronRight size={28} />
        </button>

        {/* Slider Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-[var(--color-gold)] w-8'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Animated overlay */}
        <div className="absolute inset-0 animate-shimmer z-[1]"></div>

        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-fade-in-up pt-28 sm:pt-32">
          <div className="mb-8">
            <div className="inline-block">
              <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-2 leading-tight">
                <span className="gold-gradient-text drop-shadow-2xl">True North</span>
              </h2>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                Party Rentals
              </h2>
              <div className="h-1 w-32 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent mx-auto"></div>
            </div>
          </div>
          
          <p className="text-2xl sm:text-3xl mb-4 font-light tracking-wide">
            Scarborough&apos;s Premier Event Rental Service
          </p>
          <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto leading-relaxed text-gray-300">
            From tents and tables to our exclusive 360° camera and balloon artistry — everything you need for an unforgettable event.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <button
              onClick={scrollToServices}
              className="group relative bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-10 py-5 rounded-full text-lg font-bold hover:shadow-2xl hover:shadow-[var(--color-gold)]/50 transition-all duration-300 transform hover:scale-110 overflow-hidden"
            >
              <span className="relative z-10">Explore Our Services</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
            <button
              onClick={scrollToContact}
              className="group relative glass-effect text-white border-2 border-[var(--color-gold)] px-10 py-5 rounded-full text-lg font-bold hover:bg-[var(--color-gold)] hover:text-black transition-all duration-300 transform hover:scale-110"
            >
              Get a Quote
            </button>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-24 bg-gradient-to-b from-white via-[var(--color-gray-light)] to-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[var(--color-gold)] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--color-gold)] opacity-5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-5xl sm:text-6xl font-bold mb-6 text-black">
             Everything You Need <span className="gold-gradient-text">All in One Place</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your perfect event starts with the right pieces — we have them all


            </p>
          </div>

          {/* Featured Services */}
          <div className="mb-20">
            <div className="flex items-center justify-center mb-12">
              <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent flex-1 max-w-xs"></div>
              <div className="px-8">
                <span className="text-sm font-bold text-[var(--color-gold)] bg-gradient-to-r from-[var(--color-gold)]/10 via-[var(--color-gold)]/20 to-[var(--color-gold)]/10 px-6 py-3 rounded-full border border-[var(--color-gold)]/30 inline-flex items-center gap-2">
                  <Sparkles size={16} className="animate-pulse" />
                  MOST POPULAR SERVICES
                  <Sparkles size={16} className="animate-pulse" />
                </span>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent flex-1 max-w-xs"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 max-w-4xl mx-auto">
              {featuredServices.map((service, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-smooth hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Gold border glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)] via-[var(--color-gold-light)] to-[var(--color-gold)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl"></div>
                  
                  <div className="relative border-2 border-[var(--color-gold)] rounded-2xl overflow-hidden bg-white">
                    {service.image && (
                      <div 
                        className="h-56 overflow-hidden relative cursor-pointer"
                        onClick={() => setSelectedImage({ src: service.image, alt: service.title })}
                      >
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black text-xs font-bold px-4 py-2 rounded-full z-10 shadow-lg">
                          ⭐ FEATURED
                        </div>
                        <ImageWithFallback
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          style={service.objectPosition ? { objectPosition: service.objectPosition } : undefined}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] p-3 rounded-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                          <service.icon className="text-black" size={28} />
                        </div>
                        <h3 className="ml-4 text-xl font-bold text-black">{service.title}</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link 
                href="/inventory"
                className="inline-block bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-8 py-3 rounded-full font-bold hover:shadow-lg hover:shadow-[var(--color-gold)]/50 transition-all duration-300 transform hover:scale-105"
              >
                View Full Inventory
              </Link>
            </div>
          </div>

          {/* Standard Services */}
          <div>
            <div className="flex items-center justify-center mb-12">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1 max-w-xs"></div>
              <div className="px-8">
                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Complete Rental Inventory
                </span>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1 max-w-xs"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {standardServices.map((service, index) => (
                <div
                  key={index}
                  className="group bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-smooth hover:border-[var(--color-gold)] hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  {service.image && (
                    <div 
                      className="h-48 overflow-hidden relative cursor-pointer"
                      onClick={() => setSelectedImage({ src: service.image, alt: service.title })}
                    >
                      <ImageWithFallback
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] p-3 rounded-xl shadow-md transform group-hover:scale-110 transition-all duration-300">
                        <service.icon className="text-black" size={28} />
                      </div>
                      <h3 className="ml-4 text-xl font-semibold text-black">{service.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center animate-fade-in-up">
            <div className="bg-gradient-to-r from-transparent via-gray-200 to-transparent h-px mb-8"></div>
            <p className="text-lg text-gray-600 mb-6">
              Can&apos;t find what you&apos;re looking for? We offer custom solutions for every event.
            </p>
            <Link href="/#contact" className="group relative inline-block bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-10 py-4 rounded-full font-bold hover:shadow-2xl hover:shadow-[var(--color-gold)]/50 transition-all duration-300 transform hover:scale-105 overflow-hidden">
              <span className="relative z-10">Request Custom Quote</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-24 bg-gradient-to-br from-black via-[var(--color-gray-dark)] to-black text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--color-gold)] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[var(--color-gold)] opacity-5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-5xl sm:text-6xl font-bold mb-6">
              Why Choose <span className="gold-gradient-text">True North</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We&apos;re more than just a rental company — we&apos;re your event success partners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="group relative bg-gradient-to-br from-[var(--color-gray-dark)] to-[var(--color-gray-medium)] p-8 rounded-2xl border-2 border-[var(--color-gold)]/30 hover:border-[var(--color-gold)] transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--color-gold)]/20">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <Award className="text-black" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[var(--color-gold)]">Premium Quality</h3>
                <p className="text-gray-300 leading-relaxed">
                  All our equipment is professionally maintained and regularly updated to ensure you get the best quality for your event.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-[var(--color-gray-dark)] to-[var(--color-gray-medium)] p-8 rounded-2xl border-2 border-[var(--color-gold)]/30 hover:border-[var(--color-gold)] transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--color-gold)]/20">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <Star className="text-black" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[var(--color-gold)]">5-Star Service</h3>
                <p className="text-gray-300 leading-relaxed">
                  Our dedicated team goes above and beyond to ensure your event runs smoothly from setup to teardown.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-[var(--color-gray-dark)] to-[var(--color-gray-medium)] p-8 rounded-2xl border-2 border-[var(--color-gold)]/30 hover:border-[var(--color-gold)] transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--color-gold)]/20">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <Sparkles className="text-black" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[var(--color-gold)]">Unique Offerings</h3>
                <p className="text-gray-300 leading-relaxed">
                  Stand out with our exclusive 360° camera, mirror booth, and custom balloon artistry that wow your guests.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button 
              onClick={scrollToContact}
              className="group relative bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-12 py-5 rounded-full text-lg font-bold hover:shadow-2xl hover:shadow-[var(--color-gold)]/50 transition-all duration-300 transform hover:scale-110 overflow-hidden"
            >
              <span className="relative z-10">Start Planning Your Event</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 bg-gradient-to-b from-white via-[var(--color-gray-light)] to-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--color-gold)] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[var(--color-gold)] opacity-5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="inline-block mb-4">
              <span className="text-sm font-bold text-[var(--color-gold)] bg-[var(--color-gold)]/10 px-4 py-2 rounded-full border border-[var(--color-gold)]/30">
                LET&apos;S CONNECT
              </span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold mb-6 text-black">
              Get In <span className="gold-gradient-text">Touch</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to plan your perfect event? Contact us today for a free quote!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="group bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-[var(--color-gold)] shadow-smooth hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] p-4 rounded-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Phone className="text-black" size={24} />
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--color-gold)] transition-colors">Phone</h3>
                    <p className="text-gray-600 text-lg">(416) 555-RENT</p>
                    <p className="text-gray-500">(416) 555-7368</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-[var(--color-gold)] shadow-smooth hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] p-4 rounded-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Mail className="text-black" size={24} />
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--color-gold)] transition-colors">Email</h3>
                    <p className="text-gray-600 text-lg">info@truenorthrentals.ca</p>
                    <p className="text-gray-500">quotes@truenorthrentals.ca</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-[var(--color-gold)] shadow-smooth hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] p-4 rounded-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <MapPin className="text-black" size={24} />
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--color-gold)] transition-colors">Location</h3>
                    <p className="text-gray-600 text-lg">Scarborough, Ontario</p>
                    <p className="text-gray-500">Serving the Greater Toronto Area</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-[var(--color-gold)] shadow-smooth hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] p-4 rounded-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Clock className="text-black" size={24} />
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--color-gold)] transition-colors">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                    <p className="text-gray-600">Sunday: By Appointment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="relative">
              {/* Glow effect behind form */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] opacity-10 rounded-3xl blur-2xl"></div>
              
              <div className="relative bg-white p-10 rounded-3xl border-2 border-[var(--color-gold)]/30 shadow-2xl">
                <h3 className="text-3xl font-bold mb-8 text-black">Request a <span className="gold-gradient-text">Quote</span></h3>
                <form className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-gold)] focus:border-[var(--color-gold)] transition-all duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-gold)] focus:border-[var(--color-gold)] transition-all duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-gold)] focus:border-[var(--color-gold)] transition-all duration-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="eventDate" className="block text-sm font-semibold text-gray-700 mb-2">
                        Event Date
                      </label>
                      <input
                        type="date"
                        id="eventDate"
                        name="eventDate"
                        className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-gold)] focus:border-[var(--color-gold)] transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label htmlFor="eventType" className="block text-sm font-semibold text-gray-700 mb-2">
                        Event Type
                      </label>
                      <select
                        id="eventType"
                        name="eventType"
                        className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-gold)] focus:border-[var(--color-gold)] transition-all duration-300"
                      >
                        <option value="">Select event type</option>
                        <option value="wedding">Wedding</option>
                        <option value="corporate">Corporate Event</option>
                        <option value="birthday">Birthday Party</option>
                        <option value="graduation">Graduation</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-gold)] focus:border-[var(--color-gold)] transition-all duration-300"
                      placeholder="Tell us about your event and what you need..."
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="group relative w-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl hover:shadow-[var(--color-gold)]/50 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  >
                    <span className="relative z-10">Submit Request</span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

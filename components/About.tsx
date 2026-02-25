'use client';

import { Award, Clock, Heart, Sparkles, Star, Target, Shield, Users } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';

const values = [
  {
    icon: Star,
    title: 'Excellence',
    description: 'We maintain the highest standards in equipment quality and customer service'
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'We love what we do and it shows in every event we help create'
  },
  {
    icon: Shield,
    title: 'Reliability',
    description: 'Count on us to deliver on time, every time, exactly as promised'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Proudly serving Scarborough and the GTA with local expertise'
  },
];

const stats = [
  { number: '500+', label: 'Events Completed' },
  { number: '10+', label: 'Years Experience' },
  { number: '98%', label: 'Customer Satisfaction' },
  { number: '1000+', label: 'Rental Items' },
];

export function About() {
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
                  OUR STORY
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                About <span className="gold-gradient-text">True North</span>
              </h1>
              <div className="h-1 w-20 bg-gradient-to-r from-[var(--color-gold)] to-transparent mb-8"></div>
              
              <div className="space-y-6">
                <p className="text-xl text-gray-300 leading-relaxed font-semibold">
                  True North Party Rentals started with a simple idea — celebrations should feel special, not stressful.
                </p>
                
                <p className="text-lg text-gray-400 leading-relaxed">
                  What began as helping friends and family decorate small gatherings quickly grew into something bigger. We realized people weren&apos;t just looking for rentals… they were looking for someone they could trust to help bring their vision to life. Someone reliable. Someone who actually cared about the details.
                </p>
                
                <p className="text-lg text-gray-300 leading-relaxed font-semibold text-[var(--color-gold)]">
                  We built True North around that mindset.
                </p>
                
                <p className="text-lg text-gray-400 leading-relaxed">
                  We are a GTA-based, family-run business focused on creating memorable event experiences through modern decor, custom balloon designs, and interactive photo booth services. Every setup is handled with care, professionalism, and attention to detail — because we understand these moments matter. Whether it&apos;s a child&apos;s first birthday, a baby shower, a wedding, or a milestone celebration, these are memories people keep forever.
                </p>
                
                <p className="text-lg text-gray-300 leading-relaxed font-semibold text-[var(--color-gold)]">
                  Our goal isn&apos;t just to drop off equipment.<br/>Our goal is to help create moments.
                </p>
                
                <p className="text-lg text-gray-400 leading-relaxed">
                  From the first message to the final takedown, we work closely with our clients to make the process easy, organized, and enjoyable. We pride ourselves on clear communication, on-time service, and clean, polished setups that elevate any space.
                </p>
                
                <p className="text-lg text-gray-400 leading-relaxed italic border-l-4 border-[var(--color-gold)] pl-4">
                  At True North Party Rentals, we believe a great event isn&apos;t about how big it is — it&apos;s about how it feels. And if your guests walk into the room and say "wow"… we&apos;ve done our job.
                </p>
                
                <p className="text-lg text-gray-300 leading-relaxed font-semibold text-[var(--color-gold)]">
                  We&apos;d be honoured to be part of your celebration.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] opacity-20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-[var(--color-gray-dark)] to-[var(--color-gray-medium)] p-8 rounded-3xl border-2 border-[var(--color-gold)]/30">
                <div className="relative h-80 w-full overflow-hidden rounded-2xl">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMHNldHVwJTIwdGVhbXxlbnwxfHx8fDE3Mzg0NDU1MDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="True North team setting up event"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl lg:text-6xl font-bold text-black mb-2">{stat.number}</div>
                <div className="text-lg text-black/80 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-br from-black via-[var(--color-gray-dark)] to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              Our <span className="gold-gradient-text">Values</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-[var(--color-gray-dark)] to-[var(--color-gray-medium)] p-8 rounded-2xl border-2 border-[var(--color-gold)]/30 hover:border-[var(--color-gold)] transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--color-gold)]/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <value.icon className="text-black" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-[var(--color-gold)]">
                    {value.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-gradient-to-b from-[var(--color-gray-light)] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-black">
              Why Choose <span className="gold-gradient-text">True North</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="group bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-[var(--color-gold)] shadow-smooth hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] p-4 rounded-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Award className="text-black" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-[var(--color-gold)]">
                    Family-Owned GTA Business
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    As a locally operated family business, we take pride in every event we service. We treat each setup with care and attention to detail because our reputation in the community matters to us.
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-[var(--color-gold)] shadow-smooth hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] p-4 rounded-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Star className="text-black" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-[var(--color-gold)]">
                    5-Star Rated Service
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our clients consistently trust us for professional communication, clean setups, and dependable service. We aim to make every experience smooth from your first message to the final takedown.
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-[var(--color-gold)] shadow-smooth hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] p-4 rounded-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Sparkles className="text-black" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-[var(--color-gold)]">
                    Full Setup and Takedown Included
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We handle the delivery, installation, and removal of all rentals and decor so everything is ready before your guests arrive. You won&apos;t need to assemble, move, or return any equipment.
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-[var(--color-gold)] shadow-smooth hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] p-4 rounded-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Target className="text-black" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-[var(--color-gold)]">
                    Custom Packages
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Every event is different, so we offer flexible packages tailored to your space, theme, and budget. We work with you to create a setup that fits your vision.
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-[var(--color-gold)] shadow-smooth hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] p-4 rounded-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Clock className="text-black" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-[var(--color-gold)]">
                    Reliable and On-Time Service
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We arrive on schedule and complete setups within the agreed timeframe so your event stays on track. Our goal is to give you peace of mind on the day of your celebration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6 text-black">
            Ready to Work <span className="gold-gradient-text">Together?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Let&apos;s make your next event unforgettable. Contact us today to discuss your needs and get a custom quote.
          </p>
          <Link 
            href="/#contact"
            className="group relative inline-block bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-12 py-5 rounded-full text-lg font-bold hover:shadow-2xl hover:shadow-[var(--color-gold)]/50 transition-all duration-300 transform hover:scale-110 overflow-hidden"
          >
            <span className="relative z-10">Get In Touch</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </Link>
        </div>
      </section>
    </div>
  );
}

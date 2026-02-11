'use client';

import { Award, Users, Clock, MapPin, Heart, Sparkles, Star, Target, Shield } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

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

const team = [
  {
    role: 'Founder & CEO',
    description: 'With over 15 years in the event industry, bringing vision and expertise to every celebration'
  },
  {
    role: 'Event Coordinators',
    description: 'Our dedicated team of professionals who ensure your event runs flawlessly'
  },
  {
    role: 'Setup Crew',
    description: 'Experienced technicians who handle delivery, setup, and teardown with precision'
  },
  {
    role: 'Customer Service',
    description: 'Always available to answer questions and provide support throughout your event planning'
  },
];

export function About() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-black via-[var(--color-gray-dark)] to-black text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-gold)] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[var(--color-gold)] opacity-5 rounded-full blur-3xl"></div>

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
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                True North Party Rentals was founded with a simple mission: to make every celebration in Scarborough and the Greater Toronto Area truly unforgettable.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                What started as a small local rental service has grown into one of the region&apos;s most trusted names in event equipment and services, all while maintaining our commitment to personalized service and attention to detail.
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] opacity-20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-[var(--color-gray-dark)] to-[var(--color-gray-medium)] p-8 rounded-3xl border-2 border-[var(--color-gold)]/30">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMHNldHVwJTIwdGVhbXxlbnwxfHx8fDE3Mzg0NDU1MDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="True North team setting up event"
                  className="w-full h-80 object-cover rounded-2xl"
                />
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
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-black">
              Our <span className="gold-gradient-text">Values</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border-2 border-gray-200 hover:border-[var(--color-gold)] shadow-smooth hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <value.icon className="text-black" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-[var(--color-gold)] transition-colors">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="group bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-[var(--color-gold)] shadow-smooth hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] p-4 rounded-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Award className="text-black" size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-[var(--color-gold)] transition-colors">
                      Premium Quality Equipment
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      All our rentals are professionally maintained, regularly inspected, and replaced to ensure you always get the best quality equipment for your event.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-[var(--color-gold)] shadow-smooth hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] p-4 rounded-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Users className="text-black" size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-[var(--color-gold)] transition-colors">
                      Expert Event Support
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Our experienced team provides personalized guidance and support throughout your planning process, ensuring every detail is perfect.
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
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-[var(--color-gold)] transition-colors">
                      Flexible & Reliable
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      We work around your schedule with flexible delivery times and extended rental periods. Our on-time delivery rate is 99.8%.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="group bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-[var(--color-gold)] shadow-smooth hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] p-4 rounded-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <MapPin className="text-black" size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-[var(--color-gold)] transition-colors">
                      Local Expertise
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Based in Scarborough, we know the GTA&apos;s venues, weather patterns, and local requirements inside and out.
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
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-[var(--color-gold)] transition-colors">
                      Unique Signature Services
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Stand out with our exclusive 360° camera, magic mirror photo booth, and professional balloon artistry.
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
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-[var(--color-gold)] transition-colors">
                      Custom Solutions
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Every event is unique. We create custom packages and solutions tailored to your specific vision and budget.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gradient-to-br from-black via-[var(--color-gray-dark)] to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              Meet Our <span className="gold-gradient-text">Team</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Dedicated professionals committed to making your event perfect
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-[var(--color-gray-dark)] to-[var(--color-gray-medium)] p-6 rounded-2xl border-2 border-[var(--color-gold)]/30 hover:border-[var(--color-gold)] transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--color-gold)]/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] rounded-full mb-4"></div>
                  <h3 className="text-xl font-bold mb-3 text-[var(--color-gold)]">{member.role}</h3>
                  <p className="text-gray-300 leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
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
          <button 
            onClick={() => window.location.href = '/contact'}
            className="group relative bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-12 py-5 rounded-full text-lg font-bold hover:shadow-2xl hover:shadow-[var(--color-gold)]/50 transition-all duration-300 transform hover:scale-110 overflow-hidden"
          >
            <span className="relative z-10">Get In Touch</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>
        </div>
      </section>
    </div>
  );
}

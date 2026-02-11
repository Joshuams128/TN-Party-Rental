'use client';

import { Calendar, CheckSquare, Clock, Sparkles, Users, MapPin, DollarSign, Lightbulb, ClipboardList, Phone } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useState } from 'react';

const planningSteps = [
  {
    step: '1',
    title: 'Define Your Vision',
    description: 'Determine your event type, theme, and overall atmosphere',
    icon: Lightbulb,
    timeline: '6-12 months before',
    tips: [
      'Create a mood board with colors and styles',
      'Define your event goals and objectives',
      'Consider your guest experience',
    ]
  },
  {
    step: '2',
    title: 'Set Your Budget',
    description: 'Establish a realistic budget and allocate funds',
    icon: DollarSign,
    timeline: '6-12 months before',
    tips: [
      'Allocate 40% to venue and catering',
      'Reserve 15-20% for rentals and decor',
      'Keep 10% as contingency fund',
    ]
  },
  {
    step: '3',
    title: 'Choose Date & Venue',
    description: 'Select the perfect date and location for your event',
    icon: MapPin,
    timeline: '6-10 months before',
    tips: [
      'Consider weather for outdoor events',
      'Check venue capacity and restrictions',
      'Verify venue has adequate parking',
    ]
  },
  {
    step: '4',
    title: 'Build Your Team',
    description: 'Hire vendors and service providers',
    icon: Users,
    timeline: '4-8 months before',
    tips: [
      'Book popular vendors early',
      'Request quotes from multiple providers',
      'Check references and reviews',
    ]
  },
  {
    step: '5',
    title: 'Plan the Details',
    description: 'Finalize rentals, menu, entertainment, and decor',
    icon: ClipboardList,
    timeline: '2-4 months before',
    tips: [
      'Create detailed floor plans',
      'Finalize guest list and seating',
      'Order all rentals and equipment',
    ]
  },
  {
    step: '6',
    title: 'Final Preparations',
    description: 'Confirm all details and create day-of timeline',
    icon: CheckSquare,
    timeline: '2-4 weeks before',
    tips: [
      'Confirm all vendor arrival times',
      'Create detailed timeline for the day',
      'Prepare emergency contact list',
    ]
  },
];

const eventTypeGuides = [
  {
    type: 'Wedding',
    icon: Sparkles,
    duration: '12-18 months planning time',
    checklist: [
      'Book ceremony and reception venues',
      'Select and order rentals (tables, chairs, linens)',
      'Plan ceremony seating and reception layout',
      'Arrange dance floor and entertainment area',
      'Coordinate lighting and decor',
      'Plan cocktail hour space',
    ]
  },
  {
    type: 'Corporate Event',
    icon: Users,
    duration: '3-6 months planning time',
    checklist: [
      'Define event objectives and agenda',
      'Arrange AV equipment and staging',
      'Plan networking spaces',
      'Coordinate branded materials',
      'Arrange appropriate seating (theater, conference, etc.)',
      'Plan catering and beverage stations',
    ]
  },
  {
    type: 'Birthday Party',
    icon: Calendar,
    duration: '2-3 months planning time',
    checklist: [
      'Choose theme and color scheme',
      'Select entertainment options (360° camera, photo booth)',
      'Plan balloon decorations',
      'Arrange tables and seating for guests',
      'Coordinate tent if outdoor',
      'Plan activities and timeline',
    ]
  },
  {
    type: 'Graduation Party',
    icon: Calendar,
    duration: '2-3 months planning time',
    checklist: [
      'Select school colors for decor',
      'Plan display areas for photos and achievements',
      'Arrange buffet or food station setup',
      'Coordinate outdoor tent if needed',
      'Plan entertainment and activities',
      'Create photo opportunity areas',
    ]
  },
];

const planningServices = [
  {
    name: 'Planning Consultation',
    description: 'One-on-one session to map out your event needs',
    duration: '60 minutes',
    price: 'Complimentary',
    features: [
      'Review your event vision and goals',
      'Discuss venue and space requirements',
      'Provide inventory recommendations',
      'Estimate budget and timeline',
      'Answer all your questions',
    ]
  },
  {
    name: 'Rental Planning Package',
    description: 'Complete rental design and coordination',
    duration: 'Full planning period',
    price: 'Starting at $299',
    features: [
      'Detailed floor plan design',
      'Complete rental inventory list',
      'Color and style coordination',
      'Delivery timeline planning',
      'Setup coordination',
      'Dedicated planning support',
    ]
  },
  {
    name: 'Day-Of Coordination',
    description: 'On-site support for your event day',
    duration: 'Event day',
    price: 'Starting at $499',
    features: [
      'Oversee setup and installation',
      'Coordinate with all vendors',
      'Manage timeline and schedule',
      'Handle any issues that arise',
      'Ensure proper teardown',
      'Peace of mind for your big day',
    ]
  },
];

export default function EventPlanningPage() {
  const [activeGuide, setActiveGuide] = useState(0);

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
                  EXPERT GUIDANCE
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Event <span className="gold-gradient-text">Planning</span> Made Easy
              </h1>
              <div className="h-1 w-20 bg-gradient-to-r from-[var(--color-gold)] to-transparent mb-8"></div>
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                From concept to celebration, we guide you through every step of planning your perfect event with expert advice and comprehensive support.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed mb-8">
                Our experienced team has helped plan hundreds of successful events across the GTA. Let us make your planning process smooth and stress-free.
              </p>
              <button 
                onClick={() => window.location.hash = ''}
                className="group relative bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-12 py-5 rounded-full text-lg font-bold hover:shadow-2xl hover:shadow-[var(--color-gold)]/50 transition-all duration-300 transform hover:scale-110 overflow-hidden"
              >
                <span className="relative z-10">Schedule Free Consultation</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] opacity-20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-[var(--color-gray-dark)] to-[var(--color-gray-medium)] p-8 rounded-3xl border-2 border-[var(--color-gold)]/30">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMHBsYW5uaW5nJTIwbWVldGluZ3xlbnwxfHx8fDE3Mzg0NDU1MDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Event planning consultation"
                  className="w-full h-80 object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planning Process Timeline */}
      <section className="py-24 bg-gradient-to-b from-white via-[var(--color-gray-light)] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-black">
              Your Event Planning <span className="gold-gradient-text">Timeline</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow our proven step-by-step process for a stress-free planning experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {planningSteps.map((step, index) => (
              <div
                key={index}
                className="group relative bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-[var(--color-gold)] shadow-smooth hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] w-12 h-12 rounded-full flex items-center justify-center shadow-lg font-bold text-black text-xl">
                  {step.step}
                </div>

                <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <step.icon className="text-black" size={32} />
                </div>

                <div className="mb-3">
                  <span className="inline-block bg-[var(--color-gold)]/10 text-[var(--color-gold)] px-3 py-1 rounded-full text-sm font-semibold mb-3">
                    <Clock className="inline-block mr-1" size={14} />
                    {step.timeline}
                  </span>
                </div>

                <h3 className="text-2xl font-bold mb-3 group-hover:text-[var(--color-gold)] transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{step.description}</p>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Pro Tips:</p>
                  <ul className="space-y-2">
                    {step.tips.map((tip, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-[var(--color-gold)] mt-1">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Type Guides */}
      <section className="py-24 bg-gradient-to-br from-black via-[var(--color-gray-dark)] to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              Planning Guides by <span className="gold-gradient-text">Event Type</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Tailored checklists and timelines for different types of events
            </p>
          </div>

          {/* Event Type Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {eventTypeGuides.map((guide, index) => (
              <button
                key={index}
                onClick={() => setActiveGuide(index)}
                className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                  activeGuide === index
                    ? 'bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                <guide.icon size={20} />
                {guide.type}
              </button>
            ))}
          </div>

          {/* Active Guide Content */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] opacity-10 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-[var(--color-gray-dark)] to-[var(--color-gray-medium)] p-12 rounded-3xl border-2 border-[var(--color-gold)]/30">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] w-16 h-16 rounded-xl flex items-center justify-center shadow-lg">
                      {activeGuide === 0 && <Sparkles className="text-black" size={32} />}
                      {activeGuide === 1 && <Users className="text-black" size={32} />}
                      {activeGuide === 2 && <Calendar className="text-black" size={32} />}
                      {activeGuide === 3 && <Calendar className="text-black" size={32} />}
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold">{eventTypeGuides[activeGuide].type} Planning</h3>
                      <p className="text-[var(--color-gold)]">{eventTypeGuides[activeGuide].duration}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    Essential checklist for planning a successful {eventTypeGuides[activeGuide].type.toLowerCase()}. Our team can help you with every item on this list.
                  </p>
                  <button 
                    onClick={() => window.location.hash = ''}
                    className="bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Get Planning Help
                  </button>
                </div>

                <div>
                  <h4 className="text-xl font-bold mb-6 text-[var(--color-gold)]">Planning Checklist:</h4>
                  <ul className="space-y-4">
                    {eventTypeGuides[activeGuide].checklist.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 group">
                        <div className="bg-[var(--color-gold)]/20 p-2 rounded-lg group-hover:bg-[var(--color-gold)] transition-colors duration-300">
                          <CheckSquare className="text-[var(--color-gold)] group-hover:text-black flex-shrink-0" size={20} />
                        </div>
                        <span className="text-gray-300 text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planning Services */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-black">
              Our Planning <span className="gold-gradient-text">Services</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional support at every stage of your event planning journey
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {planningServices.map((service, index) => (
              <div
                key={index}
                className={`group relative bg-white rounded-3xl overflow-hidden shadow-smooth hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                  index === 0 ? 'border-4 border-[var(--color-gold)]' : 'border-2 border-gray-200 hover:border-[var(--color-gold)]'
                }`}
              >
                {index === 0 && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg z-10">
                    ⭐ FREE
                  </div>
                )}

                <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] p-8 text-black">
                  <h3 className="text-3xl font-bold mb-2">{service.name}</h3>
                  <p className="text-black/80 mb-4">{service.description}</p>
                  <div className="text-2xl font-bold mb-1">{service.price}</div>
                  <div className="text-sm text-black/70">{service.duration}</div>
                </div>

                <div className="p-8">
                  <h4 className="text-lg font-bold mb-4">What&apos;s Included:</h4>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckSquare className="text-[var(--color-gold)] flex-shrink-0 mt-1" size={20} />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className="w-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-8 py-4 rounded-full text-lg font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    {index === 0 ? 'Book Free Consultation' : 'Learn More'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-24 bg-gradient-to-b from-[var(--color-gray-light)] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-black">
              Planning <span className="gold-gradient-text">Resources</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Helpful tools and tips to make your planning easier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-[var(--color-gold)] shadow-smooth hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <ClipboardList className="text-black" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Budget Calculator</h3>
              <p className="text-gray-600 mb-4">Estimate costs and allocate your event budget effectively</p>
              <button className="text-[var(--color-gold)] font-semibold hover:underline">Download →</button>
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-[var(--color-gold)] shadow-smooth hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Calendar className="text-black" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Timeline Template</h3>
              <p className="text-gray-600 mb-4">Month-by-month planning checklist for your event</p>
              <button className="text-[var(--color-gold)] font-semibold hover:underline">Download →</button>
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-[var(--color-gold)] shadow-smooth hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <MapPin className="text-black" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Venue Checklist</h3>
              <p className="text-gray-600 mb-4">Questions to ask when touring potential venues</p>
              <button className="text-[var(--color-gold)] font-semibold hover:underline">Download →</button>
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-[var(--color-gold)] shadow-smooth hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Users className="text-black" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Guest List Manager</h3>
              <p className="text-gray-600 mb-4">Track RSVPs and manage your guest list efficiently</p>
              <button className="text-[var(--color-gold)] font-semibold hover:underline">Download →</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-black via-[var(--color-gray-dark)] to-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Phone className="text-[var(--color-gold)] mx-auto mb-6" size={64} />
          <h2 className="text-5xl font-bold mb-6">
            Ready to Start <span className="gold-gradient-text">Planning?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Let&apos;s bring your vision to life. Schedule your free consultation today and discover how we can make your event planning effortless.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={() => window.location.hash = ''}
              className="group relative bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-12 py-5 rounded-full text-lg font-bold hover:shadow-2xl hover:shadow-[var(--color-gold)]/50 transition-all duration-300 transform hover:scale-110 overflow-hidden"
            >
              <span className="relative z-10">Schedule Free Consultation</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
            <button 
              onClick={() => window.location.hash = 'packages'}
              className="group relative glass-effect text-white border-2 border-[var(--color-gold)] px-12 py-5 rounded-full text-lg font-bold hover:bg-[var(--color-gold)] hover:text-black transition-all duration-300 transform hover:scale-110"
            >
              View Packages
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

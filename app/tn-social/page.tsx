'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ImageIcon, X } from 'lucide-react';
import { useState } from 'react';

const events = [
  {
    id: 'summer-soca',
    name: 'Summer Soca',
    image: '/images/secondary/summer-event.PNG',
    description:
      'Get ready for the ultimate summer vibes! Join us for an unforgettable night of soca music, dancing, and Caribbean energy.',
    ticketLink: '#',
    comingSoon: false,
  },
  {
    id: 'soca-social',
    name: 'Soca Social',
    image: '/images/secondary/soca-event.PNG',
    description:
      'Experience the rhythm of the islands at Soca Social. A premium soca event featuring top DJs, great vibes, and an electric atmosphere.',
    ticketLink: '#',
    comingSoon: true,
  },
  {
    id: 'wicked-carnival-experience',
    name: 'Wicked Carnival Experience',
    image: '/images/secondary/wicked-event.PNG',
    description:
      'The ultimate carnival experience is here! Immerse yourself in the culture, music, and energy of the Caribbean carnival tradition.',
    ticketLink: '#',
    comingSoon: true,
  },
];

export default function TNSocialPage() {
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[var(--color-gray-dark)] to-black text-white">
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
      
      {/* Hero */}
      <section className="pt-32 pb-16 text-center px-4">
        <div className="flex flex-col items-center justify-center gap-4 mb-6">
          <Image
            src="/images/truesocial.png"
            alt="TN Social Logo"
            width={200}
            height={200}
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain"
          />
        </div>
        <p className="text-xl text-gray-300 mb-2">Upcoming Events</p>
        <p className="text-gray-400 max-w-xl mx-auto">
          Get your tickets to our hottest events. Experience the best in soca and Caribbean culture.
        </p>
      </section>

      {/* Event Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-gradient-to-br from-[var(--color-gray-dark)] to-black rounded-2xl overflow-hidden border-2 border-[var(--color-gold)]/40 shadow-2xl flex flex-col relative"
            >
              {/* Coming Soon Badge */}
              {event.comingSoon && (
                <div className="absolute top-4 right-4 z-10 bg-[var(--color-gold)] text-black px-4 py-2 rounded-full text-sm font-bold">
                  Coming Soon
                </div>
              )}
              
              {/* Image */}
              <div className="relative h-96 w-full bg-black cursor-pointer group">
                  {event.image ? (
                    <button
                      onClick={() => setSelectedImage({ src: event.image, alt: event.name })}
                      className="w-full h-full relative overflow-hidden"
                      title="Click to view full image"
                    >
                      <Image
                        src={event.image}
                        alt={event.name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-sm font-medium">Click to enlarge</span>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                      <ImageIcon size={48} className="text-[var(--color-gold)] opacity-50" />
                      <span className="text-sm text-gray-500 font-medium">Image Coming Soon</span>
                    </div>
                  )}
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-[var(--color-gold)] mb-3">{event.name}</h3>
                <p className="text-gray-300 mb-6 flex-grow">{event.description}</p>
                {event.comingSoon ? (
                  <div className="w-full bg-gray-600 text-white px-8 py-4 rounded-full text-lg font-bold text-center block cursor-not-allowed opacity-60">
                    Coming Soon
                  </div>
                ) : (
                  <Link
                    href={event.ticketLink}
                    className="w-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-8 py-4 rounded-full text-lg font-bold hover:shadow-xl hover:shadow-[var(--color-gold)]/30 transition-all duration-300 transform hover:scale-105 text-center block"
                  >
                    Purchase Tickets
                  </Link>
                )}
              </div>
            </div>
          ))}
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

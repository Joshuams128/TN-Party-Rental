'use client'

import { FileText, AlertTriangle, CreditCard, Truck, Clock, ShieldCheck, Scale, Ban, RefreshCw, Calendar, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  const lastUpdated = "February 13, 2026";

  const sections = [
    {
      icon: FileText,
      title: "Rental Agreement",
      content: [
        {
          subtitle: "Acceptance of Terms",
          text: "By placing a rental order with True North Party Rentals, you agree to be bound by these Terms of Service. These terms constitute a legally binding agreement between you and True North Party Rentals."
        },
        {
          subtitle: "Rental Period",
          text: "Standard rental periods are for one day unless otherwise specified. Extended rentals are available at additional cost. The rental period begins at the scheduled delivery time and ends at the scheduled pickup time."
        },
        {
          subtitle: "Minimum Order",
          text: "A minimum order amount may apply depending on delivery location and event requirements. Contact us for specific details regarding minimum orders in your area."
        }
      ]
    },
    {
      icon: CreditCard,
      title: "Payment Terms",
      content: [
        {
          subtitle: "Deposit Requirements",
          text: "A non-refundable deposit of 50% is required to confirm your reservation. The remaining balance is due 7 days prior to your event date."
        },
        {
          subtitle: "Accepted Payment Methods",
          text: "We accept major credit cards, debit cards, e-transfers, and certified cheques. Cash payments are accepted for in-person transactions only."
        },
        {
          subtitle: "Late Payments",
          text: "Late payments may result in cancellation of your reservation. Any outstanding balances after the event are subject to a 2% monthly interest charge."
        }
      ]
    },
    {
      icon: Ban,
      title: "Cancellation Policy",
      content: [
        {
          subtitle: "Cancellation Timeline",
          text: "Cancellations made 30+ days before the event: Full refund minus deposit. 14-29 days: 50% refund. Less than 14 days: No refund. Deposits are non-refundable in all cases."
        },
        {
          subtitle: "Weather-Related Cancellations",
          text: "For outdoor events, weather-related cancellations must be communicated at least 24 hours in advance. A credit for future rental may be issued at our discretion."
        },
        {
          subtitle: "Our Right to Cancel",
          text: "We reserve the right to cancel any reservation due to circumstances beyond our control, including but not limited to severe weather, equipment failure, or staffing issues. Full refunds will be provided in such cases."
        }
      ]
    },
    {
      icon: Truck,
      title: "Delivery & Pickup",
      content: [
        {
          subtitle: "Delivery Area",
          text: "We primarily serve Scarborough and the Greater Toronto Area. Delivery fees vary based on distance and order size. Free delivery may be available for qualifying orders."
        },
        {
          subtitle: "Site Requirements",
          text: "You are responsible for ensuring adequate access to the delivery location, including clear pathways, parking, and any necessary permissions. Additional fees may apply for difficult access situations."
        },
        {
          subtitle: "Pickup Timing",
          text: "All rental items must be accessible and ready for pickup at the scheduled time. Items should be clean, dry, and consolidated in the original delivery location. Late pickup fees may apply."
        }
      ]
    },
    {
      icon: ShieldCheck,
      title: "Care & Responsibility",
      content: [
        {
          subtitle: "Proper Use",
          text: "Rental items must be used only for their intended purpose. Any misuse, modification, or unauthorized repairs void any liability on our part and may result in additional charges."
        },
        {
          subtitle: "Damage & Loss",
          text: "You are responsible for all rental items from delivery until pickup. Lost, stolen, or damaged items beyond normal wear will be charged at full replacement cost."
        },
        {
          subtitle: "Cleaning",
          text: "Items should be returned in reasonably clean condition. Excessive cleaning required due to negligence (food residue, stains, etc.) will incur additional cleaning fees."
        }
      ]
    },
    {
      icon: AlertTriangle,
      title: "Liability & Indemnification",
      content: [
        {
          subtitle: "Limitation of Liability",
          text: "True North Party Rentals is not liable for any indirect, incidental, or consequential damages arising from the use of our rental equipment. Our total liability shall not exceed the rental fees paid."
        },
        {
          subtitle: "Indemnification",
          text: "You agree to indemnify and hold harmless True North Party Rentals from any claims, damages, or expenses arising from your use of our rental equipment or services."
        },
        {
          subtitle: "Insurance",
          text: "We recommend that customers obtain appropriate event insurance. Our equipment is covered by our insurance only while in our possession or during professional setup/takedown."
        }
      ]
    },
    {
      icon: Scale,
      title: "Dispute Resolution",
      content: [
        {
          subtitle: "Governing Law",
          text: "These Terms of Service are governed by the laws of the Province of Ontario, Canada. Any disputes shall be resolved in the courts of Ontario."
        },
        {
          subtitle: "Resolution Process",
          text: "We encourage customers to first contact us directly to resolve any issues. Most concerns can be addressed through open communication with our customer service team."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-[var(--color-gray-dark)] to-black text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[var(--color-gold)] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[var(--color-gold)] rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] mb-8 shadow-2xl">
            <FileText className="text-black" size={40} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gold-gradient-text">Terms of</span> Service
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4">
            Please read these terms carefully before using True North Party Rentals services. By renting from us, you agree to these terms and conditions.
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Calendar size={16} />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[var(--color-gold)]/10 to-transparent border-l-4 border-[var(--color-gold)] p-6 rounded-r-xl mb-12">
            <p className="text-gray-700 leading-relaxed">
              Welcome to True North Party Rentals. These Terms of Service (&quot;Terms&quot;) govern your use of our rental services, website, and any related services provided by True North Party Rentals (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By accessing our services or placing a rental order, you acknowledge that you have read, understood, and agree to be bound by these Terms.
            </p>
          </div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {sections.map((section, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl border-2 border-gray-100 hover:border-[var(--color-gold)]/30 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] flex items-center justify-center shadow-lg">
                    <section.icon className="text-black" size={28} />
                  </div>
                  <h2 className="text-2xl font-bold text-black">{section.title}</h2>
                </div>
                
                <div className="space-y-6 pl-2">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="border-l-2 border-gray-200 pl-6">
                      <h3 className="font-semibold text-[var(--color-gold)] mb-2">{item.subtitle}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Terms */}
      <section className="py-16 bg-gradient-to-r from-[var(--color-gold)]/5 via-[var(--color-gold)]/10 to-[var(--color-gold)]/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border-2 border-[var(--color-gold)]/20 p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <Clock className="text-[var(--color-gold)]" size={28} />
              <h2 className="text-2xl font-bold text-black">Reservation Confirmation</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Your reservation is not confirmed until you receive written confirmation from True North Party Rentals and your deposit has been processed. We recommend booking at least 2-4 weeks in advance for standard events, and 2-3 months for large events or peak season dates.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Equipment availability is subject to prior reservations. We will notify you immediately if any items become unavailable and work with you to find suitable alternatives.
            </p>
          </div>
        </div>
      </section>

      {/* Changes to Terms */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[var(--color-gray-dark)] to-black rounded-2xl p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <RefreshCw className="text-[var(--color-gold)]" size={28} />
              <h2 className="text-2xl font-bold">Changes to These Terms</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services after any changes constitutes acceptance of the new Terms. We encourage you to review these Terms periodically.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-black via-[var(--color-gray-dark)] to-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Questions About Our <span className="gold-gradient-text">Terms</span>?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            If you have any questions about these Terms of Service or need clarification on any policies, our team is here to help.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/5 border border-[var(--color-gold)]/20 rounded-xl p-6">
              <Mail className="text-[var(--color-gold)] mx-auto mb-3" size={28} />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-gray-400 text-sm">info@truenorthrentals.ca</p>
            </div>
            <div className="bg-white/5 border border-[var(--color-gold)]/20 rounded-xl p-6">
              <Phone className="text-[var(--color-gold)] mx-auto mb-3" size={28} />
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-gray-400 text-sm">(416) 555-0123</p>
            </div>
            <div className="bg-white/5 border border-[var(--color-gold)]/20 rounded-xl p-6">
              <MapPin className="text-[var(--color-gold)] mx-auto mb-3" size={28} />
              <h3 className="font-semibold mb-2">Location</h3>
              <p className="text-gray-400 text-sm">Scarborough, Ontario</p>
            </div>
          </div>

          <Link
            href="/#contact"
            className="inline-block bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-10 py-4 rounded-full text-lg font-bold hover:shadow-2xl hover:shadow-[var(--color-gold)]/50 transition-all duration-300 transform hover:scale-105"
          >
            Contact Us
          </Link>
        </div>
      </section>

      {/* Back to Home */}
      <section className="py-8 bg-gray-50 text-center">
        <Link href="/" className="text-gray-500 hover:text-[var(--color-gold)] transition-colors">
          ← Back to Home
        </Link>
      </section>
    </div>
  );
}

'use client'

import { Shield, Eye, Lock, Database, UserCheck, Mail, Phone, MapPin, RefreshCw, Trash2, Globe, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const lastUpdated = "February 13, 2026";

  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "When you use our services or contact us, we may collect: your name, email address, phone number, mailing address, event details, and payment information."
        },
        {
          subtitle: "Automatically Collected Information",
          text: "We automatically collect certain information when you visit our website, including your IP address, browser type, device information, and pages visited."
        },
        {
          subtitle: "Cookies and Tracking",
          text: "We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors come from."
        }
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Service Delivery",
          text: "To process your rental orders, coordinate deliveries and pickups, and provide customer support for your events."
        },
        {
          subtitle: "Communication",
          text: "To send you order confirmations, rental reminders, and respond to your inquiries. With your consent, we may also send promotional offers."
        },
        {
          subtitle: "Improvement",
          text: "To improve our website, services, and customer experience based on your feedback and usage patterns."
        }
      ]
    },
    {
      icon: Lock,
      title: "How We Protect Your Information",
      content: [
        {
          subtitle: "Security Measures",
          text: "We implement industry-standard security measures including SSL encryption, secure payment processing, and regular security audits."
        },
        {
          subtitle: "Access Controls",
          text: "Only authorized employees have access to personal information, and they are trained on privacy and security practices."
        },
        {
          subtitle: "Data Storage",
          text: "Your information is stored on secure servers in Canada and is protected by physical, electronic, and procedural safeguards."
        }
      ]
    },
    {
      icon: UserCheck,
      title: "Information Sharing",
      content: [
        {
          subtitle: "Third-Party Service Providers",
          text: "We may share information with trusted third parties who assist us in operating our business, such as payment processors and delivery partners."
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose information when required by law, to protect our rights, or in response to valid legal requests."
        },
        {
          subtitle: "No Sale of Personal Information",
          text: "We do not sell, trade, or rent your personal information to third parties for marketing purposes."
        }
      ]
    },
    {
      icon: RefreshCw,
      title: "Your Rights and Choices",
      content: [
        {
          subtitle: "Access and Update",
          text: "You have the right to access, update, or correct your personal information at any time by contacting us."
        },
        {
          subtitle: "Opt-Out",
          text: "You may opt out of receiving promotional communications by following the unsubscribe instructions in our emails."
        },
        {
          subtitle: "Cookie Preferences",
          text: "You can manage your cookie preferences through your browser settings, though some features may not function properly if cookies are disabled."
        }
      ]
    },
    {
      icon: Trash2,
      title: "Data Retention",
      content: [
        {
          subtitle: "Retention Period",
          text: "We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, or as required by law."
        },
        {
          subtitle: "Deletion Requests",
          text: "You may request deletion of your personal information by contacting us. We will comply with your request subject to any legal obligations."
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
            <Shield className="text-black" size={40} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gold-gradient-text">Privacy</span> Policy
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4">
            Your privacy is important to us. This policy explains how True North Party Rentals collects, uses, and protects your personal information.
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
              True North Party Rentals (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit our website or use our rental services in Scarborough and the Greater Toronto Area.
            </p>
          </div>
        </div>
      </section>

      {/* Policy Sections */}
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

      {/* Children's Privacy */}
      <section className="py-16 bg-gradient-to-r from-[var(--color-gold)]/5 via-[var(--color-gold)]/10 to-[var(--color-gold)]/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border-2 border-[var(--color-gold)]/20 p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <Globe className="text-[var(--color-gold)]" size={28} />
              <h2 className="text-2xl font-bold text-black">Children&apos;s Privacy</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately, and we will take steps to delete such information.
            </p>
          </div>
        </div>
      </section>

      {/* Changes to Policy */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[var(--color-gray-dark)] to-black rounded-2xl p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <RefreshCw className="text-[var(--color-gold)]" size={28} />
              <h2 className="text-2xl font-bold">Changes to This Policy</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date. We encourage you to review this Privacy Policy periodically.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-black via-[var(--color-gray-dark)] to-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Questions About Our <span className="gold-gradient-text">Privacy Policy</span>?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            If you have any questions or concerns about this Privacy Policy or our data practices, please don&apos;t hesitate to contact us.
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

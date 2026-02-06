import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'True North Party Rentals | Event Rentals in Scarborough',
  description: 'True North Party Rentals - Premier event rental company in Scarborough. Quality equipment, packages, and event planning services for weddings, corporate events, and parties.',
  keywords: ['party rentals', 'event rentals', 'Scarborough', 'wedding rentals', 'corporate events', 'event planning'],
  openGraph: {
    title: 'True North Party Rentals',
    description: 'Premier event rental company in Scarborough',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

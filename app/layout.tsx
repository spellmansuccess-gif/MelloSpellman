import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { CartProvider } from '@/components/CartProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://mellospellman.com'),
  title: {
    default: 'MelloSpellman — Heritage menswear',
    template: '%s · MelloSpellman',
  },
  description:
    'MelloSpellman — heritage menswear cut by hand in limited runs. Gold on ink.',
  keywords: ['MelloSpellman', 'menswear', 'luxury clothing', 'heritage'],
  openGraph: {
    type: 'website',
    siteName: 'MelloSpellman',
    title: 'MelloSpellman — Heritage menswear',
    description:
      'Heritage menswear cut by hand in limited runs. Gold on ink.',
    url: 'https://mellospellman.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MelloSpellman — Heritage menswear',
    description:
      'Heritage menswear cut by hand in limited runs. Gold on ink.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}

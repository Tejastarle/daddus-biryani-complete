import type { Metadata, Viewport } from 'next';
import './globals.css';
import LeadProvider from '@/components/LeadProvider';
import SiteChrome from '@/components/SiteChrome';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Daddu's Biryani | Lucknowi, Hyderabadi, Kolkata & Mumbai Biryani in Malad East",
    template: "%s | Daddu's Biryani",
  },
  description:
    "Dum biryani four ways — Lucknowi, Hyderabadi, Kolkata and Mumbai Twist — plus kebabs, rolls, combos and party orders by the kilo. Malad East, Mumbai. Order on WhatsApp or download the menu.",
  keywords: ['biryani Malad East', 'biryani Mumbai', 'Lucknowi biryani', 'Hyderabadi biryani', 'Kolkata biryani', 'bulk biryani order Mumbai', 'party biryani per kg', 'shami kebab'],
  authors: [{ name: "Daddu's Biryani" }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE.url,
    siteName: "Daddu's Biryani",
    title: "Daddu's Biryani | Zayqo ki Kahani",
    description: 'Lucknowi, Hyderabadi, Kolkata and Mumbai-style dum biryani in Malad East, Mumbai.',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: "Chicken Lucknowi biryani at Daddu's Biryani" }],
  },
  twitter: { card: 'summary_large_image', title: "Daddu's Biryani", images: ['/images/og-image.jpg'] },
  robots: 'index, follow',
  icons: { icon: '/logo.png', apple: '/logo.png' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#082A21',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: SITE.name,
  image: `${SITE.url}/images/og-image.jpg`,
  servesCuisine: ['Indian', 'Mughlai', 'Biryani'],
  telephone: SITE.phoneTel,
  priceRange: '₹₹',
  menu: `${SITE.url}/menu`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.addressLines[0],
    addressLocality: 'Malad East, Mumbai',
    postalCode: '400097',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  openingHours: 'Mo-Su 11:00-23:00',
  aggregateRating: { '@type': 'AggregateRating', ratingValue: SITE.rating, reviewCount: SITE.reviews },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/rozha-one-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Playfair is still used by the admin panel */}
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: "try{if(sessionStorage.getItem('db_intro'))document.documentElement.classList.add('intro-seen')}catch(e){}",
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="bg-background text-foreground">
        <LeadProvider>
          {children}
          <SiteChrome />
        </LeadProvider>
      </body>
    </html>
  );
}

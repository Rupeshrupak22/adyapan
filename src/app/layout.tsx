import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Analytics from '@/components/Analytics';
import InactivityTimeout from '@/components/InactivityTimeout';

const inter = Inter({
  subsets:  ['latin'],
  display:  'swap',          // prevent FOIT
  variable: '--font-inter',
});

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://adyapan.com');

export const viewport: Viewport = {
  width:            'device-width',
  initialScale:     1,
  maximumScale:     5,
  viewportFit:      'cover',
  themeColor:       '#14162a',
  colorScheme:      'light',
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    default:  'Adyapan - Learn, Earn & Get Placed',
    template: '%s | Adyapan',
  },
  description:
    'Adyapan offers 65+ industry-relevant courses, real internship experience, live classes, and placement support to help students launch their careers in India.',
  keywords: [
    'online courses india', 'internship program', 'placement support',
    'data science course', 'machine learning', 'web development',
    'adyapan', 'edtech india', 'live online classes', 'career guidance',
  ],
  authors:  [{ name: 'Adyapan Edutech Pvt. Ltd.', url: APP_URL }],
  creator:  'Adyapan Edutech Pvt. Ltd.',
  publisher:'Adyapan Edutech Pvt. Ltd.',
  robots: {
    index:          true,
    follow:         true,
    googleBot: {
      index:             true,
      follow:            true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet':       -1,
    },
  },

  openGraph: {
    type:        'website',
    locale:      'en_IN',
    url:         APP_URL,
    siteName:    'Adyapan',
    title:       'Adyapan - Learn, Earn & Get Placed',
    description: 'Industry-relevant courses with live classes, real internship experience, and placement support.',
    images: [
      {
        url:    '/icon-512x512.png',
        width:  512,
        height: 512,
        alt:    'Adyapan Logo',
        type:   'image/png',
      },
    ],
  },

  twitter: {
    card:        'summary',
    site:        '@adyapan',
    creator:     '@adyapan',
    title:       'Adyapan - Learn, Earn & Get Placed',
    description: 'Industry-relevant courses with live classes, real internship experience, and placement support.',
    images:      ['/icon-512x512.png'],
  },

  alternates: {
    canonical: APP_URL,
  },

  icons: {
    icon: [
      { url: '/favicon.ico',      sizes: 'any',     type: 'image/x-icon' },
      { url: '/icon-48x48.png',   sizes: '48x48',   type: 'image/png' },
      { url: '/icon-96x96.png',   sizes: '96x96',   type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: [{ url: '/favicon.ico', type: 'image/x-icon' }],
    apple:    [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },

  manifest: '/site.webmanifest',

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    other: {
      // Bing Webmaster Tools verification
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={inter.variable}>
      <head>
        {/* ── Favicon – explicit links for Google & browser compatibility ── */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon-48x48.png" type="image/png" sizes="48x48" />
        <link rel="icon" href="/icon-96x96.png" type="image/png" sizes="96x96" />
        <link rel="icon" href="/icon-192x192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/icon-512x512.png" type="image/png" sizes="512x512" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://checkout.razorpay.com" />
        {/* Schema.org Organization markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type':    'EducationalOrganization',
              name:       'Adyapan Edutech Pvt. Ltd.',
              url:        APP_URL,
              logo:       `${APP_URL}/icon-512x512.png`,
              description:'India\'s leading EdTech platform offering 65+ industry-relevant courses with placement support.',
              sameAs: [
                'https://www.linkedin.com/company/adyapan-edutech-pvt-ltd/posts/?feedView=all',
                'https://www.instagram.com/adyapan_?igsh=MWw1NGwwNTIwZXU2eQ==',
              ],
              contactPoint: {
                '@type':             'ContactPoint',
                telephone:           '+91-8179124566',
                contactType:         'customer service',
                availableLanguage:   ['English', 'Hindi'],
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col overflow-x-hidden`} suppressHydrationWarning>
        {children}
        <Analytics />
        <InactivityTimeout />
        {/* Adyapan tracker */}
        <Script src="https://api.adyapancrm.in/tracker.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}

import localFont from 'next/font/local'
import './globals.css'

import Head from 'next/head'

import Script from 'next/script'
import { ThemeProvider } from '@/rgcomponents/ThemeProvider'
import { Header } from '@/rgcomponents/Header'
import { Footer } from '@/rgcomponents/Footer'
import { Toaster } from "@/components/ui/toaster"

// Self-hosted (latin woff2, variable) — avoids build-time Google Fonts fetches
const display = localFont({
  src: [{ path: './fonts/unbounded-latin.woff2', weight: '400', style: 'normal' }],
  variable: '--font-display',
  display: 'swap',
})

const body = localFont({
  src: [
    { path: './fonts/ibm-plex-sans-latin.woff2', weight: '400', style: 'normal' },
    { path: './fonts/ibm-plex-sans-latin.woff2', weight: '500', style: 'normal' },
    { path: './fonts/ibm-plex-sans-latin.woff2', weight: '600', style: 'normal' },
    { path: './fonts/ibm-plex-sans-latin.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
})

const mono = localFont({
  src: [
    { path: './fonts/jetbrains-mono-latin.woff2', weight: '400', style: 'normal' },
    { path: './fonts/jetbrains-mono-latin.woff2', weight: '600', style: 'normal' },
    { path: './fonts/jetbrains-mono-latin.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL('https://valorisvisio.top'),
  title: {
    default: 'ValorisVisio - Advanced Crypto Scenario Calculator & Market Analysis Tool',
    template: '%s | ValorisVisio - Crypto Calculator'
  },
  description: 'Calculate potential cryptocurrency profits with our advanced scenario calculator. Compare market caps, visualize gains, and make informed crypto investment decisions with real-time data.',
  authors: [{ name: 'ValorisVisio Team' }],
  creator: 'ValorisVisio',
  publisher: 'ValorisVisio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://valorisvisio.top',
    siteName: 'ValorisVisio',
    title: 'ValorisVisio - Advanced Crypto Scenario Calculator & Market Analysis Tool',
    description: 'Calculate potential cryptocurrency profits with our advanced scenario calculator. Compare market caps, visualize gains, and make informed crypto investment decisions.',
    images: [
      {
        url: 'https://valorisvisio.top/displaycard.png',
        width: 1200,
        height: 630,
        alt: 'ValorisVisio Crypto Calculator'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ValorisVisio - Advanced Crypto Scenario Calculator',
    description: 'Calculate potential cryptocurrency profits with our advanced scenario calculator. Compare market caps and visualize gains.',
    images: ['https://valorisvisio.top/displaycard.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#05060c" />
        <meta name="theme-color" content="#05060c" />
      </Head>
      <Script strategy="lazyOnload" async src="https://www.googletagmanager.com/gtag/js?id=G-ETPN827MV5" />
      <Script strategy="afterInteractive" id="service-worker">
        {`
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                  console.log('SW registered: ', registration);
                }, function(registrationError) {
                  console.log('SW registration failed: ', registrationError);
                });
            });
          }
        `}
      </Script>
      <Script strategy="lazyOnload" id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-ETPN827MV5');
        `}
      </Script>
      <Script type="application/ld+json" id="websiteSchema">
        {`
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "ValorisVisio",
          "alternateName": "ValorisVisio Crypto Calculator",
          "url": "https://valorisvisio.top/",
          "description": "Advanced cryptocurrency scenario calculator for market analysis and profit calculation",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://valorisvisio.top/?search={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@type": "Organization",
            "name": "ValorisVisio",
            "url": "https://valorisvisio.top/",
            "logo": {
              "@type": "ImageObject",
              "url": "https://valorisvisio.top/logo.svg"
            }
          }
        }
        `}
      </Script>
      <Script type="application/ld+json" id="webApplicationSchema">
        {`
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "ValorisVisio Crypto Calculator",
          "description": "Advanced cryptocurrency scenario calculator for comparing market caps and calculating potential profits",
          "url": "https://valorisvisio.top/",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            "Cryptocurrency market cap comparison",
            "Profit scenario calculation",
            "Real-time crypto data",
            "Multiple cryptocurrency support",
            "Investment visualization tools"
          ],
          "screenshot": "https://valorisvisio.top/displaycard.png"
        }
        `}
      </Script>
      <Script type="application/ld+json" id="financialServiceSchema">
        {`
        {
          "@context": "https://schema.org",
          "@type": "FinancialService",
          "name": "ValorisVisio Cryptocurrency Analysis",
          "description": "Professional cryptocurrency market analysis and profit calculation tools",
          "url": "https://valorisvisio.top/",
          "serviceType": "Cryptocurrency Analysis",
          "areaServed": "Worldwide",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Crypto Analysis Tools",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Crypto Scenario Calculator",
                  "description": "Calculate potential cryptocurrency profits based on market cap scenarios"
                }
              }
            ]
          }
        }
        `}
      </Script>
      <body className={`${display.variable} ${body.variable} ${mono.variable}` + ' font-body'}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <Header />
          {children}
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

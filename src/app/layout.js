import { Inter } from 'next/font/google'
import './globals.css'

import Head from 'next/head'

import Script from 'next/script'
import { ThemeProvider } from '@/rgcomponents/ThemeProvider'
import { Header } from '@/rgcomponents/Header'
import { Footer } from '@/rgcomponents/Footer'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://valorisvisio.top'),
  title: {
    default: 'ValorisVisio - Advanced Crypto Scenario Calculator & Market Analysis Tool',
    template: '%s | ValorisVisio - Crypto Calculator'
  },
  description: 'Calculate potential cryptocurrency profits with our advanced scenario calculator. Compare market caps, visualize gains, and make informed crypto investment decisions with real-time data.',
  keywords: ['crypto calculator', 'cryptocurrency calculator', 'crypto scenario calculator', 'market cap comparison', 'crypto profit calculator', 'bitcoin calculator', 'ethereum calculator', 'crypto investment tool'],
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
  verification: {
    google: 'google-site-verification-code',
  },
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
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
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
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
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

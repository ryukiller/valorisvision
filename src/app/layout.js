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
  title: 'Crypto Scenarios Calculate you profits - ValorisVisio',
  description: "Ever wonder what your crypto value could be if it's market cap matches another crypto? Visualize your gains in that scenario, input your holdings and calculate it",
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
      <Script strategy="lazyOnload" id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-ETPN827MV5');
        `}
      </Script>
      <Script type="application/ld+json">
        {`
       { "@context" : "https://schema.org",
        "@type" : "WebSite",
        "name" : "ValorisVisio Crypto Calculator",
        "alternateName" : "ValorisVisio",
        "url" : "https://valorisvisio.top/"}
        `
        }
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

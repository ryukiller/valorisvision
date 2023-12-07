import { Inter } from 'next/font/google'
import './globals.css'

import Script from 'next/script'
import { ThemeProvider } from '@/rgcomponents/ThemeProvider'
import { Header } from '@/rgcomponents/Header'
import { Footer } from '@/rgcomponents/Footer'
import { Toaster } from "@/components/ui/toaster"


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ValorisVisio Crypto Scenarios',
  description: "Ever wonder what your crypto value will be if it's market cap matches another crypto? Visualize your gains in that scenario, input your holdings and check it",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-ETPN827MV5" />
      <Script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="3b8cc79d-ff1c-4442-aeaf-5682c0ab0c6c" data-blockingmode="auto" type="text/javascript" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-ETPN827MV5');
        `}
      </Script>
      <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1078298151629101"
        crossorigin="anonymous" />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
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

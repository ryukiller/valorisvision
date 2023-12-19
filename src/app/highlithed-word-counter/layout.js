import '../globals.css'

import { Footer } from '@/rgcomponents/Footer'
import Head from 'next/head'
import { Header } from '@/rgcomponents/Header'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { ThemeProvider } from '@/rgcomponents/ThemeProvider'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Text Select Counter - ValorisVisio',
    description: "Text Select Counter: A Chrome Extension for Counting Words and Characters",
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

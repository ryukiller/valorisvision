import { Inter } from 'next/font/google'
import './globals.css'

import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ValorisVisio Crypto Scenarios',
  description: "Ever wonder what your crypto value will be if it's market cap matches another crypto? Visualize your gains in that scenario, input your holdings and check it",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-ETPN827MV5" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-ETPN827MV5');
        `}
      </Script>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import RecaptchaProvider from '@/components/RecaptchaProvider'
import MotionProvider from '@/components/MotionProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Ciclo E-commerce | Agência para E-commerce Full Funnel Marketing',
  description:
    'A Ciclo E-commerce é uma agência especializada em Full Funnel Marketing para marcas que querem crescer com eficiência e previsibilidade. +300 marcas atendidas, +R$ 350MM em receita gerada.',
  keywords: ['agência e-commerce', 'full funnel marketing', 'marketing digital', 'e-commerce', 'crescimento', 'CAC', 'LTV'],
  openGraph: {
    title: 'Ciclo E-commerce | Agência para E-commerce Full Funnel Marketing',
    description: 'Full Funnel Marketing para marcas que querem crescer com eficiência e previsibilidade.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Ciclo E-commerce',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ciclo E-commerce | Agência para E-commerce Full Funnel Marketing',
    description: 'Full Funnel Marketing para marcas que querem crescer.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cicloecommerce.com.br' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://img.youtube.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
      </head>
      <body className="grain">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://server-side-tagging-raejypekia-uc.a.run.app/ns.html?id=GTM-5NNPNZ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <MotionProvider>
          <RecaptchaProvider>{children}</RecaptchaProvider>
        </MotionProvider>
        {/* dataLayer pre-init — must run before GTM snippet */}
        <Script
          id="datalayer-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || [];` }}
        />
        {/* Google Tag Manager — via server-side container */}
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://server-side-tagging-raejypekia-uc.a.run.app/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5NNPNZ');`,
          }}
        />
      </body>
    </html>
  )
}

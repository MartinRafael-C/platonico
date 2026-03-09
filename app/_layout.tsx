import type { Metadata, Viewport } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const _dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const _playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '600', '700'] })

export const metadata: Metadata = {
  title: 'Pluma - Tu espacio de escritura',
  description: 'Una app para escritores. Escribe poemas, microcuentos, escanea libros y descubre bibliotecas cercanas.',
}

export const viewport: Viewport = {
  themeColor: '#6B7F4E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-center" richColors />
        <Analytics />
      </body>
    </html>
  )
}

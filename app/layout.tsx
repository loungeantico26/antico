import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Antico — იტალიური რესტორანი',
  description: 'გემრიელი იტალიური სამზარეულო, ხვდება ქართულ სტუმართმოყვარეობას. ჯავშნები, მენიუ, ფოტოები.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ka">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

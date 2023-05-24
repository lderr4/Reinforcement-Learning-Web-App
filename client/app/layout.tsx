import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'aithing',
  description: 'fun with ai',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-r1-white text-r1-brown min-h-screen flex flex-col mx-auto p-4`}>{children}</body>
    </html>
  )
}

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from 'sonner'
import { NavWrapper } from '@/components/layout/nav-wrapper'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Goodflicks",
  description: "Track and share your favorite shows and movies",
  icons: {
    icon: "/assets/images/favico/favicon.ico",
    apple: "/assets/images/favico/apple-touch-icon.png",
    shortcut: "/assets/images/favico/favicon.ico",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavWrapper>
          {children}
        </NavWrapper>
        <Toaster />
      </body>
    </html>
  )
}
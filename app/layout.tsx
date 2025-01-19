// Root layout with providers
// Includes AuthProvider, Toaster
// Sets up basic HTML structure and metadataa


import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from 'sonner'
import { NavWrapper } from '@/components/layout/nav-wrapper'
import { AuthProvider } from "@/context/auth"
import { Navbar } from '@/components/layout/navbar'
import '@/styles/marquee.scss'

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
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar className="sticky top-0 z-50" />
            <main className="flex-1 container mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-8">
              {children}
            </main>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
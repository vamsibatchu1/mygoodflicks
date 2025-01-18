import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from 'sonner'
import { NavWrapper } from '@/components/layout/nav-wrapper'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MyGoodFlicks",
  description: "Track and share your favorite shows",
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
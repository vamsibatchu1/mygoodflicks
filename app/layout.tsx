// Root layout with providers
// Includes AuthProvider, Toaster
// Sets up basic HTML structure and metadataa


import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { AuthLayoutWrapper } from "@/components/layout/auth-layout-wrapper"

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
      <body>
        <AuthLayoutWrapper>
          {children}
        </AuthLayoutWrapper>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
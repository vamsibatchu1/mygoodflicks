import { Card } from "@/components/ui/card"
import Image from "next/image"


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center pt-40 p-6">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Logo Container */}
        <div className="mb-0 flex items-center gap-3">
          {/* Wordmark */}
          <img
            src="/assets/images/logos/wordmark.png" // Add your wordmark image here
            alt="GoodFlicks"
            className="h-50 w-auto" // Adjust size as needed
          />
        </div>      
          {children}
      </div>
    </div>
  )
} 
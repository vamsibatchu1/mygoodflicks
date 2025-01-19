import { Card } from "@/components/ui/card"
import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Logo Image */}
        <div className="mb-8">
          <img 
            src="/assets/images/logos/goodflicks.png" 
            alt="Goodflicks Logo" 
            className="mx-auto w-72" // Adjust width as needed
          />
        </div>

        {/* Content */}
        <div className="rounded-lg bg-white p-8 shadow-md">
          {children}
        </div>
      </div>
    </div>
  )
} 
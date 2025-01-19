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
        <div className="mb-0">
          <img 
            src="/assets/images/logos/goodflicks.png" 
            alt="Goodflicks Logo" 
            width={240}  // 48 * 4 for the w-48 equivalent
            height={100}  // Adjust based on your logo's aspect ratio
            className="mx-auto"
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
import { Card } from "@/components/ui/card"
import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-6xl flex bg-white rounded-lg shadow-sm">
        {/* Left side - Form */}
        <Card className="flex-1 p-8 border-0 shadow-none">
          {children}
        </Card>

        {/* Right side - Image */}
        <div className="flex-1 relative p-8 flex items-center justify-center">
          <Image
            src="/assets/images/login-illustration.png"  // Make sure to add your image to the public folder
            alt="Authentication illustration"
            width={400}
            height={400}
            priority
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
} 
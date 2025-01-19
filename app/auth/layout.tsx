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
        {/* Logo Container */}
        <div className="mb-0 flex items-center justify-center gap-3">
          {/* Animated Logo */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="h-24 w-auto" // Reduced size to match wordmark
          >
            <source src="/assets/images/logos/anim.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
            <source src="/assets/images/logos/anim.webm" type="video/webm" />

          {/* Wordmark */}
          <img
            src="/assets/images/logos/wordmark.png" // Add your wordmark image here
            alt="GoodFlicks"
            className="h-8 w-auto" // Adjust size as needed
          />
        </div>
        
        {/* Content */}
        <div className="rounded-lg bg-white p-8 shadow-md bg-zinc-100">
          {children}
        </div>
      </div>
    </div>
  )
} 
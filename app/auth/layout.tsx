import { Card } from "@/components/ui/card"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <Card className="w-full max-w-md p-8">
        {children}
      </Card>
    </div>
  )
} 
'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function SettingsPage() {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast.success('Logged out successfully')
      router.push('/auth/login')
    } catch (error) {
      toast.error('Failed to log out')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
          <Button 
            variant="destructive"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </Card>
      </div>
    </div>
  )
} 
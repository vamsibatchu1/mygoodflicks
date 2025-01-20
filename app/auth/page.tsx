'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import LoginForm from './login/page'
import SignUpForm from './signup/page'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function AuthContent() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') || 'login'

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Tabs defaultValue={defaultTab} className="w-[400px]">
        <img           style={{ marginBottom: '32px', marginLeft: '20px' }}

              src="/assets/images/logos/nav-wordmark.png" // Add your wordmark image here
              alt="GoodFlicks"
              className="h-16 w-auto" // Adjust size as needed
            />
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="signup">
          <SignUpForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  )
} 
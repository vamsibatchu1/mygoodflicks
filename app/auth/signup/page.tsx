'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { toast } from 'sonner'

export default function SignUp() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName: name })
      toast.success('Account created successfully!')
      router.push('/flickfinder')
    } catch (error) {
      toast.error('Failed to create account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl bg-zinc-100 p-8">
      <h1 className="mb-6 text-2xl font-semibold text-center">Create an account</h1>
      
      <div className="space-y-4">
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium">Email</label>
          <Input 
            type="email" 
            placeholder="Enter your email"
            className="bg-white"
          />
        </div>

        <div className="space-y-2 text-left">
          <label className="text-sm font-medium">Password</label>
          <Input 
            type="password" 
            placeholder="Enter your password"
            className="bg-white"
          />
        </div>

        <Button className="w-full">Sign Up</Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-100 px-2 text-zinc-500">Or continue with</span>
          </div>
        </div>

        <Button variant="outline" className="w-full bg-white">
          Sign up with Google
        </Button>

        <p className="text-center text-sm text-zinc-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-zinc-900 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
} 
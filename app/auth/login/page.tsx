// Login form
// Firebase authentication
// Redirects after successful login

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { toast } from 'sonner'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success('Logged in successfully!')
      router.push('/flickfinder')
    } catch (error) {
      toast.error('Failed to login. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl bg-zinc-100 p-8">
      <h1 className="mb-6 text-2xl font-semibold text-center">Login to your account</h1>
      
      <div className="space-y-4">
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium">Email</label>
          <Input 
            type="email" 
            placeholder="Enter your email"
            className="bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2 text-left">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Password</label>
            <Link href="/auth/forgot-password" className="text-sm text-zinc-600 hover:text-zinc-800">
              Forgot your password?
            </Link>
          </div>
          <Input 
            type="password" 
            placeholder="Enter your password"
            className="bg-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-100 px-2 text-zinc-500">Or continue with</span>
          </div>
        </div>

        <Button variant="outline" className="w-full bg-white">
          Login with Google
        </Button>

        <p className="text-center text-sm text-zinc-600">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-medium text-zinc-900 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
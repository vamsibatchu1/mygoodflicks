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

export default function LoginPage() {
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
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-bold">Login to your account</h1>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
        <label className="text-left block">Email</label>

          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Forgot your password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {/* Add Google login logic */}}
        >
          Login with Google
        </Button>

        <div className="text-center text-sm">
          <Link href="/auth/signup" className="text-gray-500 hover:text-gray-900">
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './navbar'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

export function AuthLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isAuthPage = pathname === '/auth' || pathname?.startsWith('/auth/')
  const isWelcomePage = pathname === '/welcome'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Only redirect from protected routes if not logged in
      if (!user && !isAuthPage && !isWelcomePage) {
        router.push('/welcome')
      }
    })

    return () => unsubscribe()
  }, [isAuthPage, isWelcomePage, router])

  return (
    <>
      {!isAuthPage && !isWelcomePage && <Navbar />}
      {children}
    </>
  )
} 
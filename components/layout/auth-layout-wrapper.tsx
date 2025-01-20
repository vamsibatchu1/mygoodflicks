'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './navbar'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

export function AuthLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isAuthPage = pathname?.startsWith('/auth/')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Only redirect from protected routes if not logged in
      if (!user && !isAuthPage) {
        router.push('/auth/login')
      }
      // Remove the automatic redirect when logged in user tries to access auth pages
      // This allows users to stay on login/signup pages if they choose to
    })

    return () => unsubscribe()
  }, [isAuthPage, router])

  return (
    <>
      {!isAuthPage && <Navbar />}
      {children}
    </>
  )
} 
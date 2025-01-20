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
      // If user is not logged in and trying to access protected routes
      if (!user && !isAuthPage) {
        router.push('/auth/login')
      }
      // If user is logged in and trying to access auth pages
      if (user && isAuthPage) {
        router.push('/flickfinder')
      }
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
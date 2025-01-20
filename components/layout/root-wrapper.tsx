'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './navbar'

export function RootWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isWelcomePage = pathname === '/' || pathname === '/welcome'
  const isAuthPage = pathname === '/auth' || pathname?.startsWith('/auth/')

  return (
    <>
      {!isWelcomePage && !isAuthPage && <Navbar />}
      {children}
    </>
  )
} 
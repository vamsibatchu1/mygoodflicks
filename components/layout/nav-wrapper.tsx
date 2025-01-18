'use client'

import { usePathname } from 'next/navigation'
import { MainNav } from './nav'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export function NavWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const authPaths = ['/auth/login', '/auth/signup']
  const isAuthPage = authPaths.includes(pathname)

  if (isAuthPage) {
    return <div className="min-h-screen">{children}</div>
  }

  return (
    <div className="flex h-screen">
      <div className="w-64 border-r p-4 space-y-6">
        <MainNav />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="border-b p-4">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8"
              />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>

      <div className="w-64 border-l p-4">
        <h3 className="font-semibold mb-4">Mini Apps</h3>
      </div>
    </div>
  )
} 
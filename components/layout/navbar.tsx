'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="border-b">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Logo - centered on mobile, left-aligned on desktop */}
        <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
          <Link href="/flickfinder" className="text-xl font-bold">
          <img
            src="/assets/images/logos/nav-wordmark.png" // Add your wordmark image here
            alt="GoodFlicks"
            className="h-6 w-auto" // Adjust size as needed
          />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link 
            href="/flickfinder"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/flickfinder" ? "text-black" : "text-muted-foreground"
            )}
          >
            FlickFinder
          </Link>
          <Link 
            href="/lists"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/lists" ? "text-black" : "text-muted-foreground"
            )}
          >
            My Lists
          </Link>
          <Link 
            href="/friends"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/friends" ? "text-black" : "text-muted-foreground"
            )}
          >
            Friends
          </Link>
        </div>

        {/* Logout Button */}
        <Button 
          variant="default" 
          className="bg-black text-white hover:bg-gray-800"
          onClick={handleSignOut}
        >
          Logout
        </Button>

        {/* Mobile Navigation Overlay */}
        {isOpen && (
          <div className="fixed inset-0 bg-white z-50 md:hidden">
            <div className="flex flex-col items-center pt-20 gap-8">
              <Link 
                href="/flickfinder"
                className="text-xl font-medium"
                onClick={() => setIsOpen(false)}
              >
                FlickFinder
              </Link>
              <Link 
                href="/lists"
                className="text-xl font-medium"
                onClick={() => setIsOpen(false)}
              >
                My Lists
              </Link>
              <Link 
                href="/friends"
                className="text-xl font-medium"
                onClick={() => setIsOpen(false)}
              >
                Friends
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}



'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { signOut as firebaseSignOut } from 'firebase/auth'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Search, ListTodo, Users, LogOut, LogIn } from "lucide-react"
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { LogoutModal } from "@/components/modals/logout-modal"
import { useRouter } from 'next/navigation'
import { toast } from "sonner"

interface NavbarProps {
  className?: string
}

export function Navbar({ className }: NavbarProps) {
  const { user } = useAuth()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Immediate check of auth state
    const user = auth.currentUser
    setIsLoggedIn(!!user)

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', !!user) // Debug log
      setIsLoggedIn(!!user)
    })

    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      // First check if user is actually logged in
      const currentUser = auth.currentUser
      if (!currentUser) {
        toast.error("No user is currently logged in")
        return
      }

      // Attempt to sign out
      await firebaseSignOut(auth)
      
      // Only proceed if signOut was successful
      setIsLoggedIn(false)
      setShowLogoutModal(false)
      
      toast.success("Successfully logged out!")
      
      // Use router.replace instead of push to prevent back navigation
      setTimeout(() => {
        router.replace('/auth/login')
      }, 1000)

    } catch (error: any) {
      console.error('Error signing out:', error)
      toast.error("Failed to logout. Please try again.")
      setShowLogoutModal(false)
    }
  }

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="font-semibold">
        <img
            src="/assets/images/logos/nav-wordmark.png" // Add your wordmark image here
            alt="GoodFlicks"
            className="h-6 w-auto" // Adjust size as needed
          />
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/flickfinder">
            <Search size={18} className="inline mr-2" />
            FlickFinder
          </Link>
          <Link href="/lists">
            <ListTodo size={18} className="inline mr-2" />
            My Lists
          </Link>
          <Link href="/friends">
            <Users size={18} className="inline mr-2" />
            Friends
          </Link>
          <Button
            onClick={() => setShowLogoutModal(true)}
            variant="default"
            className="bg-black text-white"
          >
            {isLoggedIn ? (
              <>
                <LogOut size={18} className="inline mr-2" />
                Logout
              </>
            ) : (
              <>
                <LogIn size={18} className="inline mr-2" />
                Login
              </>
            )}
          </Button>
        </div>
      </div>
      
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleSignOut}
      />
    </nav>
  )
}



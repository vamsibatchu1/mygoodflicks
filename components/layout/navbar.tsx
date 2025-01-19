'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

interface NavbarProps {
  className?: string
}

export function Navbar({ className }: NavbarProps) {
  const { user } = useAuth()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <nav className={`border-b bg-background ${className || ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
          <img
            src="/assets/images/logos/wordmark.png" // Add your wordmark image here
            alt="GoodFlicks"
            className="h-6 w-auto" // Adjust size as needed
          />
          </div>

          <NavigationMenu>
            <NavigationMenuList className="hidden md:flex gap-6">
              <NavigationMenuItem>
                <Link href="/flickfinder" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    FlickFinder
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/mylists" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    My Lists
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/friends" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Friends
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-4">
            {user ? (
              <Button onClick={handleSignOut}>Sign Out</Button>
            ) : (
              <Link href="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 
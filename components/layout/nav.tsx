'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, Library, Activity, Film, Users, Settings } from 'lucide-react'

const navItems = [
  {
    title: 'Home',
    href: '/dashboard',
    icon: Home
  },
  {
    title: 'My Library',
    href: '/flick/gilmore-girls',
    icon: Library
  },
  {
    title: 'Activity',
    href: '/activity',
    icon: Activity
  },
  {
    title: 'Shows',
    href: '/shows',
    icon: Film
  },
  {
    title: 'Friends',
    href: '/friends',
    icon: Users
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings
  }
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-2 p-2 hover:bg-gray-100 rounded transition-colors",
              pathname === item.href ? "bg-gray-100 text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
} 
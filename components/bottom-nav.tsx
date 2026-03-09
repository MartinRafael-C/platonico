'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MapPin, QrCode } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/mapa', label: 'Mapa', icon: MapPin },
  { href: '/home', label: 'Inicio', icon: Home },
  { href: '/biblioteca', label: 'Libreria', icon: QrCode },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-card"
      role="navigation"
      aria-label="Navegacion principal"
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-4 pb-6 pt-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-2xl px-5 py-2 transition-all',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon
                className={cn(
                  'h-6 w-6 transition-transform',
                  isActive && 'scale-110',
                )}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span className={cn(
                'text-[11px] font-medium',
                isActive && 'font-semibold',
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BottomNav } from '@/components/bottom-nav'
import { PenLine, BookOpen, Feather, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { RecentWritings } from '@/components/recent-writings'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Buenos dias'
  if (hour >= 12 && hour < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export function HomeContent({ userEmail }: { userEmail: string }) {
  const [greeting, setGreeting] = useState('')
  const router = useRouter()

  useEffect(() => {
    setGreeting(getGreeting())
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const displayName = userEmail.split('@')[0]

  return (
    <main className="flex min-h-svh flex-col bg-background pb-28">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-10 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-[0.75rem] bg-primary">
            <PenLine className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-bold text-foreground">Pluma</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Cerrar sesion"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </header>

      {/* Greeting */}
      <section className="px-6 pt-8 pb-2">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">{greeting}</p>
        <h1 className="mt-1 font-serif text-3xl font-bold leading-tight text-foreground">
          {displayName}
        </h1>
      </section>

      {/* Question */}
      <section className="px-6 pt-8 pb-5">
        <h2 className="font-serif text-xl font-semibold text-foreground text-balance">
          {'Que deseas escribir hoy?'}
        </h2>
      </section>

      {/* Writing Options - Card style like reference */}
      <section className="flex gap-4 px-6" aria-label="Opciones de escritura">
        <Link href="/escribir/poema" className="flex-1">
          <div className="group flex flex-col items-center gap-4 rounded-[1.25rem] bg-primary/8 p-6 transition-all hover:bg-primary/15 active:scale-[0.98]">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15">
              <Feather className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <span className="block font-serif text-lg font-semibold text-foreground">Poema</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">Versos libres</span>
            </div>
          </div>
        </Link>

        <Link href="/escribir/microcuento" className="flex-1">
          <div className="group flex flex-col items-center gap-4 rounded-[1.25rem] bg-accent/8 p-6 transition-all hover:bg-accent/15 active:scale-[0.98]">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15">
              <BookOpen className="h-8 w-8 text-accent" />
            </div>
            <div className="text-center">
              <span className="block font-serif text-lg font-semibold text-foreground">Microcuento</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">Historias breves</span>
            </div>
          </div>
        </Link>
      </section>

      {/* Recent Writings */}
      <RecentWritings />

      <BottomNav />
    </main>
  )
}

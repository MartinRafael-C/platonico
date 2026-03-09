'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PenLine } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Las contrasenas no coinciden')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/home`,
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Ocurrio un error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-primary">
              <PenLine className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Pluma</h1>
          </div>

          {/* Card */}
          <div className="w-full rounded-[1.5rem] bg-card p-7 shadow-sm">
            <h2 className="mb-1 font-serif text-xl font-semibold text-card-foreground">
              Crear cuenta
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Unete a la comunidad de escritores
            </p>

            <form onSubmit={handleSignUp} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">Correo electronico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border-border bg-background py-5"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">Contrasena</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl border-border bg-background py-5"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="repeat-password" className="text-sm font-medium text-foreground">Repetir contrasena</Label>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="rounded-xl border-border bg-background py-5"
                />
              </div>
              {error && (
                <p className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive" role="alert">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full rounded-full py-6 text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'Creando cuenta...' : 'Registrarse'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {'Ya tienes cuenta? '}
              <Link
                href="/auth/login"
                className="font-semibold text-primary hover:underline"
              >
                Iniciar Sesion
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

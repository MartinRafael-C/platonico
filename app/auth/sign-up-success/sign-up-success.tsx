import { PenLine, Mail } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SignUpSuccessPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-primary">
              <PenLine className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Pluma</h1>
          </div>

          <div className="w-full rounded-[1.5rem] bg-card p-7 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-2 font-serif text-xl font-semibold text-card-foreground">
              Revisa tu correo
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              Te hemos enviado un enlace de confirmacion. Revisa tu bandeja de entrada para activar tu cuenta.
            </p>
            <Button asChild variant="outline" className="w-full rounded-full py-5 font-semibold">
              <Link href="/auth/login">Volver al inicio de sesion</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

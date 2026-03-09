import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-between bg-background px-6 py-12">
      {/* Illustration */}
      <div className="flex flex-1 items-center justify-center">
        <div className="relative h-72 w-72 overflow-hidden rounded-[2rem]">
          <Image
            src="/images/writer-illustration.jpg"
            alt="Ilustracion de un escritor"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
        <div>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground text-balance">
            Pluma
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground text-pretty">
            {'Tu espacio para escribir, leer y descubrir. Cada palabra cuenta una historia.'}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <Button
            asChild
            size="lg"
            className="w-full rounded-full py-6 text-base font-semibold"
          >
            <Link href="/auth/login">Iniciar Sesion</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full rounded-full py-6 text-base font-semibold"
          >
            <Link href="/auth/sign-up">Crear Cuenta</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

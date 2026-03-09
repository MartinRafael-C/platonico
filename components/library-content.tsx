'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import { BottomNav } from '@/components/bottom-nav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { QrCode, BookOpen, Plus, Trash2, X, Library } from 'lucide-react'
import { toast } from 'sonner'
import { QrScanner } from '@/components/qr-scanner'

interface Book {
  id: string
  title: string
  author: string | null
  isbn: string | null
  scanned_data: string | null
  created_at: string
}

async function fetchBooks(): Promise<Book[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function LibraryContent() {
  const { data: books, mutate } = useSWR('books', fetchBooks)
  const [showScanner, setShowScanner] = useState(false)
  const [showManualAdd, setShowManualAdd] = useState(false)
  const [manualTitle, setManualTitle] = useState('')
  const [manualAuthor, setManualAuthor] = useState('')

  const handleQrResult = async (result: string) => {
    setShowScanner(false)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase.from('books').insert({
      user_id: user.id,
      title: result.length > 50 ? result.substring(0, 50) : result,
      isbn: result.match(/^\d{10,13}$/) ? result : null,
      scanned_data: result,
    })

    if (error) {
      toast.error('Error al agregar el libro')
    } else {
      toast.success('Libro agregado a tu biblioteca')
      mutate()
    }
  }

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualTitle.trim()) return

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase.from('books').insert({
      user_id: user.id,
      title: manualTitle.trim(),
      author: manualAuthor.trim() || null,
    })

    if (error) {
      toast.error('Error al agregar el libro')
    } else {
      toast.success('Libro agregado')
      setManualTitle('')
      setManualAuthor('')
      setShowManualAdd(false)
      mutate()
    }
  }

  const handleDeleteBook = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('books').delete().eq('id', id)
    if (error) {
      toast.error('Error al eliminar')
    } else {
      toast.success('Libro eliminado')
      mutate()
    }
  }

  return (
    <main className="flex min-h-svh flex-col bg-background pb-28">
      {/* Header */}
      <header className="px-6 pt-10 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
            <Library className="h-5 w-5 text-primary" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Mi Biblioteca
          </h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Escanea codigos QR para agregar libros
        </p>
      </header>

      {/* Action Buttons */}
      <section className="flex gap-3 px-6 pt-5 pb-6">
        <Button
          onClick={() => setShowScanner(true)}
          className="flex-1 gap-2 rounded-full py-5 text-sm font-semibold"
          size="lg"
        >
          <QrCode className="h-4 w-4" />
          Escanear QR
        </Button>
        <Button
          onClick={() => setShowManualAdd(true)}
          variant="outline"
          className="flex-1 gap-2 rounded-full py-5 text-sm font-semibold"
          size="lg"
        >
          <Plus className="h-4 w-4" />
          Agregar manual
        </Button>
      </section>

      {/* QR Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 px-6 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[1.5rem] bg-card p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold text-card-foreground">
                Escanear QR
              </h2>
              <button
                onClick={() => setShowScanner(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
                aria-label="Cerrar escaner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <QrScanner
              onResult={handleQrResult}
              onClose={() => setShowScanner(false)}
            />
          </div>
        </div>
      )}

      {/* Manual Add Modal */}
      {showManualAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 px-6 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[1.5rem] bg-card p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold text-card-foreground">
                Agregar libro
              </h2>
              <button
                onClick={() => setShowManualAdd(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
                aria-label="Cerrar formulario"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleManualAdd} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="book-title" className="text-sm font-medium text-foreground">Titulo del libro</Label>
                <Input
                  id="book-title"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="El nombre del libro"
                  required
                  className="rounded-xl border-border bg-background py-5"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="book-author" className="text-sm font-medium text-foreground">Autor (opcional)</Label>
                <Input
                  id="book-author"
                  value={manualAuthor}
                  onChange={(e) => setManualAuthor(e.target.value)}
                  placeholder="Nombre del autor"
                  className="rounded-xl border-border bg-background py-5"
                />
              </div>
              <Button type="submit" className="w-full rounded-full py-5 font-semibold">
                Agregar
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Books List */}
      <section className="px-6">
        {!books || books.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-[1.5rem] bg-secondary/50 py-14 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <BookOpen className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <div>
              <p className="font-serif text-base font-semibold text-foreground">
                Tu biblioteca esta vacia
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Escanea un codigo QR para empezar
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-muted-foreground">
              {books.length} {books.length === 1 ? 'libro' : 'libros'}
            </p>
            {books.map((book) => (
              <article
                key={book.id}
                className="group flex items-start gap-4 rounded-[1.25rem] bg-card p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-card-foreground">
                    {book.title}
                  </h3>
                  {book.author && (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {book.author}
                    </p>
                  )}
                  {book.isbn && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      ISBN: {book.isbn}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(book.created_at).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteBook(book.id)}
                  className="shrink-0 rounded-full p-2 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  aria-label={`Eliminar ${book.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  )
}

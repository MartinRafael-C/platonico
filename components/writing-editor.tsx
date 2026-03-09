'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, RefreshCw, Feather, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import { getRandomQuote } from '@/lib/quotes'

interface WritingEditorProps {
  type: 'poema' | 'microcuento'
}

export function WritingEditor({ type }: WritingEditorProps) {
  const router = useRouter()
  const [quote, setQuote] = useState({ text: '', author: '' })
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const refreshQuote = useCallback(() => {
    setQuote(getRandomQuote(type))
  }, [type])

  useEffect(() => {
    refreshQuote()
  }, [refreshQuote])

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error('Escribe algo antes de guardar')
      return
    }

    setIsSaving(true)
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error('Debes iniciar sesion')
      setIsSaving(false)
      return
    }

    const { error } = await supabase.from('writings').insert({
      user_id: user.id,
      type,
      quote: quote.text,
      content: content.trim(),
    })

    if (error) {
      toast.error('Error al guardar tu escrito')
    } else {
      toast.success(
        type === 'poema' ? 'Poema guardado' : 'Microcuento guardado',
      )
      router.push('/home')
    }
    setIsSaving(false)
  }

  const title = type === 'poema' ? 'Poema' : 'Microcuento'
  const Icon = type === 'poema' ? Feather : BookOpen

  return (
    <main className="flex min-h-svh flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 pt-10 pb-4">
        <button
          onClick={() => router.back()}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-muted"
          aria-label="Volver"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <h1 className="font-serif text-xl font-bold text-foreground">
            {title}
          </h1>
        </div>
      </header>

      {/* Quote Card */}
      <section className="px-6 pb-6">
        <div className="relative rounded-[1.5rem] bg-primary/8 p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Inspiracion
            </span>
            <button
              onClick={refreshQuote}
              className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
              aria-label="Nueva cita"
            >
              <RefreshCw className="h-3 w-3" />
              Otra
            </button>
          </div>
          <blockquote className="font-serif text-lg italic leading-relaxed text-foreground">
            {`\u201C${quote.text}\u201D`}
          </blockquote>
          <p className="mt-4 text-sm font-semibold text-primary">
            {'— '}{quote.author}
          </p>
        </div>
      </section>

      {/* Editor */}
      <section className="flex flex-1 flex-col px-6 pb-10">
        <label
          htmlFor="writing-area"
          className="mb-3 text-sm font-medium text-muted-foreground"
        >
          Escribe algo con respecto a esto...
        </label>
        <textarea
          id="writing-area"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            type === 'poema'
              ? 'Deja que las palabras fluyan...'
              : 'Habia una vez...'
          }
          className="flex-1 resize-none rounded-[1.25rem] border-none bg-card p-6 font-sans text-base leading-relaxed text-card-foreground shadow-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
          rows={10}
        />

        <Button
          onClick={handleSave}
          disabled={isSaving || !content.trim()}
          size="lg"
          className="mt-6 w-full gap-2 rounded-full py-6 text-base font-semibold"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Guardando...' : 'Guardar'}
        </Button>
      </section>
    </main>
  )
}

'use client'

import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import { Feather, BookOpen, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Writing {
  id: string
  type: 'poema' | 'microcuento'
  quote: string
  content: string
  created_at: string
}

async function fetchWritings(): Promise<Writing[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('writings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) throw error
  return data ?? []
}

export function RecentWritings() {
  const { data: writings, error, mutate } = useSWR('writings', fetchWritings)

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('writings').delete().eq('id', id)
    if (error) {
      toast.error('Error al eliminar')
    } else {
      toast.success('Escrito eliminado')
      mutate()
    }
  }

  if (error) return null
  if (!writings || writings.length === 0) {
    return (
      <section className="px-6 pt-10">
        <div className="flex flex-col items-center gap-3 rounded-[1.25rem] bg-secondary/50 py-10 text-center">
          <Feather className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            {'Aun no has escrito nada. Empieza hoy!'}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="px-6 pt-10">
      <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">
        Tus escritos recientes
      </h3>
      <div className="flex flex-col gap-3">
        {writings.map((w) => (
          <article
            key={w.id}
            className="group relative rounded-[1.25rem] bg-card p-5 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                {w.type === 'poema' ? (
                  <Feather className="h-5 w-5 text-primary" />
                ) : (
                  <BookOpen className="h-5 w-5 text-accent" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {w.type}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(w.created_at).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-card-foreground">
                  {w.content}
                </p>
              </div>
              <button
                onClick={() => handleDelete(w.id)}
                className="shrink-0 rounded-full p-2 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                aria-label="Eliminar escrito"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

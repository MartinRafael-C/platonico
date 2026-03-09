import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { WritingEditor } from '@/components/writing-editor'

export default async function WritingPage({
  params,
}: {
  params: Promise<{ type: string }>
}) {
  const { type } = await params

  if (type !== 'poema' && type !== 'microcuento') {
    notFound()
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return <WritingEditor type={type as 'poema' | 'microcuento'} />
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LibraryContent } from '@/components/library-content'

export default async function BibliotecaPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return <LibraryContent />
}

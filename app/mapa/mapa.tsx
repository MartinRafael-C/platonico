import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MapContent } from '@/components/map-content'

export default async function MapaPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return <MapContent />
}

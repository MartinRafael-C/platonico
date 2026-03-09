'use client'

import { useState, useEffect } from 'react'
import { BottomNav } from '@/components/bottom-nav'
import { MapPin, Loader2, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'

const LibraryMap = dynamic(() => import('@/components/library-map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[55vh] items-center justify-center rounded-[1.5rem] bg-secondary/50">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
})

interface Library {
  name: string
  lat: number
  lng: number
  address: string
}

export function MapContent() {
  const [userLocation, setUserLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [libraries, setLibraries] = useState<Library[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalizacion')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ lat: latitude, lng: longitude })

        try {
          const radius = 5000
          const query = `[out:json];(node["amenity"="library"](around:${radius},${latitude},${longitude});way["amenity"="library"](around:${radius},${latitude},${longitude}););out center;`
          const response = await fetch(
            `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`,
          )
          const data = await response.json()

          const foundLibraries: Library[] = data.elements
            .map((el: any) => ({
              name: el.tags?.name || 'Biblioteca',
              lat: el.lat || el.center?.lat,
              lng: el.lon || el.center?.lon,
              address: el.tags?.['addr:street']
                ? `${el.tags['addr:street']} ${el.tags['addr:housenumber'] || ''}`
                : 'Direccion no disponible',
            }))
            .filter((l: Library) => l.lat && l.lng)

          setLibraries(foundLibraries)
        } catch {
          setLibraries([])
        }

        setLoading(false)
      },
      () => {
        setError('No pudimos acceder a tu ubicacion. Activa la geolocalizacion.')
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }, [])

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    window.location.reload()
  }

  return (
    <main className="flex min-h-svh flex-col bg-background pb-28">
      {/* Header */}
      <header className="px-6 pt-10 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Bibliotecas cercanas
          </h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Encuentra lugares para leer cerca de ti
        </p>
      </header>

      {/* Map */}
      <section className="px-6 pt-5">
        {loading ? (
          <div className="flex h-[55vh] flex-col items-center justify-center gap-4 rounded-[1.5rem] bg-secondary/50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Buscando bibliotecas cercanas...
            </p>
          </div>
        ) : error ? (
          <div className="flex h-[55vh] flex-col items-center justify-center gap-4 rounded-[1.5rem] bg-secondary/50 px-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Navigation className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={handleRetry} variant="outline" size="sm" className="rounded-full px-6">
              Reintentar
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-[1.5rem] shadow-sm">
              <LibraryMap
                userLocation={userLocation}
                libraries={libraries}
              />
            </div>

            {/* Library List */}
            <div className="mt-6 flex flex-col gap-3">
              <p className="text-sm font-medium text-muted-foreground">
                {libraries.length === 0
                  ? 'No se encontraron bibliotecas cercanas'
                  : `${libraries.length} ${libraries.length === 1 ? 'biblioteca encontrada' : 'bibliotecas encontradas'}`}
              </p>
              {libraries.map((lib, i) => (
                <article
                  key={`${lib.lat}-${lib.lng}-${i}`}
                  className="flex items-start gap-4 rounded-[1.25rem] bg-card p-5 shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">
                      {lib.name}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {lib.address}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <BottomNav />
    </main>
  )
}

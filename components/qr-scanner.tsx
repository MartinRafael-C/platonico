'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface QrScannerProps {
  onResult: (result: string) => void
  onClose: () => void
}

export function QrScanner({ onResult, onClose }: QrScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null)
  const [manualCode, setManualCode] = useState('')
  const [scannerActive, setScannerActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let html5QrCode: any = null

    const startScanner = async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode')
        html5QrCode = new Html5Qrcode('qr-reader')

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText: string) => {
            html5QrCode.stop().catch(() => {})
            onResult(decodedText)
          },
          () => {},
        )
        setScannerActive(true)
      } catch (err) {
        setError(
          'No se pudo acceder a la camara. Ingresa el codigo manualmente.',
        )
      }
    }

    startScanner()

    return () => {
      if (html5QrCode) {
        html5QrCode.stop().catch(() => {})
      }
    }
  }, [onResult])

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualCode.trim()) {
      onResult(manualCode.trim())
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {!error && (
        <div
          id="qr-reader"
          ref={scannerRef}
          className="overflow-hidden rounded-xl"
        />
      )}

      {error && (
        <div className="flex flex-col items-center gap-3 rounded-[1.25rem] bg-secondary/50 p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <Camera className="h-7 w-7 text-muted-foreground/60" />
          </div>
          <p className="text-center text-sm text-muted-foreground">{error}</p>
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-x-0 top-1/2 border-t border-border" />
        <p className="relative mx-auto w-fit bg-card px-4 text-xs font-medium text-muted-foreground">
          o ingresa manualmente
        </p>
      </div>

      <form onSubmit={handleManualSubmit} className="flex gap-2">
        <Input
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          placeholder="ISBN o titulo del libro"
          className="rounded-xl border-border bg-background py-5"
        />
        <Button type="submit" size="sm" className="rounded-xl px-5">
          Agregar
        </Button>
      </form>
    </div>
  )
}

'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for leaflet marker icons in Next.js
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const userIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'hue-rotate-180',
})

interface LibraryMapProps {
  userLocation: { lat: number; lng: number } | null
  libraries: {
    name: string
    lat: number
    lng: number
    address: string
  }[]
}

export default function LibraryMap({
  userLocation,
  libraries,
}: LibraryMapProps) {
  const center = userLocation ?? { lat: 19.4326, lng: -99.1332 } // Default: Mexico City

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={14}
      scrollWheelZoom={true}
      style={{ height: '55vh', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User marker */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>
            <strong>Tu ubicacion</strong>
          </Popup>
        </Marker>
      )}

      {/* Library markers */}
      {libraries.map((lib, i) => (
        <Marker
          key={`${lib.lat}-${lib.lng}-${i}`}
          position={[lib.lat, lib.lng]}
          icon={defaultIcon}
        >
          <Popup>
            <strong>{lib.name}</strong>
            <br />
            {lib.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

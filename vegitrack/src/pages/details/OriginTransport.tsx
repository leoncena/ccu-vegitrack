import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { DebugFooter, PageHeaderWithBack } from '../../components/layout'
import {
  SupplyChainCard,
  FreshnessCard,
  TransportStats,
  Spinner,
  type SupplyChainCardData,
  type SupplyChainType,
  type TransportStat,
} from '../../components/ui'
import { getProductByDisplayId, getProductById, getFarmById, getSupplyChain } from '../../lib/api'
import type { Farm, Product, SupplyChainBlock } from '../../types/database'
import { VerifiedBadge } from '../../components/features/VegiChain'

// Import SVG icons
import originPinIcon from '../../assets/origin/origin_pin.svg'
import packagingCenterIcon from '../../assets/origin/Packaging_center.svg'
import distributionCenterIcon from '../../assets/origin/distrubution_center.svg'
import supermarketIcon from '../../assets/origin/supermarket.svg'
import refrigeratedTruckIcon from '../../assets/origin/refrigerated_truck.svg'
import distanceIcon from '../../assets/origin/distance.svg'
import co2eIcon from '../../assets/origin/co2e.svg'

// Fix default Leaflet marker asset paths for Vite
const markerIcon = new L.Icon({
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).toString(),
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).toString(),
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).toString(),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})
L.Marker.prototype.options.icon = markerIcon

// Demo data - Transport Stats (can be made dynamic later if data exists)
const TRANSPORT_STATS: TransportStat[] = [
  {
    icon: refrigeratedTruckIcon,
    label: 'Refrigerated\nTruck',
    iconScale: 0.5,
  },
  {
    icon: distanceIcon,
    label: '350 km', // This should ideally be dynamic
    iconScale: 0.5,
  },
  {
    icon: co2eIcon,
    label: '0.025 kg\nCO2e',
    iconScale: 0.5,
  },
]

// Demo data - Freshness
const FRESHNESS_DATA = {
  isFresh: true,
  durationDays: 2,
  durationHours: 9,
}

type LatLng = { lat: number; lng: number }

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

function normalizePoint(coords: any): LatLng | null {
  if (!coords) return null
  if (typeof coords === 'string') {
    const match = coords.match(/\(([-0-9.]+),\s*([-0-9.]+)\)/)
    if (match) return { lng: Number(match[1]), lat: Number(match[2]) }
  }
  if (Array.isArray(coords) && coords.length >= 2) {
    return { lng: Number(coords[0]), lat: Number(coords[1]) }
  }
  if (typeof coords === 'object') {
    if ('lat' in coords && 'lng' in coords) return { lat: Number(coords.lat), lng: Number(coords.lng) }
    if ('y' in coords && 'x' in coords) return { lat: Number((coords as any).y), lng: Number((coords as any).x) }
  }
  return null
}

function getIconForEventType(type: string): string {
  switch (type) {
    case 'harvest': return originPinIcon
    case 'package': return packagingCenterIcon
    case 'distribution': return distributionCenterIcon
    case 'store_arrival': return supermarketIcon
    default: return originPinIcon
  }
}

function formatDistance(km: number | null | undefined): string {
  if (km === null || km === undefined) return ''
  return `${Math.round(km)} km away`
}

export default function OriginTransport() {
  const { id } = useParams()
  const [farm, setFarm] = useState<Farm | null>(null)
  const [mapCenter, setMapCenter] = useState<LatLng | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chain, setChain] = useState<SupplyChainBlock[]>([])
  const [initialCenterSet, setInitialCenterSet] = useState(false)

  useEffect(() => {
    async function load() {
      if (!id) return
      setLoading(true)
      setError(null)
      try {
        let prod: Product | null = await getProductById(id)
        if (!prod) {
          prod = await getProductByDisplayId(id)
        }
        if (!prod) {
          setError('Product not found')
          setLoading(false)
          return
        }

        if (prod.farm_id) {
          const farmData = await getFarmById(prod.farm_id)
          setFarm(farmData)
          const coords = normalizePoint(farmData?.coordinates)
          if (coords) setMapCenter(coords)
        }

        const supply = await getSupplyChain(prod.id)
        setChain(supply || [])

        if (!initialCenterSet && supply?.length) {
          const firstWithCoords = supply.map((b) => normalizePoint(b.coordinates)).find(Boolean)
          if (firstWithCoords) {
            setMapCenter(firstWithCoords)
            setInitialCenterSet(true)
          }
        }
      } catch (err) {
        console.error('Failed to load origin data', err)
        setError('Failed to load origin data')
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [id, initialCenterSet])

  // Calculate total distance
  const totalDistance = useMemo(() => {
    if (!chain || chain.length < 2) return 0
    let dist = 0
    for (let i = 0; i < chain.length - 1; i++) {
      const p1 = normalizePoint(chain[i].coordinates)
      const p2 = normalizePoint(chain[i+1].coordinates)
      if (p1 && p2) {
        dist += calculateDistance(p1.lat, p1.lng, p2.lat, p2.lng)
      }
    }
    return Math.round(dist)
  }, [chain])

  const transportStats = useMemo(() => {
    const stats = [...TRANSPORT_STATS]
    if (totalDistance > 0) {
      stats[1] = { ...stats[1], label: `${totalDistance} km` }
    }
    return stats
  }, [totalDistance])

  // Generate cards from chain data
  const { originCards, transportCards } = useMemo(() => {
    const origin: (SupplyChainCardData & { icon: string })[] = []
    const transport: (SupplyChainCardData & { icon: string })[] = []

    chain.forEach((block) => {
      const date = new Date(block.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      const details = block.details || {}
      
      // Map event_type to SupplyChainType
      let supplyChainType: SupplyChainType = 'origin'
      if (block.event_type === 'harvest') {
        supplyChainType = 'origin'
      } else if (block.event_type === 'package') {
        supplyChainType = 'packaging_center'
      } else if (block.event_type === 'distribution') {
        supplyChainType = 'distribution_center'
      } else if (block.event_type === 'store_arrival') {
        supplyChainType = 'supermarket'
      }

      const cardData: SupplyChainCardData & { icon: string } = {
        type: supplyChainType,
        title: block.location_name,
        date: date,
        distance: formatDistance(block.distance_from_store_km),
        icon: getIconForEventType(block.event_type),
        // Map specific details to card fields
        description: block.event_type === 'harvest' ? 'Harvested at peak ripeness' : undefined,
        packagingHours: details.packaging_duration ? `${details.packaging_duration}` : undefined,
        storageInfo: block.storage_type ? `Storage: ${block.storage_type.charAt(0).toUpperCase() + block.storage_type.slice(1)}` : undefined,
      }

      if (block.event_type === 'harvest') {
        origin.push(cardData)
      } else {
        transport.push(cardData)
      }
    })

    return { originCards: origin, transportCards: transport }
  }, [chain])

  const mapsLinks = useMemo(() => {
    if (!mapCenter) return null
    const { lat, lng } = mapCenter
    return {
      google: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      apple: `https://maps.apple.com/?ll=${lat},${lng}`,
    }
  }, [mapCenter])

  const chainMarkers = useMemo(() => {
    return chain
      .map((block) => {
        const coords = normalizePoint(block.coordinates)
        if (!coords) return null
        return {
          coords,
          title: block.location_name,
          type: block.event_type,
          time: new Date(block.timestamp).toLocaleString(),
          details: block.details,
          mapLinks: {
            google: `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`,
            apple: `https://maps.apple.com/?ll=${coords.lat},${coords.lng}`,
          },
        }
      })
      .filter(Boolean) as {
        coords: LatLng
        title: string
        type: string
        time: string
        details: Record<string, unknown>
        mapLinks: { google: string; apple: string }
      }[]
  }, [chain])

  const polylinePositions = chainMarkers.map((m) => [m.coords.lat, m.coords.lng])

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--color-surface-light-green-back)',
        paddingTop: '20px',
        paddingBottom: '60px',
        paddingLeft: '10%',
        paddingRight: '10%',
      }}
    >
      <PageHeaderWithBack title="Origin & Transport" backTo={`/product/${id}`} />

      {/* Map */}
      <div
        className="w-full"
        style={{
          height: '260px',
          backgroundColor: 'var(--color-card)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-primary-light)',
          marginBottom: 'var(--spacing-card)',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Spinner className="text-green-800" />
          </div>
        ) : mapCenter ? (
          <MapContainer
            center={[mapCenter.lat, mapCenter.lng] as [number, number]}
            zoom={7}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {polylinePositions.length > 1 ? (
              <Polyline 
                positions={polylinePositions as [number, number][]} 
                pathOptions={{ color: "#1c8c3d", weight: 4 }} 
              />
            ) : null}
            {chainMarkers.length
              ? chainMarkers.map((m, idx) => (
                  <Marker key={`${m.title}-${idx}`} position={[m.coords.lat, m.coords.lng]}>
                    <Popup>
                      <div style={{ fontFamily: 'var(--font-body)', maxWidth: '220px' }}>
                        <strong>{m.title}</strong>
                        <div style={{ fontSize: '12px', marginTop: '4px' }}>{m.type}</div>
                        <div style={{ fontSize: '12px', opacity: 0.7 }}>{m.time}</div>
                        <div style={{ marginTop: '6px' }}>
                          <a href={m.mapLinks.google} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>
                            Google Maps
                          </a>
                          {' · '}
                          <a href={m.mapLinks.apple} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>
                            Apple Maps
                          </a>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))
              : (
                  <Marker position={[mapCenter.lat, mapCenter.lng]}>
                    <Popup>
                      <div style={{ fontFamily: 'var(--font-body)' }}>
                        <strong>{farm?.name || 'Farm'}</strong>
                        <div>{farm?.full_address || `${mapCenter.lat.toFixed(4)}, ${mapCenter.lng.toFixed(4)}`}</div>
                      </div>
                    </Popup>
                  </Marker>
                )}
          </MapContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-center px-4" style={{ fontFamily: 'var(--font-body)' }}>
            {error ? error : 'No location data available for this farm.'}
          </div>
        )}
      </div>

      {mapsLinks ? (
        <div className="flex gap-3 mb-6" style={{ flexWrap: 'wrap' }}>
          <a
            href={mapsLinks.google}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 text-sm"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-body)',
              textDecoration: 'none',
            }}
          >
            Open in Google Maps
          </a>
          <a
            href={mapsLinks.apple}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 text-sm"
            style={{
              backgroundColor: 'var(--color-card)',
              color: 'var(--color-text)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-body)',
              textDecoration: 'none',
              border: '1px solid var(--color-primary-light)',
            }}
          >
            Open in Apple Maps
          </a>
        </div>
      ) : null}

      {/* Transport Stats - Three icons below map*/}
      <TransportStats stats={transportStats} />

      {/* Origin Section */}
      <h2
        className="text-base"
        style={{ 
          fontFamily: 'var(--font-body)', 
          fontWeight: 500,
          marginBottom: 'var(--spacing-card)',
        }}
      >
        Origin
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-card)' }}>
        {originCards.length > 0 ? originCards.map((item, index) => (
          <SupplyChainCard key={index} data={item} icon={item.icon} />
        )) : (
          <div className="text-sm opacity-60">Loading origin data...</div>
        )}
      </div>

      {/* Transportation Section */}
      <h2
        className="text-base"
        style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          marginTop: 'calc(2 * var(--spacing-card))',
          marginBottom: 'var(--spacing-card)',
        }}
      >
        Transportation
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-card)' }}>
        {transportCards.length > 0 ? transportCards.map((item, index) => (
          <SupplyChainCard key={index} data={item} icon={item.icon} />
        )) : (
          <div className="text-sm opacity-60">Loading transport data...</div>
        )}
      </div>

      {/* Freshness Report Section */}
      <h2
        className="text-base"
        style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          marginTop: 'calc(2 * var(--spacing-card))',
          marginBottom: 'var(--spacing-card)',
        }}
      >
        Freshness Report
      </h2>

      <FreshnessCard
        isFresh={FRESHNESS_DATA.isFresh}
        durationDays={FRESHNESS_DATA.durationDays}
        durationHours={FRESHNESS_DATA.durationHours}
      />

      {/* Debug Footer */}
      <DebugFooter />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'calc(var(--spacing-card) * 0.5)',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          padding: 'calc(var(--spacing-section) * 1.5)',
          marginTop: 'calc(var(--spacing-section) * 1.5)',
          marginBottom: 'calc(var(--spacing-section) * 1.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--spacing-card) * 0.5)' }}>
          <VerifiedBadge size="md" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-card) * 0.25)' }}>
            <span className="text-xs" style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-text)' }}>
              Supply chain events anchored on VegiChain
            </span>
            <span className="text-xs" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)' }}>
              Harvest, packaging, cold-chain handoffs, and store arrival are hashed blocks to expose tampering.
            </span>
          </div>
        </div>
        <Link
          to="/blockchain/assurance"
          className="text-xs"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-primary)',
            textDecoration: 'underline',
            fontWeight: 600,
          }}
        >
          What this verification covers
        </Link>
      </div>
    </div>
  )
}
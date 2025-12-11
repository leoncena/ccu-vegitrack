import { useParams } from 'react-router-dom'
import { DebugFooter, PageHeaderWithBack } from '../../components/layout'
import {
  SupplyChainCard,
  FreshnessCard,
  TransportStats,
  type SupplyChainCardData,
  type TransportStat,
} from '../../components/ui'

// Import SVG icons
import originPinIcon from '../../assets/origin/origin_pin.svg'
import packagingCenterIcon from '../../assets/origin/Packaging_center.svg'
import distributionCenterIcon from '../../assets/origin/distrubution_center.svg'
import supermarketIcon from '../../assets/origin/supermarket.svg'
import refrigeratedTruckIcon from '../../assets/origin/refrigerated_truck.svg'
import distanceIcon from '../../assets/origin/distance.svg'
import co2eIcon from '../../assets/origin/co2e.svg'

// Demo data - Supply Chain
const SUPPLY_CHAIN_DATA: (SupplyChainCardData & { icon: string })[] = [
  {
    type: 'origin',
    title: 'Quinta do Sol',
    date: 'Nov 18, 2025',
    distance: '230 km away',
    description: 'Harvested at peak ripeness at dawn',
    icon: originPinIcon,
  },
  {
    type: 'packaging_center',
    title: 'Packaging Center',
    date: 'Nov 18, 2025',
    distance: '157 km away',
    packagingHours: '7 hours',
    icon: packagingCenterIcon,
  },
  {
    type: 'distribution_center',
    title: 'Distribution Center',
    date: 'Nov 19, 2025',
    distance: '80 km away',
    storageInfo: 'Storage: Refrigerated',
    icon: distributionCenterIcon,
  },
  {
    type: 'supermarket',
    title: 'My Auchan - Largo da Graça',
    date: 'Nov 20, 2025',
    distance: '0 km away',
    icon: supermarketIcon,
  },
]

// Demo data - Transport Stats
const TRANSPORT_STATS: TransportStat[] = [
  {
    icon: refrigeratedTruckIcon,
    label: 'Refrigerated\nTruck',
    iconScale: 0.5, // Scale to 50% of original size
  },
  {
    icon: distanceIcon,
    label: '350 km',
    iconScale: 0.5, // Scale to 50% to match truck icon height
  },
  {
    icon: co2eIcon,
    label: '0.025 kg\nCO2e',
    iconScale: 0.5, // Scale to 50% to match truck icon height
  },
]

// Demo data - Freshness
const FRESHNESS_DATA = {
  isFresh: true,
  durationDays: 2,
  durationHours: 9,
}

export default function OriginTransport() {
  const { id } = useParams()

  // Get origin and transport sections
  const originCards = SUPPLY_CHAIN_DATA.filter((item) => item.type === 'origin')
  const transportCards = SUPPLY_CHAIN_DATA.filter(
    (item) =>
      item.type === 'packaging_center' ||
      item.type === 'distribution_center' ||
      item.type === 'supermarket'
  )

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

      {/* Map placeholder */}
      <div
        className="h-48 flex items-center justify-center"
        style={{
          backgroundColor: 'var(--color-card)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-primary-light)',
          marginBottom: 'var(--spacing-card)',
        }}
      >
        <span className="text-4xl">🗺️</span>
      </div>

      {/* Transport Stats - Three icons below map*/}
      <TransportStats stats={TRANSPORT_STATS} />

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
        {originCards.map((item, index) => (
          <SupplyChainCard key={index} data={item} icon={item.icon} />
        ))}
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
        {transportCards.map((item, index) => (
          <SupplyChainCard key={index} data={item} icon={item.icon} />
        ))}
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
    </div>
  )
}
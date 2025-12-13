import type { SupplyChainBlock, CertificationBlock } from '../../types/database'

// Helper to truncate block hashes for display
export function truncateHash(hash: string): string {
  if (!hash || hash.length < 16) return hash
  return `${hash.slice(0, 8)}...${hash.slice(-4)}`
}

// Helper to format timestamps
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Event type icons and labels
const eventTypeConfig: Record<string, { icon: string; label: string }> = {
  harvest: { icon: '🌱', label: 'Harvested' },
  package: { icon: '📦', label: 'Packaged' },
  transport: { icon: '🚚', label: 'In Transit' },
  distribution: { icon: '🏭', label: 'Distribution' },
  store_arrival: { icon: '🛒', label: 'Store Arrival' },
}

interface BlockCardProps {
  blockIndex: number
  blockHash: string
  previousHash?: string | null
  title: string
  subtitle?: string
  timestamp: string
  icon?: string
  showHash?: boolean
  children?: React.ReactNode
  verified?: boolean
  assuranceHref?: string
}

export function BlockCard({
  blockIndex,
  blockHash,
  previousHash,
  title,
  subtitle,
  timestamp,
  icon,
  showHash = true,
  children,
  verified,
  assuranceHref,
}: BlockCardProps) {
  return (
    <div
      className="p-4 mb-1"
      style={{
        backgroundColor: 'var(--color-card)',
        borderRadius: 'var(--radius-card)',
      }}
    >
      {/* Header with icon and title */}
      <div className="flex items-start gap-3">
        {icon && <span className="text-2xl">{icon}</span>}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium mb-0.5" style={{ fontFamily: 'var(--font-body)' }}>
            {title}
          </p>
          {subtitle && (
            <p className="text-xs opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
              {subtitle}
            </p>
          )}
          <p className="text-xs opacity-60 mt-1" style={{ fontFamily: 'var(--font-body)' }}>
            {formatTimestamp(timestamp)}
          </p>
        </div>
        <div className="text-right">
          <span
            className="text-[10px] px-1.5 py-0.5"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              borderRadius: '4px',
              fontFamily: 'var(--font-body)',
            }}
          >
            Block #{blockIndex}
          </span>
        </div>
      </div>
          {verified && (
            assuranceHref ? (
              <a
                href={assuranceHref}
                style={{ textDecoration: 'none' }}
                aria-label="Verified on blockchain (learn more)"
              >
                <VerifiedBadge size="sm" />
              </a>
            ) : (
              <VerifiedBadge size="sm" />
            )
          )}

      {/* Optional content */}
      {children && <div className="mt-3 pt-3 border-t border-gray-200">{children}</div>}

      {/* Hash display */}
      {showHash && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-[10px]" style={{ fontFamily: 'var(--font-body)' }}>
            <span className="opacity-50">Hash:</span>
            <code className="opacity-70 font-mono">{truncateHash(blockHash)}</code>
          </div>
          {previousHash && (
            <div className="flex items-center justify-between text-[10px] mt-1" style={{ fontFamily: 'var(--font-body)' }}>
              <span className="opacity-50">Prev:</span>
              <code className="opacity-70 font-mono">{truncateHash(previousHash)}</code>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Chain link connector between blocks
function ChainLink() {
  return (
    <div className="flex justify-center py-1">
      <div
        className="w-0.5 h-4"
        style={{
          background: `repeating-linear-gradient(
            to bottom,
            var(--color-primary) 0px,
            var(--color-primary) 4px,
            transparent 4px,
            transparent 8px
          )`,
        }}
      />
    </div>
  )
}

interface ChainTimelineProps {
  blocks: SupplyChainBlock[]
  showHashes?: boolean
}

export function ChainTimeline({ blocks, showHashes = true }: ChainTimelineProps) {
  const sortedBlocks = [...blocks].sort((a, b) => a.block_index - b.block_index)

  return (
    <div>
      {sortedBlocks.map((block, index) => {
        const config = eventTypeConfig[block.event_type] || { icon: '📍', label: block.event_type }
        return (
          <div key={block.id}>
            <BlockCard
              blockIndex={block.block_index}
              blockHash={block.block_hash}
              previousHash={block.previous_hash}
              title={block.location_name}
              subtitle={block.distance_from_store_km ? `${block.distance_from_store_km} km from store` : undefined}
              timestamp={block.timestamp}
              icon={config.icon}
              showHash={showHashes}
              verified={block.blockchain_verified !== false}
              assuranceHref="/blockchain/assurance"
            >
              <div className="flex flex-wrap gap-2 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
                <span
                  className="px-2 py-0.5"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: '4px',
                  }}
                >
                  {config.label}
                </span>
                {block.storage_type && (
                  <span
                    className="px-2 py-0.5"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderRadius: '4px',
                    }}
                  >
                    {block.storage_type === 'refrigerated' ? '❄️ Refrigerated' : block.storage_type}
                  </span>
                )}
                {block.transport_method && (
                  <span
                    className="px-2 py-0.5"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderRadius: '4px',
                    }}
                  >
                    {block.transport_method === 'refrigerated_truck' ? '🚛 Refrigerated Truck' : block.transport_method}
                  </span>
                )}
              </div>
            </BlockCard>
            {index < sortedBlocks.length - 1 && <ChainLink />}
          </div>
        )
      })}
    </div>
  )
}

interface VerifiedBadgeProps {
  size?: 'sm' | 'md'
}

export function VerifiedBadge({ size = 'md' }: VerifiedBadgeProps) {
  const styles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${styles[size]}`}
      style={{
        backgroundColor: 'rgba(23, 78, 5, 0.08)',
        color: 'var(--color-primary)',
        border: '1px solid var(--color-primary)',
        borderRadius: 'var(--radius-button)',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
      </svg>
      Verified on VegiChain
    </span>
  )
}

interface CertificationCardProps {
  certification: CertificationBlock
  showHash?: boolean
}

export function CertificationCard({ certification, showHash = true }: CertificationCardProps) {
  const certIcons: Record<string, string> = {
    eu_organic: '🌿',
    fair_labor: '🤝',
    low_carbon: '🌍',
    local: '📍',
  }

  return (
    <div
      className="p-4 mb-4"
      style={{
        backgroundColor: 'var(--color-card)',
        borderRadius: 'var(--radius-card)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{certIcons[certification.cert_type] || '✓'}</span>
          <div>
            <span className="font-medium" style={{ fontFamily: 'var(--font-body)' }}>
              {certification.cert_type}
            </span>
            {certification.certifying_body_code && (
              <span className="text-xs opacity-60 ml-2">({certification.certifying_body_code})</span>
            )}
          </div>
        </div>
        {certification.blockchain_verified !== false && <VerifiedBadge size="sm" />}
      </div>

      {/* Audit info */}
      {certification.audit_date && (
        <p className="text-xs opacity-60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>
          Last audit: {new Date(certification.audit_date).toLocaleDateString()}
          {certification.auditor_name && ` by ${certification.auditor_name}`}
        </p>
      )}

      {/* Description */}
      {certification.description && (
        <p className="text-sm mb-3" style={{ fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
          {certification.description}
        </p>
      )}

      {/* Hash display */}
      {showHash && (
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-[10px]" style={{ fontFamily: 'var(--font-body)' }}>
            <span className="opacity-50">Block #{certification.block_index}</span>
            <code className="opacity-70 font-mono">{truncateHash(certification.block_hash)}</code>
          </div>
        </div>
      )}
    </div>
  )
}


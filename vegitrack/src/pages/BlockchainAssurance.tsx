import { Link } from 'react-router-dom'
import { PageWrapper } from '../components/layout/PageWrapper'
import { PageHeaderWithBack } from '../components/layout/PageHeaderWithBack'
import { VerifiedBadge } from '../components/features/VegiChain'

const sectionStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-card)',
  padding: 'calc(var(--spacing-section) * 1.1)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'calc(var(--spacing-card) * 0.9)',
}

const listStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'calc(var(--spacing-card) * 0.4)',
  margin: 0,
  paddingLeft: 'calc(var(--spacing-card) * 1.1)',
}

const sourceLinkStyle: React.CSSProperties = {
  color: 'var(--color-primary)',
  textDecoration: 'underline',
}

export default function BlockchainAssurance() {
  return (
    <PageWrapper
      style={{
        backgroundColor: 'var(--color-surface-light-green-back)',
        minHeight: '100vh',
        paddingBottom: 'calc(var(--spacing-page) * 2)',
      }}
    >
      <PageHeaderWithBack title="Blockchain Assurance" backTo="/start" />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'calc(var(--spacing-section) * 1.2)',
          paddingInline: 'calc(var(--spacing-section) * 0.8)',
          paddingBottom: 'calc(var(--spacing-section) * 1.2)',
        }}
      >
        <div style={sectionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--spacing-card) * 0.8)' }}>
            <VerifiedBadge size="md" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-card) * 0.25)' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-text)' }}>
                What "secured by blockchain" means here
              </span>
              <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)' }}>
                We anchor critical farming promises to VegiChain so you can see who signed what, when. Sensors, audits,
                and attestations feed the ledger; hashes make tampering evident.
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 'calc(var(--spacing-section) * 0.8)' }}>
          <div style={sectionStyle}>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-text)' }}>
              Guarantees we provide
            </span>
            <ul style={listStyle}>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                Time-stamped supply chain events (harvest, packaging, cold-chain handoffs) with hashed blocks and chain
                links.
              </li>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                Certification attestations (organic, fair labor, low carbon) signed and recorded with audit dates and
                issuing bodies.
              </li>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                Sustainability metrics (CO2e, water, land, energy per kg) when fed by trusted sensors or audited
                sources.
              </li>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                Farming practice logs (soil inputs, pest control, biodiversity, labor practices) when attested by
                auditors or device telemetry.
              </li>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                Immutable QR/product binding: scanned codes map to a single product ID with revocation via ledger status.
              </li>
            </ul>
          </div>

          <div style={sectionStyle}>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-text)' }}>
              What is not guaranteed (honest limits)
            </span>
            <ul style={listStyle}>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                Sensors and humans can lie; blockchain makes edits visible but cannot validate fake inputs by itself.
              </li>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                Biodiversity richness and pest pressure still need field surveys or imagery; we only secure the records of
                those checks.
              </li>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                Labor conditions rely on audited evidence and worker attestations; ledger entries do not replace on-site
                oversight.
              </li>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                Connectivity gaps may delay on-chain writes; some data can appear after a short lag.
              </li>
            </ul>
          </div>

          <div style={sectionStyle}>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-text)' }}>
              How we secure farming promises
            </span>
            <ul style={listStyle}>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                Signed attestations from certifiers and producers; device IDs for sensor payloads; hashes for media and
                reports.
              </li>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                Chain-linked blocks for supply chain and certification events to expose tampering.
              </li>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                Oracle approach: sensors (water/soil), telematics (applications), and audits feed the ledger; disputes
                trigger re-audits.
              </li>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                Off-chain evidence (images, PDFs) stored with content hashes; only references live on-chain for
                auditability.
              </li>
            </ul>
          </div>

          <div style={sectionStyle}>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-text)' }}>
              Sources & further reading
            </span>
            <ul style={listStyle}>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                Blockchain: Booming Technology for Pest Management (ResearchGate, 2025):{' '}
                <a href="https://www.researchgate.net/publication/390366829_Blockchain_Booming_Technology_for_Pest_Management_Article_ID_70362" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
              </li>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                Incentivizing research & innovation with agrobiodiversity (Journal of Cleaner Production, 2021):{' '}
                <a href="https://www.sciencedirect.com/science/article/pii/S0959652621013743" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
              </li>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                Preserving Nature's Ledger: Blockchains in Biodiversity Conservation (arXiv, 2024):{' '}
                <a href="https://arxiv.org/abs/24042404.12086" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
              </li>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                Blockchain and modern slavery: Reducing deceptive recruitment (Journal of Business Research, 2021):{' '}
                <a href="https://www.sciencedirect.com/science/article/pii/S0148296321002289" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
              </li>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                Blockchain and Human Rights: Ensuring Accountability (DLABI, 2024):{' '}
                <a href="https://dlabi.org/index.php/journal/article/view/301" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
              </li>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                Exploring the Potential of Blockchain to Combat Forced Labor (ResearchGate, 2025):{' '}
                <a href="https://www.researchgate.net/publication/391497768_Exploring_the_Potential_of_Blockchain_to_Combat_Forced_Labor_in_Global_Supply_Chains" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
              </li>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                Blockchain-Enabled Water Quality Monitoring (Water, 2025):{' '}
                <a href="https://www.mdpi.com/2073-4441/17/17/2522" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
              </li>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                Blockchain-Based Crop Recommendation System (Agronomy, 2023):{' '}
                <a href="https://www.mdpi.com/2073-4395/13/10/2642" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
              </li>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                Blockchain Framework for Certification of Organic Agriculture (Sustainability, 2022):{' '}
                <a href="https://www.mdpi.com/2071-1050/14/19/11823" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
              </li>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                Transparent Irrigation Water Allocation (IntWater, 2024):{' '}
                <a href="https://intwater.com/index.php/journal" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
              </li>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                E-agriculture in action: Blockchain for agriculture (FAO, 2019):{' '}
                <a href="https://www.fao.org/family-farming/detail/en/c/1200090/" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
              </li>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                Evaluation of blockchain-based agricultural traceability (Computers and Electronics in Agriculture, 2024):{' '}
                <a href="https://www.sciencedirect.com/science/article/pii/S0168169924009396" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
              </li>
              <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                Enhancing Agriculture Through IoT and Blockchain (IEEE Access, 2024):{' '}
                <a href="https://doi.org/10.1109/ACCESS.2024.3506510" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
              </li>
            </ul>
            <div style={{ display: 'flex', gap: 'calc(var(--spacing-card) * 0.8)', marginTop: 'calc(var(--spacing-card) * 0.8)' }}>
              <Link
                to="/scan"
                style={{
                  padding: 'calc(var(--spacing-card) * 0.9) calc(var(--spacing-card) * 1.4)',
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  borderRadius: 'var(--radius-button)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                }}
              >
                Scan a product
              </Link>
              <Link
                to="/start"
                style={{
                  padding: 'calc(var(--spacing-card) * 0.9) calc(var(--spacing-card) * 1.4)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-primary)',
                  borderRadius: 'var(--radius-button)',
                  border: '1px solid var(--color-primary)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                }}
              >
                Browse products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

import { PageWrapper } from '../components/layout/PageWrapper'
import { PageHeaderWithBack } from '../components/layout/PageHeaderWithBack'
import { VerifiedBadge } from '../components/features/VegiChain'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion'

const sectionStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-card)',
  padding: 'calc(var(--spacing-section) * 1.1)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'calc(var(--spacing-card) * 0.9)',
}

const verifiedSectionStyle: React.CSSProperties = {
  ...sectionStyle,
  padding: 'calc(var(--spacing-section) * 1.8)', // Bigger padding
  gap: 'calc(var(--spacing-card) * 1.2)',
}

const accordionItemStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-card)',
  paddingInline: 'calc(var(--spacing-section) * 1.1)',
  border: 'none',
}

const listStyle: React.CSSProperties = {
  margin: 0,
  paddingLeft: 'calc(var(--spacing-card) * 1.5)',
  listStyleType: 'disc',
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
        paddingTop: '20px',
        paddingBottom: 'calc(var(--spacing-page) * 2)',
      }}
    >
      <PageHeaderWithBack 
        title="Blockchain Assurance" 
        backTo={-1}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'calc(var(--spacing-section) * 1.2)',
          paddingLeft: '10%',
          paddingRight: '10%',
          paddingBottom: 'calc(var(--spacing-section) * 1.2)',
        }}
      >
        <div style={verifiedSectionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--spacing-card) * 0.8)' }}>
            <VerifiedBadge size="md" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-card) * 0.25)' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-text)', fontSize: '16px' }}>
                What "secured by blockchain" means here
              </span>
              <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)', fontSize: '14px', lineHeight: '1.5' }}>
                We <strong>anchor critical farming promises</strong> to VegiChain so you can see <strong>who signed what, when</strong>. Sensors, audits,
                and attestations feed the ledger; <strong>hashes make tampering evident</strong>.
              </span>
            </div>
          </div>
        </div>

        <Accordion type="single" collapsible className="flex flex-col gap-[var(--spacing-card)]">
          <AccordionItem value="guarantees" style={accordionItemStyle}>
            <AccordionTrigger style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-text)', fontSize: '15px' }}>
              Guarantees we provide
            </AccordionTrigger>
            <AccordionContent>
              <ul style={listStyle}>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)', fontSize: '13px', lineHeight: '1.6', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  <strong>Time-stamped supply chain events</strong> (harvest, packaging, cold-chain handoffs) with hashed blocks and chain
                  links.
                </li>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)', fontSize: '13px', lineHeight: '1.6', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  <strong>Certification attestations</strong> (organic, fair labor, low carbon) signed and recorded with audit dates and
                  issuing bodies.
                </li>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)', fontSize: '13px', lineHeight: '1.6', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  <strong>Sustainability metrics</strong> (CO2e, water, land, energy per kg) when fed by trusted sensors or audited
                  sources.
                </li>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)', fontSize: '13px', lineHeight: '1.6', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  <strong>Farming practice logs</strong> (soil inputs, pest control, biodiversity, labor practices) when attested by
                  auditors or device telemetry.
                </li>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)', fontSize: '13px', lineHeight: '1.6', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  <strong>Immutable QR/product binding</strong>: scanned codes map to a single product ID with revocation via ledger status.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="limits" style={accordionItemStyle}>
            <AccordionTrigger style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-text)', fontSize: '15px' }}>
              What is not guaranteed<br />(honest limits)
            </AccordionTrigger>
            <AccordionContent>
              <ul style={listStyle}>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)', fontSize: '13px', lineHeight: '1.6', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  <strong>Sensors and humans can lie</strong>; blockchain makes edits visible but cannot validate fake inputs by itself.
                </li>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)', fontSize: '13px', lineHeight: '1.6', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  <strong>Biodiversity richness and pest pressure</strong> still need field surveys or imagery; we only secure the records of
                  those checks.
                </li>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)', fontSize: '13px', lineHeight: '1.6', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  <strong>Labor conditions</strong> rely on audited evidence and worker attestations; ledger entries do not replace on-site
                  oversight.
                </li>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)', fontSize: '13px', lineHeight: '1.6', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  <strong>Connectivity gaps</strong> may delay on-chain writes; some data can appear after a short lag.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="secure" style={accordionItemStyle}>
            <AccordionTrigger style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-text)', fontSize: '15px' }}>
              How we secure farming promises
            </AccordionTrigger>
            <AccordionContent>
              <ul style={listStyle}>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)', fontSize: '13px', lineHeight: '1.6', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  <strong>Signed attestations</strong> from certifiers and producers; device IDs for sensor payloads; hashes for media and
                  reports.
                </li>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)', fontSize: '13px', lineHeight: '1.6', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  <strong>Chain-linked blocks</strong> for supply chain and certification events to expose tampering.
                </li>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)', fontSize: '13px', lineHeight: '1.6', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  <strong>Oracle approach</strong>: sensors (water/soil), telematics (applications), and audits feed the ledger; disputes
                  trigger re-audits.
                </li>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)', fontSize: '13px', lineHeight: '1.6', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  <strong>Off-chain evidence</strong> (images, PDFs) stored with content hashes; only references live on-chain for
                  auditability.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sources" style={accordionItemStyle}>
            <AccordionTrigger style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-text)', fontSize: '15px' }}>
              Sources & further reading
            </AccordionTrigger>
            <AccordionContent>
              <ul style={listStyle}>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)', fontSize: '11px', lineHeight: '1.5', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  Blockchain: Booming Technology for Pest Management (ResearchGate, 2025):{' '}
                  <a href="https://www.researchgate.net/publication/390366829_Blockchain_Booming_Technology_for_Pest_Management_Article_ID_70362" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
                </li>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)', fontSize: '11px', lineHeight: '1.5', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  Incentivizing research & innovation with agrobiodiversity (Journal of Cleaner Production, 2021):{' '}
                  <a href="https://www.sciencedirect.com/science/article/pii/S0959652621013743" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
                </li>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)', fontSize: '11px', lineHeight: '1.5', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  Preserving Nature's Ledger: Blockchains in Biodiversity Conservation (arXiv, 2024):{' '}
                  <a href="https://arxiv.org/abs/24042404.12086" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
                </li>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)', fontSize: '11px', lineHeight: '1.5', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  Blockchain and modern slavery: Reducing deceptive recruitment (Journal of Business Research, 2021):{' '}
                  <a href="https://www.sciencedirect.com/science/article/pii/S0148296321002289" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
                </li>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)', fontSize: '11px', lineHeight: '1.5', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  Blockchain and Human Rights: Ensuring Accountability (DLABI, 2024):{' '}
                  <a href="https://dlabi.org/index.php/journal/article/view/301" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
                </li>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)', fontSize: '11px', lineHeight: '1.5', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  Exploring the Potential of Blockchain to Combat Forced Labor (ResearchGate, 2025):{' '}
                  <a href="https://www.researchgate.net/publication/391497768_Exploring_the_Potential_of_Blockchain_to_Combat_Forced_Labor_in_Global_Supply_Chains" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
                </li>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)', fontSize: '11px', lineHeight: '1.5', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  Blockchain-Enabled Water Quality Monitoring (Water, 2025):{' '}
                  <a href="https://www.mdpi.com/2073-4441/17/17/2522" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
                </li>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)', fontSize: '11px', lineHeight: '1.5', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  Blockchain-Based Crop Recommendation System (Agronomy, 2023):{' '}
                  <a href="https://www.mdpi.com/2073-4395/13/10/2642" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
                </li>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)', fontSize: '11px', lineHeight: '1.5', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  Blockchain Framework for Certification of Organic Agriculture (Sustainability, 2022):{' '}
                  <a href="https://www.mdpi.com/2071-1050/14/19/11823" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
                </li>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)', fontSize: '11px', lineHeight: '1.5', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  Transparent Irrigation Water Allocation (IntWater, 2024):{' '}
                  <a href="https://intwater.com/index.php/journal" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
                </li>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)', fontSize: '11px', lineHeight: '1.5', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  E-agriculture in action: Blockchain for agriculture (FAO, 2019):{' '}
                  <a href="https://www.fao.org/family-farming/detail/en/c/1200090/" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
                </li>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)', fontSize: '11px', lineHeight: '1.5', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  Evaluation of blockchain-based agricultural traceability (Computers and Electronics in Agriculture, 2024):{' '}
                  <a href="https://www.sciencedirect.com/science/article/pii/S0168169924009396" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
                </li>
                <li style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)', fontSize: '11px', lineHeight: '1.5', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                  Enhancing Agriculture Through IoT and Blockchain (IEEE Access, 2024):{' '}
                  <a href="https://doi.org/10.1109/ACCESS.2024.3506510" style={sourceLinkStyle} target="_blank" rel="noopener noreferrer">Read Article</a>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </PageWrapper>
  )
}

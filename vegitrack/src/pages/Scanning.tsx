import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeaderWithBack, DebugFooter } from '../components/layout'
import { MenuToggleButton } from '../components/layout/MenuToggleButton'
import { Button, Spinner, Toaster, toast } from '../components/ui'
import { Combobox, type ComboboxOption } from '../components/ui/combobox'
import { QRScanner } from '../components/scanner/QRScanner'
import qrSampleImage from '../assets/scanner/qr_sample.svg'
import { parseQRCodePayload } from '../lib/api'
import { useTranslation } from '../lib/i18n'

// Available products for fallback selection (mirrors seed.sql demo rows)
const PRODUCT_OPTIONS: ComboboxOption[] = [
  { value: '11111111-2222-3333-4444-555555555555', label: 'Cluster Tomatoes (3345667)' },
  { value: '22222222-3333-4444-5555-666666666666', label: 'Cherry Tomatoes (3345668)' },
  { value: '33333333-4444-5555-6666-777777777777', label: 'Roma Tomatoes (3345669)' },
]

export default function Scanning() {
  const navigate = useNavigate()
  const [selectedProductId, setSelectedProductId] = useState<string>('')
  const [isLoadingProduct, setIsLoadingProduct] = useState(false)
  const { t } = useTranslation()

  const handleNavigate = useCallback(
    (productId: string) => {
      navigate(`/product/${productId}`)
    },
    [navigate],
  )

  const handleManualOpen = () => {
    if (!selectedProductId) return
    handleNavigate(selectedProductId)
  }

  const handleScan = useCallback(
    async (text: string) => {
      const parsed = parseQRCodePayload(text)
      if (!parsed?.product_id) {
        toast.error(t('scan.invalidQr'))
        return
      }

      setIsLoadingProduct(true)
      try {
        // Navigate directly; product page will load data
        handleNavigate(parsed.product_id)
      } catch (err) {
        console.error('Failed to open product from QR', err)
        toast.error(t('scan.openError'))
      } finally {
        setIsLoadingProduct(false)
      }
    },
    [handleNavigate, t],
  )

  const title = useMemo(
    () => (
      <h1
        className="text-center"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '24px',
          fontWeight: 500,
          letterSpacing: '-0.66px',
          color: 'var(--color-text)',
          marginBottom: 'calc(2 * var(--spacing-card))',
        }}
      >
        Scan a Product
        {t('scan.title')}
      </h1>
    ),
    [t],
  )

  return (
    <div
      className="min-h-screen pb-8"
      style={{
        backgroundColor: 'var(--color-background)',
        paddingTop: '20px',
        paddingBottom: '60px',
        paddingLeft: '10%',
        paddingRight: '10%',
      }}
    >
      <Toaster />
      <PageHeaderWithBack
        title={<span style={{ color: 'var(--color-text-light)' }}></span>}
        backTo="/start"
        marginBottom={`calc(2 * 1.125em - var(--spacing-card))`}
        rightActions={<MenuToggleButton size="sm" />}
      />

      {title}

      <div className="flex-1 flex flex-col items-center">
        {/* Live QR scanner */}
        <QRScanner onScan={handleScan} isLoading={isLoadingProduct} />

        {/* Info panel */}
        <div
          className="w-full max-w-sm flex items-center gap-3 mt-6"
          style={{ marginBottom: 'calc(2 * var(--spacing-card))' }}
        >
          <img
            src={qrSampleImage}
            alt="QR code example"
            style={{ width: '67px', height: '67px', flexShrink: 0 }}
          />
          <p
            className="text-sm flex-1"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
          >
            {t('scan.tip')}
          </p>
        </div>

        {/* Manual fallback */}
        <div
          className="w-full max-w-sm"
          style={{
            padding: 'calc(var(--spacing-card) * 1.5)',
            backgroundColor: 'var(--color-card)',
            borderRadius: 'var(--radius-card)',
          }}
        >
          <p
            className="text-sm mb-3 text-center font-medium"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}
          >
            {t('scan.manualTitle')}
          </p>

          <div style={{ marginBottom: 'var(--spacing-card)' }}>
            <Combobox
              options={PRODUCT_OPTIONS}
              value={selectedProductId}
              onValueChange={setSelectedProductId}
              placeholder={t('scan.placeholder')}
              searchPlaceholder={t('scan.searchPlaceholder')}
              emptyText={t('scan.empty')}
            />
          </div>

          <Button
            onClick={handleManualOpen}
            className="w-full"
            disabled={!selectedProductId || isLoadingProduct}
            style={{ borderRadius: 'var(--radius-md)' }}
          >
              {isLoadingProduct ? <Spinner className="text-white" /> : t('scan.openButton')}
          </Button>
        </div>
      </div>

      <DebugFooter />
    </div>
  )
}

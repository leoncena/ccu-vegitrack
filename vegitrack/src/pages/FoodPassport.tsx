import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
import { getProductById, getProductByDisplayId, getProductLabels, getAlternativeProducts } from '../lib/api'
import { supabase } from '../lib/supabase'
import type { Product, ProductLabel, Farm } from '../types/database'
import { Tag, Spinner } from '../components/ui'
import { PageWrapper, PageHeader, DebugFooter } from '../components/layout'
import { useUserData } from '../contexts/UserDataContext'
import { useTranslation } from '../lib/i18n'

interface ProductWithFarm extends Product {
  farm?: Farm | null
}

export default function FoodPassport() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [product, setProduct] = useState<ProductWithFarm | null>(null)
  const [labels, setLabels] = useState<ProductLabel[]>([])
  const [alternatives, setAlternatives] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addRecentProduct, toggleFavoriteProduct, isProductFavorite } = useUserData()
  const { t, language } = useTranslation()

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return
      
      setLoading(true)
      setError(null)

      try {
        // Try to fetch by UUID first, then by display_id
        let productData = await getProductById(id)
        
        if (!productData) {
          productData = await getProductByDisplayId(id)
        }

        if (!productData) {
          setError('Product not found')
          setLoading(false)
          return
        }

        // Fetch farm info if farm_id exists
        let farmData = null
        if (productData.farm_id) {
          const { data } = await supabase
            .from('farms')
            .select('*')
            .eq('id', productData.farm_id)
            .single()
          farmData = data
        }

        setProduct({ ...productData, farm: farmData })

        // Fetch labels and alternatives in parallel
        const [labelsData, alternativesData] = await Promise.all([
          getProductLabels(productData.id),
          getAlternativeProducts(productData.id),
        ])

        setLabels(labelsData)
        setAlternatives(alternativesData)
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  useEffect(() => {
    if (!product) return
    addRecentProduct({
      id: product.id,
      name: product.name,
      displayId: product.display_id,
      imageUrl: product.image_url,
    })
  }, [addRecentProduct, product])

  // Calculate days since harvest
  const getDaysSinceHarvest = () => {
    if (!product?.harvest_date) return null
    const harvest = new Date(product.harvest_date)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - harvest.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const relativeTimeFormatter = useMemo(() => {
    try {
      return new Intl.RelativeTimeFormat(language, { numeric: 'auto' })
    } catch (error) {
      console.warn('RelativeTimeFormat not supported', error)
      return null
    }
  }, [language])

  const detailSections = useMemo(
    () => [
      { path: 'origin', label: t('food.section.origin'), icon: '📍' },
      { path: 'certifications', label: t('food.section.certifications'), icon: '✓' },
      { path: 'farming', label: t('food.section.farming'), icon: '🌱' },
      { path: 'farmer', label: t('food.section.farmer'), icon: '👨‍🌾' },
      { path: 'recipes', label: t('food.section.recipes'), icon: '🍳' },
    ],
    [t],
  )

  const daysSinceHarvest = getDaysSinceHarvest()

  const stats = useMemo(
    () => [
      {
        label: t('food.stat.harvested'),
        value:
          daysSinceHarvest !== null
            ? relativeTimeFormatter?.format(-daysSinceHarvest, 'day') ?? `${daysSinceHarvest}d ago`
            : '—',
      },
      {
        label: t('food.stat.transport'),
        value: product?.transport_distance_km ? `${product.transport_distance_km} km` : '—',
      },
      {
        label: t('food.stat.emissions'),
        value: product?.emissions_co2e_per_kg ? `${product.emissions_co2e_per_kg} kg` : '—',
      },
      {
        label: t('food.stat.price'),
        value: product?.price_per_kg ? `€${product.price_per_kg}/kg` : '—',
      },
    ],
    [
      daysSinceHarvest,
      product?.transport_distance_km,
      product?.emissions_co2e_per_kg,
      product?.price_per_kg,
      relativeTimeFormatter,
      t,
    ],
  )

  const palette = {
    background: '#FFFEFC',
    surface: '#F3F5EF',
    card: '#E8ECE3',
    cardBorder: '#C3CBBC',
    accent: '#174E05',
    tagBg: 'rgba(23, 78, 5, 0.20)',
    tagBorder: '#A4B99B',
    statBg: '#C7D4C0',
  }

  const fromProductId = (location.state as { fromProductId?: string } | null)?.fromProductId || null
  const isBookmarked = product ? isProductFavorite(product.id) : false

  const handleBookmark = () => {
    if (!product) return
    toggleFavoriteProduct({
      id: product.id,
      name: product.name,
      displayId: product.display_id,
      imageUrl: product.image_url,
    })
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center">
            <Spinner className="size-8 mb-4" style={{ color: 'var(--color-primary)' }} />
            <p style={{ fontFamily: 'var(--font-body)' }}>{t('food.loading')}</p>
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (error || !product) {
    return (
      <PageWrapper>
        <PageHeader backTo="/scan" closeButton />
        <div className="flex flex-col items-center justify-center px-6 pt-20">
          <div className="text-6xl mb-4">🔍</div>
          <h1 
            className="text-xl mb-2"
            style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}
          >
            {t('food.notFoundTitle')}
          </h1>
          <p 
            className="text-sm opacity-60 text-center mb-6"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {error || t('food.notFoundBody')}
          </p>
          <button
            onClick={() => navigate('/scan')}
            className="px-6 py-3"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              borderRadius: 'var(--radius-button)',
              fontFamily: 'var(--font-body)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {t('food.backToScanner')}
          </button>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper
      style={{
        backgroundColor: palette.background,
        paddingBottom: 'calc(var(--spacing-page) * 2.5)',
      }}
    >
      <PageHeader
        backTo={fromProductId ? `/product/${fromProductId}` : '/scan'}
        closeButton={!fromProductId}
        center={t('food.productId', { id: product.display_id })}
        showBookmark
        isBookmarked={isBookmarked}
        onBookmarkClick={handleBookmark}
      />

      <div
        className="relative flex justify-center w-full"
        style={{ marginTop: 'calc(var(--spacing-section) * 1.25)' }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            maxWidth: '480px',
            height: 'calc(var(--spacing-page) * 51)',
            backgroundColor: palette.surface,
            borderRadius: 'calc(var(--spacing-page) * 13)',
            border: '1px solid rgba(23, 78, 5, 0.20)',
            top: 'calc(var(--spacing-page) * 14.5)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 0,
          }}
        />

        <div
          className="relative w-full"
          style={{
            maxWidth: '402px',
            paddingInline: 'calc(var(--spacing-card) * 1.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(var(--spacing-section) * 1.25)',
            zIndex: 1,
          }}
        >
          <div
            className="relative"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'calc(var(--spacing-card) * 1.1)',
              paddingTop: 'calc(var(--spacing-card) * 1.2)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: palette.accent,
                fontWeight: 400,
                letterSpacing: '0.2px',
              }}
            >
            </div>

            <div
              style={{
                width: 'calc(var(--spacing-page) * 8.7)',
                height: 'calc(var(--spacing-page) * 9.5)',
                borderRadius: 'var(--radius-card)',
                overflow: 'hidden',
                boxShadow: '0 16px 38px rgba(0,0,0,0.12)',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ fontSize: '48px' }}
                >
                  🍅
                </div>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'calc(var(--spacing-card) * 0.6)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'calc(var(--spacing-card) * 0.2)',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '18px',
                    fontWeight: 400,
                    color: 'var(--color-text)',
                    lineHeight: 1.3,
                  }}
                >
                  {product.name}
                </span>
                {product.scientific_name && (
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      fontWeight: 300,
                      color: 'var(--color-text)',
                      opacity: 0.65,
                      lineHeight: 1.3,
                    }}
                  >
                    {product.scientific_name}
                    {product.variety ? ` '${product.variety}'` : ''}
                  </span>
                )}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'calc(var(--spacing-card) * 0.8)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  color: 'var(--color-text)',
                  fontWeight: 300,
                  flexWrap: 'wrap',
                }}
              >
                <span>
                  {product.origin_country}
                  {product.origin_region ? `, ${product.origin_region}` : ''}
                </span>
                {product.farm && (
                  <>
                    <span style={{ width: '1px', height: 'calc(var(--spacing-card) * 2)', backgroundColor: palette.accent, opacity: 0.6 }} />
                    <span>{product.farm.name}</span>
                  </>
                )}
                {product.transport_distance_km && (
                  <>
                    <span style={{ width: '1px', height: 'calc(var(--spacing-card) * 2)', backgroundColor: palette.accent, opacity: 0.6 }} />
                    <span>{product.transport_distance_km} km</span>
                  </>
                )}
              </div>
            </div>

            {labels.length > 0 && (
              <div
                className="flex flex-wrap justify-center gap-2"
                style={{ paddingTop: 'calc(var(--spacing-card) * 0.5)' }}
              >
                {labels.map((label) => (
                  <Tag
                    key={label.id}
                    color={label.label_color || undefined}
                    style={{
                      backgroundColor: palette.tagBg,
                      border: `1px solid ${palette.tagBorder}`,
                      borderRadius: 'var(--radius-button)',
                      fontWeight: 300,
                      padding: 'calc(var(--spacing-card) * 0.35) calc(var(--spacing-card) * 0.9)',
                      fontSize: '12px',
                    }}
                  >
                    {label.label_name}
                  </Tag>
                ))}
              </div>
            )}

            <div
              className="grid grid-cols-4 gap-2 w-full"
              style={{ marginTop: 'calc(var(--spacing-section) * 0.3)' }}
            >
              {stats.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: palette.statBg,
                    borderRadius: 'calc(var(--spacing-page) * 1.2)',
                    minHeight: 'calc(var(--spacing-section) * 3.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'calc(var(--spacing-card) * 0.55)',
                    gap: 'calc(var(--spacing-card) * 0.25)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      color: palette.accent,
                      fontWeight: 400,
                      textAlign: 'center',
                      lineHeight: 1.2,
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '16px',
                      fontWeight: 500,
                      color: palette.accent,
                      lineHeight: 1.3,
                      textAlign: 'center',
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                width: 'calc(var(--spacing-page) * 3.2)',
                height: 1,
                backgroundColor: palette.accent,
                marginTop: 'calc(var(--spacing-section) * 0.75)',
                opacity: 0.6,
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-card) * 1)' }}>
            <h2
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                fontWeight: 400,
                color: 'var(--color-text)',
              }}
            >
              {t('food.details')}
            </h2>

            <div
              className="grid grid-cols-2 gap-3"
              style={{ marginTop: 'calc(var(--spacing-card) * 0.4)' }}
            >
              {detailSections.map((section) => (
                <Link
                  key={section.path}
                  to={`/product/${product.id}/${section.path}`}
                  style={{
                    backgroundColor: palette.card,
                    border: `1px solid ${palette.cardBorder}`,
                    borderRadius: 'var(--radius-card)',
                    textDecoration: 'none',
                    color: palette.accent,
                    minHeight: 'calc(var(--spacing-section) * 5.6)',
                    padding: 'calc(var(--spacing-card) * 1)',
                    display: 'flex',
                    gap: 'calc(var(--spacing-card) * 0.8)',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '22px' }}>{section.icon}</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      fontWeight: 400,
                      color: palette.accent,
                      lineHeight: 1.2,
                    }}
                  >
                    {section.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-card) * 1)' }}>
            <h2
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                fontWeight: 400,
                color: 'var(--color-text)',
              }}
            >
              {t('food.alternatives')}
            </h2>

            {alternatives.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'calc(var(--spacing-card) * 1)',
                }}
              >
                {alternatives.map((alt) => (
                  <Link
                    key={alt.id}
                    to={`/product/${alt.id}`}
                    state={{ fromProductId: product.id }}
                    style={{
                      width: '100%',
                      backgroundColor: palette.card,
                      border: `1px solid ${palette.cardBorder}`,
                      borderRadius: 'var(--radius-card)',
                      padding: 'calc(var(--spacing-card) * 1)',
                      textDecoration: 'none',
                      color: palette.accent,
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr',
                      gap: 'calc(var(--spacing-card) * 1)',
                      alignItems: 'center',
                    }}
                  >
                    {alt.image_url ? (
                      <img
                        src={alt.image_url}
                        alt={alt.name}
                        style={{
                          width: 'calc(var(--spacing-section) * 3.5)',
                          height: 'calc(var(--spacing-section) * 3.5)',
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-card)',
                        }}
                      />
                    ) : (
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: 'calc(var(--spacing-section) * 3.5)',
                          height: 'calc(var(--spacing-section) * 3.5)',
                          backgroundColor: 'var(--color-background)',
                          borderRadius: 'var(--radius-card)',
                          fontSize: '28px',
                        }}
                      >
                        🍅
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-card) * 0.35)' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '14px',
                          fontWeight: 500,
                          color: 'var(--color-text)',
                          lineHeight: 1.3,
                        }}
                      >
                        {alt.name}
                      </span>
                      {alt.price_per_kg && (
                        <span
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '13px',
                            fontWeight: 300,
                            color: 'var(--color-text)',
                            opacity: 0.8,
                          }}
                        >
                          €{alt.price_per_kg}/kg
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'var(--color-text)',
                  opacity: 0.75,
                }}
              >
                {t('food.noAlternatives')}
              </p>
            )}
          </div>
        </div>
      </div>

      <DebugFooter />
    </PageWrapper>
  )
}

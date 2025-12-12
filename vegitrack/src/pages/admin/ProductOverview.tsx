import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/Button'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/accordion'
import { createProduct } from '../../lib/api'
import { toast } from '../../components/ui/sonner'
import { Spinner } from '../../components/ui'
import { Check } from 'lucide-react'

interface FormData {
  productData: any
  recipes: any[]
  qualityIndicators: any[]
  certifications: any[]
  farmingPractices: any[]
}

export default function ProductOverview() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData | null>(null)

  useEffect(() => {
    // Add admin-page class to root for desktop layout
    const root = document.getElementById('root')
    if (root) {
      root.classList.add('admin-page')
      return () => {
        root.classList.remove('admin-page')
      }
    }
  }, [])

  useEffect(() => {
    // Add admin-page class to root for desktop layout
    const root = document.getElementById('root')
    if (root) {
      root.classList.add('admin-page')
      return () => {
        root.classList.remove('admin-page')
      }
    }
  }, [])

  useEffect(() => {
    const stored = sessionStorage.getItem('productFormData')
    if (stored) {
      setFormData(JSON.parse(stored))
    } else {
      navigate('/admin/product/new')
    }
  }, [navigate])

  async function handleConfirm() {
    if (!user || !formData) return
    setLoading(true)
    try {
      // Prepare product data
      const productPayload: any = {
        display_id: formData.productData.display_id,
        name: formData.productData.name,
        scientific_name: formData.productData.scientific_name || null,
        variety: formData.productData.variety || null,
        origin_country: formData.productData.origin_country,
        origin_region: formData.productData.origin_region || null,
        farm_id: formData.productData.farm_id || null,
        harvest_date: formData.productData.harvest_date || null,
        price_per_kg: formData.productData.price_per_kg ? parseFloat(formData.productData.price_per_kg) : null,
        transport_distance_km: formData.productData.transport_distance_km ? parseFloat(formData.productData.transport_distance_km) : null,
        emissions_co2e_per_kg: formData.productData.emissions_co2e_per_kg ? parseFloat(formData.productData.emissions_co2e_per_kg) : null,
        image_url: formData.productData.image_url || null,
      }

      // Prepare related data
      const relatedData: any = {}

      if (formData.recipes.length > 0) {
        relatedData.recipes = formData.recipes.map((r: any) => ({
          title: r.title,
          description: r.description || null,
          cultural_origin: r.cultural_origin || null,
          prep_time_minutes: r.prep_time_minutes ? parseInt(r.prep_time_minutes) : null,
          cook_time_minutes: r.cook_time_minutes ? parseInt(r.cook_time_minutes) : null,
          servings: r.servings ? parseInt(r.servings) : null,
          ingredients: r.ingredients.filter((ing: any) => ing.name || ing.amount),
          instructions: r.instructions.filter((inst: string) => inst.trim()),
          image_url: r.image_url || null,
        }))
      }

      if (formData.qualityIndicators.length > 0) {
        relatedData.qualityIndicators = formData.qualityIndicators.map((q: any) => ({
          indicator_type: q.indicator_type,
          score: typeof q.score === 'number' ? q.score : (q.score ? parseFloat(q.score) : null),
          max_score: typeof q.max_score === 'number' ? q.max_score : (q.max_score ? parseFloat(q.max_score) : 5),
          percentage: q.percentage ? parseFloat(q.percentage) : (q.score && q.max_score ? ((q.score / q.max_score) * 100) : null),
          description: q.description || null,
          recommendation: q.recommendation || null,
        }))
      }

      if (formData.certifications.length > 0) {
        relatedData.certifications = formData.certifications.map((c: any) => ({
          cert_type: c.cert_type,
          cert_display_name: c.cert_display_name || null,
          certifying_body: c.certifying_body || null,
          certifying_body_code: c.certifying_body_code || null,
          certificate_id: c.certificate_id || null,
          audit_date: c.audit_date || null,
          expiry_date: c.expiry_date || null,
          auditor_name: c.auditor_name || null,
          audit_findings: c.audit_findings || null,
          description: c.description || null,
        }))
      }

      await createProduct(productPayload, user.id, relatedData)

      // Clear stored form data
      sessionStorage.removeItem('productFormData')

      toast.success('Product created successfully!')
      navigate('/admin?tab=products')
    } catch (error: any) {
      console.error('Error creating product:', error)
      toast.error(error.message || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  if (!formData) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
        <Spinner className="size-8" style={{ color: 'var(--color-primary)' }} />
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-background)',
        padding: 'var(--spacing-page)',
        maxWidth: 'none',
        width: '100%',
        color: 'var(--color-text)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: 'calc(var(--spacing-section) * 2)' }}>
          <h1
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '32px',
              fontWeight: 600,
              color: 'var(--color-text)',
              marginBottom: 'calc(var(--spacing-card) * 0.5)',
            }}
          >
            Product Overview
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              color: 'var(--color-text-light)',
            }}
          >
            Review your product information before confirming
          </p>
        </div>

        <Accordion type="multiple" defaultValue={['product-info']}>
          {/* Product Info */}
          <AccordionItem value="product-info">
            <AccordionTrigger style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}>
              Product Information
            </AccordionTrigger>
            <AccordionContent>
              <Card style={{ marginBottom: 'var(--spacing-card)' }}>
                <CardContent style={{ padding: 'var(--spacing-card)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-card)' }}>
                  <div>
                    <strong style={{ fontFamily: 'var(--font-body)' }}>Display ID:</strong>
                    <p style={{ fontFamily: 'var(--font-body)' }}>{formData.productData.display_id}</p>
                  </div>
                  <div>
                    <strong style={{ fontFamily: 'var(--font-body)' }}>Name:</strong>
                    <p style={{ fontFamily: 'var(--font-body)' }}>{formData.productData.name}</p>
                  </div>
                  <div>
                    <strong style={{ fontFamily: 'var(--font-body)' }}>Scientific Name:</strong>
                    <p style={{ fontFamily: 'var(--font-body)' }}>{formData.productData.scientific_name || '—'}</p>
                  </div>
                  <div>
                    <strong style={{ fontFamily: 'var(--font-body)' }}>Variety:</strong>
                    <p style={{ fontFamily: 'var(--font-body)' }}>{formData.productData.variety || '—'}</p>
                  </div>
                  <div>
                    <strong style={{ fontFamily: 'var(--font-body)' }}>Origin:</strong>
                    <p style={{ fontFamily: 'var(--font-body)' }}>
                      {formData.productData.origin_country}
                      {formData.productData.origin_region ? `, ${formData.productData.origin_region}` : ''}
                    </p>
                  </div>
                  {formData.productData.harvest_date && (
                    <div>
                      <strong style={{ fontFamily: 'var(--font-body)' }}>Harvest Date:</strong>
                      <p style={{ fontFamily: 'var(--font-body)' }}>{formData.productData.harvest_date}</p>
                    </div>
                  )}
                  {formData.productData.price_per_kg && (
                    <div>
                      <strong style={{ fontFamily: 'var(--font-body)' }}>Price per kg:</strong>
                      <p style={{ fontFamily: 'var(--font-body)' }}>€{formData.productData.price_per_kg}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* Recipes */}
          <AccordionItem value="recipes">
            <AccordionTrigger style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}>
              Recipes ({formData.recipes.length})
            </AccordionTrigger>
            <AccordionContent>
              {formData.recipes.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-card)' }}>
                  {formData.recipes.map((recipe: any, index: number) => (
                    <Card key={index} stroke>
                      <CardContent style={{ padding: 'var(--spacing-card)' }}>
                        <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: 'var(--spacing-card)' }}>
                          {recipe.title}
                        </h3>
                        {recipe.description && <p style={{ fontFamily: 'var(--font-body)', marginBottom: 'var(--spacing-card)' }}>{recipe.description}</p>}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-card)', fontFamily: 'var(--font-body)' }}>
                          {recipe.prep_time_minutes && <div>Prep: {recipe.prep_time_minutes} min</div>}
                          {recipe.cook_time_minutes && <div>Cook: {recipe.cook_time_minutes} min</div>}
                          {recipe.servings && <div>Servings: {recipe.servings}</div>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)' }}>No recipes added</p>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Certifications & Quality */}
          <AccordionItem value="certifications">
            <AccordionTrigger style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}>
              Certifications & Quality ({formData.certifications.length + formData.qualityIndicators.length})
            </AccordionTrigger>
            <AccordionContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-section)' }}>
                {formData.qualityIndicators.length > 0 && (
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: 'var(--spacing-card)' }}>Quality Indicators</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-card)' }}>
                      {formData.qualityIndicators.map((indicator: any, index: number) => (
                        <Card key={index} stroke>
                          <CardContent style={{ padding: 'var(--spacing-card)', fontFamily: 'var(--font-body)' }}>
                            <strong>{indicator.indicator_type}</strong>
                            {indicator.score && <span> - Score: {indicator.score}/{indicator.max_score}</span>}
                            {indicator.description && <p style={{ marginTop: 'calc(var(--spacing-card) * 0.5)' }}>{indicator.description}</p>}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                {formData.certifications.length > 0 && (
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: 'var(--spacing-card)' }}>Certifications</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-card)' }}>
                      {formData.certifications.map((cert: any, index: number) => (
                        <Card key={index} stroke>
                          <CardContent style={{ padding: 'var(--spacing-card)', fontFamily: 'var(--font-body)' }}>
                            <strong>{cert.cert_display_name || cert.cert_type}</strong>
                            {cert.certificate_id && <p>Certificate ID: {cert.certificate_id}</p>}
                            {cert.description && <p>{cert.description}</p>}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                {formData.qualityIndicators.length === 0 && formData.certifications.length === 0 && (
                  <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)' }}>No quality indicators or certifications added</p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Farming Practices */}
          <AccordionItem value="farming">
            <AccordionTrigger style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}>
              Farming Practices ({formData.farmingPractices.length})
            </AccordionTrigger>
            <AccordionContent>
              {formData.farmingPractices.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-card)' }}>
                  {formData.farmingPractices.map((practice: any, index: number) => (
                    <Card key={index} stroke>
                      <CardContent style={{ padding: 'var(--spacing-card)', fontFamily: 'var(--font-body)' }}>
                        <strong>{practice.category.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</strong>
                        <ul style={{ marginTop: 'calc(var(--spacing-card) * 0.5)', paddingLeft: 'calc(var(--spacing-card) * 1.5)' }}>
                          {practice.practices.map((p: string, i: number) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)' }}>No farming practices added</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--spacing-card)', marginTop: 'calc(var(--spacing-section) * 2)' }}>
          <Button onClick={() => navigate(-1)} variant="outline" style={{ padding: '4px 8px' }}>
            Back to Edit
          </Button>
          <Button onClick={handleConfirm} disabled={loading} style={{ padding: '4px 8px' }}>
            {loading ? (
              <>
                <Spinner className="size-4" />
                Creating...
              </>
            ) : (
              <>
                <Check className="size-4" />
                Confirm & Save
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}


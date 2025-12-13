import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'
import { Slider } from '../../components/ui/slider'
import { FileUpload } from '../../components/admin/FileUpload'
import { DatePicker } from '../../components/admin/DatePicker'
import { PageHeaderWithBack } from '../../components/layout'
import { getProductById, getAllFarms, getRecipes, getQualityIndicators, getCertifications, getProductLabels, createProduct, updateProduct } from '../../lib/api'
import { supabase } from '../../lib/supabase'
import { toast } from '../../components/ui/sonner'
import { Plus, Trash2, ArrowRight, MapPin } from 'lucide-react'
import { Spinner } from '../../components/ui'
import { Combobox } from '../../components/ui/combobox'

interface RecipeFormData {
  id?: string
  title: string
  description: string
  cultural_origin: string
  prep_time_minutes: string
  cook_time_minutes: string
  servings: string
  ingredients: Array<{ name: string; amount: string }>
  instructions: string[]
  image_url: string
}

interface QualityIndicatorFormData {
  id?: string
  indicator_type: 'freshness' | 'ripeness' | 'shelf_life'
  score?: number
  max_score?: number
  percentage?: string
  description: string
  shelf_life_remaining_days?: number
}

interface CertificationFormData {
  id?: string
  cert_type: string
  certifying_body: string
  certifying_body_code: string
  certificate_id: string
  audit_date: string
  expiry_date: string
  auditor_name: string
  audit_findings: string
}

interface ProductLabelFormData {
  id?: string
  label_name: string
}


export default function ProductForm() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [currentTab, setCurrentTab] = useState('product-info')
  const [farms, setFarms] = useState<Array<{ id: string; name: string }>>([])

  // Product info state
  const [productData, setProductData] = useState({
    display_id: '',
    name: '',
    scientific_name: '',
    variety: '',
    origin_country: '',
    origin_region: '',
    farm_id: '',
    harvest_date: '',
    price_per_kg: '',
    transport_distance_km: '',
    emissions_co2e_per_kg: '',
    image_url: '',
    shelf_life_remaining_days: 0,
  })

  // Recipes state
  const [recipes, setRecipes] = useState<RecipeFormData[]>([])

  // Quality indicators state
  const [qualityIndicators, setQualityIndicators] = useState<QualityIndicatorFormData[]>([])

  // Certifications state
  const [certifications, setCertifications] = useState<CertificationFormData[]>([])

  // Labels state
  const [labels, setLabels] = useState<ProductLabelFormData[]>([])

  useEffect(() => {
    loadFarms()
    if (id && id !== 'new') {
      loadProduct()
    }
  }, [id])

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

  async function loadFarms() {
    try {
      const allFarms = await getAllFarms()
      setFarms(allFarms.map(f => ({ id: f.id, name: f.name })))
    } catch (error) {
      console.error('Error loading farms:', error)
    }
  }

  async function loadProduct() {
    if (!id || id === 'new') return
    setLoading(true)
    try {
      const product = await getProductById(id)
      if (product) {
        setProductData({
          display_id: product.display_id,
          name: product.name,
          scientific_name: product.scientific_name || '',
          variety: product.variety || '',
          origin_country: product.origin_country,
          origin_region: product.origin_region || '',
          farm_id: product.farm_id || '',
          harvest_date: product.harvest_date || '',
          price_per_kg: product.price_per_kg?.toString() || '',
          transport_distance_km: product.transport_distance_km?.toString() || '',
          emissions_co2e_per_kg: product.emissions_co2e_per_kg?.toString() || '',
          image_url: product.image_url || '',
          shelf_life_remaining_days: 0,
        })

        // Load recipes
        const recipesData = await getRecipes(id)
        setRecipes(
          recipesData.map(r => ({
            id: r.id,
            title: r.title,
            description: r.description || '',
            cultural_origin: r.cultural_origin || '',
            prep_time_minutes: r.prep_time_minutes?.toString() || '',
            cook_time_minutes: r.cook_time_minutes?.toString() || '',
            servings: r.servings?.toString() || '',
            ingredients: r.ingredients || [],
            instructions: r.instructions || [],
            image_url: r.image_url || '',
          }))
        )

        // Load labels
        const labelsData = await getProductLabels(id)
        setLabels(
          labelsData.map(l => ({
            id: l.id,
            label_name: l.label_name || '',
          }))
        )

        // Load quality indicators
        const qualityData = await getQualityIndicators(id)
        setQualityIndicators(
          qualityData.map(q => ({
            id: q.id,
            indicator_type: q.indicator_type,
            score: q.indicator_type !== 'shelf_life' ? (q.score || 0) : undefined,
            max_score: q.indicator_type !== 'shelf_life' ? (q.max_score || 5) : undefined,
            percentage: q.indicator_type !== 'shelf_life' ? (q.percentage?.toString() || '') : undefined,
            description: q.description || '',
            shelf_life_remaining_days: q.indicator_type === 'shelf_life' ? (q.shelf_life_remaining_days || 0) : undefined,
          }))
        )

        // Load certifications
        const certData = await getCertifications(id)
        setCertifications(
          certData.map(c => ({
            id: c.id,
            cert_type: c.cert_type,
            certifying_body: c.certifying_body || '',
            certifying_body_code: c.certifying_body_code || '',
            certificate_id: c.certificate_id || '',
            audit_date: c.audit_date || '',
            expiry_date: c.expiry_date || '',
            auditor_name: c.auditor_name || '',
            audit_findings: c.audit_findings || '',
          }))
        )
      }
    } catch (error) {
      console.error('Error loading product:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = ['product-info', 'recipes', 'certifications']
  const isLastTab = currentTab === tabs[tabs.length - 1]

  function handleContinue() {
    if (isLastTab) {
      handleSave()
    } else {
      // Move to next tab
      const currentIndex = tabs.indexOf(currentTab)
      if (currentIndex < tabs.length - 1) {
        setCurrentTab(tabs[currentIndex + 1])
      }
    }
  }

  async function handleSave() {
    if (!user) return
    setSaving(true)
    try {
      // Prepare product data
      const productPayload: any = {
        display_id: productData.display_id,
        name: productData.name,
        scientific_name: productData.scientific_name || null,
        variety: productData.variety || null,
        origin_country: productData.origin_country,
        origin_region: productData.origin_region || null,
        farm_id: productData.farm_id || null,
        harvest_date: productData.harvest_date || null,
        price_per_kg: productData.price_per_kg ? parseFloat(productData.price_per_kg) : null,
        transport_distance_km: productData.transport_distance_km ? parseFloat(productData.transport_distance_km) : null,
        emissions_co2e_per_kg: productData.emissions_co2e_per_kg ? parseFloat(productData.emissions_co2e_per_kg) : null,
        image_url: productData.image_url || null,
      }

      // Prepare related data
      const relatedData: any = {}

      if (recipes.length > 0) {
        relatedData.recipes = recipes.map((r: any) => ({
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

      if (labels.length > 0) {
        relatedData.labels = labels.map((l: any) => ({
          label_name: l.label_name || null,
        }))
      }

      if (qualityIndicators.length > 0) {
        relatedData.qualityIndicators = qualityIndicators.map((q: any) => {
          if (q.indicator_type === 'shelf_life') {
            return {
              indicator_type: q.indicator_type,
              score: null,
              max_score: null,
              percentage: null,
              description: q.description || null,
              shelf_life_remaining_days: q.shelf_life_remaining_days ? parseInt(q.shelf_life_remaining_days.toString()) : null,
            }
          } else {
            return {
              indicator_type: q.indicator_type,
              score: typeof q.score === 'number' ? q.score : (q.score ? parseFloat(q.score) : null),
              max_score: typeof q.max_score === 'number' ? q.max_score : (q.max_score ? parseFloat(q.max_score) : 5),
              percentage: q.percentage ? parseFloat(q.percentage) : (q.score && q.max_score ? ((q.score / q.max_score) * 100) : null),
              description: q.description || null,
              shelf_life_remaining_days: null,
            }
          }
        })
      }

      if (certifications.length > 0) {
        relatedData.certifications = certifications.map((c: any) => ({
          cert_type: c.cert_type,
          certifying_body: c.certifying_body || null,
          certifying_body_code: c.certifying_body_code || null,
          certificate_id: c.certificate_id || null,
          audit_date: c.audit_date || null,
          expiry_date: c.expiry_date || null,
          auditor_name: c.auditor_name || null,
          audit_findings: c.audit_findings || null,
        }))
      }

      if (id && id !== 'new') {
        // Update existing product
        await updateProduct(id, productPayload)
        
        // Update related data - delete existing and insert new
        if (relatedData.labels) {
          await supabase.from('product_labels').delete().eq('product_id', id)
          if (relatedData.labels.length > 0) {
            await supabase.from('product_labels').insert(
              relatedData.labels.map((l: any) => ({ ...l, product_id: id }))
            )
          }
        }
        
        if (relatedData.qualityIndicators) {
          await supabase.from('quality_indicators').delete().eq('product_id', id)
          if (relatedData.qualityIndicators.length > 0) {
            await supabase.from('quality_indicators').insert(
              relatedData.qualityIndicators.map((q: any) => {
                if (q.indicator_type === 'shelf_life') {
                  return {
                    indicator_type: q.indicator_type,
                    product_id: id,
                    score: null,
                    max_score: null,
                    percentage: null,
                    description: q.description || null,
                    shelf_life_remaining_days: q.shelf_life_remaining_days || null,
                  }
                } else {
                  return {
                    indicator_type: q.indicator_type,
                    product_id: id,
                    score: typeof q.score === 'number' ? q.score : (q.score ? parseFloat(q.score) : null),
                    max_score: typeof q.max_score === 'number' ? q.max_score : (q.max_score ? parseFloat(q.max_score) : 5),
                    percentage: q.percentage ? parseFloat(q.percentage) : (q.score && q.max_score ? ((q.score / q.max_score) * 100) : null),
                    description: q.description || null,
                    shelf_life_remaining_days: null,
                  }
                }
              })
            )
          }
        }
        
        if (relatedData.certifications) {
          await supabase.from('certification_ledger').delete().eq('product_id', id)
          if (relatedData.certifications.length > 0) {
            const now = new Date().toISOString()
            let previousHash: string | null = null
            for (let i = 0; i < relatedData.certifications.length; i++) {
              const cert = relatedData.certifications[i]
              const blockHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
              await supabase.from('certification_ledger').insert({
                ...cert,
                product_id: id,
                block_index: i,
                block_hash: blockHash,
                previous_hash: previousHash,
                timestamp: now,
              })
              previousHash = blockHash
            }
          }
        }
        
        if (relatedData.recipes) {
          await supabase.from('recipes').delete().eq('product_id', id)
          if (relatedData.recipes.length > 0) {
            await supabase.from('recipes').insert(
              relatedData.recipes.map((r: any) => ({ ...r, product_id: id }))
            )
          }
        }
        
        toast.success('Product updated successfully!')
      } else {
        // Create new product
        await createProduct(productPayload, user.id, relatedData)
        toast.success('Product created successfully!')
      }

      navigate('/admin?tab=products')
    } catch (error: any) {
      console.error('Error saving product:', error)
      toast.error(error.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  function addRecipe() {
    setRecipes([
      ...recipes,
      {
        title: '',
        description: '',
        cultural_origin: '',
        prep_time_minutes: '',
        cook_time_minutes: '',
        servings: '',
        ingredients: [{ name: '', amount: '' }],
        instructions: [''],
        image_url: '',
      },
    ])
  }

  function removeRecipe(index: number) {
    setRecipes(recipes.filter((_, i) => i !== index))
  }

  function addLabel() {
    setLabels([
      ...labels,
      {
        label_name: '',
      },
    ])
  }

  function removeLabel(index: number) {
    setLabels(labels.filter((_, i) => i !== index))
  }

  function addQualityIndicator() {
    setQualityIndicators([
      ...qualityIndicators,
      {
        indicator_type: 'freshness',
        score: 0,
        max_score: 5,
        percentage: '',
        description: '',
      },
    ])
  }

  function removeQualityIndicator(index: number) {
    setQualityIndicators(qualityIndicators.filter((_, i) => i !== index))
  }

  function addCertification() {
    setCertifications([
      ...certifications,
      {
        cert_type: '',
        certifying_body: '',
        certifying_body_code: '',
        certificate_id: '',
        audit_date: '',
        expiry_date: '',
        auditor_name: '',
        audit_findings: '',
      },
    ])
  }

  function removeCertification(index: number) {
    setCertifications(certifications.filter((_, i) => i !== index))
  }


  if (loading) {
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
        <PageHeaderWithBack
          title={id === 'new' ? 'Create Product' : 'Edit Product'}
          backTo="/admin?tab=products"
        />

        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList style={{ marginBottom: 'var(--spacing-card)' }}>
            <TabsTrigger value="product-info">Product Info</TabsTrigger>
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
            <TabsTrigger value="certifications">Certifications & Quality</TabsTrigger>
          </TabsList>

          {/* Product Info Tab */}
          <TabsContent value="product-info" style={{ marginTop: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'var(--font-body)', marginBottom: 'var(--spacing-card)' }}>Product Information</CardTitle>
              </CardHeader>
              <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-card)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-card)' }}>
                  <div>
                    <Label htmlFor="display_id" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Display ID *</Label>
                    <Input
                      id="display_id"
                      value={productData.display_id}
                      onChange={(e) => setProductData({ ...productData, display_id: e.target.value })}
                      className="h-[42px] rounded-[8px] border-[1.5px]"
                      style={{
                        fontFamily: 'var(--font-body)',
                        backgroundColor: 'var(--color-background)',
                        marginTop: 'calc(var(--spacing-card) * 0.5)',
                        paddingLeft: 'var(--spacing-card)',
                        paddingRight: 'var(--spacing-card)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="name" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Name *</Label>
                    <Input
                      id="name"
                      value={productData.name}
                      onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                      className="h-[42px] rounded-[8px] border-[1.5px]"
                      style={{
                        fontFamily: 'var(--font-body)',
                        backgroundColor: 'var(--color-background)',
                        marginTop: 'calc(var(--spacing-card) * 0.5)',
                        paddingLeft: 'var(--spacing-card)',
                        paddingRight: 'var(--spacing-card)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                      required
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-card)' }}>
                  <div>
                    <Label htmlFor="scientific_name" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Scientific Name</Label>
                    <Input
                      id="scientific_name"
                      value={productData.scientific_name}
                      onChange={(e) => setProductData({ ...productData, scientific_name: e.target.value })}
                      className="h-[42px] rounded-[8px] border-[1.5px]"
                      style={{
                        fontFamily: 'var(--font-body)',
                        backgroundColor: 'var(--color-background)',
                        marginTop: 'calc(var(--spacing-card) * 0.5)',
                        paddingLeft: 'var(--spacing-card)',
                        paddingRight: 'var(--spacing-card)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="variety" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Variety</Label>
                    <Input
                      id="variety"
                      value={productData.variety}
                      onChange={(e) => setProductData({ ...productData, variety: e.target.value })}
                      className="h-[42px] rounded-[8px] border-[1.5px]"
                      style={{
                        fontFamily: 'var(--font-body)',
                        backgroundColor: 'var(--color-background)',
                        marginTop: 'calc(var(--spacing-card) * 0.5)',
                        paddingLeft: 'var(--spacing-card)',
                        paddingRight: 'var(--spacing-card)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-card)' }}>
                  <div>
                    <Label htmlFor="origin_country" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Origin Country *</Label>
                    <Input
                      id="origin_country"
                      value={productData.origin_country}
                      onChange={(e) => setProductData({ ...productData, origin_country: e.target.value })}
                      className="h-[42px] rounded-[8px] border-[1.5px]"
                      style={{
                        fontFamily: 'var(--font-body)',
                        backgroundColor: 'var(--color-background)',
                        marginTop: 'calc(var(--spacing-card) * 0.5)',
                        paddingLeft: 'var(--spacing-card)',
                        paddingRight: 'var(--spacing-card)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="origin_region" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Origin Region</Label>
                    <Input
                      id="origin_region"
                      value={productData.origin_region}
                      onChange={(e) => setProductData({ ...productData, origin_region: e.target.value })}
                      className="h-[42px] rounded-[8px] border-[1.5px]"
                      style={{
                        fontFamily: 'var(--font-body)',
                        backgroundColor: 'var(--color-background)',
                        marginTop: 'calc(var(--spacing-card) * 0.5)',
                        paddingLeft: 'var(--spacing-card)',
                        paddingRight: 'var(--spacing-card)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="farm_id" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Farm</Label>
                  <Combobox
                    options={farms.map(farm => ({ value: farm.id, label: farm.name }))}
                    value={productData.farm_id}
                    onValueChange={(value) => setProductData({ ...productData, farm_id: value || '' })}
                    placeholder="Select a farm"
                    searchPlaceholder="Search farms..."
                    emptyText="No farms found."
                    rightIcon={MapPin}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-card)' }}>
                  <div>
                    <Label htmlFor="harvest_date" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Harvest Date</Label>
                    <DatePicker
                      value={productData.harvest_date}
                      onChange={(value) => setProductData({ ...productData, harvest_date: value })}
                      placeholder="Select harvest date"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price_per_kg" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Price per kg (€)</Label>
                    <Input
                      id="price_per_kg"
                      type="number"
                      step="0.01"
                      value={productData.price_per_kg}
                      onChange={(e) => setProductData({ ...productData, price_per_kg: e.target.value })}
                      className="h-[42px] rounded-[8px] border-[1.5px]"
                      style={{
                        fontFamily: 'var(--font-body)',
                        backgroundColor: 'var(--color-background)',
                        marginTop: 'calc(var(--spacing-card) * 0.5)',
                        paddingLeft: 'var(--spacing-card)',
                        paddingRight: 'var(--spacing-card)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="transport_distance_km" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Transport Distance (km)</Label>
                    <Input
                      id="transport_distance_km"
                      type="number"
                      step="0.01"
                      value={productData.transport_distance_km}
                      onChange={(e) => setProductData({ ...productData, transport_distance_km: e.target.value })}
                      className="h-[42px] rounded-[8px] border-[1.5px]"
                      style={{
                        fontFamily: 'var(--font-body)',
                        backgroundColor: 'var(--color-background)',
                        marginTop: 'calc(var(--spacing-card) * 0.5)',
                        paddingLeft: 'var(--spacing-card)',
                        paddingRight: 'var(--spacing-card)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="emissions_co2e_per_kg" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Emissions CO₂e per kg</Label>
                  <Input
                    id="emissions_co2e_per_kg"
                    type="number"
                    step="0.001"
                    value={productData.emissions_co2e_per_kg}
                    onChange={(e) => setProductData({ ...productData, emissions_co2e_per_kg: e.target.value })}
                    className="h-[42px] rounded-[8px] border-[1.5px]"
                    style={{
                      fontFamily: 'var(--font-body)',
                      backgroundColor: 'var(--color-background)',
                      marginTop: 'calc(var(--spacing-card) * 0.5)',
                      paddingLeft: 'var(--spacing-card)',
                      paddingRight: 'var(--spacing-card)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="image_url">Product Image</Label>
                  <FileUpload
                    value={productData.image_url}
                    onChange={(url) => setProductData({ ...productData, image_url: url })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <div className="flex-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
                    <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Labels</Label>
                    <Button onClick={addLabel} size="sm" variant="outline" style={{ padding: '4px 8px' }}>
                      <Plus className="size-4" />
                      Add Label
                    </Button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-card) * 0.5)' }}>
                    {labels.map((label, labelIndex) => (
                      <div key={labelIndex} style={{ display: 'flex', gap: 'var(--spacing-card)', alignItems: 'center' }}>
                        <Input
                          value={label.label_name}
                          onChange={(e) => {
                            const updated = [...labels]
                            updated[labelIndex].label_name = e.target.value
                            setLabels(updated)
                          }}
                          placeholder='The most important labels you want to highlight, e.g. "Bio" or "Fair Trade"'
                          className="h-[42px] rounded-[8px] border-[1.5px]"
                          style={{
                            fontFamily: 'var(--font-body)',
                            backgroundColor: 'var(--color-background)',
                            paddingLeft: 'var(--spacing-card)',
                            paddingRight: 'var(--spacing-card)',
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-text)',
                          }}
                        />
                        <Button
                          onClick={() => removeLabel(labelIndex)}
                          size="icon-sm"
                          variant="ghost"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                    {labels.length === 0 && (
                      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)', fontSize: '14px', fontStyle: 'italic' }}>
                        No labels added yet. Click "Add Label" to get started.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recipes Tab */}
          <TabsContent value="recipes">
            <div>
              <div className="flex-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-card)' }}>
                <h3 style={{ fontFamily: 'var(--font-body)', margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Recipes</h3>
                <Button onClick={addRecipe} size="sm" variant="outline" style={{ padding: '4px 8px' }}>
                  <Plus className="size-4" />
                  Add Recipe
                </Button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-section)' }}>
                {recipes.map((recipe, recipeIndex) => (
                  <Card key={recipeIndex} stroke>
                    <CardContent style={{ padding: 'var(--spacing-card)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-card)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-card)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-card)' }}>
                            <div>
                              <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Title *</Label>
                              <Input
                                value={recipe.title}
                                onChange={(e) => {
                                  const updated = [...recipes]
                                  updated[recipeIndex].title = e.target.value
                                  setRecipes(updated)
                                }}
                                className="h-[42px] rounded-[8px] border-[1.5px]"
                                style={{
                                  fontFamily: 'var(--font-body)',
                                  backgroundColor: 'var(--color-background)',
                                  marginTop: 'calc(var(--spacing-card) * 0.5)',
                                  paddingLeft: 'var(--spacing-card)',
                                  paddingRight: 'var(--spacing-card)',
                                  borderColor: 'var(--color-border)',
                                  color: 'var(--color-text)',
                                }}
                              />
                            </div>
                            <div>
                              <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Cultural Origin</Label>
                              <Input
                                value={recipe.cultural_origin}
                                onChange={(e) => {
                                  const updated = [...recipes]
                                  updated[recipeIndex].cultural_origin = e.target.value
                                  setRecipes(updated)
                                }}
                                className="h-[42px] rounded-[8px] border-[1.5px]"
                                style={{
                                  fontFamily: 'var(--font-body)',
                                  backgroundColor: 'var(--color-background)',
                                  marginTop: 'calc(var(--spacing-card) * 0.5)',
                                  paddingLeft: 'var(--spacing-card)',
                                  paddingRight: 'var(--spacing-card)',
                                  borderColor: 'var(--color-border)',
                                  color: 'var(--color-text)',
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Description</Label>
                            <textarea
                              value={recipe.description}
                              onChange={(e) => {
                                const updated = [...recipes]
                                updated[recipeIndex].description = e.target.value
                                setRecipes(updated)
                              }}
                              style={{
                                marginTop: 'calc(var(--spacing-card) * 0.5)',
                                width: '100%',
                                minHeight: '80px',
                                padding: 'var(--spacing-card)',
                                borderRadius: '8px',
                                border: '1.5px solid var(--color-border)',
                                fontFamily: 'var(--font-body)',
                                fontSize: '14px',
                                backgroundColor: 'var(--color-background)',
                                color: 'var(--color-text)',
                              }}
                            />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-card)' }}>
                            <div>
                              <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Prep Time (min)</Label>
                              <Input
                                type="number"
                                value={recipe.prep_time_minutes}
                                onChange={(e) => {
                                  const updated = [...recipes]
                                  updated[recipeIndex].prep_time_minutes = e.target.value
                                  setRecipes(updated)
                                }}
                                className="h-[42px] rounded-[8px] border-[1.5px]"
                                style={{
                                  fontFamily: 'var(--font-body)',
                                  backgroundColor: 'var(--color-background)',
                                  marginTop: 'calc(var(--spacing-card) * 0.5)',
                                  paddingLeft: 'var(--spacing-card)',
                                  paddingRight: 'var(--spacing-card)',
                                  borderColor: 'var(--color-border)',
                                  color: 'var(--color-text)',
                                }}
                              />
                            </div>
                            <div>
                              <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Cook Time (min)</Label>
                              <Input
                                type="number"
                                value={recipe.cook_time_minutes}
                                onChange={(e) => {
                                  const updated = [...recipes]
                                  updated[recipeIndex].cook_time_minutes = e.target.value
                                  setRecipes(updated)
                                }}
                                className="h-[42px] rounded-[8px] border-[1.5px]"
                                style={{
                                  fontFamily: 'var(--font-body)',
                                  backgroundColor: 'var(--color-background)',
                                  marginTop: 'calc(var(--spacing-card) * 0.5)',
                                  paddingLeft: 'var(--spacing-card)',
                                  paddingRight: 'var(--spacing-card)',
                                  borderColor: 'var(--color-border)',
                                  color: 'var(--color-text)',
                                }}
                              />
                            </div>
                            <div>
                              <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Servings</Label>
                              <Input
                                type="number"
                                value={recipe.servings}
                                onChange={(e) => {
                                  const updated = [...recipes]
                                  updated[recipeIndex].servings = e.target.value
                                  setRecipes(updated)
                                }}
                                className="h-[42px] rounded-[8px] border-[1.5px]"
                                style={{
                                  fontFamily: 'var(--font-body)',
                                  backgroundColor: 'var(--color-background)',
                                  marginTop: 'calc(var(--spacing-card) * 0.5)',
                                  paddingLeft: 'var(--spacing-card)',
                                  paddingRight: 'var(--spacing-card)',
                                  borderColor: 'var(--color-border)',
                                  color: 'var(--color-text)',
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Ingredients</Label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-card) * 0.5)', marginTop: 'calc(var(--spacing-card) * 0.5)' }}>
                              {recipe.ingredients.map((ing, ingIndex) => (
                                <div key={ingIndex} style={{ display: 'flex', gap: 'var(--spacing-card)', alignItems: 'center' }}>
                                  <Input
                                    placeholder="Name"
                                    value={ing.name}
                                    onChange={(e) => {
                                      const updated = [...recipes]
                                      updated[recipeIndex].ingredients[ingIndex].name = e.target.value
                                      setRecipes(updated)
                                    }}
                                    className="h-[42px] rounded-[8px] border-[1.5px]"
                                    style={{
                                      fontFamily: 'var(--font-body)',
                                      backgroundColor: 'var(--color-background)',
                                      paddingLeft: 'var(--spacing-card)',
                                      paddingRight: 'var(--spacing-card)',
                                      borderColor: 'var(--color-border)',
                                      color: 'var(--color-text)',
                                    }}
                                  />
                                  <Input
                                    placeholder="Amount"
                                    value={ing.amount}
                                    onChange={(e) => {
                                      const updated = [...recipes]
                                      updated[recipeIndex].ingredients[ingIndex].amount = e.target.value
                                      setRecipes(updated)
                                    }}
                                    className="h-[42px] rounded-[8px] border-[1.5px]"
                                    style={{
                                      fontFamily: 'var(--font-body)',
                                      backgroundColor: 'var(--color-background)',
                                      paddingLeft: 'var(--spacing-card)',
                                      paddingRight: 'var(--spacing-card)',
                                      borderColor: 'var(--color-border)',
                                      color: 'var(--color-text)',
                                    }}
                                  />
                                  <Button
                                    onClick={() => {
                                      const updated = [...recipes]
                                      updated[recipeIndex].ingredients = updated[recipeIndex].ingredients.filter((_, i) => i !== ingIndex)
                                      setRecipes(updated)
                                    }}
                                    size="icon-sm"
                                    variant="ghost"
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                onClick={() => {
                                  const updated = [...recipes]
                                  updated[recipeIndex].ingredients.push({ name: '', amount: '' })
                                  setRecipes(updated)
                                }}
                                size="sm"
                                variant="outline"
                                style={{ alignSelf: 'flex-start', padding: '4px 8px' }}
                              >
                                <Plus className="size-4" />
                                Add Ingredient
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label>Instructions</Label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-card) * 0.5)', marginTop: 'calc(var(--spacing-card) * 0.5)' }}>
                              {recipe.instructions.map((instruction, instIndex) => (
                                <div key={instIndex} style={{ display: 'flex', gap: 'var(--spacing-card)', alignItems: 'center' }}>
                                  <span style={{ fontFamily: 'var(--font-body)', minWidth: '30px' }}>{instIndex + 1}.</span>
                                  <Input
                                    value={instruction}
                                    onChange={(e) => {
                                      const updated = [...recipes]
                                      updated[recipeIndex].instructions[instIndex] = e.target.value
                                      setRecipes(updated)
                                    }}
                                    className="h-[42px] rounded-[8px] border-[1.5px]"
                                    style={{
                                      fontFamily: 'var(--font-body)',
                                      backgroundColor: 'var(--color-background)',
                                      paddingLeft: 'var(--spacing-card)',
                                      paddingRight: 'var(--spacing-card)',
                                      borderColor: 'var(--color-border)',
                                      color: 'var(--color-text)',
                                    }}
                                  />
                                  <Button
                                    onClick={() => {
                                      const updated = [...recipes]
                                      updated[recipeIndex].instructions = updated[recipeIndex].instructions.filter((_, i) => i !== instIndex)
                                      setRecipes(updated)
                                    }}
                                    size="icon-sm"
                                    variant="ghost"
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                onClick={() => {
                                  const updated = [...recipes]
                                  updated[recipeIndex].instructions.push('')
                                  setRecipes(updated)
                                }}
                                size="sm"
                                variant="outline"
                                style={{ alignSelf: 'flex-start', padding: '4px 8px' }}
                              >
                                <Plus className="size-4" />
                                Add Instruction
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label>Recipe Image</Label>
                            <FileUpload
                              value={recipe.image_url}
                              onChange={(url) => {
                                const updated = [...recipes]
                                updated[recipeIndex].image_url = url
                                setRecipes(updated)
                              }}
                              className="mt-2"
                            />
                          </div>
                        </div>
                        <Button
                          onClick={() => removeRecipe(recipeIndex)}
                          size="icon-sm"
                          variant="ghost"
                          style={{ marginLeft: 'var(--spacing-card)' }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {recipes.length === 0 && (
                  <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)', textAlign: 'center', paddingTop: '4px', paddingBottom: '4px', paddingLeft: 'var(--spacing-section)', paddingRight: 'var(--spacing-section)', verticalAlign: 'middle' }}>
                    No recipes added yet. Click "Add Recipe" to get started.
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Certifications & Quality Tab */}
          <TabsContent value="certifications">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-section)' }}>
              {/* Quality Indicators */}
              <div>
                <div className="flex-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-card)' }}>
                  <h3 style={{ fontFamily: 'var(--font-body)', margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Quality Indicators</h3>
                  <Button onClick={addQualityIndicator} size="sm" variant="outline" style={{ padding: '4px 8px' }}>
                    <Plus className="size-4" />
                    Add Indicator
                  </Button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-card)' }}>
                  {qualityIndicators.map((indicator, index) => (
                    <Card key={index} stroke>
                      <CardContent style={{ padding: 'var(--spacing-card)', display: 'flex', gap: 'var(--spacing-card)' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-card)' }}>
                          <div>
                            <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Type</Label>
                            <Combobox
                              options={[
                                { value: 'freshness', label: 'Freshness' },
                                { value: 'ripeness', label: 'Ripeness' },
                                { value: 'shelf_life', label: 'Shelf Life' },
                              ]}
                              value={indicator.indicator_type}
                              onValueChange={(value) => {
                                const updated = [...qualityIndicators]
                                const newType = value as any
                                updated[index].indicator_type = newType
                                // Reset fields when type changes
                                if (newType === 'shelf_life') {
                                  updated[index].score = undefined
                                  updated[index].max_score = undefined
                                  updated[index].percentage = undefined
                                  updated[index].shelf_life_remaining_days = 0
                                } else {
                                  updated[index].score = 0
                                  updated[index].max_score = 5
                                  updated[index].percentage = ''
                                  updated[index].shelf_life_remaining_days = undefined
                                }
                                setQualityIndicators(updated)
                              }}
                              placeholder="Select type"
                            />
                          </div>
                          {indicator.indicator_type === 'shelf_life' ? (
                            <div>
                              <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Days Remaining</Label>
                              <Input
                                type="number"
                                value={indicator.shelf_life_remaining_days || ''}
                                onChange={(e) => {
                                  const updated = [...qualityIndicators]
                                  updated[index].shelf_life_remaining_days = e.target.value ? parseInt(e.target.value) : 0
                                  setQualityIndicators(updated)
                                }}
                                placeholder="Enter days remaining"
                                className="h-[42px] rounded-[8px] border-[1.5px]"
                                style={{
                                  fontFamily: 'var(--font-body)',
                                  backgroundColor: 'var(--color-background)',
                                  marginTop: 'calc(var(--spacing-card) * 0.5)',
                                  paddingLeft: 'var(--spacing-card)',
                                  paddingRight: 'var(--spacing-card)',
                                  borderColor: 'var(--color-border)',
                                  color: 'var(--color-text)',
                                }}
                              />
                            </div>
                          ) : (
                            <div>
                              <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>
                                Score: {indicator.score || 0} / {indicator.max_score || 5}
                              </Label>
                              <div style={{ marginTop: 'calc(var(--spacing-card) * 0.5)', padding: '0 var(--spacing-card)' }}>
                                <Slider
                                  value={[indicator.score || 0]}
                                  onValueChange={(values) => {
                                    const updated = [...qualityIndicators]
                                    updated[index].score = values[0]
                                    updated[index].percentage = ((values[0] / (indicator.max_score || 5)) * 100).toFixed(2)
                                    setQualityIndicators(updated)
                                  }}
                                  min={0}
                                  max={indicator.max_score || 5}
                                  step={0.1}
                                />
                              </div>
                            </div>
                          )}
                          <div>
                            <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Description</Label>
                            <Input
                              value={indicator.description}
                              onChange={(e) => {
                                const updated = [...qualityIndicators]
                                updated[index].description = e.target.value
                                setQualityIndicators(updated)
                              }}
                              placeholder={indicator.indicator_type === 'shelf_life' ? 'e.g. Best consumed within 5 days' : 'e.g. perfect ripeness in 3 days'}
                              className="h-[42px] rounded-[8px] border-[1.5px]"
                              style={{
                                fontFamily: 'var(--font-body)',
                                backgroundColor: 'var(--color-background)',
                                marginTop: 'calc(var(--spacing-card) * 0.5)',
                                paddingLeft: 'var(--spacing-card)',
                                paddingRight: 'var(--spacing-card)',
                                borderColor: 'var(--color-border)',
                                color: 'var(--color-text)',
                              }}
                            />
                          </div>
                        </div>
                        <Button
                          onClick={() => removeQualityIndicator(index)}
                          size="icon-sm"
                          variant="ghost"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  {qualityIndicators.length === 0 && (
                    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)', textAlign: 'center', paddingTop: '4px', paddingBottom: '4px', paddingLeft: 'var(--spacing-section)', paddingRight: 'var(--spacing-section)', verticalAlign: 'middle' }}>
                      No quality indicators added yet. Click "Add Indicator" to get started.
                    </p>
                  )}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <div className="flex-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-card)' }}>
                  <h3 style={{ fontFamily: 'var(--font-body)', margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Certifications</h3>
                  <Button onClick={addCertification} size="sm" variant="outline" style={{ padding: '4px 8px' }}>
                    <Plus className="size-4" />
                    Add Certification
                  </Button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-card)' }}>
                  {certifications.map((cert, index) => (
                    <Card key={index} stroke>
                      <CardContent style={{ padding: 'var(--spacing-card)', display: 'flex', gap: 'var(--spacing-card)' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-card)' }}>
                          <div>
                            <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Certification Type *</Label>
                            <Combobox
                              options={[
                                // Organic Certifications
                                { value: 'EU Organic', label: 'EU Organic' },
                                { value: 'USDA Organic', label: 'USDA Organic' },
                                { value: 'Bio Suisse', label: 'Bio Suisse' },
                                { value: 'Demeter', label: 'Demeter (Biodynamic)' },
                                { value: 'Soil Association Organic', label: 'Soil Association Organic' },
                                { value: 'AB (Agriculture Biologique)', label: 'AB (Agriculture Biologique)' },
                                { value: 'JAS Organic', label: 'JAS Organic (Japan)' },
                                { value: 'Australian Certified Organic', label: 'Australian Certified Organic' },
                                // Fair Trade & Social Responsibility
                                { value: 'Fair Trade Certified', label: 'Fair Trade Certified' },
                                { value: 'Fair Labor Certified', label: 'Fair Labor Certified' },
                                { value: 'Fair for Life', label: 'Fair for Life' },
                                { value: 'Rainforest Alliance', label: 'Rainforest Alliance' },
                                { value: 'UTZ Certified', label: 'UTZ Certified' },
                                // Sustainability & Environmental
                                { value: 'Carbon Trust Certified', label: 'Carbon Trust Certified' },
                                { value: 'LEAF Marque', label: 'LEAF Marque' },
                                { value: 'GlobalG.A.P.', label: 'GlobalG.A.P.' },
                                { value: 'SCS Sustainably Grown', label: 'SCS Sustainably Grown' },
                                { value: 'MSC Certified', label: 'MSC Certified (Marine Stewardship)' },
                                { value: 'ASC Certified', label: 'ASC Certified (Aquaculture)' },
                                // Food Safety & Quality
                                { value: 'BRC Global Standards', label: 'BRC Global Standards' },
                                { value: 'IFS Food Standard', label: 'IFS Food Standard' },
                                { value: 'GFSI Recognized', label: 'GFSI Recognized (Global Food Safety)' },
                                { value: 'SQF Certified', label: 'SQF Certified (Safe Quality Food)' },
                                // Regional & Specialty
                                { value: 'Protected Designation of Origin (PDO)', label: 'Protected Designation of Origin (PDO)' },
                                { value: 'Protected Geographical Indication (PGI)', label: 'Protected Geographical Indication (PGI)' },
                                { value: 'Traditional Specialty Guaranteed (TSG)', label: 'Traditional Specialty Guaranteed (TSG)' },
                                { value: 'Non-GMO Project Verified', label: 'Non-GMO Project Verified' },
                                { value: 'Kosher Certified', label: 'Kosher Certified' },
                                { value: 'Halal Certified', label: 'Halal Certified' },
                                { value: 'Local Certified', label: 'Local Certified' },
                              ]}
                              value={cert.cert_type}
                              onValueChange={(value) => {
                                const updated = [...certifications]
                                updated[index].cert_type = value || ''
                                setCertifications(updated)
                              }}
                              placeholder="Select certification type"
                            />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-card)' }}>
                            <div>
                              <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Certifying Body</Label>
                              <Input
                                value={cert.certifying_body}
                                onChange={(e) => {
                                  const updated = [...certifications]
                                  updated[index].certifying_body = e.target.value
                                  setCertifications(updated)
                                }}
                                placeholder="e.g. Fair Labor Association"
                                className="h-[42px] rounded-[8px] border-[1.5px]"
                                style={{
                                  fontFamily: 'var(--font-body)',
                                  backgroundColor: 'var(--color-background)',
                                  marginTop: 'calc(var(--spacing-card) * 0.5)',
                                  paddingLeft: 'var(--spacing-card)',
                                  paddingRight: 'var(--spacing-card)',
                                  borderColor: 'var(--color-border)',
                                  color: 'var(--color-text)',
                                }}
                              />
                            </div>
                            <div>
                              <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Certifying Body Code</Label>
                              <Input
                                value={cert.certifying_body_code}
                                onChange={(e) => {
                                  const updated = [...certifications]
                                  updated[index].certifying_body_code = e.target.value
                                  setCertifications(updated)
                                }}
                                className="h-[42px] rounded-[8px] border-[1.5px]"
                                style={{
                                  fontFamily: 'var(--font-body)',
                                  backgroundColor: 'var(--color-background)',
                                  marginTop: 'calc(var(--spacing-card) * 0.5)',
                                  paddingLeft: 'var(--spacing-card)',
                                  paddingRight: 'var(--spacing-card)',
                                  borderColor: 'var(--color-border)',
                                  color: 'var(--color-text)',
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Certificate ID</Label>
                            <Input
                              value={cert.certificate_id}
                              onChange={(e) => {
                                const updated = [...certifications]
                                updated[index].certificate_id = e.target.value
                                setCertifications(updated)
                              }}
                              className="h-[42px] rounded-[8px] border-[1.5px]"
                              style={{
                                fontFamily: 'var(--font-body)',
                                backgroundColor: 'var(--color-background)',
                                marginTop: 'calc(var(--spacing-card) * 0.5)',
                                paddingLeft: 'var(--spacing-card)',
                                paddingRight: 'var(--spacing-card)',
                                borderColor: 'var(--color-border)',
                                color: 'var(--color-text)',
                              }}
                            />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-card)' }}>
                            <div>
                              <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Audit Date</Label>
                              <DatePicker
                                value={cert.audit_date}
                                onChange={(value) => {
                                  const updated = [...certifications]
                                  updated[index].audit_date = value
                                  setCertifications(updated)
                                }}
                                placeholder="Select audit date"
                              />
                            </div>
                            <div>
                              <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Expiry Date</Label>
                              <DatePicker
                                value={cert.expiry_date}
                                onChange={(value) => {
                                  const updated = [...certifications]
                                  updated[index].expiry_date = value
                                  setCertifications(updated)
                                }}
                                placeholder="Select expiry date"
                              />
                            </div>
                            <div>
                              <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Auditor Name</Label>
                              <Input
                                value={cert.auditor_name}
                                onChange={(e) => {
                                  const updated = [...certifications]
                                  updated[index].auditor_name = e.target.value
                                  setCertifications(updated)
                                }}
                                className="h-[42px] rounded-[8px] border-[1.5px]"
                                style={{
                                  fontFamily: 'var(--font-body)',
                                  backgroundColor: 'var(--color-background)',
                                  marginTop: 'calc(var(--spacing-card) * 0.5)',
                                  paddingLeft: 'var(--spacing-card)',
                                  paddingRight: 'var(--spacing-card)',
                                  borderColor: 'var(--color-border)',
                                  color: 'var(--color-text)',
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Audit Findings</Label>
                            <textarea
                              value={cert.audit_findings}
                              onChange={(e) => {
                                const updated = [...certifications]
                                updated[index].audit_findings = e.target.value
                                setCertifications(updated)
                              }}
                              placeholder="E.g. Workers receive above minimum wage, proper housing provided for seasonal workers, no child labor observed."
                              style={{
                                marginTop: 'calc(var(--spacing-card) * 0.5)',
                                width: '100%',
                                minHeight: '80px',
                                padding: 'var(--spacing-card)',
                                borderRadius: '8px',
                                border: '1.5px solid var(--color-border)',
                                fontFamily: 'var(--font-body)',
                                fontSize: '14px',
                                backgroundColor: 'var(--color-background)',
                                color: 'var(--color-text)',
                              }}
                            />
                          </div>
                        </div>
                        <Button
                          onClick={() => removeCertification(index)}
                          size="icon-sm"
                          variant="ghost"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  {certifications.length === 0 && (
                    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)', textAlign: 'center', paddingTop: '4px', paddingBottom: '4px', paddingLeft: 'var(--spacing-section)', paddingRight: 'var(--spacing-section)', verticalAlign: 'middle' }}>
                      No certifications added yet. Click "Add Certification" to get started.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

        </Tabs>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-card)', marginTop: 'calc(var(--spacing-section) * 2)' }}>
          <Button onClick={() => navigate('/admin?tab=products')} variant="outline" style={{ padding: '4px 8px' }}>
            Cancel
          </Button>
          <Button onClick={handleContinue} disabled={saving || (!productData.name || !productData.display_id || !productData.origin_country)} style={{ padding: '4px 8px', color: 'var(--background)' }}>
            {saving ? (
              <>
                <Spinner className="size-4" />
                Saving...
              </>
            ) : isLastTab ? (
              'Confirm & Save'
            ) : (
              <>
                Next
                <ArrowRight className="size-4" style={{ stroke: 'var(--background)' }} />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}


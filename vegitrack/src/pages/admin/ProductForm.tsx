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
import { getProductById, getAllFarms, getRecipes, getQualityIndicators, getCertifications } from '../../lib/api'
import type {
  Product,
  Recipe,
  QualityIndicator,
  CertificationBlock,
  FarmingPractice,
} from '../../types/database'
import { Plus, Trash2, ArrowRight, MapPin } from 'lucide-react'
import { Spinner } from '../../components/ui'
import { Combobox, type ComboboxOption } from '../../components/ui/combobox'

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
  score: number
  max_score: number
  percentage: string
  description: string
  recommendation: string
  shelf_life_remaining_days?: number
}

interface CertificationFormData {
  id?: string
  cert_type: string
  cert_display_name: string
  certifying_body: string
  certifying_body_code: string
  certificate_id: string
  audit_date: string
  expiry_date: string
  auditor_name: string
  audit_findings: string
  description: string
}

interface FarmingPracticeFormData {
  id?: string
  category: string
  icon_type: string
  practices: string[]
}

export default function ProductForm() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(!!id)
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

  // Farming practices state
  const [farmingPractices, setFarmingPractices] = useState<FarmingPracticeFormData[]>([])

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

        // Load quality indicators
        const qualityData = await getQualityIndicators(id)
        setQualityIndicators(
          qualityData.map(q => ({
            id: q.id,
            indicator_type: q.indicator_type,
            score: q.score || 0,
            max_score: q.max_score || 5,
            percentage: q.percentage?.toString() || '',
            description: q.description || '',
            recommendation: q.recommendation || '',
            shelf_life_remaining_days: q.indicator_type === 'shelf_life' ? (q.score || 0) : undefined,
          }))
        )

        // Load certifications
        const certData = await getCertifications(id)
        setCertifications(
          certData.map(c => ({
            id: c.id,
            cert_type: c.cert_type,
            cert_display_name: c.cert_display_name || '',
            certifying_body: c.certifying_body || '',
            certifying_body_code: c.certifying_body_code || '',
            certificate_id: c.certificate_id || '',
            audit_date: c.audit_date || '',
            expiry_date: c.expiry_date || '',
            auditor_name: c.auditor_name || '',
            audit_findings: c.audit_findings || '',
            description: c.description || '',
          }))
        )
      }
    } catch (error) {
      console.error('Error loading product:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleContinue() {
    // Store form data in sessionStorage and navigate to overview
    const formData = {
      productData,
      recipes,
      qualityIndicators,
      certifications,
      farmingPractices,
    }
    sessionStorage.setItem('productFormData', JSON.stringify(formData))
    navigate(`/admin/product/${id || 'new'}/overview`)
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

  function addQualityIndicator() {
    setQualityIndicators([
      ...qualityIndicators,
      {
        indicator_type: 'freshness',
        score: 0,
        max_score: 5,
        percentage: '',
        description: '',
        recommendation: '',
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
        cert_display_name: '',
        certifying_body: '',
        certifying_body_code: '',
        certificate_id: '',
        audit_date: '',
        expiry_date: '',
        auditor_name: '',
        audit_findings: '',
        description: '',
      },
    ])
  }

  function removeCertification(index: number) {
    setCertifications(certifications.filter((_, i) => i !== index))
  }

  function addFarmingPractice() {
    setFarmingPractices([
      ...farmingPractices,
      {
        category: 'soil_inputs',
        icon_type: '',
        practices: [''],
      },
    ])
  }

  function removeFarmingPractice(index: number) {
    setFarmingPractices(farmingPractices.filter((_, i) => i !== index))
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

        <Tabs defaultValue="product-info">
          <TabsList style={{ marginBottom: 'var(--spacing-card)' }}>
            <TabsTrigger value="product-info">Product Info</TabsTrigger>
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
            <TabsTrigger value="certifications">Certifications & Quality</TabsTrigger>
            <TabsTrigger value="farming">Farming Practices</TabsTrigger>
          </TabsList>

          {/* Product Info Tab */}
          <TabsContent value="product-info">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'var(--font-body)' }}>Product Information</CardTitle>
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recipes Tab */}
          <TabsContent value="recipes">
            <div>
              <div className="flex-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-card)' }}>
                <h3 style={{ fontFamily: 'var(--font-body)', margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Recipes</h3>
                <Button onClick={addRecipe} size="sm" variant="outline">
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
                                style={{ alignSelf: 'flex-start' }}
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
                                style={{ alignSelf: 'flex-start' }}
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
                  <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)', textAlign: 'center', padding: 'var(--spacing-section)' }}>
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
                  <Button onClick={addQualityIndicator} size="sm" variant="outline">
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
                            <select
                              value={indicator.indicator_type}
                              onChange={(e) => {
                                const updated = [...qualityIndicators]
                                updated[index].indicator_type = e.target.value as any
                                // Reset shelf_life_remaining_days if type changes
                                if (e.target.value !== 'shelf_life') {
                                  updated[index].shelf_life_remaining_days = undefined
                                }
                                setQualityIndicators(updated)
                              }}
                              style={{
                                marginTop: 'calc(var(--spacing-card) * 0.5)',
                                width: '100%',
                                height: '42px',
                                padding: '0 var(--spacing-card)',
                                borderRadius: '8px',
                                border: '1.5px solid var(--color-border)',
                                fontFamily: 'var(--font-body)',
                                backgroundColor: 'var(--color-background)',
                                color: 'var(--color-text)',
                              }}
                            >
                              <option value="freshness">Freshness</option>
                              <option value="ripeness">Ripeness</option>
                              <option value="shelf_life">Shelf Life</option>
                            </select>
                          </div>
                          <div>
                            <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>
                              Score: {indicator.score} / {indicator.max_score}
                            </Label>
                            <div style={{ marginTop: 'calc(var(--spacing-card) * 0.5)', padding: '0 var(--spacing-card)' }}>
                              <Slider
                                value={[indicator.score]}
                                onValueChange={(values) => {
                                  const updated = [...qualityIndicators]
                                  updated[index].score = values[0]
                                  updated[index].percentage = ((values[0] / indicator.max_score) * 100).toFixed(2)
                                  setQualityIndicators(updated)
                                }}
                                min={0}
                                max={indicator.max_score}
                                step={0.1}
                              />
                            </div>
                          </div>
                          {indicator.indicator_type === 'shelf_life' && (
                            <div>
                              <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>
                                Shelf Life Remaining (days): {indicator.shelf_life_remaining_days || 0}
                              </Label>
                              <div style={{ marginTop: 'calc(var(--spacing-card) * 0.5)', padding: '0 var(--spacing-card)' }}>
                                <Slider
                                  value={[indicator.shelf_life_remaining_days || 0]}
                                  onValueChange={(values) => {
                                    const updated = [...qualityIndicators]
                                    updated[index].shelf_life_remaining_days = values[0]
                                    setQualityIndicators(updated)
                                  }}
                                  min={0}
                                  max={30}
                                  step={1}
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
                            <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Recommendation</Label>
                            <Input
                              value={indicator.recommendation}
                              onChange={(e) => {
                                const updated = [...qualityIndicators]
                                updated[index].recommendation = e.target.value
                                setQualityIndicators(updated)
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
                </div>
              </div>

              {/* Certifications */}
              <div>
                <div className="flex-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-card)' }}>
                  <h3 style={{ fontFamily: 'var(--font-body)', margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Certifications</h3>
                  <Button onClick={addCertification} size="sm" variant="outline">
                    <Plus className="size-4" />
                    Add Certification
                  </Button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-card)' }}>
                  {certifications.map((cert, index) => (
                    <Card key={index} stroke>
                      <CardContent style={{ padding: 'var(--spacing-card)', display: 'flex', gap: 'var(--spacing-card)' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-card)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-card)' }}>
                            <div>
                              <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Certification Type *</Label>
                              <Input
                                value={cert.cert_type}
                                onChange={(e) => {
                                  const updated = [...certifications]
                                  updated[index].cert_type = e.target.value
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
                            <div>
                              <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Display Name</Label>
                              <Input
                                value={cert.cert_display_name}
                                onChange={(e) => {
                                  const updated = [...certifications]
                                  updated[index].cert_display_name = e.target.value
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
                          <div>
                            <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Description</Label>
                            <textarea
                              value={cert.description}
                              onChange={(e) => {
                                const updated = [...certifications]
                                updated[index].description = e.target.value
                                setCertifications(updated)
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
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Farming Practices Tab */}
          <TabsContent value="farming">
            <div>
              <div className="flex-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-card)' }}>
                <h3 style={{ fontFamily: 'var(--font-body)', margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Farming Practices</h3>
                <Button onClick={addFarmingPractice} size="sm" variant="outline">
                  <Plus className="size-4" />
                  Add Practice
                </Button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-card)' }}>
                {farmingPractices.map((practice, index) => (
                  <Card key={index} stroke>
                    <CardContent style={{ padding: 'var(--spacing-card)', display: 'flex', gap: 'var(--spacing-card)' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-card)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-card)' }}>
                          <div>
                            <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Category</Label>
                            <select
                              value={practice.category}
                              onChange={(e) => {
                                const updated = [...farmingPractices]
                                updated[index].category = e.target.value
                                setFarmingPractices(updated)
                              }}
                              style={{
                                marginTop: 'calc(var(--spacing-card) * 0.5)',
                                width: '100%',
                                height: '42px',
                                padding: '0 var(--spacing-card)',
                                borderRadius: '8px',
                                border: '1.5px solid var(--color-border)',
                                fontFamily: 'var(--font-body)',
                                backgroundColor: 'var(--color-background)',
                                color: 'var(--color-text)',
                              }}
                            >
                              <option value="soil_inputs">Soil & Inputs</option>
                              <option value="water_management">Water Management</option>
                              <option value="pest_control">Pest Control</option>
                              <option value="biodiversity">Biodiversity</option>
                              <option value="labor_conditions">Labor Conditions</option>
                            </select>
                          </div>
                          <div>
                            <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Icon Type</Label>
                            <Input
                              value={practice.icon_type}
                              onChange={(e) => {
                                const updated = [...farmingPractices]
                                updated[index].icon_type = e.target.value
                                setFarmingPractices(updated)
                              }}
                              placeholder="e.g. soil, water, bug"
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
                          <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Practices</Label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-card) * 0.5)', marginTop: 'calc(var(--spacing-card) * 0.5)' }}>
                            {practice.practices.map((item, itemIndex) => (
                              <div key={itemIndex} style={{ display: 'flex', gap: 'var(--spacing-card)', alignItems: 'center' }}>
                                <Input
                                  value={item}
                                  onChange={(e) => {
                                    const updated = [...farmingPractices]
                                    updated[index].practices[itemIndex] = e.target.value
                                    setFarmingPractices(updated)
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
                                    const updated = [...farmingPractices]
                                    updated[index].practices = updated[index].practices.filter((_, i) => i !== itemIndex)
                                    setFarmingPractices(updated)
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
                                const updated = [...farmingPractices]
                                updated[index].practices.push('')
                                setFarmingPractices(updated)
                              }}
                              size="sm"
                              variant="outline"
                              style={{ alignSelf: 'flex-start' }}
                            >
                              <Plus className="size-4" />
                              Add Practice Item
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => removeFarmingPractice(index)}
                        size="icon-sm"
                        variant="ghost"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-card)', marginTop: 'calc(var(--spacing-section) * 2)' }}>
          <Button onClick={() => navigate('/admin?tab=products')} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleContinue} disabled={!productData.name || !productData.display_id || !productData.origin_country}>
            Continue to Overview
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}


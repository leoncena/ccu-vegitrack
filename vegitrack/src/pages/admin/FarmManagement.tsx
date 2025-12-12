import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { FileUpload } from '../../components/admin/FileUpload'
import { toast } from '../../components/ui/sonner'
import { Spinner } from '../../components/ui'
import {
  getProducerFarm,
  createFarm,
  updateFarm,
  getFarmerStory,
  upsertFarmerStory,
  getFarmingPractices,
  upsertFarmingPractice,
  deleteFarmingPractice,
} from '../../lib/api'
import type { Farm, FarmerStory, FarmingPractice } from '../../types/database'
import { Plus, Trash2 } from 'lucide-react'

export default function FarmManagement() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [farm, setFarm] = useState<Farm | null>(null)
  const [farmerStory, setFarmerStory] = useState<FarmerStory | null>(null)
  const [farmingPractices, setFarmingPractices] = useState<FarmingPractice[]>([])

  // Farm form state
  const [farmData, setFarmData] = useState({
    name: '',
    full_address: '',
    region: '',
    country: '',
    coordinates_lat: '',
    coordinates_lng: '',
    description: '',
  })

  // Farmer story form state
  const [storyData, setStoryData] = useState({
    farmer_name: '',
    title: '',
    story_content: '',
    quote: '',
    image_url: '',
    years_farming: '',
  })

  useEffect(() => {
    loadData()
  }, [user])

  async function loadData() {
    if (!user) return
    setLoading(true)
    try {
      const farmData = await getProducerFarm(user.id)
      if (farmData) {
        setFarm(farmData)
        setFarmData({
          name: farmData.name || '',
          full_address: farmData.full_address || '',
          region: farmData.region || '',
          country: farmData.country || '',
          coordinates_lat: farmData.coordinates?.lat?.toString() || '',
          coordinates_lng: farmData.coordinates?.lng?.toString() || '',
          description: farmData.description || '',
        })

        // Load farmer story
        const story = await getFarmerStory(farmData.id)
        if (story) {
          setFarmerStory(story)
          setStoryData({
            farmer_name: story.farmer_name || '',
            title: story.title || '',
            story_content: story.story_content || '',
            quote: story.quote || '',
            image_url: story.image_url || '',
            years_farming: story.years_farming?.toString() || '',
          })
        }

        // Load farming practices
        const practices = await getFarmingPractices(farmData.id)
        setFarmingPractices(practices)
      }
    } catch (error) {
      console.error('Error loading farm data:', error)
      toast.error('Failed to load farm data')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!user) return
    setSaving(true)
    try {
      let farmId = farm?.id

      // Create or update farm
      const farmPayload: any = {
        name: farmData.name,
        full_address: farmData.full_address || null,
        region: farmData.region || null,
        country: farmData.country,
        description: farmData.description || null,
      }

      if (farmData.coordinates_lat && farmData.coordinates_lng) {
        farmPayload.coordinates = `(${farmData.coordinates_lng},${farmData.coordinates_lat})`
      }

      if (farmId) {
        await updateFarm(farmId, farmPayload)
      } else {
        const newFarm = await createFarm(farmPayload)
        farmId = newFarm.id
        setFarm(newFarm)
      }

      // Save farmer story
      if (farmId && (storyData.farmer_name || storyData.title || storyData.story_content)) {
        await upsertFarmerStory({
          id: farmerStory?.id,
          farm_id: farmId,
          farmer_name: storyData.farmer_name || 'Unknown',
          title: storyData.title || null,
          story_content: storyData.story_content || null,
          quote: storyData.quote || null,
          image_url: storyData.image_url || null,
          years_farming: storyData.years_farming ? parseInt(storyData.years_farming) : null,
        })
      }

      // Save farming practices
      for (const practice of farmingPractices) {
        await upsertFarmingPractice({
          id: practice.id,
          farm_id: farmId!,
          category: practice.category,
          category_display_name: practice.category_display_name || null,
          icon_type: practice.icon_type || null,
          practices: practice.practices || [],
        })
      }

      toast.success('Farm information saved successfully!')
      await loadData()
    } catch (error) {
      console.error('Error saving farm:', error)
      toast.error('Failed to save farm information')
    } finally {
      setSaving(false)
    }
  }

  function addFarmingPractice() {
    setFarmingPractices([
      ...farmingPractices,
      {
        id: `temp-${Date.now()}`,
        farm_id: farm?.id || '',
        category: 'soil_inputs',
        category_display_name: null,
        icon_type: null,
        practices: [''],
        created_at: new Date().toISOString(),
      },
    ])
  }

  function removeFarmingPractice(index: number) {
    const practice = farmingPractices[index]
    if (practice.id && !practice.id.startsWith('temp-')) {
      deleteFarmingPractice(practice.id).catch(console.error)
    }
    setFarmingPractices(farmingPractices.filter((_, i) => i !== index))
  }

  function updateFarmingPractice(index: number, field: keyof FarmingPractice, value: any) {
    const updated = [...farmingPractices]
    updated[index] = { ...updated[index], [field]: value }
    setFarmingPractices(updated)
  }

  function addPracticeItem(practiceIndex: number) {
    const updated = [...farmingPractices]
    updated[practiceIndex].practices = [...(updated[practiceIndex].practices || []), '']
    setFarmingPractices(updated)
  }

  function removePracticeItem(practiceIndex: number, itemIndex: number) {
    const updated = [...farmingPractices]
    updated[practiceIndex].practices = updated[practiceIndex].practices.filter((_, i) => i !== itemIndex)
    setFarmingPractices(updated)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
        <Spinner className="size-8" style={{ color: 'var(--color-primary)' }} />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-section) * 2)' }}>
      {/* Farm Information */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-body)' }}>Farm Information</CardTitle>
        </CardHeader>
        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-card)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-card)' }}>
            <div>
              <Label htmlFor="name" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Farm Name *</Label>
              <Input
                id="name"
                value={farmData.name}
                onChange={(e) => setFarmData({ ...farmData, name: e.target.value })}
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
              <Label htmlFor="country" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Country *</Label>
              <Input
                id="country"
                value={farmData.country}
                onChange={(e) => setFarmData({ ...farmData, country: e.target.value })}
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
            <Label htmlFor="full_address" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Full Address</Label>
            <Input
              id="full_address"
              value={farmData.full_address}
              onChange={(e) => setFarmData({ ...farmData, full_address: e.target.value })}
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
              <Label htmlFor="region" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Region</Label>
              <Input
                id="region"
                value={farmData.region}
                onChange={(e) => setFarmData({ ...farmData, region: e.target.value })}
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
              <Label htmlFor="coordinates_lat" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Latitude</Label>
              <Input
                id="coordinates_lat"
                type="number"
                step="any"
                value={farmData.coordinates_lat}
                onChange={(e) => setFarmData({ ...farmData, coordinates_lat: e.target.value })}
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
              <Label htmlFor="coordinates_lng" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Longitude</Label>
              <Input
                id="coordinates_lng"
                type="number"
                step="any"
                value={farmData.coordinates_lng}
                onChange={(e) => setFarmData({ ...farmData, coordinates_lng: e.target.value })}
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
            <Label htmlFor="description" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Description</Label>
            <textarea
              id="description"
              value={farmData.description}
              onChange={(e) => setFarmData({ ...farmData, description: e.target.value })}
              style={{
                marginTop: 'calc(var(--spacing-card) * 0.5)',
                width: '100%',
                minHeight: '100px',
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
        </CardContent>
      </Card>

      {/* Farmer Story */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-body)' }}>Farmer Story</CardTitle>
        </CardHeader>
        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-card)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-card)' }}>
            <div>
              <Label htmlFor="farmer_name" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Farmer Name</Label>
              <Input
                id="farmer_name"
                value={storyData.farmer_name}
                onChange={(e) => setStoryData({ ...storyData, farmer_name: e.target.value })}
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
              <Label htmlFor="years_farming" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Years Farming</Label>
              <Input
                id="years_farming"
                type="number"
                value={storyData.years_farming}
                onChange={(e) => setStoryData({ ...storyData, years_farming: e.target.value })}
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
            <Label htmlFor="title" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Story Title</Label>
            <Input
              id="title"
              value={storyData.title}
              onChange={(e) => setStoryData({ ...storyData, title: e.target.value })}
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
            <Label htmlFor="quote" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Quote</Label>
            <Input
              id="quote"
              value={storyData.quote}
              onChange={(e) => setStoryData({ ...storyData, quote: e.target.value })}
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
            <Label htmlFor="story_content" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Story Content</Label>
            <textarea
              id="story_content"
              value={storyData.story_content}
              onChange={(e) => setStoryData({ ...storyData, story_content: e.target.value })}
              style={{
                marginTop: 'calc(var(--spacing-card) * 0.5)',
                width: '100%',
                minHeight: '150px',
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
            <Label htmlFor="story_image">Farmer Image</Label>
            <FileUpload
              value={storyData.image_url}
              onChange={(url) => setStoryData({ ...storyData, image_url: url })}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Farming Practices */}
      <div>
        <div className="flex-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-card)' }}>
          <h3 style={{ fontFamily: 'var(--font-body)', margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Farming Practices</h3>
          <Button onClick={addFarmingPractice} size="sm" variant="outline">
            <Plus className="size-4" />
            Add Practice
          </Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-section)' }}>
          {farmingPractices.map((practice, index) => (
            <Card key={index} stroke>
              <CardContent style={{ padding: 'var(--spacing-card)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-card)' }}>
                    <div>
                      <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Category</Label>
                      <select
                        value={practice.category}
                        onChange={(e) => updateFarmingPractice(index, 'category', e.target.value)}
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
                      <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Display Name</Label>
                      <Input
                        value={practice.category_display_name || ''}
                        onChange={(e) => updateFarmingPractice(index, 'category_display_name', e.target.value)}
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
                      <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Icon Type</Label>
                      <Input
                        value={practice.icon_type || ''}
                        onChange={(e) => updateFarmingPractice(index, 'icon_type', e.target.value)}
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
                  <Button
                    onClick={() => removeFarmingPractice(index)}
                    size="icon-sm"
                    variant="ghost"
                    style={{ marginLeft: 'var(--spacing-card)' }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <div>
                  <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Practices</Label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-card) * 0.5)', marginTop: 'calc(var(--spacing-card) * 0.5)' }}>
                    {(practice.practices || []).map((item, itemIndex) => (
                      <div key={itemIndex} style={{ display: 'flex', gap: 'var(--spacing-card)', alignItems: 'center' }}>
                        <Input
                          value={item}
                          onChange={(e) => {
                            const updated = [...farmingPractices]
                            updated[index].practices = [...(updated[index].practices || [])]
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
                          onClick={() => removePracticeItem(index, itemIndex)}
                          size="icon-sm"
                          variant="ghost"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() => addPracticeItem(index)}
                      size="sm"
                      variant="outline"
                      style={{ alignSelf: 'flex-start' }}
                    >
                      <Plus className="size-4" />
                      Add Practice Item
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {farmingPractices.length === 0 && (
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)', textAlign: 'center', padding: 'var(--spacing-section)' }}>
              No farming practices added yet. Click "Add Practice" to get started.
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-card)' }}>
        <Button onClick={handleSave} disabled={saving || !farmData.name || !farmData.country}>
          {saving ? <Spinner className="size-4" /> : 'Save Farm Information'}
        </Button>
      </div>
    </div>
  )
}



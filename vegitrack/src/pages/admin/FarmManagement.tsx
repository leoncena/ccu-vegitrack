import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { FileUpload } from '../../components/admin/FileUpload'
import { toast } from '../../components/ui/sonner'
import { Spinner } from '../../components/ui'
import { Combobox } from '../../components/ui/combobox'
import {
  getProducerFarm,
  createFarm,
  updateFarm,
  getFarmingPractices,
  upsertFarmingPractice,
  deleteFarmingPractice,
} from '../../lib/api'
import type { Farm, FarmingPractice } from '../../types/database'
import { Plus, Trash2 } from 'lucide-react'

export default function FarmManagement() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [farm, setFarm] = useState<Farm | null>(null)
  const [farmingPractices, setFarmingPractices] = useState<FarmingPractice[]>([])

  // Farm form state
  const [farmData, setFarmData] = useState({
    name: '',
    full_address: '',
    region: '',
    country: '',
    google_maps_link: '',
    our_story: '',
    what_drives_us: [] as string[],
    life_on_farm: '',
    looking_ahead: '',
    image_url: '',
  })

  // Icon mapping for farming practices
  const farmingPracticeIcons: Record<string, string> = {
    soil_inputs: 'soil',
    water_management: 'water',
    pest_control: 'bug',
    biodiversity: 'leaf',
    labor_conditions: 'users',
  }

  const loadData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const farmData = await getProducerFarm(user.id)
      if (farmData) {
        setFarm(farmData)
        // Convert coordinates to Google Maps link if available
        let googleMapsLink = ''
        if (farmData.coordinates?.lat && farmData.coordinates?.lng) {
          googleMapsLink = `https://www.google.com/maps/place/${farmData.coordinates.lat},${farmData.coordinates.lng}`
        }
        setFarmData({
          name: farmData.name || '',
          full_address: farmData.full_address || '',
          region: farmData.region || '',
          country: farmData.country || '',
          google_maps_link: googleMapsLink,
          our_story: (farmData as any).our_story || '',
          what_drives_us: (farmData as any).what_drives_us || [],
          life_on_farm: (farmData as any).life_on_farm || '',
          looking_ahead: (farmData as any).looking_ahead || '',
          image_url: (farmData as any).image_url || '',
        })

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
  }, [user])

  useEffect(() => {
    loadData()
  }, [loadData])

  function extractCoordinatesFromGoogleMaps(link: string): { lat: number; lng: number } | null {
    try {
      // Try to extract from URL pattern: @lat,lng
      const match = link.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
      if (match) {
        return {
          lat: parseFloat(match[1]),
          lng: parseFloat(match[2]),
        }
      }
      // Try alternative pattern: place/.../@lat,lng
      const match2 = link.match(/place\/[^@]+@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
      if (match2) {
        return {
          lat: parseFloat(match2[1]),
          lng: parseFloat(match2[2]),
        }
      }
      return null
    } catch (error) {
      console.error('Error extracting coordinates:', error)
      return null
    }
  }

  async function handleSave() {
    if (!user) return
    setSaving(true)
    try {
      let farmId = farm?.id

      // Extract coordinates from Google Maps link
      let coordinates: { lat: number; lng: number } | null = null
      if (farmData.google_maps_link) {
        coordinates = extractCoordinatesFromGoogleMaps(farmData.google_maps_link)
      }

      // Create or update farm
      const farmPayload: any = {
        name: farmData.name,
        full_address: farmData.full_address || null,
        region: farmData.region || null,
        country: farmData.country,
        coordinates: coordinates,
        distance_km: null,
        our_story: farmData.our_story || null,
        what_drives_us: farmData.what_drives_us || null,
        life_on_farm: farmData.life_on_farm || null,
        looking_ahead: farmData.looking_ahead || null,
        image_url: farmData.image_url || null,
      }

      if (farmId) {
        await updateFarm(farmId, farmPayload)
      } else {
        const newFarm = await createFarm(farmPayload as Omit<Farm, 'id' | 'created_at'>)
        farmId = newFarm.id
        setFarm(newFarm)
      }

      // Save farming practices
      for (const practice of farmingPractices) {
        await upsertFarmingPractice({
          id: practice.id,
          farm_id: farmId!,
          category: practice.category,
          category_display_name: null, // Inferred from category
          icon_type: farmingPracticeIcons[practice.category] || null,
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

  function updateFarmingPractice(index: number, field: keyof FarmingPractice, value: string | string[] | null) {
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
          <CardTitle style={{ fontFamily: 'var(--font-body)', marginBottom: 'var(--spacing-card)' }}>Farm Information</CardTitle>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-card)' }}>
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
              <Label htmlFor="google_maps_link" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Google Maps Link</Label>
              <Input
                id="google_maps_link"
                value={farmData.google_maps_link}
                onChange={(e) => setFarmData({ ...farmData, google_maps_link: e.target.value })}
                placeholder="Just enter the google maps link, we find the coordinates for you"
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
            <Label htmlFor="our_story" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Our story</Label>
            <textarea
              id="our_story"
              value={farmData.our_story}
              onChange={(e) => setFarmData({ ...farmData, our_story: e.target.value })}
              placeholder="Feel free to tell your farm story here in a small text"
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
          <div>
            <div className="flex-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'calc(var(--spacing-card) * 0.5)' }}>
              <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>What drives us</Label>
              <Button
                onClick={() => setFarmData({ ...farmData, what_drives_us: [...farmData.what_drives_us, ''] })}
                size="sm"
                variant="outline"
                style={{ padding: '4px 8px' }}
              >
                <Plus className="size-4" />
                Add Point
              </Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-card) * 0.5)' }}>
              {farmData.what_drives_us.map((item, itemIndex) => (
                <div key={itemIndex} style={{ display: 'flex', gap: 'var(--spacing-card)', alignItems: 'center' }}>
                  <Input
                    value={item}
                    onChange={(e) => {
                      const updated = [...farmData.what_drives_us]
                      updated[itemIndex] = e.target.value
                      setFarmData({ ...farmData, what_drives_us: updated })
                    }}
                    placeholder="What drives you and your farm? Feel free to enter some bullet points."
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
                      const updated = farmData.what_drives_us.filter((_, i) => i !== itemIndex)
                      setFarmData({ ...farmData, what_drives_us: updated })
                    }}
                    size="icon-sm"
                    variant="ghost"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="life_on_farm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Life on the farm</Label>
            <textarea
              id="life_on_farm"
              value={farmData.life_on_farm}
              onChange={(e) => setFarmData({ ...farmData, life_on_farm: e.target.value })}
              placeholder="Feel free to share something about your farm life. E.g. a farmer markets or community events."
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
          <div>
            <Label htmlFor="looking_ahead" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Looking ahead</Label>
            <textarea
              id="looking_ahead"
              value={farmData.looking_ahead}
              onChange={(e) => setFarmData({ ...farmData, looking_ahead: e.target.value })}
              placeholder="What are your plans for the future?"
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
          <div>
            <Label htmlFor="image_url">Farm Image</Label>
            <FileUpload
              value={farmData.image_url}
              onChange={(url) => setFarmData({ ...farmData, image_url: url })}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>


      {/* Farming Practices */}
      <div>
        <div className="flex-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-card)' }}>
          <h3 style={{ fontFamily: 'var(--font-body)', margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Farming Practices</h3>
          <Button onClick={addFarmingPractice} size="sm" variant="outline" style={{ padding: '4px 8px' }}>
            <Plus className="size-4" />
            Add Practice
          </Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-section)' }}>
          {farmingPractices.map((practice, index) => (
            <Card key={index} stroke>
              <CardContent style={{ padding: 'var(--spacing-card)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div>
                      <Label style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>Category</Label>
                      <Combobox
                        options={[
                          { value: 'soil_inputs', label: 'Soil & Inputs' },
                          { value: 'water_management', label: 'Water Management' },
                          { value: 'pest_control', label: 'Pest Control' },
                          { value: 'biodiversity', label: 'Biodiversity' },
                          { value: 'labor_conditions', label: 'Labor Conditions' },
                        ]}
                        value={practice.category}
                        onValueChange={(value) => updateFarmingPractice(index, 'category', value || '')}
                        placeholder="Select category"
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
                      style={{ alignSelf: 'flex-start', padding: '4px 8px' }}
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
        <Button onClick={handleSave} disabled={saving || !farmData.name || !farmData.country} style={{ padding: '4px 8px', color: 'var(--background)' }}>
          {saving ? <Spinner className="size-4" /> : 'Save Farm Information'}
        </Button>
      </div>
    </div>
  )
}



import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DebugFooter, PageHeaderWithBack } from '../../components/layout'
import { 
  FarmerBioCard,
  StoryCard,
  StoryBulletCard,
  StoryTextCard,
  FarmPicturesCarousel,
  Spinner,
} from '../../components/ui'
import { getProductById, getProductByDisplayId, getFarmById, getFarmerStory } from '../../lib/api'
import type { Farm, FarmerStory } from '../../types/database'

export default function FarmerStories() {
  const { id } = useParams()
  const [farm, setFarm] = useState<Farm | null>(null)
  const [farmerStory, setFarmerStory] = useState<FarmerStory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!id) return

      setLoading(true)
      setError(null)

      try {
        // Fetch product by id or display_id
        let product = await getProductById(id)
        if (!product) {
          product = await getProductByDisplayId(id)
        }

        if (!product) {
          setError('Product not found')
          setLoading(false)
          return
        }

        if (!product.farm_id) {
          setError('Product does not have an associated farm')
          setLoading(false)
          return
        }

        // Fetch farm and farmer story in parallel
        const [farmData, storyData] = await Promise.all([
          getFarmById(product.farm_id),
          getFarmerStory(product.farm_id),
        ])

        if (!farmData) {
          setError('Farm not found')
          setLoading(false)
          return
        }

        setFarm(farmData)
        setFarmerStory(storyData)
      } catch (err) {
        console.error('Error fetching farmer stories:', err)
        setError('Failed to load farmer stories')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  // Helper function to split text into paragraphs
  const splitIntoParagraphs = (text: string | null | undefined): string[] => {
    if (!text) return []
    // Split by double newlines or periods followed by newlines
    return text
      .split(/\n\n+/)
      .map(p => p.trim())
      .filter(p => p.length > 0)
  }

  // Helper function to split text into items (for "Life on the farm")
  const splitIntoItems = (text: string | null | undefined): string[] => {
    if (!text) return []
    // Split by newlines or bullet points
    return text
      .split(/\n|•|[-]\s+/)
      .map(item => item.trim())
      .filter(item => item.length > 0)
  }

  // Default farm images fallback
  const farmImages = farm?.image_url
    ? [farm.image_url]
    : [
        'https://www.tagesspiegel.de/images/14123957/alternates/BASE_4_3_W600/1754380770000/mit-roel-lintermans-auf-der-tomatenfarm-good-food-syndicate.jpeg',
        'https://c8.alamy.com/compde/d173td/eine-grosse-indoor-tomaten-farm-in-sudengland-d173td.jpg',
        'https://bmg-images.forward-publishing.io/2025/12/04/33312358-c45a-444f-a8cc-f3ebb07fc615.jpeg?rect=0%2C0%2C2017%2C1135&w=1024',
        'https://cdn.getyourguide.com/img/tour/63502f65e4afc.jpeg/99.jpg',
      ]

  if (loading) {
    return (
      <div 
        className="min-h-screen pb-8 flex items-center justify-center"
        style={{ 
          backgroundColor: 'var(--color-surface-light-green-back)', 
          paddingTop: '20px',
          paddingBottom: '60px',
          paddingLeft: '10%',
          paddingRight: '10%',
        }}
      >
        <Spinner className="size-8" />
      </div>
    )
  }

  if (error || !farm) {
    return (
      <div 
        className="min-h-screen pb-8"
        style={{ 
          backgroundColor: 'var(--color-surface-light-green-back)', 
          paddingTop: '20px',
          paddingBottom: '60px',
          paddingLeft: '10%',
          paddingRight: '10%',
        }}
      >
        <PageHeaderWithBack 
          title="Farmer Stories"
          backTo={`/product/${id}`}
        />
        <div style={{ padding: 'var(--spacing-card)', textAlign: 'center', color: 'var(--color-text)' }}>
          <p>{error || 'No farmer story data available'}</p>
        </div>
        <DebugFooter />
      </div>
    )
  }

  // Build bio text from farmer story and farm data
  const farmerName = farmerStory?.farmer_name || 'Farmer'
  const yearsText = farmerStory?.years_farming 
    ? ` - Farming for ${farmerStory.years_farming} years`
    : ''
  const regionText = farm.region ? ` in ${farm.region}` : ''
  const bio = `${farmerName}${yearsText}. A small family farm${regionText} growing vegetables with care and tradition.`

  // Use story_content from farmer_stories or our_story from farm, split into paragraphs
  const storyParagraphs = farmerStory?.story_content
    ? splitIntoParagraphs(farmerStory.story_content)
    : splitIntoParagraphs(farm.our_story)

  // Get "What drives us" items from farm data
  const whatDrivesUsItems = farm.what_drives_us && farm.what_drives_us.length > 0
    ? farm.what_drives_us
    : []

  // Get "Life on the farm" items from farm data
  const lifeOnFarmItems = farm.life_on_farm
    ? splitIntoItems(farm.life_on_farm)
    : []

  return (
    <div 
      className="min-h-screen pb-8"
      style={{ 
        backgroundColor: 'var(--color-surface-light-green-back)', 
        paddingTop: '20px',
        paddingBottom: '60px',
        paddingLeft: '10%',
        paddingRight: '10%',
      }}
    >
      <PageHeaderWithBack 
        title="Farmer Stories"
        backTo={`/product/${id}`}
      />

      {/* Cards container with 1 space card margin */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-card)' }}>
        
        {/* Farmer Profile Card */}
        <FarmerBioCard
          imageUrl={farmerStory?.image_url || 'https://i0.wp.com/www.climatefarmers.org/wp-content/uploads/2025/05/Profile-Farmer-featured-image-9.png?fit=1080%2C720&ssl=1'}
          imageAlt={farmerName}
          farmName={farm.name}
          bio={bio}
        />

        {/* Our Story Card - only show if we have story content */}
        {storyParagraphs.length > 0 && (
          <StoryCard
            title="Our story"
            paragraphs={storyParagraphs}
          />
        )}

        {/* What drives us & Life on the farm - Side by side */}
        {(whatDrivesUsItems.length > 0 || lifeOnFarmItems.length > 0) && (
          <div style={{ display: 'flex', gap: 'var(--spacing-card)', alignItems: 'stretch' }}>
            {/* What drives us Card */}
            {whatDrivesUsItems.length > 0 && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <StoryBulletCard
                  title="What drives us"
                  items={whatDrivesUsItems}
                />
              </div>
            )}

            {/* Life on the farm Card */}
            {lifeOnFarmItems.length > 0 && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <StoryBulletCard
                  title="Life on the farm"
                  items={lifeOnFarmItems}
                  showBullets={false}
                  itemClassName="text-sm"
                />
              </div>
            )}
          </div>
        )}

        {/* Looking ahead Card - only show if we have this data */}
        {farm.looking_ahead && (
          <StoryTextCard
            title="Looking ahead"
            text={farm.looking_ahead}
          />
        )}

        {/* Pictures of the farm - Carousel */}
        {farmImages.length > 0 && (
          <FarmPicturesCarousel
            images={farmImages}
            title="Pictures of the farm"
          />
        )}

      </div>
      
      {/* Debug Footer */}
      <DebugFooter />
    </div>
  )
}


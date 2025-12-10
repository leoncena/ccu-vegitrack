import { useParams } from 'react-router-dom'
import { DebugFooter, PageHeaderWithBack } from '../../components/layout'
import { 
  FarmerBioCard,
  StoryCard,
  StoryBulletCard,
  StoryTextCard,
  FarmPicturesCarousel,
} from '../../components/ui'

const FARM_IMAGES = [
  'https://www.tagesspiegel.de/images/14123957/alternates/BASE_4_3_W600/1754380770000/mit-roel-lintermans-auf-der-tomatenfarm-good-food-syndicate.jpeg',
  'https://c8.alamy.com/compde/d173td/eine-grosse-indoor-tomaten-farm-in-sudengland-d173td.jpg',
  'https://bmg-images.forward-publishing.io/2025/12/04/33312358-c45a-444f-a8cc-f3ebb07fc615.jpeg?rect=0%2C0%2C2017%2C1135&w=1024',
  'https://cdn.getyourguide.com/img/tour/63502f65e4afc.jpeg/99.jpg',
  // Add more images here when fetching from API
]

export default function FarmerStories() {
  const { id } = useParams()

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
          imageUrl="https://i0.wp.com/www.climatefarmers.org/wp-content/uploads/2025/05/Profile-Farmer-featured-image-9.png?fit=1080%2C720&ssl=1"
          imageAlt="Anna & Miguel Teixeira"
          farmName="Quinta do Sol"
          bio="Anna & Miguel Teixeira - Farmers since 1998. A small family farm in Algarve growing vegetables with care and tradition."
        />

        {/* Our Story Card */}
        <StoryCard
          title="Our story"
          paragraphs={[
            "Anna grew up on this land, learning from her grandparents who first planted vegetables here in the 1950s. After studying agriculture, she returned to take over the farm, bringing modern organic techniques while honoring traditional methods.",
            "Miguel joined the farm in 2005, bringing expertise in sustainable water management. Together, they rebuilt after a devastating storm in 2010, using the opportunity to introduce organic practices and expand their crop diversity.",
            "Today, Quinta do Sol supplies local markets and restaurants across Algarve, known for their commitment to quality, seasonality, and environmental stewardship."
          ]}
        />

        {/* What drives us & Life on the farm - Side by side */}
        <div style={{ display: 'flex', gap: 'var(--spacing-card)', alignItems: 'stretch' }}>
          {/* What drives us Card */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <StoryBulletCard
              title="What drives us"
              items={[
                "Respect for seasonality - Only harvest when nature tells us its time.",
                "Care for people - Our workers return every season - we grow together",
                "Local pride - We supply algarve with the best local and fresh vegetables and greens"
              ]}
            />
          </div>

          {/* Life on the farm Card */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <StoryBulletCard
              title="Life on the farm"
              items={[
                "Early morning harvest rituals",
                "Caring for seedlings",
                "Community farmer markets days"
              ]}
              showBullets={false}
              itemClassName="text-sm"
            />
          </div>
        </div>

        {/* Looking ahead Card */}
        <StoryTextCard
          title="Looking ahead"
          text="This year, we're expanding our pollinator garden and restoring a small citrus grove that was part of the original farm. Our vision is to create a sustainable, heritage-based farm that can be passed down to the next generation while continuing to serve our community with the freshest, most responsibly grown produce."
        />

        {/* Pictures of the farm - Carousel */}
        <FarmPicturesCarousel
          images={FARM_IMAGES}
          title="Pictures of the farm"
        />

      </div>
      
      {/* Debug Footer */}
      <DebugFooter />
    </div>
  )
}


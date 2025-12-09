import { useParams } from 'react-router-dom'
import { DebugFooter, PageHeaderWithBack } from '../../components/layout'

export default function Recipes() {
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
        title="Cultural Recipes"
        backTo={`/product/${id}`}
      />

      {/* Placeholder content */}
      <div>
        <div 
          className="p-6 text-center"
          style={{ 
            backgroundColor: 'var(--color-card)',
            borderRadius: 'var(--radius-card)'
          }}
        >
          <span className="text-6xl mb-4 block">🍳</span>
          <p 
            className="text-sm opacity-60"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            hxCulturalRecipesComingSoon
          </p>
          <p 
            className="text-xs opacity-40 mt-2"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            hxDiscoverTraditionalRecipesFeaturingThisProduct
          </p>
        </div>
      </div>
      
      {/* Debug Footer */}
      <DebugFooter />
    </div>
  )
}


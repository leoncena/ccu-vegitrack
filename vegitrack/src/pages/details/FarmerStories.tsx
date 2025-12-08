import { useParams, useNavigate } from 'react-router-dom'

export default function FarmerStories() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div 
      className="min-h-screen pb-8"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 px-6 pt-16 pb-4">
        <button 
          onClick={() => navigate(`/product/${id}`)}
          className="p-1"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Title */}
      <h1 
        className="text-center text-xl mb-6"
        style={{ fontFamily: 'var(--font-body)', letterSpacing: '-0.66px' }}
      >
        Farmer Stories
      </h1>

      {/* Placeholder content */}
      <div className="px-6">
        <div 
          className="p-6 text-center"
          style={{ 
            backgroundColor: 'var(--color-card)',
            borderRadius: 'var(--radius-card)'
          }}
        >
          <span className="text-6xl mb-4 block">👨‍🌾</span>
          <p 
            className="text-sm opacity-60"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            hxFarmerStoriesComingSoon
          </p>
          <p 
            className="text-xs opacity-40 mt-2"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            hxLearnAboutThePeopleWhoGrowYourFood
          </p>
        </div>
      </div>
    </div>
  )
}


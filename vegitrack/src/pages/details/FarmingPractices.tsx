import { useParams, useNavigate } from 'react-router-dom'
import { DebugFooter } from '../../components/layout'

const PRACTICES = [
  {
    category: 'hxSoilAndInputs',
    icon: '🌿',
    items: [
      'hxNoSyntheticPesticides',
      'hxOrganicFertilizerOnly',
      'hxCropRotationToMaintainSoilHealth',
      'hxNaturalCompostingMethods'
    ]
  },
  {
    category: 'hxWaterManagement',
    icon: '💧',
    items: [
      'hxDripIrrigationSystem',
      'hxWaterSavingMethodsInPlace',
      'hxRainwaterCollection',
      'hxEfficientSchedulingToMinimizeWaste'
    ]
  },
  {
    category: 'hxPestControl',
    icon: '🐛',
    items: [
      'hxBiologicalPestControl',
      'hxNaturalPredatorsEncouraged',
      'hxNoChemicalSprays',
      'hxCompanionPlantingStrategy'
    ]
  },
  {
    category: 'hxBiodiversity',
    icon: '🦋',
    items: [
      'hxWildflowerStripsForPollinators',
      'hxNativeHedgerowsMaintained',
      'hxBirdNestingBoxesInstalled'
    ]
  },
  {
    category: 'hxLaborAndWorkingConditions',
    icon: '👨‍🌾',
    items: [
      'hxSeasonalWorkersHiredUnderDocumentedContracts',
      'hxSafetyTrainingRequiredForGreenhouseEntry',
      'hxVerifiedInFairLaborAudit(06 July 2025)'
    ]
  }
]

export default function FarmingPractices() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div 
      className="min-h-screen pb-8"
      style={{ backgroundColor: 'var(--color-surface)', paddingBottom: '60px' }}
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
        Farming Practices
      </h1>

      {/* Practice icons row */}
      <div className="flex justify-center gap-4 mb-6 px-6">
        {['🌿', '💧', '🐛', '🦋'].map((icon, i) => (
          <div 
            key={i}
            className="w-12 h-12 flex items-center justify-center text-xl"
            style={{ 
              backgroundColor: 'var(--color-card)',
              borderRadius: '50%'
            }}
          >
            {icon}
          </div>
        ))}
      </div>

      {/* Practice sections */}
      <div className="px-6">
        {PRACTICES.map((section, i) => (
          <div 
            key={i}
            className="p-4 mb-4"
            style={{ 
              backgroundColor: 'var(--color-card)',
              borderRadius: 'var(--radius-card)'
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{section.icon}</span>
              <span className="font-medium" style={{ fontFamily: 'var(--font-body)' }}>
                {section.category}
              </span>
            </div>
            <ul className="list-disc pl-6">
              {section.items.map((item, j) => (
                <li 
                  key={j}
                  className="text-sm mb-1"
                  style={{ fontFamily: 'var(--font-body)', lineHeight: 1.4 }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      {/* Debug Footer */}
      <DebugFooter />
    </div>
  )
}


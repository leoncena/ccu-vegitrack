import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      {/* Logo */}
      <div className="text-center mb-8">
        <h1 
          className="text-7xl tracking-tight"
          style={{ 
            fontFamily: 'var(--font-brand)', 
            color: 'var(--color-primary)',
            fontWeight: 700 
          }}
        >
          <span className="text-8xl">V</span>egi
          <span className="text-8xl">T</span>rack
        </h1>
        <p 
          className="text-xl mt-4"
          style={{ 
            fontFamily: 'var(--font-body)', 
            color: 'var(--color-primary)',
            fontWeight: 600 
          }}
        >
          Know your veggies
        </p>
      </div>

      {/* Veggie illustrations placeholder */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        {/* TODO: Add veggie illustrations */}
      </div>

      {/* Tap to continue */}
      <button
        onClick={() => navigate('/start')}
        className="absolute bottom-20 left-0 right-0 text-center cursor-pointer"
        style={{ 
          fontFamily: 'var(--font-body)', 
          color: 'var(--color-primary)',
          background: 'none',
          border: 'none'
        }}
      >
        Tap to continue
      </button>
    </div>
  )
}


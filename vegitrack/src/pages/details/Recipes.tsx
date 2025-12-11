import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DebugFooter, PageHeaderWithBack } from '../../components/layout'
import { Spinner } from '../../components/ui'
import { getRecipes } from '../../lib/api'
import type { Recipe } from '../../types/database'

export default function Recipes() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      if (!id) return
      setLoading(true)
      setError(null)
      const data = await getRecipes(id)
      if (!data || data.length === 0) {
        setError('No recipes available yet for this product.')
        setRecipes([])
      } else {
        setRecipes(data)
      }
      setLoading(false)
    }
    load()
  }, [id])

  return (
    <div
      className="min-h-screen pb-8"
      style={{
        backgroundColor: 'var(--color-surface)',
        paddingTop: 'calc(var(--spacing-page) * 0.8)',
        paddingBottom: 'calc(var(--spacing-page) * 2.5)',
        paddingLeft: '10%',
        paddingRight: '10%',
      }}
    >
      <PageHeaderWithBack
        title="Cultural Recipes"
        backTo={`/product/${id}`}
        marginBottom={`calc(var(--spacing-card) * 2)`}
      />

      <div
        className="w-full max-w-md mx-auto"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'calc(var(--spacing-section) * 1.25)',
        }}
      >
        <header style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '20px',
              fontWeight: 500,
              letterSpacing: '-0.25px',
              color: 'var(--color-text)',
            }}
          >
            Regional Recipes & Traditions
          </h1>
          <p
            style={{
              marginTop: 'calc(var(--spacing-card) * 0.5)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--color-text)',
              opacity: 0.8,
            }}
          >
            Farmers Recipes · Traditional Algarve · Seasonal Cooking Tips
          </p>
        </header>

        {loading && (
          <div
            className="flex justify-center items-center"
            style={{ padding: 'calc(var(--spacing-section) * 2)' }}
          >
            <Spinner className="text-primary" />
          </div>
        )}

        {error && !loading && (
          <div
            className="text-center"
            style={{
              padding: 'calc(var(--spacing-section) * 1.5)',
              backgroundColor: 'var(--color-card)',
              borderRadius: 'var(--radius-card)',
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text)',
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="flex flex-col" style={{ gap: 'var(--spacing-section)' }}>
            {recipes.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => navigate(`/product/${id}/recipes/${recipe.id}`)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  backgroundColor: 'var(--color-card)',
                  borderRadius: 'var(--radius-card)',
                  padding: 'calc(var(--spacing-section) * 0.75)',
                  display: 'flex',
                  gap: 'var(--spacing-card)',
                  boxShadow: '0 8px 18px rgba(0,0,0,0.06)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-surface)',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  {recipe.image_url ? (
                    <img
                      src={recipe.image_url}
                      alt={recipe.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ fontSize: '24px' }}
                    >
                      🍅
                    </div>
                  )}
                </div>

                <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '16px',
                      fontWeight: 500,
                      color: 'var(--color-text)',
                    }}
                  >
                    {recipe.title}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      color: 'var(--color-text)',
                      opacity: 0.75,
                    }}
                  >
                    {recipe.description}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'calc(var(--spacing-card) * 0.75)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      color: 'var(--color-text)',
                      opacity: 0.8,
                    }}
                  >
                    <span>⏱️ {recipe.prep_time_minutes ?? 0} min</span>
                    {recipe.cultural_origin && <span>· {recipe.cultural_origin}</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <DebugFooter />
    </div>
  )
}


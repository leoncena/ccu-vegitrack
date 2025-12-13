import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DebugFooter, PageHeaderWithBack } from '../../components/layout'
import { Spinner, IconButton, BookmarkIcon, toast } from '../../components/ui'
import { getRecipeById } from '../../lib/api'
import type { Recipe } from '../../types/database'
import { useUserData } from '../../contexts/UserDataContext'

export default function RecipeDetail() {
  const { id, recipeId } = useParams()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toggleFavoriteRecipe, isRecipeFavorite } = useUserData()

  useEffect(() => {
    async function load() {
      if (!recipeId) return
      setLoading(true)
      setError(null)
      const data = await getRecipeById(recipeId)
      if (!data) {
        setError('Recipe not found')
      }
      setRecipe(data)
      setLoading(false)
    }
    load()
  }, [recipeId])

  const handleAddToShoppingList = async () => {
    if (!recipe) return

    const ingredientsList = recipe.ingredients
      .map(i => `- ${i.name}: ${i.amount}`)
      .join('\n')
    
    const text = `Shopping List for ${recipe.title}:\n\n${ingredientsList}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Shopping List: ${recipe.title}`,
          text: text,
        })
      } else {
        await navigator.clipboard.writeText(text)
        toast.success('Ingredients copied to clipboard!')
      }
    } catch (err) {
      console.error('Error sharing:', err)
      // Fallback to clipboard if share fails or is cancelled (e.g. user aborted)
      if ((err as Error).name !== 'AbortError') {
         try {
            await navigator.clipboard.writeText(text)
            toast.success('Ingredients copied to clipboard!')
         } catch (clipboardErr) {
            toast.error('Failed to add to shopping list')
         }
      }
    }
  }

  return (
    <div
      className="min-h-screen pb-10"
      style={{
        backgroundColor: 'var(--color-surface)',
        paddingTop: 'calc(var(--spacing-page) * 0.8)',
        paddingLeft: '10%',
        paddingRight: '10%',
      }}
    >
      <PageHeaderWithBack
        title="Recipe"
        backTo={`/product/${id}/recipes`}
        marginBottom={`calc(var(--spacing-card) * 1.5)`}
        rightActions={
          recipe ? (
            <IconButton
              label={isRecipeFavorite(recipe.id) ? 'Remove bookmark' : 'Add bookmark'}
              onClick={() =>
                toggleFavoriteRecipe({
                  id: recipe.id,
                  productId: recipe.product_id,
                  title: recipe.title,
                  imageUrl: recipe.image_url,
                })
              }
              style={{ color: 'var(--color-primary)' }}
              size="sm"
            >
              <BookmarkIcon filled={isRecipeFavorite(recipe.id)} />
            </IconButton>
          ) : undefined
        }
      />

      {loading && (
        <div className="flex justify-center items-center" style={{ padding: 'calc(var(--spacing-section) * 2)' }}>
          <Spinner className="text-primary" />
        </div>
      )}

      {!loading && error && (
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

      {!loading && recipe && (
        <div
          className="w-full max-w-md mx-auto"
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: 'var(--radius-card)',
            padding: 'calc(var(--spacing-section) * 1)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(var(--spacing-section) * 0.75)',
          }}
        >
          <div style={{ width: '100%', height: 180, borderRadius: 'var(--radius-card)', overflow: 'hidden', backgroundColor: 'var(--color-surface)' }}>
            {recipe.image_url ? (
              <img
                src={recipe.image_url}
                alt={recipe.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ fontSize: '32px' }}>
                🍅
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <h1
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '20px',
                fontWeight: 500,
                color: 'var(--color-text)',
                textAlign: 'center',
              }}
            >
              {recipe.title}
            </h1>
            {recipe.description && (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  color: 'var(--color-text)',
                  opacity: 0.8,
                  textAlign: 'center',
                }}
              >
                {recipe.description}
              </p>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'calc(var(--spacing-card) * 1.5)',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--color-text)',
              opacity: 0.85,
            }}
          >
            <span>⏱️ Prep {recipe.prep_time_minutes ?? 0} min</span>
            {recipe.cook_time_minutes !== null && <span>🍳 Cook {recipe.cook_time_minutes} min</span>}
            {recipe.servings !== null && <span>🥣 Serves {recipe.servings}</span>}
          </div>

          <section>
            <h2
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-text)',
                marginBottom: 'calc(var(--spacing-card) * 0.5)',
              }}
            >
              Ingredients
            </h2>
            <ul
              style={{
                listStyle: 'disc',
                paddingLeft: 'calc(var(--spacing-section) * 0.75)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'calc(var(--spacing-card) * 0.5)',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'var(--color-text)',
              }}
            >
              {recipe.ingredients.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.name}</strong> — {item.amount}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-text)',
                marginBottom: 'calc(var(--spacing-card) * 0.5)',
              }}
            >
              Steps
            </h2>
            <ol
              style={{
                paddingLeft: 'calc(var(--spacing-section) * 0.75)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'calc(var(--spacing-card) * 0.5)',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'var(--color-text)',
              }}
            >
              {recipe.instructions.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </section>

          <button
            onClick={handleAddToShoppingList}
            style={{
              marginTop: 'calc(var(--spacing-section) * 0.75)',
              width: '100%',
              borderRadius: 'var(--radius-button)',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              padding: '12px',
              border: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Add ingredients to shopping list
          </button>
        </div>
      )}

      <DebugFooter />
    </div>
  )
}

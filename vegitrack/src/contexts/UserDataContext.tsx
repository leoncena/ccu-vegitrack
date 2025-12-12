import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { addFavorite, addViewHistory, getUserFavorites, getViewHistory, removeFavorite } from '../lib/api'

export interface ProductSummary {
  id: string
  name: string
  displayId?: string | null
  imageUrl?: string | null
}

export interface RecipeSummary {
  id: string
  productId: string
  title: string
  imageUrl?: string | null
}

interface UserDataState {
  recentProducts: ProductSummary[]
  favoriteProducts: ProductSummary[]
  favoriteRecipes: RecipeSummary[]
}

interface UserDataContextValue extends UserDataState {
  addRecentProduct: (product: ProductSummary) => void
  toggleFavoriteProduct: (product: ProductSummary) => void
  toggleFavoriteRecipe: (recipe: RecipeSummary) => void
  isProductFavorite: (id: string) => boolean
  isRecipeFavorite: (id: string) => boolean
}

const DEFAULT_STATE: UserDataState = {
  recentProducts: [],
  favoriteProducts: [],
  favoriteRecipes: [],
}

const UserDataContext = createContext<UserDataContextValue | undefined>(undefined)

function getStorageKey(userId: string | null) {
  return `vegitrack-user-data-${userId ?? 'guest'}`
}

export function UserDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [data, setData] = useState<UserDataState>(DEFAULT_STATE)

  const storageKey = useMemo(() => getStorageKey(user?.id ?? null), [user?.id])

  // Load when user changes
  useEffect(() => {
    const run = async () => {
      // guest fallback to localStorage
      if (!user) {
        try {
          const raw = localStorage.getItem(storageKey)
          if (raw) {
            const parsed = JSON.parse(raw) as UserDataState
            setData({
              recentProducts: parsed.recentProducts || [],
              favoriteProducts: parsed.favoriteProducts || [],
              favoriteRecipes: parsed.favoriteRecipes || [],
            })
            return
          }
        } catch (err) {
          console.error('Failed to load user data from storage', err)
        }
        setData(DEFAULT_STATE)
        return
      }

      try {
        const [favorites, history] = await Promise.all([
          getUserFavorites(user.id),
          getViewHistory(user.id, 25),
        ])
        setData((prev) => ({
          ...prev,
          favoriteProducts: favorites.map((f) => ({
            id: f.product_id,
            name: f.product?.name || '',
            displayId: f.product?.display_id,
            imageUrl: f.product?.image_url,
          })),
          recentProducts: history.map((h) => ({
            id: h.product_id,
            name: h.product?.name || '',
            displayId: h.product?.display_id,
            imageUrl: h.product?.image_url,
          })),
        }))
      } catch (err) {
        console.error('Failed to load remote user data', err)
      }
    }
    run()
  }, [storageKey, user])

  const addRecentProduct = useCallback(
    (product: ProductSummary) => {
      setData((prev) => {
        const filtered = prev.recentProducts.filter((item) => item.id !== product.id)
        const next = [product, ...filtered].slice(0, 10)

        // Persist guest state inside the updater to avoid stale captures and re-renders
        if (!user?.id) {
          try {
            localStorage.setItem(storageKey, JSON.stringify({ ...prev, recentProducts: next }))
          } catch (err) {
            console.error('Failed to persist guest recent product', err)
          }
        }

        return { ...prev, recentProducts: next }
      })

      if (user?.id) {
        addViewHistory(user.id, product.id).catch((err) => console.error('Failed to record view history', err))
      }
    },
    [storageKey, user?.id],
  )

  const toggleFavoriteProduct = useCallback(
    (product: ProductSummary) => {
      setData((prev) => {
        const exists = prev.favoriteProducts.some((item) => item.id === product.id)
        const nextFavorites = exists
          ? prev.favoriteProducts.filter((item) => item.id !== product.id)
          : [...prev.favoriteProducts, product]

        if (!user?.id) {
          try {
            localStorage.setItem(storageKey, JSON.stringify({ ...prev, favoriteProducts: nextFavorites }))
          } catch (err) {
            console.error('Failed to persist guest favorites', err)
          }
        }

        return { ...prev, favoriteProducts: nextFavorites }
      })

      if (user?.id) {
        const exists = data.favoriteProducts.some((item) => item.id === product.id)
        const op = exists ? removeFavorite : addFavorite
        op(user.id, product.id).catch((err) => console.error('Failed to update favorite', err))
      }
    },
    [data.favoriteProducts, storageKey, user?.id],
  )

  const toggleFavoriteRecipe = useCallback((recipe: RecipeSummary) => {
    setData((prev) => {
      const exists = prev.favoriteRecipes.some((item) => item.id === recipe.id)
      const nextFavorites = exists
        ? prev.favoriteRecipes.filter((item) => item.id !== recipe.id)
        : [...prev.favoriteRecipes, recipe]
      return { ...prev, favoriteRecipes: nextFavorites }
    })
  }, [])

  const isProductFavorite = useCallback(
    (id: string) => data.favoriteProducts.some((item) => item.id === id),
    [data.favoriteProducts],
  )
  const isRecipeFavorite = useCallback(
    (id: string) => data.favoriteRecipes.some((item) => item.id === id),
    [data.favoriteRecipes],
  )

  const value = useMemo<UserDataContextValue>(
    () => ({
      ...data,
      addRecentProduct,
      toggleFavoriteProduct,
      toggleFavoriteRecipe,
      isProductFavorite,
      isRecipeFavorite,
    }),
    [addRecentProduct, data, isProductFavorite, isRecipeFavorite, toggleFavoriteProduct, toggleFavoriteRecipe],
  )

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>
}

export function useUserData() {
  const ctx = useContext(UserDataContext)
  if (!ctx) {
    throw new Error('useUserData must be used within a UserDataProvider')
  }
  return ctx
}

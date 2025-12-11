import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from './AuthContext'

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
  }, [storageKey])

  // Persist when data changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data))
    } catch (err) {
      console.error('Failed to persist user data', err)
    }
  }, [data, storageKey])

  const addRecentProduct = useCallback((product: ProductSummary) => {
    setData((prev) => {
      const filtered = prev.recentProducts.filter((item) => item.id !== product.id)
      const next = [product, ...filtered].slice(0, 10)
      return { ...prev, recentProducts: next }
    })
  }, [])

  const toggleFavoriteProduct = useCallback((product: ProductSummary) => {
    setData((prev) => {
      const exists = prev.favoriteProducts.some((item) => item.id === product.id)
      const nextFavorites = exists
        ? prev.favoriteProducts.filter((item) => item.id !== product.id)
        : [...prev.favoriteProducts, product]
      return { ...prev, favoriteProducts: nextFavorites }
    })
  }, [])

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

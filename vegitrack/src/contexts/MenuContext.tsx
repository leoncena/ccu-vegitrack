import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

interface MenuContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  language: LanguageOption
  setLanguage: (value: LanguageOption) => void
}

export type LanguageOption = 'en-US' | 'pt-PT' | 'de-DE' | 'sv-SE'

const MenuContext = createContext<MenuContextValue | undefined>(undefined)

export function MenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [language, setLanguageState] = useState<LanguageOption>('en-US')

  useEffect(() => {
    const stored = localStorage.getItem('vegitrack-language') as LanguageOption | null
    if (stored) {
      setLanguageState(stored)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const setLanguage = (value: LanguageOption) => {
    setLanguageState(value)
    localStorage.setItem('vegitrack-language', value)
  }

  const value = useMemo<MenuContextValue>(() => ({
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
    language,
    setLanguage,
  }), [isOpen, language])

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}

export function useMenu() {
  const ctx = useContext(MenuContext)
  if (!ctx) {
    throw new Error('useMenu must be used within a MenuProvider')
  }
  return ctx
}

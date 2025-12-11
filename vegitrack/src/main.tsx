import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { MenuProvider } from './contexts/MenuContext'
import { UserDataProvider } from './contexts/UserDataContext'
import { router } from './lib/router'
import { Toaster } from './components/ui/sonner'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <UserDataProvider>
        <MenuProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <Toaster />
          </QueryClientProvider>
        </MenuProvider>
      </UserDataProvider>
    </AuthProvider>
  </StrictMode>,
)

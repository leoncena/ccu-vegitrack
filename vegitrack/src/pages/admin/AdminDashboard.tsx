import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'
import FarmManagement from './FarmManagement'
import ProductsManagement from './ProductsManagement'
import { Spinner } from '../../components/ui'

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const activeTab = searchParams.get('tab') || 'farm'

  useEffect(() => {
    // Add admin-page class to root for desktop layout
    const root = document.getElementById('root')
    if (root) {
      root.classList.add('admin-page')
      return () => {
        root.classList.remove('admin-page')
      }
    }
  }, [])

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { state: { from: '/admin' } })
    }
  }, [user, authLoading, navigate])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <Spinner className="size-8" style={{ color: 'var(--color-primary)' }} />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleTabChange = (value: string) => {
    navigate(`/admin?tab=${value}`, { replace: true })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-background)',
        padding: 'var(--spacing-page)',
        maxWidth: 'none',
        width: '100%',
        color: 'var(--color-text)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: 'calc(var(--spacing-section) * 2)' }}>
          <h1
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '32px',
              fontWeight: 600,
              color: 'var(--color-text)',
              marginBottom: 'calc(var(--spacing-card) * 0.5)',
            }}
          >
            Producer Dashboard
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              color: 'var(--color-text-light)',
            }}
          >
            Manage your farm information and products
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList style={{ marginBottom: 'var(--spacing-card)' }}>
            <TabsTrigger value="farm">Farm Information</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          <TabsContent value="farm" style={{ marginTop: 0 }}>
            <FarmManagement />
          </TabsContent>

          <TabsContent value="products" style={{ marginTop: 0 }}>
            <ProductsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


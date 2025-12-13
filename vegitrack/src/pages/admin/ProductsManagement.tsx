import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/Button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import { getProducerProducts, deleteProduct } from '../../lib/api'
import type { Product } from '../../types/database'

type ProductWithFarm = Product & { farm_name?: string | null }
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Spinner } from '../../components/ui'
import { toast } from '../../components/ui/sonner'

export default function ProductsManagement() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<ProductWithFarm[]>([])

  const loadProducts = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await getProducerProducts(user.id)
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  async function handleDelete(productId: string) {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await deleteProduct(productId)
      toast.success('Product deleted successfully')
      await loadProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
        <Spinner className="size-8" style={{ color: 'var(--color-primary)' }} />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <CardTitle style={{ fontFamily: 'var(--font-body)' }}>Products</CardTitle>
        <Button onClick={() => navigate('/admin/product/new')} style={{ padding: '4px 8px', color: 'var(--background)' }}>
          <Plus className="size-4" style={{ stroke: 'var(--background)' }} />
          Add Product
        </Button>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: 'calc(var(--spacing-section) * 2)',
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text-light)',
            }}
          >
            <p style={{ marginBottom: 'var(--spacing-card)' }}>No products yet.</p>
            <Button onClick={() => navigate('/admin/product/new')} style={{ padding: '4px 8px' }}>
              <Plus className="size-4" style={{ stroke: 'var(--background)' }} />
              <span style={{ color: 'var(--background)' }}>Create Your First Product</span>
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Display ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Farm</TableHead>
                <TableHead>Origin</TableHead>
                <TableHead>Created</TableHead>
                <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}>
                    {product.display_id}
                  </TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-body)' }}>{product.name}</TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-body)' }}>
                    {product.farm_name || '-'}
                  </TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-body)' }}>
                    {product.origin_country}
                    {product.origin_region ? `, ${product.origin_region}` : ''}
                  </TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-body)' }}>
                    {new Date(product.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 'calc(var(--spacing-card) * 0.5)', justifyContent: 'flex-end' }}>
                      <Button
                        onClick={() => navigate(`/admin/product/${product.id}`)}
                        size="icon-sm"
                        variant="ghost"
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(product.id)}
                        size="icon-sm"
                        variant="ghost"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}



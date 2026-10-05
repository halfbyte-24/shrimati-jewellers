import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Edit2, Search, Filter, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import ProductModal from '../components/ProductModal'

export default function Products() {
  const [products, setProducts] = useState([])
  const [parents, setParents] = useState([])
  const [children, setChildren] = useState([])
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [filterParent, setFilterParent] = useState('')
  const [filterChild, setFilterChild] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, published, unpublished, featured

  // Modal
  const [modalConfig, setModalConfig] = useState({ isOpen: false, mode: 'create', data: null })

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      // We explicitly select the required columns for categories to avoid schema cache issues
      const [prodRes, parentRes, childRes, subRes] = await Promise.all([
        supabase.from('products').select(`
          *,
          product_images(image_url, is_primary)
        `).order('display_order', { ascending: true }).order('created_at', { ascending: false }),
        supabase.from('parent_categories').select('id, name, slug, display_order, is_active'),
        supabase.from('child_categories').select('id, parent_category_id, name, slug, display_order, is_active'),
        supabase.from('sub_categories').select('id, child_category_id, name, slug, display_order, is_active')
      ])

      if (prodRes.error) throw new Error(`Products load error: ${prodRes.error.message}`)
      if (parentRes.error) throw new Error(`Parent load error: ${parentRes.error.message}`)
      if (childRes.error) throw new Error(`Child load error: ${childRes.error.message}`)
      // Ignore sub error if table not created yet in dev
      if (subRes.error && subRes.error.code !== '42P01') throw new Error(`Sub load error: ${subRes.error.message}`)

      setProducts(prodRes.data || [])
      setParents(parentRes.data || [])
      setChildren(childRes.data || [])
      setSubs(subRes.data || [])
    } catch (err) {
      console.error(err)
      setError(err.message || "Failed to load data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Derived filtered data
  const availableChildrenForFilter = filterParent 
    ? children.filter(c => c.parent_category_id === filterParent)
    : children

  const filteredProducts = products.filter(p => {
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase()) && !p.product_code?.toLowerCase().includes(searchTerm.toLowerCase())) return false
    if (filterParent && p.parent_category_id !== filterParent) return false
    if (filterChild && p.child_category_id !== filterChild) return false
    
    if (filterStatus === 'published' && !p.is_published) return false
    if (filterStatus === 'unpublished' && p.is_published) return false
    if (filterStatus === 'featured' && !p.is_featured) return false
    if (filterStatus === 'available' && !p.is_available) return false

    return true
  })

  // Handlers
  const openCreate = () => setModalConfig({ isOpen: true, mode: 'create', data: null })
  const openEdit = (product) => setModalConfig({ isOpen: true, mode: 'edit', data: product })
  const closeModals = () => setModalConfig({ isOpen: false, mode: 'create', data: null })

  const handleTogglePublish = async (product) => {
    try {
      const { error } = await supabase.from('products').update({ is_published: !product.is_published }).eq('id', product.id)
      if (error) throw error
      // Optmistic update
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_published: !p.is_published } : p))
    } catch (err) {
      alert("Failed to update status: " + err.message)
    }
  }

  // Render Helpers
  const getCategoryName = (parentId, childId, subId) => {
    const pName = parents.find(p => p.id === parentId)?.name || 'Unknown'
    const cName = children.find(c => c.id === childId)?.name || 'Unknown'
    const sName = subs.find(s => s.id === subId)?.name
    
    let label = `${pName} > ${cName}`
    if (sName) label += ` > ${sName}`
    return label
  }

  const getPrimaryImage = (product) => {
    if (!product.product_images || product.product_images.length === 0) return null
    const primary = product.product_images.find(img => img.is_primary) || product.product_images[0]
    if (primary.image_url.startsWith('http')) return primary.image_url
    return supabase.storage.from('product-images').getPublicUrl(primary.image_url).data.publicUrl
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Products</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Manage jewelry catalog, pricing, and availability.</p>
        </div>
        <button className="btn-primary" onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      {error && (
        <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Filters Bar */}
      <div className="card" style={{ marginBottom: '24px', padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 300px', backgroundColor: '#f9fafb', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search by name or code..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem' }}
          />
        </div>

        <select 
          value={filterParent} 
          onChange={(e) => { setFilterParent(e.target.value); setFilterChild('') }}
          style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '4px' }}
        >
          <option value="">All Parents</option>
          {parents.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <select 
          value={filterChild} 
          onChange={(e) => setFilterChild(e.target.value)}
          disabled={!filterParent}
          style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '4px' }}
        >
          <option value="">All Children</option>
          {availableChildrenForFilter.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '4px' }}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
          <option value="available">In Stock</option>
          <option value="featured">Featured</option>
        </select>
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <p>Loading catalog...</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              <p style={{ marginBottom: '16px' }}>No products found matching your filters.</p>
              {products.length === 0 && (
                <button className="btn-primary" onClick={openCreate}>Create your first product</button>
              )}
            </div>
          ) : (
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Image</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => {
                    const primaryImg = getPrimaryImage(product)
                    return (
                      <tr key={product.id}>
                        <td data-label="Image">
                          {primaryImg ? (
                            <img src={primaryImg} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                          ) : (
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#f3f4f6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                              No Img
                            </div>
                          )}
                        </td>
                        <td data-label="Product">
                          <div style={{ fontWeight: 500 }}>{product.name}</div>
                          {product.product_code && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{product.product_code}</div>}
                        </td>
                        <td data-label="Category" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          {getCategoryName(product.parent_category_id, product.child_category_id, product.sub_category_id)}
                        </td>
                        <td data-label="Price">
                          {product.price ? `₹${product.price}` : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>{product.price_type || 'N/A'}</span>}
                        </td>
                        <td data-label="Status">
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'flex-end' }}>
                            {product.is_published ? (
                              <span className="badge badge-active">Published</span>
                            ) : (
                              <span className="badge badge-inactive">Draft</span>
                            )}
                            {product.is_available && <span className="badge" style={{ backgroundColor: '#f0f9ff', color: '#0369a1' }}>In Stock</span>}
                            {product.is_featured && <span className="badge" style={{ backgroundColor: '#fef9c3', color: '#854d0e' }}>Featured</span>}
                          </div>
                        </td>
                        <td data-label="Actions" style={{ textAlign: 'right' }}>
                          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem', marginRight: '8px' }} onClick={() => handleTogglePublish(product)}>
                            {product.is_published ? 'Unpublish' : 'Publish'}
                          </button>
                          <button className="btn-icon" title="Edit Product" onClick={() => openEdit(product)}>
                            <Edit2 size={16} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {modalConfig.isOpen && (
        <ProductModal 
          isOpen={modalConfig.isOpen}
          mode={modalConfig.mode}
          initialData={modalConfig.data}
          parents={parents}
          children={children}
          subs={subs}
          onClose={closeModals}
          onSave={fetchData}
        />
      )}
    </div>
  )
}

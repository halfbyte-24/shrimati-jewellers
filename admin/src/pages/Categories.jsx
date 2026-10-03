import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Edit2, CheckCircle, XCircle, AlertCircle, X, ChevronDown, ChevronRight } from 'lucide-react'

// --- Utility ---
const generateSlug = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

// --- Modals ---
function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onCancel} className="close-btn"><X size={20} /></button>
        </div>
        <p style={{ color: 'var(--text-muted)' }}>{message}</p>
        <div className="modal-footer">
          <button onClick={onCancel} className="btn-secondary">Cancel</button>
          <button onClick={onConfirm} className="btn-danger">Confirm</button>
        </div>
      </div>
    </div>
  )
}

function CategoryModal({ isOpen, onClose, onSave, mode, type, initialData, parents }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parent_category_id: '',
    display_order: 0,
    is_active: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          name: initialData.name || '',
          slug: initialData.slug || '',
          parent_category_id: initialData.parent_category_id || '',
          display_order: initialData.display_order || 0,
          is_active: initialData.is_active !== false // default true if undefined
        })
      } else {
        setFormData({
          name: '',
          slug: '',
          parent_category_id: type === 'child' && parents.length > 0 ? parents[0].id : '',
          display_order: 0,
          is_active: true
        })
      }
      setError(null)
    }
  }, [isOpen, mode, initialData, type, parents])

  if (!isOpen) return null

  const handleNameChange = (e) => {
    const name = e.target.value
    setFormData(prev => ({
      ...prev,
      name,
      slug: mode === 'create' ? generateSlug(name) : prev.slug // Auto-slug on create only
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.name || !formData.slug) {
      setError("Name and Slug are required.")
      setLoading(false)
      return
    }

    if (type === 'child' && !formData.parent_category_id) {
      setError("Parent category is required for a child category.")
      setLoading(false)
      return
    }

    try {
      await onSave(formData)
      onClose()
    } catch (err) {
      console.error(err)
      setError(err.message || "An error occurred while saving.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{mode === 'create' ? 'Create' : 'Edit'} {type === 'parent' ? 'Parent' : 'Child'} Category</h3>
          <button onClick={onClose} className="close-btn" disabled={loading}><X size={20} /></button>
        </div>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {type === 'child' && (
            <div className="form-group">
              <label>Parent Category</label>
              <select 
                value={formData.parent_category_id}
                onChange={(e) => setFormData({...formData, parent_category_id: e.target.value})}
                required
                style={{ padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '4px' }}
              >
                <option value="">Select Parent...</option>
                {parents.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={handleNameChange}
              required
              placeholder="e.g. Gold"
            />
          </div>

          <div className="form-group">
            <label>Slug</label>
            <input 
              type="text" 
              value={formData.slug} 
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              required
              placeholder="e.g. gold"
            />
          </div>

          <div className="form-group">
            <label>Display Order</label>
            <input 
              type="number" 
              value={formData.display_order} 
              onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
            />
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
            <input 
              type="checkbox" 
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
              style={{ width: 'auto' }}
            />
            <label htmlFor="is_active" style={{ cursor: 'pointer' }}>Category is Active</label>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


// --- Main Page ---
export default function Categories() {
  const [parents, setParents] = useState([])
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedParents, setExpandedParents] = useState({})

  // Modals state
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'parent', mode: 'create', data: null })
  
  // Fetch Data
  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const parentRes = await supabase
        .from('parent_categories')
        .select('id, name, slug, display_order, is_active')
        .order('display_order', { ascending: true })

      const childRes = await supabase
        .from('child_categories')
        .select('id, parent_category_id, name, slug, display_order, is_active')
        .order('display_order', { ascending: true })

      if (parentRes.error) throw new Error(`Parent load error: ${parentRes.error.message}`)
      if (childRes.error) throw new Error(`Child load error: ${childRes.error.message}`)

      setParents(parentRes.data || [])
      setChildren(childRes.data || [])
      
      // Expand all by default
      const expanded = {}
      ;(parentRes.data || []).forEach(p => { expanded[p.id] = true })
      setExpandedParents(expanded)

    } catch (err) {
      console.error(err)
      setError(err.message || "Failed to load categories. Make sure your Supabase connection is active and SQL migrations are run.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const toggleExpand = (parentId) => {
    setExpandedParents(prev => ({ ...prev, [parentId]: !prev[parentId] }))
  }

  const openCreateParent = () => setModalConfig({ isOpen: true, type: 'parent', mode: 'create', data: null })
  const openEditParent = (parent) => setModalConfig({ isOpen: true, type: 'parent', mode: 'edit', data: parent })
  
  const openCreateChild = (parentId = null) => {
    // If a specific parent isn't requested, it will default to the first in the list
    const initialData = parentId ? { parent_category_id: parentId } : null
    setModalConfig({ isOpen: true, type: 'child', mode: 'create', data: initialData })
  }
  const openEditChild = (child) => setModalConfig({ isOpen: true, type: 'child', mode: 'edit', data: child })

  const closeModals = () => setModalConfig({ isOpen: false, type: 'parent', mode: 'create', data: null })

  const handleSave = async (formData) => {
    const table = modalConfig.type === 'parent' ? 'parent_categories' : 'child_categories'
    
    const payload = {
      name: formData.name,
      slug: formData.slug,
      display_order: formData.display_order,
      is_active: formData.is_active
    }
    
    if (modalConfig.type === 'child') {
      payload.parent_category_id = formData.parent_category_id
    }
    
    if (modalConfig.mode === 'create') {
      const { error } = await supabase.from(table).insert([payload])
      if (error) throw error
    } else {
      const { error } = await supabase.from(table).update(payload).eq('id', modalConfig.data.id)
      if (error) throw error
    }
    
    // Refresh
    await fetchData()
  }

  // Render Status Badge
  const renderStatus = (isActive) => {
    // If isActive is strictly undefined (migration not run), show nothing or a default active
    const active = isActive !== false
    return (
      <span className={`badge ${active ? 'badge-active' : 'badge-inactive'}`}>
        {active ? 'Active' : 'Inactive'}
      </span>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Category Management</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Manage top-level parent categories and their sub-categories.</p>
        </div>
        <div className="flex-row">
          <button className="btn-secondary" onClick={() => openCreateChild()}>Add Child Category</button>
          <button className="btn-primary" onClick={openCreateParent}>Add Parent Category</button>
        </div>
      </div>

      {error && (
        <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading categories...</p>
        </div>
      ) : parents.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>No categories found.</p>
          <button className="btn-primary" onClick={openCreateParent}>Create your first category</button>
        </div>
      ) : (
        parents.map(parent => {
          const parentChildren = children.filter(c => c.parent_category_id === parent.id)
          const isExpanded = expandedParents[parent.id]

          return (
            <div key={parent.id} className="card category-section" style={{ padding: 0, overflow: 'hidden' }}>
              <div 
                className="category-header" 
                style={{ padding: '20px', margin: 0, backgroundColor: '#f9fafb', cursor: 'pointer', borderBottom: isExpanded ? '1px solid var(--border-color)' : 'none' }}
                onClick={() => toggleExpand(parent.id)}
              >
                <div className="flex-row">
                  {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  <h3 style={{ margin: 0 }}>{parent.name}</h3>
                  {renderStatus(parent.is_active)}
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/{parent.slug}</span>
                </div>
                
                <div className="flex-row" onClick={e => e.stopPropagation()}>
                  <button className="btn-icon" title="Edit Parent" onClick={() => openEditParent(parent)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => openCreateChild(parent.id)}>
                    <Plus size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                    Add Child
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div style={{ padding: '0' }}>
                  {parentChildren.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      No child categories exist for this parent.
                    </div>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Child Name</th>
                          <th>Slug</th>
                          <th>Order</th>
                          <th>Status</th>
                          <th style={{ width: '80px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parentChildren.map(child => (
                          <tr key={child.id}>
                            <td style={{ fontWeight: 500 }}>{child.name}</td>
                            <td style={{ color: 'var(--text-muted)' }}>/{parent.slug}/{child.slug}</td>
                            <td>{child.display_order}</td>
                            <td>{renderStatus(child.is_active)}</td>
                            <td style={{ textAlign: 'right' }}>
                              <button className="btn-icon" title="Edit Child" onClick={() => openEditChild(child)}>
                                <Edit2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          )
        })
      )}

      <CategoryModal 
        isOpen={modalConfig.isOpen}
        mode={modalConfig.mode}
        type={modalConfig.type}
        initialData={modalConfig.data}
        parents={parents}
        onClose={closeModals}
        onSave={handleSave}
      />
    </div>
  )
}

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Edit2, AlertCircle, X, ChevronDown, ChevronRight } from 'lucide-react'

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

function CategoryModal({ isOpen, onClose, onSave, mode, initialData, parents, children }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parent_selection: 'none', // 'none', or ID of parent (L1), or ID of child (L2)
    display_order: 0,
    is_active: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        let parent_selection = 'none';
        if (initialData.type === 'child') {
          parent_selection = initialData.parent_category_id;
        } else if (initialData.type === 'sub') {
          parent_selection = initialData.child_category_id;
        }

        setFormData({
          name: initialData.name || '',
          slug: initialData.slug || '',
          parent_selection,
          display_order: initialData.display_order || 0,
          is_active: initialData.is_active !== false
        })
      } else {
        setFormData({
          name: '',
          slug: '',
          parent_selection: initialData?.parent_selection || 'none',
          display_order: 0,
          is_active: true
        })
      }
      setError(null)
    }
  }, [isOpen, mode, initialData, parents, children])

  if (!isOpen) return null

  const handleNameChange = (e) => {
    const name = e.target.value
    setFormData(prev => ({
      ...prev,
      name,
      slug: mode === 'create' ? generateSlug(name) : prev.slug
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

  // Figure out the active level for display
  let levelDisplay = "Level 1 (Parent)"
  if (formData.parent_selection !== 'none') {
    if (parents.find(p => p.id === formData.parent_selection)) {
      levelDisplay = "Level 2 (Child Category)"
    } else if (children.find(c => c.id === formData.parent_selection)) {
      levelDisplay = "Level 3 (Sub-category)"
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{mode === 'create' ? 'Create Category' : 'Edit Category'}</h3>
          <button onClick={onClose} className="close-btn" disabled={loading}><X size={20} /></button>
        </div>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          
          <div className="form-group">
            <label>Parent Category</label>
            <select 
              value={formData.parent_selection}
              onChange={(e) => setFormData({...formData, parent_selection: e.target.value})}
              required
              disabled={mode === 'edit'} // Cannot change hierarchy safely during edit in this UI
              style={{ padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '4px' }}
            >
              <option value="none">No Parent (Top Level)</option>
              <optgroup label="Level 1 Categories">
                {parents.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </optgroup>
              <optgroup label="Level 2 Categories">
                {children.map(c => {
                  const pName = parents.find(p => p.id === c.parent_category_id)?.name || 'Unknown'
                  return <option key={c.id} value={c.id}>{pName} &gt; {c.name}</option>
                })}
              </optgroup>
            </select>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Creating as: <strong>{levelDisplay}</strong>
            </span>
          </div>

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
  const [subs, setSubs] = useState([])
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [expandedParents, setExpandedParents] = useState({})
  const [expandedChildren, setExpandedChildren] = useState({})

  // Modals state
  const [modalConfig, setModalConfig] = useState({ isOpen: false, mode: 'create', data: null })
  
  // Delete Modal
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, data: null })

  // Fetch Data
  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [parentRes, childRes, subRes] = await Promise.all([
        supabase.from('parent_categories').select('*').order('display_order', { ascending: true }),
        supabase.from('child_categories').select('*').order('display_order', { ascending: true }),
        supabase.from('sub_categories').select('*').order('display_order', { ascending: true })
      ])

      if (parentRes.error) throw new Error(`Parent load error: ${parentRes.error.message}`)
      if (childRes.error) throw new Error(`Child load error: ${childRes.error.message}`)
      if (subRes.error && subRes.error.code !== '42P01') { 
        // 42P01 is undefined table, ignore if migration hasn't run yet
        throw new Error(`Sub load error: ${subRes.error.message}`)
      }

      setParents(parentRes.data || [])
      setChildren(childRes.data || [])
      setSubs(subRes.data || [])
      
      // Expand all by default
      const pExp = {}
      ;(parentRes.data || []).forEach(p => { pExp[p.id] = true })
      setExpandedParents(pExp)
      
      const cExp = {}
      ;(childRes.data || []).forEach(c => { cExp[c.id] = true })
      setExpandedChildren(cExp)

    } catch (err) {
      console.error(err)
      setError(err.message || "Failed to load categories.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const toggleParentExpand = (id) => setExpandedParents(prev => ({ ...prev, [id]: !prev[id] }))
  const toggleChildExpand = (id) => setExpandedChildren(prev => ({ ...prev, [id]: !prev[id] }))

  const openCreate = (parentSelection = 'none') => setModalConfig({ isOpen: true, mode: 'create', data: { parent_selection: parentSelection } })
  const openEdit = (cat, type) => setModalConfig({ isOpen: true, mode: 'edit', data: { ...cat, type } })
  const closeModals = () => setModalConfig({ isOpen: false, mode: 'create', data: null })

  const handleSave = async (formData) => {
    // Determine table
    let table = 'parent_categories'
    let payload = {
      name: formData.name,
      slug: formData.slug,
      display_order: formData.display_order,
      is_active: formData.is_active
    }

    if (formData.parent_selection !== 'none') {
      if (parents.find(p => p.id === formData.parent_selection)) {
        table = 'child_categories'
        payload.parent_category_id = formData.parent_selection
      } else if (children.find(c => c.id === formData.parent_selection)) {
        table = 'sub_categories'
        payload.child_category_id = formData.parent_selection
      }
    }

    if (modalConfig.mode === 'create') {
      const { error } = await supabase.from(table).insert([payload])
      if (error) throw error
    } else {
      const { error } = await supabase.from(table).update(payload).eq('id', modalConfig.data.id)
      if (error) throw error
    }
    
    await fetchData()
  }

  const confirmDelete = (cat, type) => {
    // Validate safe deletion
    let message = ""
    if (type === 'parent') {
      const hasChildren = children.some(c => c.parent_category_id === cat.id)
      if (hasChildren) {
        alert("Cannot delete this category because it contains subcategories. Please reassign or delete them first.")
        return
      }
      message = `Are you sure you want to delete the top-level category "${cat.name}"?`
    } else if (type === 'child') {
      const hasSubs = subs.some(s => s.child_category_id === cat.id)
      if (hasSubs) {
        alert("Cannot delete this category because it contains subcategories. Please reassign or delete them first.")
        return
      }
      message = `Are you sure you want to delete "${cat.name}"?`
    } else {
      message = `Are you sure you want to delete "${cat.name}"?`
    }

    // Checking for products is also recommended here in a real production app.
    // For now, we rely on ON DELETE RESTRICT in Postgres to prevent accidental deletes if products exist.

    setDeleteModal({ isOpen: true, data: { ...cat, type }, message })
  }

  const handleDelete = async () => {
    const { data, type } = deleteModal
    let table = 'parent_categories'
    if (type === 'child') table = 'child_categories'
    if (type === 'sub') table = 'sub_categories'

    try {
      const { error } = await supabase.from(table).delete().eq('id', data.id)
      if (error) {
        if (error.code === '23503') throw new Error("Cannot delete because products are assigned to this category.")
        throw error
      }
      setDeleteModal({ isOpen: false, data: null })
      await fetchData()
    } catch (err) {
      alert("Delete failed: " + err.message)
    }
  }

  const renderStatus = (isActive) => {
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
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Manage 3-level hierarchical categories.</p>
        </div>
        <button className="btn-primary" onClick={() => openCreate('none')}>
          <Plus size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
          Add Category
        </button>
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
          <button className="btn-primary" onClick={() => openCreate('none')}>Create your first category</button>
        </div>
      ) : (
        parents.map(parent => {
          const parentChildren = children.filter(c => c.parent_category_id === parent.id)
          const isExpanded = expandedParents[parent.id]

          return (
            <div key={parent.id} className="card category-section" style={{ padding: 0, overflow: 'hidden', marginBottom: '16px' }}>
              
              {/* LEVEL 1: PARENT */}
              <div 
                className="category-header" 
                style={{ padding: '20px', margin: 0, backgroundColor: '#f9fafb', cursor: 'pointer', borderBottom: isExpanded ? '1px solid var(--border-color)' : 'none' }}
                onClick={() => toggleParentExpand(parent.id)}
              >
                <div className="flex-row">
                  {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  <h3 style={{ margin: 0 }}>{parent.name}</h3>
                  {renderStatus(parent.is_active)}
                  <span className="badge" style={{ backgroundColor: '#e2e8f0', color: '#475569' }}>L1</span>
                </div>
                
                <div className="flex-row" onClick={e => e.stopPropagation()}>
                  <button className="btn-icon" title="Edit" onClick={() => openEdit(parent, 'parent')}>
                    <Edit2 size={16} />
                  </button>
                  <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => openCreate(parent.id)}>
                    <Plus size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                    Add L2
                  </button>
                </div>
              </div>

              {/* LEVEL 2: CHILDREN */}
              {isExpanded && (
                <div style={{ padding: '0' }}>
                  {parentChildren.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      No child categories exist.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {parentChildren.map((child, index) => {
                        const childSubs = subs.filter(s => s.child_category_id === child.id)
                        const isChildExpanded = expandedChildren[child.id]
                        const isLastChild = index === parentChildren.length - 1

                        return (
                          <div key={child.id} style={{ borderBottom: isLastChild ? 'none' : '1px solid var(--border-color)' }}>
                            <div 
                              style={{ 
                                padding: '12px 20px 12px 40px', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                backgroundColor: '#ffffff',
                                cursor: 'pointer'
                              }}
                              onClick={() => toggleChildExpand(child.id)}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {isChildExpanded ? <ChevronDown size={16} color="var(--text-muted)" /> : <ChevronRight size={16} color="var(--text-muted)" />}
                                <span style={{ fontWeight: 500 }}>{child.name}</span>
                                {renderStatus(child.is_active)}
                                <span className="badge" style={{ backgroundColor: '#e2e8f0', color: '#475569', fontSize: '0.7rem' }}>L2</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} onClick={e => e.stopPropagation()}>
                                <button className="btn-icon" onClick={() => openEdit(child, 'child')}><Edit2 size={14} /></button>
                                <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => openCreate(child.id)}>
                                  + Add L3
                                </button>
                              </div>
                            </div>

                            {/* LEVEL 3: SUBS */}
                            {isChildExpanded && (
                              <div style={{ padding: '0', backgroundColor: '#fafafa', borderTop: '1px solid var(--border-color)' }}>
                                {childSubs.length === 0 ? (
                                  <div style={{ padding: '12px 20px 12px 70px', color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                                    No sub-categories.
                                  </div>
                                ) : (
                                  <table className="admin-table" style={{ margin: 0 }}>
                                    <tbody>
                                      {childSubs.map((sub, sIndex) => (
                                        <tr key={sub.id} style={{ borderBottom: sIndex === childSubs.length - 1 ? 'none' : '1px solid var(--border-color)' }}>
                                          <td style={{ paddingLeft: '70px', width: '35%' }}>
                                            <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{sub.name}</span>
                                            <span className="badge" style={{ backgroundColor: '#e2e8f0', color: '#475569', fontSize: '0.7rem', marginLeft: '8px' }}>L3</span>
                                          </td>
                                          <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>/{parent.slug}/{child.slug}/{sub.slug}</td>
                                          <td style={{ width: '100px' }}>{renderStatus(sub.is_active)}</td>
                                          <td style={{ textAlign: 'right', width: '100px' }}>
                                            <button className="btn-icon" onClick={() => openEdit(sub, 'sub')}><Edit2 size={14} /></button>
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
                      })}
                    </div>
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
        initialData={modalConfig.data}
        parents={parents}
        children={children}
        onClose={closeModals}
        onSave={handleSave}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Category"
        message={deleteModal.message}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ isOpen: false, data: null })}
      />
    </div>
  )
}

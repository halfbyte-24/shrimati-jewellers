import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { compressImage } from '../utils/imageCompression'
import { X, Upload, Star, Trash2, GripVertical, CheckCircle } from 'lucide-react'

const generateSlug = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

export default function ProductModal({ isOpen, onClose, onSave, mode, initialData, parents, children, subs }) {
  const defaultFormData = {
    parent_category_id: '',
    child_category_id: '',
    sub_category_id: '',
    name: '',
    slug: '',
    product_code: '',
    description: '',
    collection_name: '',
    design_name: '',
    finish: '',
    purity: '',
    weight_value: '',
    weight_unit: 'g',
    huid: '',
    price: '',
    price_type: '',
    is_available: true,
    is_published: false,
    is_featured: false,
    display_order: 0
  }

  const [formData, setFormData] = useState(defaultFormData)
  const [images, setImages] = useState([])
  const [deletedImages, setDeletedImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Active tab: 'details' or 'images'
  const [activeTab, setActiveTab] = useState('details')

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          ...defaultFormData,
          ...initialData
        })
        
        // Fetch existing images
        fetchExistingImages(initialData.id)
      } else {
        setFormData(defaultFormData)
        setImages([])
        setDeletedImages([])
      }
      setError(null)
      setActiveTab('details')
    }
  }, [isOpen, mode, initialData])

  const fetchExistingImages = async (productId) => {
    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('display_order', { ascending: true })
    
    if (error) {
      console.error("Failed to load images", error)
    } else {
      setImages((data || []).map(img => ({
        ...img,
        _isExisting: true,
        previewUrl: img.image_url.startsWith('http') ? img.image_url : supabase.storage.from('product-images').getPublicUrl(img.image_url).data.publicUrl
      })))
    }
  }

  if (!isOpen) return null

  // Derived state for category filtering
  const activeParents = parents.filter(p => p.is_active !== false)
  const availableChildren = children.filter(c => c.parent_category_id === formData.parent_category_id && c.is_active !== false)
  const availableSubs = (subs || []).filter(s => s.child_category_id === formData.child_category_id && s.is_active !== false)

  const handleParentChange = (e) => {
    const newParentId = e.target.value
    setFormData(prev => {
      // Check if current child belongs to new parent
      const currentChild = children.find(c => c.id === prev.child_category_id)
      const childValid = currentChild && currentChild.parent_category_id === newParentId
      
      return {
        ...prev,
        parent_category_id: newParentId,
        child_category_id: childValid ? prev.child_category_id : '',
        sub_category_id: childValid ? prev.sub_category_id : ''
      }
    })
  }

  const handleChildChange = (e) => {
    const newChildId = e.target.value
    setFormData(prev => {
      const currentSub = (subs || []).find(s => s.id === prev.sub_category_id)
      const subValid = currentSub && currentSub.child_category_id === newChildId
      
      return {
        ...prev,
        child_category_id: newChildId,
        sub_category_id: subValid ? prev.sub_category_id : ''
      }
    })
  }

  const handleNameChange = (e) => {
    const name = e.target.value
    setFormData(prev => ({
      ...prev,
      name,
      slug: mode === 'create' ? generateSlug(name) : prev.slug
    }))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const newImages = files.map((file, index) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      is_primary: images.length === 0 && index === 0, // First uploaded image becomes primary if none exist
      display_order: images.length + index,
      _isNew: true
    }))

    setImages(prev => [...prev, ...newImages])
  }

  const removeImage = (index) => {
    const imgToRemove = images[index]
    if (imgToRemove._isExisting) {
      setDeletedImages(prev => [...prev, imgToRemove])
    }
    
    setImages(prev => {
      const updated = [...prev]
      updated.splice(index, 1)
      // If we removed the primary, make the first remaining image primary
      if (imgToRemove.is_primary && updated.length > 0) {
        updated[0].is_primary = true
      }
      return updated
    })
  }

  const setPrimaryImage = (index) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      is_primary: i === index
    })))
  }

  const moveImage = (index, direction) => {
    if (direction === 'up' && index > 0) {
      setImages(prev => {
        const updated = [...prev]
        const temp = updated[index]
        updated[index] = updated[index - 1]
        updated[index - 1] = temp
        // Update display_order
        updated.forEach((img, i) => img.display_order = i)
        return updated
      })
    } else if (direction === 'down' && index < images.length - 1) {
      setImages(prev => {
        const updated = [...prev]
        const temp = updated[index]
        updated[index] = updated[index + 1]
        updated[index + 1] = temp
        updated.forEach((img, i) => img.display_order = i)
        return updated
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.name || !formData.slug || !formData.parent_category_id || !formData.child_category_id) {
      setError("Please fill all required fields (Name, Slug, Parent Category, Child Category).")
      setLoading(false)
      return
    }

    try {
      // 1. Save Product
      // Explicitly construct payload to prevent joined fields (like product_images) from breaking the schema
      const {
        parent_category_id,
        child_category_id,
        sub_category_id,
        name,
        slug,
        product_code,
        description,
        collection_name,
        design_name,
        finish,
        purity,
        weight_value,
        weight_unit,
        huid,
        price,
        price_type,
        is_available,
        is_published,
        is_featured,
        display_order
      } = formData

      const productPayload = {
        parent_category_id,
        child_category_id,
        sub_category_id: sub_category_id || null,
        name,
        slug,
        product_code,
        description,
        collection_name,
        design_name,
        finish,
        purity,
        weight_value: weight_value === '' ? null : weight_value,
        weight_unit,
        huid,
        price: price === '' ? null : price,
        price_type,
        is_available,
        is_published,
        is_featured,
        display_order
      }
      
      let productId = initialData?.id
      
      if (mode === 'create') {
        const { data, error } = await supabase.from('products').insert([productPayload]).select()
        if (error) throw new Error(`Product Create Error: ${error.message}`)
        productId = data[0].id
      } else {
        const { error } = await supabase.from('products').update(productPayload).eq('id', productId)
        if (error) throw new Error(`Product Update Error: ${error.message}`)
      }

      // 2. Handle Deleted Images
      for (const img of deletedImages) {
        // Delete from DB
        await supabase.from('product_images').delete().eq('id', img.id)
        // Delete from Storage
        if (img.image_url && !img.image_url.startsWith('http')) {
          await supabase.storage.from('product-images').remove([img.image_url])
        }
      }

      // 3. Handle Images Update/Upload
      for (let i = 0; i < images.length; i++) {
        const img = images[i]
        const display_order = i // Force order based on array

        if (img._isNew) {
          // Compress and Upload
          const compressed = await compressImage(img.file)
          const fileExt = img.file.name.split('.').pop()
          const fileName = `${productId}/${crypto.randomUUID()}.${fileExt}`
          
          const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, compressed)
          if (uploadError) throw new Error(`Image Upload Error: ${uploadError.message}`)
          
          // Insert to DB
          const { error: dbError } = await supabase.from('product_images').insert([{
            product_id: productId,
            image_url: fileName,
            is_primary: img.is_primary || false,
            display_order: display_order
          }])
          if (dbError) throw new Error(`Image DB Error: ${dbError.message}`)
          
        } else if (img._isExisting) {
          // Update existing image metadata
          const { error: dbError } = await supabase.from('product_images').update({
            is_primary: img.is_primary || false,
            display_order: display_order
          }).eq('id', img.id)
          if (dbError) throw new Error(`Image Update Error: ${dbError.message}`)
        }
      }

      await onSave()
      onClose()
    } catch (err) {
      console.error(err)
      setError(err.message || "An error occurred while saving the product.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '800px', height: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header">
          <h3>{mode === 'create' ? 'Add' : 'Edit'} Product</h3>
          <button onClick={onClose} className="close-btn" disabled={loading}><X size={20} /></button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          <button 
            type="button"
            style={{ background: 'none', border: 'none', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', color: activeTab === 'details' ? 'var(--primary-color)' : 'var(--text-muted)' }}
            onClick={() => setActiveTab('details')}
          >
            Product Details
          </button>
          <button 
            type="button"
            style={{ background: 'none', border: 'none', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', color: activeTab === 'images' ? 'var(--primary-color)' : 'var(--text-muted)' }}
            onClick={() => setActiveTab('images')}
          >
            Images ({images.length})
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
          {activeTab === 'details' ? (
            <div className="login-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label>Level 1 (Parent) *</label>
                  <select value={formData.parent_category_id} onChange={handleParentChange} required>
                    <option value="">Select Parent...</option>
                    {activeParents.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Level 2 (Child) *</label>
                  <select 
                    value={formData.child_category_id} 
                    onChange={handleChildChange} 
                    required 
                    disabled={!formData.parent_category_id}
                  >
                    <option value="">Select Child...</option>
                    {availableChildren.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Level 3 (Sub-category)</label>
                  <select 
                    value={formData.sub_category_id || ''} 
                    onChange={(e) => setFormData({...formData, sub_category_id: e.target.value})} 
                    disabled={!formData.child_category_id || availableSubs.length === 0}
                  >
                    <option value="">{availableSubs.length === 0 && formData.child_category_id ? 'No subs available' : 'None / Select...'}</option>
                    {availableSubs.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Product Name *</label>
                  <input type="text" value={formData.name} onChange={handleNameChange} required />
                </div>
                <div className="form-group">
                  <label>Slug *</label>
                  <input type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} required />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={formData.description || ''} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  style={{ padding: '10px', border: '1px solid var(--border-color)', borderRadius: '4px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Product Code / SKU</label>
                  <input type="text" value={formData.product_code || ''} onChange={(e) => setFormData({...formData, product_code: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input type="number" step="0.01" value={formData.price || ''} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Price Type</label>
                  <input type="text" placeholder="e.g. Approx. Price" value={formData.price_type || ''} onChange={(e) => setFormData({...formData, price_type: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Purity</label>
                  <input type="text" placeholder="e.g. 22K" value={formData.purity || ''} onChange={(e) => setFormData({...formData, purity: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Weight</label>
                  <input type="number" step="0.01" value={formData.weight_value || ''} onChange={(e) => setFormData({...formData, weight_value: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <input type="text" value={formData.weight_unit || 'g'} onChange={(e) => setFormData({...formData, weight_unit: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Collection</label>
                  <input type="text" value={formData.collection_name || ''} onChange={(e) => setFormData({...formData, collection_name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Design Name</label>
                  <input type="text" value={formData.design_name || ''} onChange={(e) => setFormData({...formData, design_name: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Finish</label>
                  <input type="text" value={formData.finish || ''} onChange={(e) => setFormData({...formData, finish: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>HUID</label>
                  <input type="text" value={formData.huid || ''} onChange={(e) => setFormData({...formData, huid: e.target.value})} />
                </div>
              </div>

              <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '4px', border: '1px solid var(--border-color)', marginTop: '8px' }}>
                <h4 style={{ marginBottom: '12px', fontSize: '1rem' }}>Visibility & Status</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" id="is_published" checked={formData.is_published} onChange={(e) => setFormData({...formData, is_published: e.target.checked})} style={{ width: 'auto' }} />
                    <label htmlFor="is_published" style={{ cursor: 'pointer' }}>Published (Visible to Public)</label>
                  </div>
                  <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" id="is_available" checked={formData.is_available} onChange={(e) => setFormData({...formData, is_available: e.target.checked})} style={{ width: 'auto' }} />
                    <label htmlFor="is_available" style={{ cursor: 'pointer' }}>In Stock</label>
                  </div>
                  <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" id="is_featured" checked={formData.is_featured} onChange={(e) => setFormData({...formData, is_featured: e.target.checked})} style={{ width: 'auto' }} />
                    <label htmlFor="is_featured" style={{ cursor: 'pointer' }}>Featured Product</label>
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '16px', maxWidth: '200px' }}>
                  <label>Display Order (Lower is first)</label>
                  <input type="number" value={formData.display_order} onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})} />
                </div>
              </div>
            </div>
          ) : (
            <div className="images-section">
              <div style={{ marginBottom: '20px' }}>
                <label 
                  style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
                    padding: '20px', border: '2px dashed var(--border-color)', borderRadius: '8px', 
                    cursor: 'pointer', backgroundColor: '#f9fafb', color: 'var(--text-muted)'
                  }}
                >
                  <Upload size={24} />
                  <span>Click to browse or drag images here</span>
                  <input type="file" multiple accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleImageUpload} />
                </label>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
                  Supported formats: JPG, PNG, WEBP. Images will be automatically compressed.
                </p>
              </div>

              {images.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                  {images.map((img, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: img.is_primary ? '#f0fdf4' : '#fff' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <button type="button" className="btn-icon" onClick={() => moveImage(index, 'up')} disabled={index === 0}>▲</button>
                        <button type="button" className="btn-icon" onClick={() => moveImage(index, 'down')} disabled={index === images.length - 1}>▼</button>
                      </div>
                      <img src={img.previewUrl} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 500, display: 'block', marginBottom: '4px' }}>
                          {img._isNew ? img.file.name : 'Existing Image'}
                        </span>
                        {img.is_primary ? (
                          <span className="badge badge-active" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Star size={12} /> Primary Image</span>
                        ) : (
                          <button type="button" onClick={() => setPrimaryImage(index)} style={{ background: 'none', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}>
                            Set as Primary
                          </button>
                        )}
                      </div>
                      <button type="button" className="btn-icon" onClick={() => removeImage(index)} style={{ color: 'var(--error-color)' }}>
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No images uploaded yet.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: 'auto' }}>
          <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>Cancel</button>
          <button type="button" onClick={handleSubmit} className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  )
}

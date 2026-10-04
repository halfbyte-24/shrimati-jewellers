import { useState, useEffect } from 'react'
import { Plus, Edit2, AlertCircle, X, Trash2 } from 'lucide-react'
import { getAllOffers, createOffer, updateOffer, deleteOffer } from '../../../src/services/offers'

function OfferModal({ isOpen, onClose, onSave, mode, initialData }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    display_text: '',
    is_active: true,
    starts_at: '',
    ends_at: '',
    display_order: 1
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          title: initialData.title || '',
          description: initialData.description || '',
          display_text: initialData.display_text || '',
          is_active: initialData.is_active !== false,
          starts_at: initialData.starts_at ? new Date(initialData.starts_at).toISOString().slice(0, 16) : '',
          ends_at: initialData.ends_at ? new Date(initialData.ends_at).toISOString().slice(0, 16) : '',
          display_order: initialData.display_order || 1
        })
      } else {
        setFormData({
          title: '',
          description: '',
          display_text: '',
          is_active: true,
          starts_at: '',
          ends_at: '',
          display_order: 1
        })
      }
      setError(null)
    }
  }, [isOpen, mode, initialData])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.title || !formData.display_text) {
      setError("Title and Display Text are required.")
      setLoading(false)
      return
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        display_text: formData.display_text,
        is_active: formData.is_active,
        starts_at: formData.starts_at ? new Date(formData.starts_at).toISOString() : null,
        ends_at: formData.ends_at ? new Date(formData.ends_at).toISOString() : null,
        display_order: formData.display_order
      }
      await onSave(payload)
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
          <h3>{mode === 'create' ? 'Create' : 'Edit'} Offer</h3>
          <button onClick={onClose} className="close-btn" disabled={loading}><X size={20} /></button>
        </div>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
              required
              placeholder="e.g. Dhanteras Special"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Internal description of the offer"
              rows={2}
            />
          </div>

          <div className="form-group">
            <label>Display Text (Public)</label>
            <textarea 
              value={formData.display_text} 
              onChange={e => setFormData({...formData, display_text: e.target.value})}
              required
              placeholder="e.g. This Dhanteras, get a flat 20% off. Visit our store to know more."
              rows={3}
            />
          </div>

          <div className="flex-row" style={{ gap: '20px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Start Date & Time (Optional)</label>
              <input 
                type="datetime-local" 
                value={formData.starts_at} 
                onChange={e => setFormData({...formData, starts_at: e.target.value})}
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>End Date & Time (Optional)</label>
              <input 
                type="datetime-local" 
                value={formData.ends_at} 
                onChange={e => setFormData({...formData, ends_at: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Display Order</label>
            <input 
              type="number" 
              value={formData.display_order} 
              onChange={e => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
            />
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
            <input 
              type="checkbox" 
              id="is_active"
              checked={formData.is_active}
              onChange={e => setFormData({...formData, is_active: e.target.checked})}
              style={{ width: 'auto' }}
            />
            <label htmlFor="is_active" style={{ cursor: 'pointer' }}>Offer is Active</label>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

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

export default function Offers() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [modalConfig, setModalConfig] = useState({ isOpen: false, mode: 'create', data: null })
  const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, offer: null })

  const fetchOffers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllOffers()
      setOffers(data)
    } catch (err) {
      setError(err.message || "Failed to load offers.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOffers()
  }, [])

  const handleSave = async (payload) => {
    if (modalConfig.mode === 'create') {
      await createOffer(payload)
    } else {
      await updateOffer(modalConfig.data.id, payload)
    }
    await fetchOffers()
  }

  const handleDelete = async () => {
    try {
      await deleteOffer(deleteConfig.offer.id)
      setDeleteConfig({ isOpen: false, offer: null })
      await fetchOffers()
    } catch (err) {
      setError(err.message || "Failed to delete offer.")
    }
  }

  const toggleStatus = async (offer) => {
    try {
      await updateOffer(offer.id, { is_active: !offer.is_active })
      await fetchOffers()
    } catch (err) {
      setError(err.message || "Failed to update offer status.")
    }
  }

  const openCreate = () => setModalConfig({ isOpen: true, mode: 'create', data: null })
  const openEdit = (offer) => setModalConfig({ isOpen: true, mode: 'edit', data: offer })
  const closeModals = () => setModalConfig({ isOpen: false, mode: 'create', data: null })

  const getStatusDisplay = (offer) => {
    if (!offer.is_active) {
      return <span className="badge badge-inactive">Inactive</span>
    }
    
    const now = new Date()
    const start = offer.starts_at ? new Date(offer.starts_at) : null
    const end = offer.ends_at ? new Date(offer.ends_at) : null
    
    if (start && start > now) {
      return <span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>Scheduled</span>
    }
    
    if (end && end < now) {
      return <span className="badge" style={{ background: '#f3f4f6', color: '#374151' }}>Expired</span>
    }
    
    return <span className="badge badge-active">Active</span>
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Offers & Discounts</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Manage promotional offers displayed on the customer website.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>Add Offer</button>
      </div>

      {error && (
        <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading offers...</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {offers.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No offers found. Create your first offer to display on the home page.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Offer</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Order</th>
                    <th style={{ width: '120px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map(offer => (
                    <tr key={offer.id}>
                      <td style={{ fontWeight: 500 }}>{offer.title}</td>
                      <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={offer.display_text}>
                        {offer.display_text}
                      </td>
                      <td>{getStatusDisplay(offer)}</td>
                      <td style={{ fontSize: '0.85rem' }}>{formatDate(offer.starts_at)}</td>
                      <td style={{ fontSize: '0.85rem' }}>{formatDate(offer.ends_at)}</td>
                      <td>{offer.display_order}</td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button className="btn-icon" title={offer.is_active ? 'Disable' : 'Enable'} onClick={() => toggleStatus(offer)}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: offer.is_active ? 'var(--text-muted)' : 'var(--primary-color)', marginRight: '8px', cursor: 'pointer' }}>
                            {offer.is_active ? 'Disable' : 'Enable'}
                          </span>
                        </button>
                        <button className="btn-icon" title="Edit" onClick={() => openEdit(offer)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn-icon" title="Delete" onClick={() => setDeleteConfig({ isOpen: true, offer })} style={{ color: 'var(--danger-color)' }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <OfferModal 
        isOpen={modalConfig.isOpen}
        mode={modalConfig.mode}
        initialData={modalConfig.data}
        onClose={closeModals}
        onSave={handleSave}
      />

      <ConfirmModal 
        isOpen={deleteConfig.isOpen}
        title="Delete Offer"
        message={`Are you sure you want to delete "${deleteConfig.offer?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfig({ isOpen: false, offer: null })}
      />
    </div>
  )
}

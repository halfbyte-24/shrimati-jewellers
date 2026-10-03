import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Save, AlertCircle, CheckCircle } from 'lucide-react'

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const defaultBusinessHours = DAYS_OF_WEEK.reduce((acc, day) => {
  acc[day] = { enabled: day !== 'sunday', open: '10:00', close: '20:00' }
  return acc
}, {})

export default function Settings() {
  const [formData, setFormData] = useState({
    store_name: '', tagline: '', short_description: '', description: '',
    phone: '', secondary_phone: '', whatsapp: '', email: '', enquiry_email: '',
    address_line_1: '', address_line_2: '', locality: '', city: '', state: '', postal_code: '', country: 'India', google_maps_url: '',
    business_hours: defaultBusinessHours,
    instagram_url: '', facebook_url: '', youtube_url: '', whatsapp_url: '',
    website_title: '', meta_description: '', logo_url: '', favicon_url: ''
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null) // { type: 'success' | 'error', text: '' }

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    setMessage(null)
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 1)
        .single()

      if (error && error.code !== 'PGRST116') { // Ignore "no rows returned" during initialization
        throw error
      }

      if (data) {
        // Merge with defaults to ensure business_hours structure exists if missing
        setFormData({
          ...formData,
          ...data,
          business_hours: Object.keys(data.business_hours || {}).length > 0 ? data.business_hours : defaultBusinessHours
        })
      }
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: `Failed to load settings: ${err.message}` })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleBusinessHourChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      business_hours: {
        ...prev.business_hours,
        [day]: {
          ...prev.business_hours[day],
          [field]: value
        }
      }
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    if (!formData.store_name) {
      setMessage({ type: 'error', text: 'Store Name is required.' })
      setSaving(false)
      return
    }

    try {
      // Explicit payload construction to avoid sending React artifacts to Supabase
      const payload = {
        store_name: formData.store_name,
        tagline: formData.tagline,
        short_description: formData.short_description,
        description: formData.description,
        phone: formData.phone,
        secondary_phone: formData.secondary_phone,
        whatsapp: formData.whatsapp,
        email: formData.email,
        enquiry_email: formData.enquiry_email,
        address_line_1: formData.address_line_1,
        address_line_2: formData.address_line_2,
        locality: formData.locality,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        country: formData.country,
        google_maps_url: formData.google_maps_url,
        business_hours: formData.business_hours,
        instagram_url: formData.instagram_url,
        facebook_url: formData.facebook_url,
        youtube_url: formData.youtube_url,
        whatsapp_url: formData.whatsapp_url,
        website_title: formData.website_title,
        meta_description: formData.meta_description,
        logo_url: formData.logo_url,
        favicon_url: formData.favicon_url,
        updated_at: new Date().toISOString()
      }

      // Upsert using id = 1
      const { error } = await supabase
        .from('store_settings')
        .upsert({ id: 1, ...payload })

      if (error) throw error

      setMessage({ type: 'success', text: 'Store settings saved successfully!' })
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: `Failed to save settings: ${err.message}` })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
        <p>Loading settings...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Store Settings</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Manage the public-facing details of your store.</p>
        </div>
      </div>

      {message && (
        <div className={`message-banner ${message.type === 'error' ? 'error' : 'success'}`} style={{
          padding: '12px 16px',
          marginBottom: '20px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
          color: message.type === 'error' ? '#991b1b' : '#166534',
          border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bbf7d0'}`
        }}>
          {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="settings-form">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* SECTION A — BUSINESS INFORMATION */}
          <section className="card">
            <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Business Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label>Store Name *</label>
                <input type="text" value={formData.store_name} onChange={(e) => handleInputChange('store_name', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Business Tagline</label>
                <input type="text" value={formData.tagline || ''} onChange={(e) => handleInputChange('tagline', e.target.value)} placeholder="e.g. Timeless Craft. Modern Elegance." />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label>Short Description</label>
              <textarea value={formData.short_description || ''} onChange={(e) => handleInputChange('short_description', e.target.value)} rows="2" style={{ padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
            <div className="form-group">
              <label>Full Business Description</label>
              <textarea value={formData.description || ''} onChange={(e) => handleInputChange('description', e.target.value)} rows="5" style={{ padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
          </section>

          {/* SECTION B — CONTACT INFORMATION */}
          <section className="card">
            <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Contact Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label>Primary Phone</label>
                <input type="text" value={formData.phone || ''} onChange={(e) => handleInputChange('phone', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Secondary Phone</label>
                <input type="text" value={formData.secondary_phone || ''} onChange={(e) => handleInputChange('secondary_phone', e.target.value)} />
              </div>
              <div className="form-group">
                <label>WhatsApp Number</label>
                <input type="text" value={formData.whatsapp || ''} onChange={(e) => handleInputChange('whatsapp', e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={formData.email || ''} onChange={(e) => handleInputChange('email', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Enquiry Email</label>
                <input type="email" value={formData.enquiry_email || ''} onChange={(e) => handleInputChange('enquiry_email', e.target.value)} />
              </div>
            </div>
          </section>

          {/* SECTION C — STORE ADDRESS */}
          <section className="card">
            <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Store Address</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label>Address Line 1</label>
                <input type="text" value={formData.address_line_1 || ''} onChange={(e) => handleInputChange('address_line_1', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Address Line 2</label>
                <input type="text" value={formData.address_line_2 || ''} onChange={(e) => handleInputChange('address_line_2', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Area / Locality</label>
                <input type="text" value={formData.locality || ''} onChange={(e) => handleInputChange('locality', e.target.value)} />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" value={formData.city || ''} onChange={(e) => handleInputChange('city', e.target.value)} />
              </div>
              <div className="form-group">
                <label>State</label>
                <input type="text" value={formData.state || ''} onChange={(e) => handleInputChange('state', e.target.value)} />
              </div>
              <div className="form-group">
                <label>PIN / ZIP Code</label>
                <input type="text" value={formData.postal_code || ''} onChange={(e) => handleInputChange('postal_code', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input type="text" value={formData.country || ''} onChange={(e) => handleInputChange('country', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Google Maps URL</label>
              <input type="url" value={formData.google_maps_url || ''} onChange={(e) => handleInputChange('google_maps_url', e.target.value)} placeholder="https://maps.google.com/..." />
            </div>
          </section>

          {/* SECTION D — BUSINESS HOURS */}
          <section className="card">
            <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Business Hours</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {DAYS_OF_WEEK.map((day) => {
                const dayData = formData.business_hours[day] || { enabled: false, open: '', close: '' }
                return (
                  <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#f9fafb', padding: '12px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                    <div style={{ width: '120px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="checkbox" 
                        checked={dayData.enabled} 
                        onChange={(e) => handleBusinessHourChange(day, 'enabled', e.target.checked)} 
                        id={`day-${day}`}
                      />
                      <label htmlFor={`day-${day}`} style={{ textTransform: 'capitalize', cursor: 'pointer', margin: 0, fontWeight: 500 }}>{day}</label>
                    </div>
                    
                    {dayData.enabled ? (
                      <>
                        <input 
                          type="time" 
                          value={dayData.open} 
                          onChange={(e) => handleBusinessHourChange(day, 'open', e.target.value)} 
                          style={{ padding: '4px 8px', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                        />
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                        <input 
                          type="time" 
                          value={dayData.close} 
                          onChange={(e) => handleBusinessHourChange(day, 'close', e.target.value)} 
                          style={{ padding: '4px 8px', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                        />
                      </>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>Closed</span>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* SECTION E — SOCIAL MEDIA */}
          <section className="card">
            <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Social Media</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Instagram URL</label>
                <input type="url" value={formData.instagram_url || ''} onChange={(e) => handleInputChange('instagram_url', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Facebook URL</label>
                <input type="url" value={formData.facebook_url || ''} onChange={(e) => handleInputChange('facebook_url', e.target.value)} />
              </div>
              <div className="form-group">
                <label>YouTube URL</label>
                <input type="url" value={formData.youtube_url || ''} onChange={(e) => handleInputChange('youtube_url', e.target.value)} />
              </div>
              <div className="form-group">
                <label>WhatsApp Contact URL</label>
                <input type="url" value={formData.whatsapp_url || ''} onChange={(e) => handleInputChange('whatsapp_url', e.target.value)} />
              </div>
            </div>
          </section>

          {/* SECTION F — WEBSITE / BRAND INFORMATION */}
          <section className="card">
            <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Website Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label>Website Title (SEO)</label>
                <input type="text" value={formData.website_title || ''} onChange={(e) => handleInputChange('website_title', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Logo Image URL</label>
                <input type="text" value={formData.logo_url || ''} onChange={(e) => handleInputChange('logo_url', e.target.value)} placeholder="/assets/logo.png" />
              </div>
            </div>
            <div className="form-group">
              <label>Meta Description (SEO)</label>
              <textarea value={formData.meta_description || ''} onChange={(e) => handleInputChange('meta_description', e.target.value)} rows="3" style={{ padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
          </section>

          <div style={{ position: 'sticky', bottom: '20px', display: 'flex', justifyContent: 'flex-end', padding: '16px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <button type="submit" className="btn-primary" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontSize: '1rem' }}>
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

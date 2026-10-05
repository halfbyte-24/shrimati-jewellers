import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import brandLogo from '../../assets/logo.jpeg';
import { useStoreSettings } from '../../contexts/StoreSettingsContext';
import './Footer.css';

export default function Footer() {
  const [logoClicks, setLogoClicks] = useState(0);
  const navigate = useNavigate();
  const { settings, loading } = useStoreSettings();

  useEffect(() => {
    if (logoClicks > 0 && logoClicks < 7) {
      const timer = setTimeout(() => setLogoClicks(0), 15000);
      return () => clearTimeout(timer);
    }
  }, [logoClicks]);

  const handleLogoClick = (e) => {
    const newCount = logoClicks + 1;
    if (newCount >= 7) {
      e.preventDefault();
      setLogoClicks(0);
      navigate('/admin/login');
    } else {
      setLogoClicks(newCount);
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo" aria-label={`${settings?.store_name || 'Shrimati Jewellers'} — Home`} onClick={handleLogoClick}>
              <img 
                src={brandLogo} 
                alt={settings?.store_name || 'Shrimati Jewellers'} 
                className="footer-logo-img"
              />
            </Link>
            <p className="mt-md text-xs text-muted">
              {settings?.short_description || settings?.tagline || 'Timeless craft. Modern elegance. Discover thoughtfully crafted jewelry collections.'}
            </p>
          </div>

          <div className="footer-links">
            <h4 className="footer-heading">Explore</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/collections">Collections</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4 className="footer-heading">Contact</h4>
            <ul>
              {settings?.locality && (
                <li className="flex gap-sm mt-sm">
                  <MapPin size={18} className="text-secondary" />
                  <span className="text-xs">{[settings.locality, settings.city].filter(Boolean).join(', ')}</span>
                </li>
              )}
              {(settings?.phone || settings?.secondary_phone) && (
                <li className="flex gap-sm mt-sm">
                  <Phone size={18} className="text-secondary" />
                  <span className="text-xs">
                    {settings.phone && (
                      <a href={`tel:${settings.phone.replace(/[\s+()\-]/g, '')}`} style={{ color: 'inherit' }}>{settings.phone}</a>
                    )}
                    {settings.phone && settings.secondary_phone && ' | '}
                    {settings.secondary_phone && (
                      <a href={`tel:${settings.secondary_phone.replace(/[\s+()\-]/g, '')}`} style={{ color: 'inherit' }}>{settings.secondary_phone}</a>
                    )}
                  </span>
                </li>
              )}
              {settings?.email && (
                <li className="flex gap-sm mt-sm">
                  <Mail size={18} className="text-secondary" />
                  <span className="text-xs">
                    <a href={`mailto:${settings.email}`} style={{ color: 'inherit' }}>{settings.email}</a>
                  </span>
                </li>
              )}
            </ul>
          </div>

          {(settings?.instagram_url || settings?.facebook_url) && (
            <div className="footer-social">
              <h4 className="footer-heading">Follow Us</h4>
              <div className="social-icons flex gap-md mt-sm">
                {settings.instagram_url && (
                  <a href={settings.instagram_url} aria-label="Instagram" target="_blank" rel="noopener noreferrer">Instagram</a>
                )}
                {settings.facebook_url && (
                  <a href={settings.facebook_url} aria-label="Facebook" target="_blank" rel="noopener noreferrer">Facebook</a>
                )}
              </div>
            </div>
          )}

          <div className="footer-map" style={{ width: '100%', maxWidth: '300px' }}>
            <h4 className="footer-heading">Find Us</h4>
            <a 
              href={settings?.google_maps_url || "https://www.google.com/maps/dir/?api=1&destination=Shrimati+Jewellers,+Uluberia,+West+Bengal"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
              style={{ borderRadius: '8px', overflow: 'hidden', height: '160px', marginTop: '12px', display: 'block', position: 'relative', cursor: 'pointer' }}
            >
              {/* Overlay to intercept clicks */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}></div>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.5338200082797!2d88.10033347507449!3d22.46807697956633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0287004bcc64ed%3A0x3dbab5a853007921!2sShrimati%20Jewellers!5e1!3m2!1sen!2sin!4v1791055135545!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0, pointerEvents: 'none' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="strict-origin-when-cross-origin"
                title={`${settings?.store_name || 'Store'} Location Map`}
              ></iframe>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="text-xs text-muted">&copy; {new Date().getFullYear()} {settings?.store_name || 'Srimati Jewelers'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

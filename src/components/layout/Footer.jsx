import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="font-bengali text-3xl font-bold">শ্রীমতী</span>
              <span className="text-sm tracking-wider mt-sm">Jewelers</span>
            </Link>
            <p className="mt-md text-sm text-muted">
              Timeless craft. Modern elegance. Discover thoughtfully crafted jewelry collections.
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
              <li className="flex gap-sm mt-sm">
                <MapPin size={18} className="text-secondary" />
                <span className="text-sm">Uluberia, Nona, Howrah</span>
              </li>
              <li className="flex gap-sm mt-sm">
                <Phone size={18} className="text-secondary" />
                <span className="text-sm">92422 76397 | 80018 76397</span>
              </li>
              <li className="flex gap-sm mt-sm">
                <Mail size={18} className="text-secondary" />
                <span className="text-sm">info@srimatijewelers.com</span>
              </li>
            </ul>
          </div>

          <div className="footer-social">
            <h4 className="footer-heading">Follow Us</h4>
            <div className="social-icons flex gap-md mt-sm">
              <a href="#" aria-label="Instagram">Instagram</a>
              <a href="#" aria-label="Facebook">Facebook</a>
            </div>
          </div>

          <div className="footer-map" style={{ width: '100%', maxWidth: '300px' }}>
            <h4 className="footer-heading">Find Us</h4>
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=Shrimati+Jewellers,+Uluberia,+West+Bengal" 
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
                title="Store Location Map"
              ></iframe>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="text-sm text-muted">&copy; {new Date().getFullYear()} Srimati Jewelers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

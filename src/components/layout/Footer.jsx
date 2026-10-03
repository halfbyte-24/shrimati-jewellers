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
        </div>

        <div className="footer-bottom">
          <p className="text-sm text-muted">&copy; {new Date().getFullYear()} Srimati Jewelers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

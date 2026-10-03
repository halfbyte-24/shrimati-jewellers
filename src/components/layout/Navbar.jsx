import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/collections' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header className={`navbar ${isHome ? 'navbar-transparent' : 'navbar-solid'}`}>
      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="font-bengali text-2xl font-bold">শ্রীমতী</span>
          <span className="navbar-logo-sub text-sm">Jewelers</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-links hidden-md">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="navbar-actions hidden-md">
          <button className="icon-btn" aria-label="Search">
            <Search size={20} />
          </button>
          <Link to="/contact" className="btn btn-outline">Enquire Now</Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle hidden-md-up"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu hidden-md-up">
          <nav className="mobile-nav">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="mobile-actions mt-lg">
              <Link to="/contact" className="btn btn-primary w-full text-center" onClick={() => setIsMobileMenuOpen(false)}>
                Enquire Now
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

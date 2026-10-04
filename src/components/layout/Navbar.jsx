import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import brandLogo from '../../assets/logo.jpeg';
import './Navbar.css';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/collections' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header className="navbar navbar-golden">
      <div className="container navbar-container">
        {/* Official Brand Logo */}
        <Link 
          to="/" 
          className="navbar-logo" 
          aria-label="Srimati Jewelers — Home"
        >
          <img 
            src={brandLogo} 
            alt="Srimati Jewelers" 
            className="navbar-logo-img"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-links hidden-md">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`nav-link ${location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path)) ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="navbar-actions hidden-md">
          <form 
            onSubmit={(e) => { 
              e.preventDefault(); 
              const val = e.target.q?.value?.trim(); 
              if(val) {
                navigate(`/collections?q=${encodeURIComponent(val)}`); 
                setIsSearchOpen(false);
              }
            }} 
            className="flex items-center gap-xs"
          >
            {isSearchOpen && (
              <input 
                name="q"
                type="text" 
                placeholder="Search..." 
                className="navbar-search-input"
                autoFocus
                onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
              />
            )}
            <button 
              type={isSearchOpen ? "submit" : "button"} 
              className="icon-btn" 
              aria-label="Search"
              onClick={() => {
                if (!isSearchOpen) setIsSearchOpen(true);
              }}
            >
              <Search size={18} />
            </button>
          </form>
          <Link to="/contact" className="btn btn-enquire">Enquire Now</Link>
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
              <Link to="/contact" className="btn btn-enquire w-full text-center" onClick={() => setIsMobileMenuOpen(false)}>
                Enquire Now
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

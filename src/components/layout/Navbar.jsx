import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import brandLogo from '../../assets/logo.jpeg';
import './Navbar.css';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Reset logo clicks after 3 seconds of inactivity
  useEffect(() => {
    if (logoClicks > 0 && logoClicks < 7) {
      const timer = setTimeout(() => setLogoClicks(0), 3000);
      return () => clearTimeout(timer);
    }
  }, [logoClicks]);

  const handleLogoClick = (e) => {
    const newCount = logoClicks + 1;
    if (newCount >= 7) {
      e.preventDefault(); // Prevent navigating to "/"
      setLogoClicks(0);
      navigate('/admin');
    } else {
      setLogoClicks(newCount);
    }
  };

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
          onClick={handleLogoClick}
        >
          <img 
            src={brandLogo} 
            alt="Srimati Jewelers" 
            className="navbar-logo-img"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-links desktop-only">
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
        <div className="navbar-actions desktop-only">
          <button className="icon-btn" aria-label="Search">
            <Search size={20} />
          </button>
          <Link to="/contact" className="btn btn-outline">Enquire Now</Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle mobile-only"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
          style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu mobile-only">
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

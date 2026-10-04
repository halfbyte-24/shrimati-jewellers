import React, { useState } from 'react';
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const val = e.target.q?.value?.trim();

    if (val) {
      navigate(`/collections?q=${encodeURIComponent(val)}`);
      setIsSearchOpen(false);
    }
  };

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

        {/* Desktop Navigation */}
        <nav className="navbar-links desktop-only">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`nav-link ${
                location.pathname === link.path ||
                (
                  link.path !== '/' &&
                  location.pathname.startsWith(link.path)
                )
                  ? 'active'
                  : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="navbar-actions desktop-only">

          {/* Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-xs"
          >
            {isSearchOpen && (
              <input
                name="q"
                type="text"
                placeholder="Search..."
                className="navbar-search-input"
                autoFocus
                onBlur={() =>
                  setTimeout(() => setIsSearchOpen(false), 200)
                }
              />
            )}

            <button
              type={isSearchOpen ? 'submit' : 'button'}
              className="icon-btn"
              aria-label="Search"
              onClick={() => {
                if (!isSearchOpen) {
                  setIsSearchOpen(true);
                }
              }}
            >
              <Search size={20} />
            </button>
          </form>

          {/* Enquire */}
          <Link
            to="/contact"
            className="btn btn-outline"
          >
            Enquire Now
          </Link>

        </div>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle mobile-only"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
          aria-expanded={isMobileMenuOpen}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {isMobileMenuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
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
              <Link
                to="/contact"
                className="btn btn-enquire w-full text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Enquire Now
              </Link>
            </div>

          </nav>
        </div>
      )}

    </header>
  );
}
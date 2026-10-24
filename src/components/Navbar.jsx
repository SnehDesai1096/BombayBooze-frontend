import React, { useState, useEffect } from 'react';
import { ShoppingCart, LogOut, MapPin, Menu, X, Store, User as UserIcon } from 'lucide-react';
import { useApp } from '../context/AppProvider';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, logout, getCartItemsCount } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/store" className="nav-brand" onClick={() => setMobileMenuOpen(false)}>
          <img src="/logo.png" alt="BombayBooze Logo" className="nav-brand-img" />
          <span className="nav-brand-text">Bombay<span>Booze</span></span>
        </Link>

        {/* Location Badge (Desktop/Tablet) */}
        <div className="nav-location-badge">
          <MapPin size={16} color="var(--accent)" />
          <span>Deliver to <strong>Mumbai</strong></span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="nav-links desktop-only">
          <Link to="/store" className={`nav-link ${location.pathname === '/store' ? 'active' : ''}`}>
             Store
          </Link>

          <Link to="/checkout" className={`nav-link ${location.pathname === '/checkout' ? 'active' : ''}`} style={{ position: 'relative' }}>
            <ShoppingCart size={20} />
            Cart
            {getCartItemsCount() > 0 && (
              <span className="cart-badge">{getCartItemsCount()}</span>
            )}
          </Link>

          {user ? (
            <button 
              className="btn-secondary nav-logout-btn"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn-primary nav-signin-btn">
              Sign In
            </Link>
          )}

          <ThemeToggle />
        </div>

        {/* Mobile Action Controls */}
        <div className="mobile-actions">
          <Link to="/checkout" className="mobile-cart-link" aria-label="View Cart">
            <ShoppingCart size={22} />
            {getCartItemsCount() > 0 && (
              <span className="cart-badge">{getCartItemsCount()}</span>
            )}
          </Link>

          <ThemeToggle className="mobile-theme-toggle" />

          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay Drawer */}
      <div className={`mobile-menu-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <div className="mobile-location-badge">
            <MapPin size={18} color="var(--accent)" />
            <span>Delivering to <strong>Mumbai</strong></span>
          </div>

          <div className="mobile-nav-links">
            <Link 
              to="/store" 
              className={`mobile-nav-link ${location.pathname === '/store' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Store size={20} />
              Store
            </Link>

            <Link 
              to="/checkout" 
              className={`mobile-nav-link ${location.pathname === '/checkout' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingCart size={20} />
              Cart ({getCartItemsCount()})
            </Link>

            {user ? (
              <button 
                className="btn-secondary mobile-logout-btn"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Logout ({user.name || 'User'})
              </button>
            ) : (
              <Link 
                to="/login" 
                className="btn-primary mobile-signin-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserIcon size={18} />
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}


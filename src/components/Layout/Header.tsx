import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, ChevronDown, Zap } from 'lucide-react';
import { internalLinks } from '../../constants/seoData';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const categories = ['Dasar', 'Optimasi', 'Dokumen', 'Kreatif'] as const;

  return (
    <header className="top-nav">
      <Link to="/" className="nav-logo">
        <div className="logo-container" style={{ width: 40, height: 40, borderRadius: 10 }}>
          <Zap size={24} className="logo-icon" />
        </div>
        <span className="gradient-text">Soto Converter</span>
      </Link>

      <nav className="nav-menu">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Beranda</Link>
        
        {categories.map(cat => (
          <div key={cat} className="nav-item-dropdown">
            <span className="nav-link nav-title">
              {cat} <ChevronDown size={14} />
            </span>
            <div className="dropdown-menu">
              {internalLinks.filter(l => l.category === cat).map(link => (
                <Link key={link.path} to={link.path} className="dropdown-item">
                  <link.icon size={18} style={{ marginRight: 10, opacity: 0.7 }} />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
        
        <Link to="/wordpress-plugin" className={`nav-link ${location.pathname === '/wordpress-plugin' ? 'active' : ''}`}>WP Plugin</Link>
      </nav>

      <div className="right-controls">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link to="/" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Beranda</Link>
        {categories.map(cat => (
          <div key={cat}>
            <div className="mobile-link" style={{ background: 'transparent', borderBottom: '1px solid var(--glass-border)', borderRadius: 0 }}>
              {cat}
            </div>
            <div className="mobile-submenu">
              {internalLinks.filter(l => l.category === cat).map(link => (
                <Link key={link.path} to={link.path} className="mobile-sublink" onClick={() => setIsMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
        <Link to="/wordpress-plugin" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>WordPress Plugin</Link>
      </div>
    </header>
  );
};

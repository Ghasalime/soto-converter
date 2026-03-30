import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, ChevronDown, Rocket } from 'lucide-react';
import { internalLinks } from '../../constants/seoData';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const LOGO_URL = "https://cdn-berjuang.ghasali.id/wp-content/uploads/2026/03/sotoconvert_Soto-Converter-Logo.webp";
  const categories = ['Dasar', 'Optimasi', 'Dokumen', 'Kreatif'] as const;

  return (
    <header className="top-nav-premium">
      <div className="nav-container">
        <div className="nav-content">
          <Link to="/" className="nav-logo-premium" onClick={() => setIsMobileMenuOpen(false)}>
            <img 
              src={LOGO_URL} 
              alt="Soto Converter" 
              className="header-logo-img"
            />
            <div className="logo-text-stack">
              <span className="brand-name">Soto Converter</span>
              <span className="brand-tagline">Cloud-Native Processing</span>
            </div>
          </Link>

          <nav className="nav-menu-premium">
            <Link to="/" className={`nav-link-premium ${location.pathname === '/' ? 'active' : ''}`}>Beranda</Link>
            
            {categories.map(cat => (
              <div key={cat} className="nav-item-dropdown-premium">
                <span className="nav-link-premium">
                  {cat} <ChevronDown size={14} className="dropdown-chevron" />
                </span>
                <div className="dropdown-menu-premium">
                  <div className="dropdown-grid">
                    {internalLinks.filter(l => l.category === cat).map(link => (
                      <Link key={link.path} to={link.path} className="dropdown-item-premium">
                        <div className="item-icon-wrapper">
                          <link.icon size={18} />
                        </div>
                        <div className="item-text">
                          <span className="item-label">{link.label}</span>
                          <span className="item-desc">Konversi {link.label} instan</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            <Link to="/wordpress-plugin" className={`nav-link-premium wp-plugin-btn ${location.pathname === '/wordpress-plugin' ? 'active' : ''}`}>
              <Rocket size={16} /> <span>WP Plugin</span>
            </Link>
          </nav>

          <div className="right-controls-premium">
            <button className="theme-toggle-premium" onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button className="mobile-menu-toggle-premium" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-nav-overlay-premium ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-content">
          <Link to="/" className="mobile-link-premium" onClick={() => setIsMobileMenuOpen(false)}>Beranda</Link>
          {categories.map(cat => (
            <div key={cat} className="mobile-section">
              <div className="mobile-section-title">{cat}</div>
              <div className="mobile-submenu-premium">
                {internalLinks.filter(l => l.category === cat).map(link => (
                  <Link key={link.path} to={link.path} className="mobile-sublink-premium" onClick={() => setIsMobileMenuOpen(false)}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <Link to="/wordpress-plugin" className="mobile-link-premium cta-premium-mobile" onClick={() => setIsMobileMenuOpen(false)}>
            <Rocket size={20} /> WordPress Plugin
          </Link>
        </div>
      </div>
    </header>
  );
};

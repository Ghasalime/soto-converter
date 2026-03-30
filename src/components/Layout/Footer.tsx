import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, CheckCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const LOGO_URL = "https://cdn-berjuang.ghasali.id/wp-content/uploads/2026/03/sotoconvert_Soto-Converter-Logo.webp";

  return (
    <footer className="footer-premium">
      <div className="footer-main-grid">
        <div className="footer-brand-section">
          <Link to="/" className="footer-logo-premium">
            <img 
              src={LOGO_URL} 
              alt="Soto Converter" 
              style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover' }} 
            />
            <span className="brand-name">Soto Converter</span>
          </Link>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', maxWidth: 300 }}>
            Solusi pemrosesan media batch terpintar di Indonesia. 100% aman, privat, dan berjalan sepenuhnya di browser Anda.
          </p>
          <div className="social-stack">
            <a href="#" className="social-pill">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              <span>Github</span>
            </a>
            <a href="#" className="social-pill">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              <span>Twitter</span>
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Peralatan Utama</h4>
          <div className="footer-links-premium">
            <Link to="/">WebP Converter</Link>
            <Link to="/jpg-to-png">JPG to PNG</Link>
            <Link to="/heic-to-jpg">HEIC to JPG</Link>
            <Link to="/image-compressor">Kompres Gambar</Link>
          </div>
        </div>

        <div className="footer-col">
          <h4>Resource</h4>
          <div className="footer-links-premium">
            <Link to="/wordpress-plugin">WordPress Plugin</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-use">Terms of Service</Link>
          </div>
        </div>

        <div className="footer-col">
          <h4>Dukungan</h4>
          <div className="footer-links-premium">
            <a href="mailto:support@sotoconverter.id">Email Helpdesk</a>
            <a href="#">Dokumentasi API</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="nav-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            © {currentYear} Soto Converter. Proudly made in 🇮🇩
          </div>
          <div className="trust-badge-container">
            <div className="trust-badge"><Shield size={16} /> <span>100% Privat</span></div>
            <div className="trust-badge"><Lock size={16} /> <span>End-to-End Encryption</span></div>
            <div className="trust-badge"><CheckCircle size={16} /> <span>Open Source</span></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

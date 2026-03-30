import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, Globe, Link2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-glass">
      <div className="footer-content">
        <div className="footer-cols">
          <div className="footer-col">
            <div className="nav-logo" style={{ marginBottom: 20 }}>
              <Zap size={24} className="logo-icon" />
              <span className="gradient-text">Soto Converter</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: 24 }}>
              Solusi konversi media batch yang aman, cepat, dan 100% berjalan di browser Anda. Kami tidak pernah mengunggah file Anda ke server.
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              <a href="#" className="icon-btn" aria-label="Github"><Link2 size={20} /></a>
              <a href="#" className="icon-btn" aria-label="Twitter"><Link2 size={20} /></a>
              <a href="#" className="icon-btn" aria-label="Facebook"><Link2 size={20} /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Alat Populer</h4>
            <div className="footer-links">
              <Link to="/">WebP Converter</Link>
              <Link to="/jpg-to-png">JPG to PNG</Link>
              <Link to="/heic-to-jpg">HEIC to JPG</Link>
              <Link to="/image-compressor">Kompres Gambar</Link>
              <Link to="/pdf-to-image">PDF to Image</Link>
            </div>
          </div>

          <div className="footer-col">
            <h4>Perusahaan</h4>
            <div className="footer-links">
              <Link to="/wordpress-plugin">WordPress Plugin</Link>
              <Link to="/privacy-policy">Kebijakan Privasi</Link>
              <Link to="/terms-of-use">Syarat Penggunaan</Link>
              <a href="mailto:support@sotoconverter.id">Hubungi Kami</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>© {currentYear} Soto Converter. Dibuat dengan ❤️ di Indonesia.</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Shield size={14} /> Aman & Privat</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Globe size={14} /> 100% Offline</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

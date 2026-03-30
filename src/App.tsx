import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';
import { ConverterPage } from './components/Converter/ConverterPage';
import { PrivacyPolicy, TermsOfUse, WordPressPlugin, ApiDocs } from './components/Pages/StaticPages';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import './index.css';

type ThemeMode = 'light' | 'dark';

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ', r);
      if (r) {
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="pwa-toast animate-slide-up" role="alert" style={{
      position: 'fixed', right: 24, bottom: 24, zIndex: 1000, padding: 24, borderRadius: 20,
      background: 'var(--glass-bg)', backdropFilter: 'blur(16px)', border: '1px solid var(--glass-border)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 350
    }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--icon-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
          <RefreshCw size={24} className={needRefresh ? 'spinning' : ''} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
            {offlineReady ? 'Siap Digunakan Offline' : 'Pembaruan Tersedia'}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4 }}>
            {offlineReady ? 'Aplikasi telah diunduh dan bisa diakses tanpa internet.' : 'Versi terbaru tersedia dengan fitur dan perbaikan baru.'}
          </div>
        </div>
        <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', alignSelf: 'flex-start' }}>
          <X size={20} />
        </button>
      </div>
      
      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        {needRefresh && (
          <button className="primary-btn" style={{ padding: '10px 20px', fontSize: '0.9rem' }} onClick={() => updateServiceWorker(true)}>
            Update Sekarang
          </button>
        )}
        <button className="secondary-btn" style={{ padding: '10px 20px', fontSize: '0.9rem' }} onClick={close}>
          Tutup
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('light');
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('sotoweb-theme') as ThemeMode | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('sotoweb-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <HelmetProvider>
      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="app-main">
        <Routes>
          <Route path="/privacy-policy" element={<PrivacyPolicy theme={theme} toggleTheme={toggleTheme}/>} />
          <Route path="/terms-of-use" element={<TermsOfUse theme={theme} toggleTheme={toggleTheme}/>} />
          <Route path="/wordpress-plugin" element={<WordPressPlugin theme={theme} toggleTheme={toggleTheme}/>} />
          <Route path="/api-docs" element={<ApiDocs theme={theme} toggleTheme={toggleTheme}/>} />
          <Route path="/image-upscaler" element={<ConverterPage theme={theme} toggleTheme={toggleTheme}/>} />
          <Route path="/image-editor" element={<ConverterPage theme={theme} toggleTheme={toggleTheme}/>} />
          <Route path="*" element={<ConverterPage theme={theme} toggleTheme={toggleTheme}/>} />
        </Routes>
      </main>
      <Footer />
      <ReloadPrompt />
    </HelmetProvider>
  );
}

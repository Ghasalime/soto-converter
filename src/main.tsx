import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { registerSW } from 'virtual:pwa-register'
import App from './App.tsx'
import './index.css'

// Check for SW updates every 10 minutes
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("Versi terbaru soto.web.id tersedia. Segarkan halaman sekarang?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App siap untuk penggunaan offline.');
  },
});

// Periodic update check
setInterval(() => {
  updateSW();
}, 600000); // 10 minutes

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { UploadCloud, Settings2, Download, RefreshCw, CheckCircle2, ChevronRight, Moon, Sun, X, Archive, Plus, ChevronDown, ShieldCheck, Zap, Menu, FileText, Lock, Scissors, Wand2, SlidersHorizontal, Gift, Rocket } from 'lucide-react';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import heic2any from 'heic2any';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { removeBackground } from '@imgly/background-removal';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './index.css';

type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif' | 'image/gif' | 'image/bmp';
type ThemeMode = 'light' | 'dark';
type GlobalStatus = 'idle' | 'processing' | 'success' | 'parsing' | 'error';

interface FileItem {
  id: string;
  file: File;
  previewUrl: string;
  status: 'idle' | 'processing' | 'success' | 'error';
  resultUrl?: string;
  resultSize?: number;
  resultBlob?: Blob;
}

const formatExtensions: Record<ImageFormat, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
  'image/bmp': 'bmp'
};

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024, dm = decimals < 0 ? 0 : decimals, sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const seoConfig = {
  '/': {
    title: 'Soto Converter - Konversi Harian Segala Ekstensi Secara Lokal',
    desc: 'Ubah format PNG, JPG, WEBP, AVIF, HEIC, GIF sesuka Anda. Aplikasi murni berjalan tanpa mengunggah ke server manapun.',
    h1: 'Soto Converter Universal',
    subText: 'Ubah format segala gambar - Dukungan Next-Gen AVIF & HEIC iOS 🚀',
    defaultTarget: 'image/webp' as ImageFormat
  },
  '/png-to-webp': {
    title: 'Convert PNG to WEBP Cepat & Gratis | Soto Converter',
    desc: 'Ubah gambar PNG berukuran besar Anda menjadi format WEBP modern secara instan dan tanpa mengorbankan kualitas transparansi.',
    h1: 'Convert PNG to WEBP',
    subText: 'Kurangi ukuran gambar Anda tanpa mengorbankan transparansinya 🔥',
    defaultTarget: 'image/webp' as ImageFormat
  },
  '/jpg-to-webp': {
    title: 'Convert JPG to WEBP Tercepat | Soto Converter',
    desc: 'Buat situs web Anda lebih cepat dengan mengonversi foto JPEG lama ke dalam format Next-Gen WEBP secara gratis dan masal.',
    h1: 'Convert JPG to WEBP',
    subText: 'Ubah JPEG jadul Anda ke format gambar situs modern yang ringan 🚀',
    defaultTarget: 'image/webp' as ImageFormat
  },
  '/webp-to-png': {
    title: 'Convert WEBP ke PNG Berkualitas | Soto Converter',
    desc: 'Ubah file WEBP Anda kembali ke format PNG standar. Ekstrak gambar webp Anda tanpa menghilangkan fitur transparan.',
    h1: 'Convert WEBP to PNG',
    subText: 'Kembalikan WebP transparan ke format PNG standar universal 🎨',
    defaultTarget: 'image/png' as ImageFormat
  },
  '/jpg-to-png': {
    title: 'Konversi JPG to PNG Lengkap | Soto Converter',
    desc: 'Ingin mengubah file JPG menjadi format gambar standar PNG? Gunakan Soto Converter secara gratis dan tanpa batas.',
    h1: 'Convert JPG to PNG',
    subText: 'Konversi lossy JPG Anda untuk standar transparansi berlapis PNG.',
    defaultTarget: 'image/png' as ImageFormat
  },
  '/png-to-avif': {
    title: 'Convert PNG to AVIF Terbaik | Soto Converter',
    desc: 'Ubah gambar PNG Anda menjadi format mutakhir AVIF dengan tingkat kompresi luar biasa. Tidak memerlukan instalasi server.',
    h1: 'Convert PNG to AVIF',
    subText: 'Tekan bandwidth server semaksimal mungkin dengan beralih ke AVIF 😎',
    defaultTarget: 'image/avif' as ImageFormat
  },
  '/jpg-to-avif': {
    title: 'Convert JPG to AVIF Ultra Cepat | Soto Converter',
    desc: 'Konverter dari file foto berat JPEG ke arsitektur terbaru AVIF untuk menghemat ruang penyimpanan. Semuanya lokal di browser.',
    h1: 'Convert JPG to AVIF',
    subText: 'Pangkas gigabyte ukuran foto JPEG jadul menjadi lebih efisien dengan ekstensi AVIF.',
    defaultTarget: 'image/avif' as ImageFormat
  },
  '/heic-to-jpg': {
    title: 'Ubah Foto iPhone HEIC ke JPG (Bisa Banyak) | Soto Converter',
    desc: 'Ekstrak foto HEIC eksklusif Apple iPhone menjadi JPG Universal. Kami pakai library canggih heic2any di dalam browser Anda.',
    h1: 'Convert HEIC/iPhone to JPG',
    subText: 'Seret foto HEIC/HEIF dari iPhone Anda, otomatis akan kami tembus parsing menjadi JPG standar 🍎',
    defaultTarget: 'image/jpeg' as ImageFormat
  },
  '/heic-to-png': {
    title: 'Ubah HEIC ke PNG Tanpa Batas | Soto Converter',
    desc: 'Mengonversi gambar iOS (HEIC) ke dalam standar PNG. Alat murni offline yang tidak mencuri rahasia foto pribadi Anda!',
    h1: 'Convert HEIC/iPhone to PNG',
    subText: 'Satu-satunya konverter HEIC lokal tanpa unggah demi melindungi privasi Anda sepenuhnya 🛡️',
    defaultTarget: 'image/png' as ImageFormat
  },
  '/wordpress-plugin': {
    title: 'Download Soto WebP Converter - LinkedIn Plugin WordPress Gratis',
    desc: 'Plugin WordPress terbaik untuk optimasi gambar otomatis ke WebP. 100% Gratis, amankan privasi dengan pemrosesan Client-Side.',
    h1: 'Plugin WordPress: Soto WebP',
    subText: 'Optimalkan media WordPress Anda secepat kilat dengan format WebP murni dari browser.',
    defaultTarget: 'image/webp' as ImageFormat
  }
};

const internalLinks = [
  { path: '/png-to-webp', label: 'PNG to WEBP' },
  { path: '/jpg-to-webp', label: 'JPG to WEBP' },
  { path: '/webp-to-png', label: 'WEBP to PNG' },
  { path: '/jpg-to-png', label: 'JPG to PNG' },
  { path: '/png-to-avif', label: 'PNG to AVIF' },
  { path: '/jpg-to-avif', label: 'JPG to AVIF' },
  { path: '/heic-to-jpg', label: 'HEIC to JPG' },
  { path: '/heic-to-png', label: 'HEIC to PNG' },
];

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

function StudioEditor({ 
  fileItem, 
  onSave 
}: { 
  fileItem: FileItem, 
  onSave: (url: string) => void 
}) {
  const [activeTab, setActiveTab] = useState<'crop' | 'compare' | 'bg'>('crop');
  
  // Crop state
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<any>();
  
  // BG state
  const [isBgLoading, setIsBgLoading] = useState(false);
  const [bgRemovedUrl, setBgRemovedUrl] = useState<string | null>(null);

  // Compare state
  const [compareUrl, setCompareUrl] = useState<string | null>(null);

  const generateComparePreview = async () => {
      const img = new Image();
      img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob(b => {
             if (b) setCompareUrl(URL.createObjectURL(b));
          }, 'image/webp', 0.2); // hardcore compression to see difference
      };
      img.src = fileItem.previewUrl;
  };

  useEffect(() => {
     if (activeTab === 'compare' && !compareUrl) {
        generateComparePreview();
     }
  }, [activeTab]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  };

  const setCropPreset = (ratio: number) => {
    if (imgRef.current) {
       setCrop(centerAspectCrop(imgRef.current.width, imgRef.current.height, ratio));
    }
  };

  const handleApplyCrop = async () => {
     if (!completedCrop || !imgRef.current) return;
     const canvas = document.createElement('canvas');
     const image = imgRef.current;
     const scaleX = image.naturalWidth / image.width;
     const scaleY = image.naturalHeight / image.height;
     canvas.width = completedCrop.width * scaleX;
     canvas.height = completedCrop.height * scaleY;
     const ctx = canvas.getContext('2d');
     if (!ctx) return;
     
     ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0, 0,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY
     );
     canvas.toBlob(blob => {
        if(blob) {
            onSave(URL.createObjectURL(blob));
        }
     });
  };

  const handleRemoveBg = async () => {
     setIsBgLoading(true);
     try {
         const blob = await removeBackground(fileItem.previewUrl);
         const url = URL.createObjectURL(blob);
         setBgRemovedUrl(url);
     } catch (err) {
         alert("Gagal menghapus background. Pastikan koneksi stabil (Model AI butuh diunduh jika ini yang pertama kali).");
     }
     setIsBgLoading(false);
  };

  return (
    <div className="studio-editor-container">
      <div className="studio-tabs">
        <button className={`tab-btn ${activeTab === 'crop' ? 'active' : ''}`} onClick={() => setActiveTab('crop')}>
          <Scissors size={18}/> Crop & Trim
        </button>
        <button className={`tab-btn ${activeTab === 'compare' ? 'active' : ''}`} onClick={() => setActiveTab('compare')}>
          <SlidersHorizontal size={18}/> Live Compare
        </button>
        <button className={`tab-btn ${activeTab === 'bg' ? 'active' : ''}`} onClick={() => setActiveTab('bg')}>
          <Wand2 size={18}/> AI BG Eraser
        </button>
      </div>

      <div className="studio-content">
            <div className="crop-tab">
               <div className="crop-presets" style={{display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none'}}>
                  <button className="secondary-btn" style={{whiteSpace: 'nowrap'}} onClick={() => setCropPreset(1)}>1:1 Square</button>
                  <button className="secondary-btn" style={{whiteSpace: 'nowrap'}} onClick={() => setCropPreset(16/9)}>16:9 Video</button>
                  <button className="secondary-btn" style={{whiteSpace: 'nowrap'}} onClick={() => setCropPreset(9/16)}>9:16 Story</button>
                  <button className="secondary-btn" style={{whiteSpace: 'nowrap'}} onClick={() => setCropPreset(4/5)}>4:5 Post</button>
               </div>
               <div className="crop-area" style={{maxHeight: '60vh', overflow: 'auto', background: 'var(--surface)', borderRadius: 16, padding: 12, border: '1px solid var(--glass-border)'}}>
                 <ReactCrop
                   crop={crop}
                   onChange={(_, percentCrop) => setCrop(percentCrop)}
                   onComplete={(c) => setCompletedCrop(c)}
                 >
                   <img ref={imgRef} src={fileItem.previewUrl} onLoad={onImageLoad} alt="Crop preview" style={{maxHeight: '400px', width: 'auto'}} />
                 </ReactCrop>
               </div>
               <button className="primary-btn" style={{marginTop: 16, width: '100%', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)'}} onClick={handleApplyCrop}>Terapkan & Simpan Hasil</button>
            </div>
         
          {activeTab === 'compare' && (
            <div className="compare-tab">
               <p style={{marginBottom: 16, color: 'var(--text-secondary)', fontSize: '0.9rem'}}>Geser pemisah untuk membandingkan kualitas foto asli dan kompresi (WEBP Low).</p>
               {compareUrl ? (
                 <div style={{height: 'clamp(250px, 50vh, 400px)', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--glass-border)'}}>
                   <ReactCompareSlider
                     itemOne={<ReactCompareSliderImage src={fileItem.previewUrl} alt="Original" />}
                     itemTwo={<ReactCompareSliderImage src={compareUrl} alt="Compressed" />}
                   />
                 </div>
               ) : (
                 <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300}}>
                    <RefreshCw className="spinning text-accent" size={32} />
                 </div>
               )}
            </div>
          )}

         {activeTab === 'bg' && (
           <div className="bg-tab" style={{textAlign: 'center', padding: '20px 0'}}>
              {bgRemovedUrl ? (
                 <>
                   <div style={{background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAOklEQVQYV2NkYGAwYcSPgX/ww1AGRoZEBlIAzRzKgAokbEIF0MyhDKhAwiZUAExTjD8iSUIFEE1iAQDqfQ1AEEsY7AAAAABJRU5ErkJggg==)', borderRadius: 12, display: 'inline-block'}}>
                     <img src={bgRemovedUrl} style={{maxHeight: 400, maxWidth: '100%'}} alt="No BG" />
                   </div>
                   <button className="primary-btn" style={{marginTop: 16, width: '100%'}} onClick={() => onSave(bgRemovedUrl)}>Terapkan & Simpan BG Baru</button>
                 </>
              ) : (
                 <>
                   <img src={fileItem.previewUrl} style={{maxHeight: 300, maxWidth: '100%', marginBottom: 20, borderRadius: 12}} alt="Original" />
                   {isBgLoading ? (
                     <div style={{color: 'var(--accent-color)', fontWeight: 'bold'}}>
                        <RefreshCw className="spinning" size={24} style={{marginBottom: 8}}/>
                        <p>AI Sedang Memproses (Mengunduh Model jika pertama kali)...</p>
                     </div>
                   ) : (
                     <button className="primary-btn" style={{width: '100%'}} onClick={handleRemoveBg}>
                        <Wand2 size={20}/> Mulai Hapus Background Otomatis
                     </button>
                   )}
                 </>
              )}
           </div>
         )}
      </div>
    </div>
  );
}

function TopNavigation({ theme, toggleTheme }: { theme: ThemeMode, toggleTheme: () => void }) {
  const loc = useLocation();
  const path = loc.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [loc.pathname]);

  return (
    <>
      <nav className="top-nav animate-fade-in">
        <Link to="/" className="nav-logo">
          <div className="logo-container" style={{ width: 32, height: 32, borderRadius: 8, boxShadow: 'none' }}>
            <img src="https://cdn-berjuang.ghasali.id/wp-content/uploads/2026/03/sotoconvert_Soto-Converter-Logo.webp" alt="Logo" style={{ width: '100%', height: '100%', borderRadius: 8 }} />
          </div>
          <span>Soto <span className="gradient-text">Converter</span></span>
        </Link>
        
        <div className="nav-menu">
          <Link to="/" className={`nav-link ${path === '/' ? 'active' : ''}`}>Beranda</Link>
          
          <div className="nav-item-dropdown">
            <div className="nav-link nav-title">
              Alat Populer <ChevronDown size={14} />
            </div>
            <div className="dropdown-menu">
              <Link to="/heic-to-jpg" className="dropdown-item">Apple HEIC ke JPG</Link>
              <Link to="/png-to-avif" className="dropdown-item">PNG ke AVIF (Next-Gen)</Link>
              <Link to="/jpg-to-webp" className="dropdown-item">JPG ke WEBP (Web)</Link>
              <Link to="/webp-to-png" className="dropdown-item">WEBP ke PNG</Link>
            </div>
          </div>

          <Link to="/privacy-policy" className={`nav-link ${path === '/privacy-policy' ? 'active' : ''}`}>Privasi</Link>
          <Link to="/terms-of-use" className={`nav-link ${path === '/terms-of-use' ? 'active' : ''}`}>Ketentuan</Link>
          <Link to="/wordpress-plugin" className={`nav-link ${path === '/wordpress-plugin' ? 'active' : ''}`} style={{ color: 'var(--accent-color)', fontWeight: 700 }}>
             <Gift size={16} /> Plugin WP
          </Link>
        </div>

        <div className="right-controls">
          <button 
            className="theme-toggle" 
            onClick={toggleTheme} 
            title={`Ubah ke mode ${theme === 'light' ? 'Gelap' : 'Cerah'}`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-nav-overlay ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-content" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link to="/" className="mobile-link"><span>Beranda</span> <ChevronRight size={18} opacity={0.5} /></Link>
          <div className="mobile-link"><span>Alat Populer</span> <ChevronDown size={18} opacity={0.5} /></div>
          <div className="mobile-submenu">
             <Link to="/heic-to-jpg" className="mobile-sublink">HEIC ke JPG</Link>
             <Link to="/png-to-avif" className="mobile-sublink">PNG ke AVIF</Link>
             <Link to="/jpg-to-webp" className="mobile-sublink">JPG ke WEBP</Link>
          </div>
          <Link to="/privacy-policy" className="mobile-link"><span>Privasi</span> <ChevronRight size={18} opacity={0.5} /></Link>
          <Link to="/terms-of-use" className="mobile-link"><span>Ketentuan</span> <ChevronRight size={18} opacity={0.5} /></Link>
          <Link to="/wordpress-plugin" className="mobile-link" style={{ background: 'var(--primary-gradient)', color: 'white', marginTop: 8, boxShadow: 'var(--shadow-glow)' }}>
              <span>Download Plugin WP</span>
              <Gift size={20} />
          </Link>
        </div>
      </div>
    </>
  );
}

function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="footer-links">
        <Link to="/privacy-policy">Privacy Policy</Link>
        <span className="separator">|</span>
        <Link to="/terms-of-use">Terms of Use</Link>
      </div>
      <div className="footer-copy">
        &copy; Copyright SotoWeb {new Date().getFullYear()} - 100% Secure Client-Side
      </div>
    </footer>
  );
}

function PrivacyPolicy({ theme, toggleTheme }: { theme: ThemeMode, toggleTheme: () => void }) {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Soto Converter</title>
        <meta name="description" content="Kebijakan Privasi Soto Converter. Kami menjamin 100% privasi karena seluruh pemrosesan gambar dilakukan secara lokal di perangkat Anda." />
      </Helmet>

      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>
      
      <TopNavigation theme={theme} toggleTheme={toggleTheme} />

      <main className="app-main">
         <div className="glass-panel legal-content animate-fade-in">
             <h1>Kebijakan Privasi (Privacy Policy)</h1>
             <p>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
             <br/>
             <h2>1. Privasi Anda Jaminan Kami</h2>
             <p>Soto Converter sepenuhnya menghargai privasi dan keamanan berkas Anda. Berbeda dengan layanan alat konversi daring (online) lainnya yang memindahkan file ke server jarak jauh, **kami tidak pernah mengumpulkan, mengunggah, menyimpan, atau mengirim gambar maupun file aset Anda ke server manapun**.</p>
             
             <h2>2. Pemrosesan Lokal Terisolasi (Client-Side)</h2>
             <p>Aplikasi ini secara khusus dirancang dengan teknologi <i>HTML5 Canvas</i> dan pemrosesan peramban asinkron (Client-Side). Seluruh beban komputasi konversi murni ditangani oleh prosesor komputer/ponsel (RAM) Anda sendiri. Gambar Anda tidak pernah meninggalkan perangkat Anda sedetik pun.</p>

             <h2>3. Pengumpulan Data Analytics & Cookies</h2>
             <p>Soto Converter dirangkai untuk bekerja dengan jejak digital setipis mungkin. Kami tidak menyuntikkan cookies pihak ketiga yang melacak aktivitas Anda secara agresif, dan sama sekali tidak mengakses data kamera, lokasi, kontak, atau media lainnya tanpa izin manual penyeretan/pemilihan gambar oleh pengguna sendiri.</p>

             <h2>4. Log Navigasi Web</h2>
             <p>Ketika Anda mengunjungi situs ini, penyedia hosting dasar kami (sebagai server penampil halaman web ini) secara otomatis mencatat informasi standar umum seperti alamat IP sementara dan tipe browser, semata-mata untuk mencegah serangan siber (DDoS) terhadap platform. Hal ini tidak terhubung dengan berkas pribadi yang Anda olah di dalam aplikasi.</p>

             <h2>5. Kontak Keselamatan & Dukungan</h2>
             <p>Jika Anda memiliki pertanyaan spesifik seputar keamanan teknis, transparansi pengelolaan platform kami, atau kebingungan terhadap syarat ini, silakan menembuskan rinciannya (menghubungi email pengembang kami langsung) di alamat: <a href="mailto:gmail@ghasali.id"><b>gmail@ghasali.id</b></a>.</p>
         </div>
      </main>

      <AppFooter />
    </>
  );
}

function TermsOfUse({ theme, toggleTheme }: { theme: ThemeMode, toggleTheme: () => void }) {
  return (
    <>
      <Helmet>
        <title>Terms of Use - Soto Converter</title>
        <meta name="description" content="Syarat dan Ketentuan Penggunaan Layanan Soto Converter." />
      </Helmet>

      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>
      
      <TopNavigation theme={theme} toggleTheme={toggleTheme} />

      <main className="app-main">
         <div className="glass-panel legal-content animate-fade-in">
             <h1>Syarat dan Ketentuan (Terms of Use)</h1>
             <p>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
             <br/>
             <h2>1. Penerimaan Syarat</h2>
             <p>Dengan mengakses atau menggunakan platform alat/utilitas Soto Converter, Anda sebagai pengunjung dianggap telah membaca, menyetujui, dan sepakat untuk tunduk di bawah seluruh ketentuan layanan yang dijabarkan dalam halaman ini secara tulus tanpa paksaan.</p>
             
             <h2>2. Layanan Disediakan Seadanya (As-Is Basis)</h2>
             <p>Soto Converter 100% ditawarkan sebagai alat bantu komunitas web secara gratis. Meskipun kami berusaha menanamkan teknologi terdepan standar industri (seperti konversi masif JSZip, Native Canvas AVIF, dan pembongkar format HEIC milik Apple), kami tidak memberikan jaminan kehandalan tanpa henti bahwa aplikasi ini akan senantiasa luput dari error. Kecepatan dan kompatibilitas pembacaan ekstensi amat bergantung sepenuhnya pada pembaruan atau kapabilitas web browser di masing-masing mesin Anda.</p>
             
             <h2>3. Larangan Penyalahgunaan Teknis</h2>
             <p>Situs ini sepenuhnya dibangun untuk pemanfaatan yang mempermudah produktivitas pribadi dan para penggiat *profesional*. Anda secara tegas dilarang membongkar rancangan struktur situs (Reverse engineer), mem-bypass lapisan perlindungan situs, berniat menyerang kerentanan server dengan muatan sampah (spamming), atau mengeksploitasi alat ini demi niatan jahat siber.</p>

             <h2>4. Hak Milik dan Tanggung Jawab Konten</h2>
             <p>Mengingat siklus pengerjaan file berlangsung secara tertutup 100% (Client-Side) pada perangkat keras milik pengguna, Anda bertanggung jawab secara hukum seorang diri terhadap cipta, karsa, dan segala subjek fotografi materi (copyrights) atau moralitas desain yang Anda seret kemudian ubah via platform kami. Soto Converter dibebaskan dari segala tuntutan hukum yang mencakup pelanggaran Hak Kekayaan Intelektual dari foto orang lain yang Anda unggah tanpa permisi.</p>

             <h2>5. Saluran Tanya Jawab & Kritik Elektronik</h2>
             <p>Apakah Anda memiliki pertanyaan lain atau menemukan celah kerentanan (Bug)? Silakan hantarkan tanggapan, masukan, gagasan, pelaporan, keluhan, fitur pesanan modifikasi, dan sapaan bersahabat lainnya melalui email satu pintu kami: <a href="mailto:gmail@ghasali.id"><b>gmail@ghasali.id</b></a>.</p>
         </div>
      </main>

      <AppFooter />
    </>
  );
}

function WordPressPlugin({ theme, toggleTheme }: { theme: ThemeMode, toggleTheme: () => void }) {
  return (
    <>
      <Helmet>
        <title>Soto WebP Converter - Plugin WordPress Gratis & Cepat</title>
        <meta name="description" content="Optimalkan gambar WordPress Anda secara otomatis menjadi WebP sebelum masuk ke Media Library. 100% Gratis, amankan privasi Anda." />
      </Helmet>

      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>
      
      <TopNavigation theme={theme} toggleTheme={toggleTheme} />

      <main className="app-main">
         <header className="app-header animate-fade-in">
           <div className="logo-container" style={{ marginBottom: 4, width: 80, height: 80 }}>
             <Rocket size={40} className="text-accent" />
           </div>
           <h1>Soto WebP <span className="gradient-text">Plugin</span></h1>
           <p>Optimalkan Website WordPress Anda dengan Sekali Klik.</p>
           
           <div className="layout-badges">
             <span className="feature-badge"><div className="dot"></div> Auto WebP</span>
             <span className="feature-badge"><div className="dot"></div> No Server Usage</span>
             <span className="feature-badge"><div className="dot"></div> Client-Side Processing</span>
           </div>
         </header>

         <div className="wp-feature-grid animate-fade-in" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', 
            gap: '20px', 
            marginBottom: '40px' 
         }}>
            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: 'var(--icon-bg)', width: '54px', height: '54px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                    <ShieldCheck size={28} className="text-accent" />
                </div>
                <h3 style={{ fontSize: '1.2rem' }}>Bebas Privasi</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>Gambar diproses murni di sisi browser (Client-Side) sebelum dikirim ke database WordPress Anda. Tidak ada data yang keluar ke server pihak ketiga.</p>
            </div>

            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: 'var(--icon-bg)', width: '54px', height: '54px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                    <Zap size={28} className="text-accent" />
                </div>
                <h3 style={{ fontSize: '1.2rem' }}>Otomatis WebP</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>Setiap kali Anda mengunggah gambar ke Media WordPress, plugin akan otomatis mengubahnya menjadi format WebP modern yang jauh lebih ringan.</p>
            </div>

            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: 'var(--icon-bg)', width: '54px', height: '54px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                    <Gift size={28} className="text-accent" />
                </div>
                <h3 style={{ fontSize: '1.2rem' }}>100% Gratis Selamanya</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>Nikmati fitur premium optimasi gambar tanpa biaya bulanan. Kami percaya pada keterbukaan dan performa web yang setara untuk semua.</p>
            </div>
         </div>

         <div className="glass-panel animate-fade-in" style={{ padding: 'clamp(32px, 8vw, 48px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
                <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '16px' }}>Siap Mempercepat WordPress Anda?</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>Download plugin Soto WebP Converter sekarang dan rasakan perbedaan kecepatan loading situs Anda tanpa menguras bandwidth server.</p>
                
                <a href="https://cdn-berjuang.ghasali.id/wp-content/uploads/2026/03/soto-webp-converter.zip" className="primary-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '16px 40px', fontSize: '1.1rem', borderRadius: '40px', maxWidth: 'fit-content', margin: '0 auto' }} download>
                    <Download size={22} /> Download (.zip)
                </a>
                
                <p style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Versi Terbaru - Kompatibel dengan WordPress 6.0+ & PHP 7.4+</p>
            </div>
            
            <div className="rocket-bg-icon" style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.05 }}>
                <Rocket size={300} />
            </div>
         </div>
      </main>

      <AppFooter />
    </>
  );
}

function ConverterPage({ theme, toggleTheme }: { theme: ThemeMode, toggleTheme: () => void }) {
  const location = useLocation();
  const currentPath = seoConfig[location.pathname as keyof typeof seoConfig] ? location.pathname : '/';
  const pageSEO = seoConfig[currentPath as keyof typeof seoConfig];

  const [files, setFiles] = useState<FileItem[]>([]);
  const [globalStatus, setGlobalStatus] = useState<GlobalStatus>('idle');
  const [targetFormat, setTargetFormat] = useState<ImageFormat>(pageSEO.defaultTarget);
  const [quality, setQuality] = useState(0.8);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Advanced Pro Features State
  const [resizeWidth, setResizeWidth] = useState('');
  const [resizeHeight, setResizeHeight] = useState('');
  const [watermarkText, setWatermarkText] = useState('');
  const [customPrefix, setCustomPrefix] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Editor Modal State
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setTargetFormat(pageSEO.defaultTarget);
    setFiles([]);
    setGlobalStatus('idle');
  }, [location.pathname, pageSEO.defaultTarget]);

  const processFilesInput = async (selectedFiles: FileList | File[]) => {
    const list = Array.from(selectedFiles);
    if (list.length === 0) return;

    setGlobalStatus('parsing'); 
    
    const newItems: FileItem[] = [];
    
    for (const f of list) {
      if (f.name.toLowerCase().endsWith('.heic') || f.name.toLowerCase().endsWith('.heif')) {
        try {
           const convertedBlob = await heic2any({ blob: f, toType: "image/jpeg" }) as Blob;
           const newName = f.name.replace(/\.heic|\.heif/i, '.jpg');
           const newFile = new File([convertedBlob], newName, { type: "image/jpeg" });
           newItems.push({
              id: Math.random().toString(36).substring(2, 9),
              file: newFile,
              previewUrl: URL.createObjectURL(convertedBlob),
              status: 'idle'
           });
        } catch (err) {
            console.error('HEIC Parse error', err);
        }
      } else if (f.type.startsWith('image/')) {
        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file: f,
          previewUrl: URL.createObjectURL(f),
          status: 'idle'
        });
      }
    }

    if (newItems.length === 0) {
      setGlobalStatus('idle');
      alert('Tidak ada gambar valid yang berhasil ditambah. Jika HEIC memakan waktu silakan ulangi bertahap.');
      return;
    }

    setFiles(prev => [...prev, ...newItems]);
    setGlobalStatus('idle');
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFilesInput(e.dataTransfer.files);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFilesInput(e.target.files);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (files.length === 1) setGlobalStatus('idle');
  };

  const clearAllFiles = () => {
    setFiles([]);
    setGlobalStatus('idle');
  };

  const processSingleFile = async (item: FileItem, targetFmt: ImageFormat, qual: number): Promise<FileItem> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        
        let finalWidth = img.width;
        let finalHeight = img.height;
        
        const rW = parseInt(resizeWidth);
        const rH = parseInt(resizeHeight);
        
        if (rW && !rH) {
           finalWidth = rW;
           finalHeight = (img.height / img.width) * rW;
        } else if (!rW && rH) {
           finalHeight = rH;
           finalWidth = (img.width / img.height) * rH;
        } else if (rW && rH) {
           finalWidth = rW;
           finalHeight = rH;
        }
        
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            resolve({...item, status: 'error'});
            return;
        }
        
        if (targetFmt === 'image/jpeg' || targetFmt === 'image/bmp') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
        
        if (watermarkText.trim() !== '') {
            const fontSize = Math.max(16, finalWidth * 0.04);
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 4;
            ctx.fillText(watermarkText, finalWidth - (finalWidth * 0.02), finalHeight - (finalHeight * 0.02));
        }
        
        canvas.toBlob((blob) => {
            if (blob) {
                resolve({
                  ...item, 
                  status: 'success', 
                  resultUrl: URL.createObjectURL(blob), 
                  resultSize: blob.size, 
                  resultBlob: blob
                });
            } else {
                resolve({...item, status: 'error'});
            }
        }, targetFmt, qual);
      };
      img.onerror = () => resolve({...item, status: 'error'});
      img.src = item.previewUrl;
    });
  };

  const handleConvertAll = async () => {
    if (files.length === 0) return;
    setGlobalStatus('processing');
    
    let currentFiles = [...files];
    
    for (let i = 0; i < currentFiles.length; i++) {
        if (currentFiles[i].status !== 'success') {
            setFiles(latestFiles => latestFiles.map((f, idx) => idx === i ? {...f, status: 'processing'} : f));
            const result = await processSingleFile(currentFiles[i], targetFormat, quality);
            currentFiles[i] = result;
            setFiles([...currentFiles]);
        }
    }
    setGlobalStatus('success');
  };

  const handleDownloadZip = async () => {
    const successFiles = files.filter(f => f.status === 'success' && f.resultBlob);
    if (successFiles.length === 0) return;

    const zip = new JSZip();
    successFiles.forEach(f => {
        const ext = formatExtensions[targetFormat];
        let originalName = f.file.name;
        const lastDotIdx = f.file.name.lastIndexOf('.');
        if (lastDotIdx !== -1) {
            originalName = f.file.name.substring(0, lastDotIdx);
        }
        const safePrefix = customPrefix.trim() ? `${customPrefix.trim()}-` : `sotoconvert_${originalName}_`;
        const uniqueName = `${safePrefix}${f.id.substring(0,4)}.${ext}`;
        zip.file(uniqueName, f.resultBlob!);
    });

    const content = await zip.generateAsync({type: 'blob'});
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    const dlPrefix = customPrefix.trim() ? customPrefix.trim() : 'soto_bulk_convert';
    a.download = `${dlPrefix}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = async () => {
    const successFiles = files.filter(f => f.status === 'success' && f.resultUrl);
    if (successFiles.length === 0) return;
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    for (let i = 0; i < successFiles.length; i++) {
        const file = successFiles[i];
        if (i > 0) pdf.addPage();
        
        const img = new Image();
        img.src = file.resultUrl!;
        await new Promise(r => img.onload = r);
        
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        const maxW = pageWidth - 20;
        const maxH = pageHeight - 20;
        const ratio = Math.min(maxW / img.width, maxH / img.height);
        
        const finalW = img.width * ratio;
        const finalH = img.height * ratio;
        
        const x = (pageWidth - finalW) / 2;
        const y = (pageHeight - finalH) / 2;
        
        pdf.addImage(img, 'JPEG', x, y, finalW, finalH);
    }
    const safePrefix = customPrefix.trim() ? customPrefix.trim() : 'Soto_Album';
    pdf.save(`${safePrefix}.pdf`);
  };

  const renderDropzone = (variant: 'main' | 'mini') => (
    <div 
      className={`dropzone glass-panel ${variant === 'mini' ? 'mini' : ''} ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*,.heic,.heif" 
        multiple
        style={{ display: 'none' }} 
      />
      {variant === 'main' ? (
        <>
          <div className="icon-pulse-container">
            {globalStatus === 'parsing' ? <RefreshCw size={44} className="upload-icon spinning" /> : <UploadCloud size={44} className="upload-icon" />}
          </div>
          <h3>Seret & Lepas Gambar ke Sini</h3>
          <p>Mendukung format JPG, PNG, WEBP, AVIF & iPhone HEIC</p>
        </>
      ) : (
        <>
          {globalStatus === 'parsing' ? <RefreshCw size={24} className="upload-icon-mini spinning" /> : <Plus size={24} className="upload-icon-mini" />}
          <span>Tambah Gambar Lain</span>
        </>
      )}
    </div>
  );

  const completedCount = files.filter(f => f.status === 'success').length;
  const progressPercent = files.length > 0 ? (completedCount / files.length) * 100 : 0;

  return (
    <>
      <Helmet>
        <title>{pageSEO.title}</title>
        <meta name="description" content={pageSEO.desc} />
        <meta property="og:title" content={pageSEO.title} />
        <meta property="og:description" content={pageSEO.desc} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>
      
      <TopNavigation theme={theme} toggleTheme={toggleTheme} />

      <main className="app-main">
        <header className="app-header animate-fade-in">
          <div className="logo-container" style={{ marginBottom: 4, overflow: 'hidden' }}>
            <img src="https://cdn-berjuang.ghasali.id/wp-content/uploads/2026/03/sotoconvert_Soto-Converter-Logo.webp" alt="Soto Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {currentPath === '/' ? (
             <h1>Soto <span className="gradient-text">Converter</span></h1>
          ) : (
             <h1 className="seo-h1">{pageSEO.h1}</h1>
          )}
          <p>{pageSEO.subText}</p>
          
          <div className="layout-badges">
            <span className="feature-badge"><div className="dot"></div> No Uploads</span>
            <span className="feature-badge"><div className="dot"></div> 100% Secure</span>
            <span className="feature-badge"><div className="dot"></div> Unlimited Bulk</span>
          </div>
        </header>

        <section className="app-content">
          {files.length === 0 ? (
            <div className="animate-fade-in" style={{width: '100%'}}>
              <div className="step-title">
                 <div className="step-number">1</div> Unggah Gambar Anda
              </div>
              {renderDropzone('main')}
            </div>
          ) : (
            <div className="dashboard-grid animate-fade-in">
              <div className="file-list-section">
                <div className="step-title">
                   <div className="step-number">1</div> Detail Antrean ({files.length})
                </div>
                
                <div className="list-header" style={{marginTop: -10, marginBottom: 10}}>
                  <span>Pastikan semua file yang Anda unggah benar.</span>
                  {globalStatus !== 'processing' && globalStatus !== 'parsing' && (
                    <button className="text-btn clear-btn" onClick={clearAllFiles}>Hapus Semua</button>
                  )}
                </div>
                
                <div className="file-list">
                  {files.map(f => (
                    <div key={f.id} className={`file-card ${f.status}`}>
                      <img src={f.previewUrl} alt="prev" className="mini-preview" />
                      
                      <div className="file-details">
                         <span className="filename" title={f.file.name}>{f.file.name}</span>
                         <div className="filesize-info">
                           <span>{formatBytes(f.file.size)}</span>
                           {f.status === 'success' && f.resultSize && (
                              <>
                                <ChevronRight size={12} className="size-arrow" />
                                <span className="new-size">{formatBytes(f.resultSize)}</span>
                              </>
                           )}
                         </div>
                      </div>

                        <div className="file-actions">
                          {f.status === 'processing' && <RefreshCw size={18} className="spinning text-muted" />}
                          {f.status === 'success' && f.resultUrl && (
                            <a 
                              href={f.resultUrl} 
                              download={`sotoconvert_${f.file.name.split('.')[0]}.${formatExtensions[targetFormat]}`}
                              className="icon-btn download-single"
                              title="Unduh file tunggal ini"
                            >
                              <Download size={18} />
                            </a>
                          )}
                          {f.status !== 'processing' && (
                            <div style={{display: 'flex', gap: 6}}>
                              <button 
                                className="icon-btn remove-single" 
                                onClick={() => setEditingFile(f)}
                                title="Edit Lanjut (Crop & Background)"
                                style={{color: 'var(--accent-color)', borderColor: 'var(--glass-border)'}}
                              >
                                <Wand2 size={16} />
                              </button>
                              <button 
                                className="icon-btn remove-single" 
                                onClick={() => removeFile(f.id)}
                                title="Hapus dari daftar"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          )}
                        </div>
                    </div>
                  ))}
                </div>

                {globalStatus !== 'processing' && (
                  <div className="add-more-container" style={{marginTop: 10}}>
                    {renderDropzone('mini')}
                  </div>
                )}
              </div>

              <div className="controls-sidebar">
                <div className="step-title">
                   <div className="step-number">2</div> Konfigurasi Output
                </div>
                
                <div className="control-group sticky-sidebar">
                   <div className="input-group">
                     <label>Target Ekstensi</label>
                     <div className="custom-select">
                       <select 
                         value={targetFormat} 
                         onChange={(e) => {
                             setTargetFormat(e.target.value as ImageFormat);
                             if (globalStatus === 'success') {
                                 setGlobalStatus('idle');
                                 setFiles(prev => prev.map(item => ({...item, status: 'idle'})));
                             }
                         }}
                         disabled={globalStatus === 'processing' || globalStatus === 'parsing'}
                       >
                         <option value="image/webp">WEBP (Rekomendasi Web)</option>
                         <option value="image/avif">AVIF (Terkecil/Next-Gen)</option>
                         <option value="image/jpeg">JPG / JPEG (Universal)</option>
                         <option value="image/png">PNG (Transparan)</option>
                         <option value="image/gif">GIF (Statis)</option>
                         <option value="image/bmp">BMP (Raw Uncompressed)</option>
                       </select>
                       <ChevronRight size={16} className="select-icon" />
                     </div>
                   </div>

                   {(targetFormat === 'image/jpeg' || targetFormat === 'image/webp' || targetFormat === 'image/avif') && (
                     <div className="input-group">
                       <label>
                         Kualitas Kompresi <span style={{color: 'var(--accent-color)'}}>{Math.round(quality * 100)}%</span>
                       </label>
                       <input 
                         type="range" 
                         min="0.1" max="1" step="0.05" 
                         value={quality} 
                         onChange={(e) => {
                             setQuality(parseFloat(e.target.value));
                             if (globalStatus === 'success') {
                                setGlobalStatus('idle');
                                setFiles(prev => prev.map(item => ({...item, status: 'idle'})));
                             }
                         }}
                         className="custom-range"
                         disabled={globalStatus === 'processing' || globalStatus === 'parsing'}
                       />
                     </div>
                   )}
                   
                   <div className="advanced-options" style={{marginTop: 12, marginBottom: 12}}>
                      <div 
                         className="advanced-toggle" 
                         onClick={() => setShowAdvanced(!showAdvanced)}
                         style={{display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600}}
                      >
                        <Settings2 size={16} /> Fitur Lanjutan (Pro) 
                        <ChevronDown size={14} style={{transform: showAdvanced ? 'rotate(180deg)' : 'none', transition: '0.3s', marginLeft: 'auto'}}/>
                      </div>
                      
                      {showAdvanced && (
                         <div className="advanced-content animate-fade-in" style={{padding: '16px', background: 'var(--icon-bg)', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 12}}>
                            <div className="input-group">
                              <label style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Ubah Ukuran Lebar & Tinggi (px)</label>
                              <div style={{display: 'flex', gap: 8}}>
                                <input type="number" placeholder="Atur Lebar" value={resizeWidth} onChange={e => setResizeWidth(e.target.value)} className="custom-input" disabled={globalStatus === 'processing'} style={{width: '50%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--glass-border)', background: 'var(--surface)', color: 'var(--text-primary)'}} />
                                <input type="number" placeholder="Atur Tinggi" value={resizeHeight} onChange={e => setResizeHeight(e.target.value)} className="custom-input" disabled={globalStatus === 'processing'} style={{width: '50%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--glass-border)', background: 'var(--surface)', color: 'var(--text-primary)'}} />
                              </div>
                              <small style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Kosongkan salah satu untuk resolusi otomatis.</small>
                            </div>
                            
                            <div className="input-group">
                              <label style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Sisipkan Watermark Visual</label>
                              <input type="text" placeholder="Ketik label cap air Anda..." value={watermarkText} onChange={e => setWatermarkText(e.target.value)} className="custom-input" disabled={globalStatus === 'processing'} style={{width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--glass-border)', background: 'var(--surface)', color: 'var(--text-primary)'}} />
                            </div>

                            <div className="input-group">
                              <label style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Format Nama ZIP & PDF</label>
                              <input type="text" placeholder="Misal: FotoProduk (Otomatis ditambah urutan)" value={customPrefix} onChange={e => setCustomPrefix(e.target.value)} className="custom-input" disabled={globalStatus === 'processing'} style={{width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--glass-border)', background: 'var(--surface)', color: 'var(--text-primary)'}} />
                            </div>
                            
                            <div style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)', padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 8}}>
                               <Lock size={14} className="text-accent" /> Metadata (GPS/Kamera) otomatis dibersihkan Canvas untuk perlindungan privasi EXIF Anda.
                            </div>
                         </div>
                      )}
                   </div>

                   <div className="action-section">
                     {globalStatus === 'idle' || globalStatus === 'error' ? (
                       <button className="primary-btn" onClick={handleConvertAll} style={{width: '100%'}}>
                         <Zap size={20} className="btn-icon" /> Convert Semua 
                       </button>
                     ) : globalStatus === 'parsing' ? (
                       <button className="primary-btn processing" disabled style={{width: '100%', background: 'var(--surface)'}}>
                         <RefreshCw size={20} className="btn-icon spinning" /> Membaca HEIC...
                       </button>
                     ) : globalStatus === 'processing' ? (
                       <div className="processing-container">
                         <div className="progress-info">
                           <span>Memproses Konversi...</span>
                           <span>{completedCount} / {files.length}</span>
                         </div>
                         <div className="progress-bar-bg">
                           <div className="progress-bar-fill" style={{width: `${progressPercent}%`}}></div>
                         </div>
                       </div>
                     ) : (
                       <div className="success-actions animate-fade-in" style={{width: '100%'}}>
                          <div className="result-stats">
                            <CheckCircle2 size={24} className="text-success" />
                            <div className="stat-text">
                              <span>Semua Berhasil!</span>
                              <small>{completedCount} gambar siap diunduh</small>
                            </div>
                          </div>
                          <div style={{display: 'flex', flexDirection: 'column', gap: 8, width: '100%'}}>
                             <button 
                               className="primary-btn download-btn" 
                               onClick={handleDownloadZip}
                               style={{width: '100%'}}
                             >
                               <Archive size={20} className="btn-icon" /> Download ZIP
                             </button>
                             <button 
                               className="secondary-btn" 
                               onClick={handleDownloadPDF}
                               style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'var(--icon-bg)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'}}
                             >
                               <FileText size={20} className="text-accent" /> Opsi Cetak PDF
                             </button>
                          </div>
                       </div>
                     )}
                   </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Editor Modal Overlay */}
        {editingFile && (
           <div className="editor-modal-overlay animate-fade-in">
              <div className="editor-modal-content glass-panel" style={{ height: '100%', borderRadius: 'inherit' }}>
                 <div className="modal-header">
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <h3 title={editingFile.file.name}>{editingFile.file.name}</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Studio Editor</span>
                    </div>
                    <button className="icon-btn remove-single" onClick={() => setEditingFile(null)}><X size={20} /></button>
                 </div>
                 <StudioEditor 
                    fileItem={editingFile} 
                    onSave={(newObjUrl) => {
                       setFiles(prev => prev.map(f => f.id === editingFile.id ? {...f, previewUrl: newObjUrl, status: 'idle'} : f));
                       setEditingFile(null);
                    }}
                 />
              </div>
           </div>
        )}

        {/* SEO Navigation Section */}
        <section className="seo-links-container">
           <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16}}>
              <ShieldCheck size={28} style={{color: 'var(--accent-color)'}} />
              <h3 className="seo-links-title">Alat Konversi Cepat Lainnya</h3>
           </div>
           
           <div className="seo-links-grid">
               {internalLinks.map(link => (
                   <Link key={link.path} to={link.path} className={`seo-link-chip ${currentPath === link.path ? 'active' : ''}`}>
                       {link.label}
                   </Link>
               ))}
           </div>
        </section>

      </main>

      <AppFooter />
    </>
  );
}

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('light');
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('sotoweb-theme') as ThemeMode | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
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
    <Routes>
      <Route path="/privacy-policy" element={<PrivacyPolicy theme={theme} toggleTheme={toggleTheme}/>} />
      <Route path="/terms-of-use" element={<TermsOfUse theme={theme} toggleTheme={toggleTheme}/>} />
      <Route path="/wordpress-plugin" element={<WordPressPlugin theme={theme} toggleTheme={toggleTheme}/>} />
      <Route path="*" element={<ConverterPage theme={theme} toggleTheme={toggleTheme}/>} />
    </Routes>
  );
}

import React from 'react';
import { ShieldCheck, Lock, Download, Rocket, Zap, CheckCircle2, ChevronRight, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PageProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const PrivacyPolicy: React.FC<PageProps> = () => {
  return (
    <div className="static-page animate-fade-in" style={{maxWidth: 800, margin: '80px auto', padding: '0 20px'}}>
      <Link to="/" className="back-link" style={{display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent)', marginBottom: 24, fontWeight: 600}}>
        <ChevronRight style={{transform: 'rotate(180deg)'}} size={20} /> Kembali ke Beranda
      </Link>
      <h1 style={{fontSize: '2.5rem', fontWeight: 800, marginBottom: 24}}>Kebijakan Privasi</h1>
      <div className="content-card" style={{background: 'var(--glass-bg)', padding: 32, borderRadius: 24, border: '1px solid var(--glass-border)', lineHeight: 1.8}}>
        <p>Di <strong>Soto Converter</strong>, privasi Anda adalah prioritas mutlak kami. Berbeda dengan layanan konversi online lainnya, kami mengusung konsep <strong>Private-by-Design</strong>.</p>
        <h3 style={{marginTop: 24, marginBottom: 12}}>1. Pemrosesan Lokal 100%</h3>
        <p>Semua proses konversi gambar, resize, dan pengeditan dilakukan sepenuhnya di dalam browser perangkat Anda menggunakan teknologi Client-Side (JavaScript & WebAssembly). File Anda <strong>tidak pernah</strong> diunggah ke server kami.</p>
        <h3 style={{marginTop: 24, marginBottom: 12}}>2. Tidak Ada Penyimpanan Data</h3>
        <p>Karena file tidak pernah terunggah, kami tidak menyimpan, melihat, atau memiliki akses ke gambar atau dokumen yang Anda proses.</p>
        <h3 style={{marginTop: 24, marginBottom: 12}}>3. Keamanan Metadata</h3>
        <p>Saat Anda melakukan konversi, sistem kami secara otomatis membersihkan metadata sensitif (seperti lokasi GPS atau model kamera) untuk melindungi privasi digital Anda.</p>
      </div>
    </div>
  );
};

export const TermsOfUse: React.FC<PageProps> = () => {
  return (
    <div className="static-page animate-fade-in" style={{maxWidth: 800, margin: '80px auto', padding: '0 20px'}}>
      <Link to="/" className="back-link" style={{display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent)', marginBottom: 24, fontWeight: 600}}>
        <ChevronRight style={{transform: 'rotate(180deg)'}} size={20} /> Kembali ke Beranda
      </Link>
      <h1 style={{fontSize: '2.5rem', fontWeight: 800, marginBottom: 24}}>Ketentuan Layanan</h1>
      <div className="content-card" style={{background: 'var(--glass-bg)', padding: 32, borderRadius: 24, border: '1px solid var(--glass-border)', lineHeight: 1.8}}>
        <p>Dengan menggunakan Soto Converter, Anda menyetujui ketentuan berikut:</p>
        <h3 style={{marginTop: 24, marginBottom: 12}}>1. Penggunaan Gratis</h3>
        <p>Layanan ini disediakan secara gratis untuk penggunaan personal maupun komersial tanpa batasan jumlah file.</p>
        <h3 style={{marginTop: 24, marginBottom: 12}}>2. Tanpa Jaminan</h3>
        <p>Meskipun kami berusaha memberikan kualitas terbaik, layanan ini disediakan "sebagaimana adanya" tanpa jaminan hasil konversi yang sempurna untuk setiap jenis file.</p>
        <h3 style={{marginTop: 24, marginBottom: 12}}>3. Tanggung Jawab Pengguna</h3>
        <p>Anda bertanggung jawab penuh atas konten yang Anda konversi dan pastikan Anda memiliki hak legal atas gambar tersebut.</p>
      </div>
    </div>
  );
};

export const WordPressPlugin: React.FC<PageProps> = () => {
  return (
    <div className="static-page animate-fade-in" style={{maxWidth: 1000, margin: '80px auto', padding: '0 20px'}}>
       <div style={{textAlign: 'center', marginBottom: 60}}>
          <div style={{display: 'inline-flex', padding: '12px 24px', background: 'var(--icon-bg)', borderRadius: 100, color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem', marginBottom: 20, gap: 8, alignItems: 'center'}}>
            <Zap size={18} /> Official WordPress Extension
          </div>
          <h1 style={{fontSize: '3.5rem', fontWeight: 800, marginBottom: 20, letterSpacing: '-0.02em'}}>Soto WebP Converter</h1>
          <p style={{fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: 700, margin: '0 auto', lineHeight: 1.6}}>
            Otomatisasi optimasi gambar situs WordPress Anda. Ubah setiap unggahan menjadi WebP secara instan dan hemat ruang penyimpanan server hingga 80%.
          </p>
          <div style={{marginTop: 40, display: 'flex', justifyContent: 'center', gap: 16}}>
             <a href="/soto-webp-converter.zip" download className="primary-btn" style={{padding: '16px 40px', fontSize: '1.1rem'}}>
                <Download size={20} className="btn-icon" /> Download Plugin (.zip)
             </a>
             <Link to="/" className="secondary-btn" style={{padding: '16px 40px', fontSize: '1.1rem'}}>Lihat Demo Alat</Link>
          </div>
       </div>

       <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 80}}>
          {[
            { icon: <Zap />, title: 'Konversi Otomatis', desc: 'Setiap gambar yang Anda unggah ke Media Library otomatis diubah ke format WebP.' },
            { icon: <ShieldCheck />, title: 'Keamanan Data', desc: 'Semua proses terjadi di server Anda sendiri tanpa pihak ketiga.' },
            { icon: <Rocket />, title: 'Performa Ultra', desc: 'Meningkatkan skor PageSpeed Insights dengan format gambar modern yang ringan.' }
          ].map((feat, i) => (
            <div key={i} style={{background: 'var(--glass-bg)', padding: 32, borderRadius: 24, border: '1px solid var(--glass-border)'}}>
               <div style={{width: 48, height: 48, background: 'var(--icon-bg)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', marginBottom: 20}}>
                 {feat.icon}
               </div>
               <h3 style={{fontSize: '1.25rem', fontWeight: 700, marginBottom: 12}}>{feat.title}</h3>
               <p style={{color: 'var(--text-secondary)', lineHeight: 1.6}}>{feat.desc}</p>
            </div>
          ))}
       </div>
    </div>
  );
};

import { ShieldCheck, Download, Rocket, Zap, CheckCircle2, Globe, BarChart3, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PageProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const PrivacyPolicy: React.FC<PageProps> = () => {
  return (
    <div className="static-page animate-fade-in" style={{maxWidth: 900, margin: '60px auto', padding: '0 24px'}}>
      <div style={{marginBottom: 48, textAlign: 'center'}}>
        <h1 style={{fontSize: '3rem', fontWeight: 900, marginBottom: 16, letterSpacing: '-0.02em'}}>Kebijakan Privasi</h1>
        <p style={{color: 'var(--text-secondary)', fontSize: '1.1rem'}}>Bagaimana kami menjaga keamanan dan privasi data Anda.</p>
      </div>
      
      <div className="content-card" style={{background: 'var(--surface)', padding: 40, borderRadius: 32, border: '1px solid var(--glass-border)', lineHeight: 1.8, boxShadow: 'var(--shadow-lg)'}}>
        <p style={{fontSize: '1.1rem', marginBottom: 32}}>Di <strong>Soto Converter</strong>, privasi Anda adalah prioritas mutlak kami. Berbeda dengan layanan konversi online lainnya, kami mengusung konsep <strong>Private-by-Design</strong>.</p>
        
        <div style={{display: 'grid', gap: 32}}>
          <section>
            <h3 style={{fontSize: '1.5rem', fontWeight: 700, marginBottom: 12, color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: 12}}>
              <Lock size={24} /> 1. Pemrosesan Lokal 100%
            </h3>
            <p>Semua proses konversi gambar, resize, dan pengeditan dilakukan sepenuhnya di dalam browser perangkat Anda menggunakan teknologi Client-Side (JavaScript & WebAssembly). File Anda <strong>tidak pernah</strong> diunggah ke server kami.</p>
          </section>

          <section>
            <h3 style={{fontSize: '1.5rem', fontWeight: 700, marginBottom: 12, color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: 12}}>
              <ShieldCheck size={24} /> 2. Tidak Ada Penyimpanan Data
            </h3>
            <p>Karena file tidak pernah terunggah, kami tidak menyimpan, melihat, atau memiliki akses ke gambar atau dokumen yang Anda proses. Data Anda tetap milik Anda sepenuhnya.</p>
          </section>

          <section>
            <h3 style={{fontSize: '1.5rem', fontWeight: 700, marginBottom: 12, color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: 12}}>
              <CheckCircle2 size={24} /> 3. Keamanan Metadata
            </h3>
            <p>Saat Anda melakukan konversi, sistem kami secara otomatis membersihkan metadata sensitif (seperti lokasi GPS atau model kamera) untuk melindungi privasi digital Anda secara otomatis.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export const TermsOfUse: React.FC<PageProps> = () => {
  return (
    <div className="static-page animate-fade-in" style={{maxWidth: 900, margin: '60px auto', padding: '0 24px'}}>
      <div style={{marginBottom: 48, textAlign: 'center'}}>
        <h1 style={{fontSize: '3rem', fontWeight: 900, marginBottom: 16, letterSpacing: '-0.02em'}}>Ketentuan Layanan</h1>
        <p style={{color: 'var(--text-secondary)', fontSize: '1.1rem'}}>Panduan dan tanggung jawab penggunaan platform Soto Converter.</p>
      </div>

      <div className="content-card" style={{background: 'var(--surface)', padding: 40, borderRadius: 32, border: '1px solid var(--glass-border)', lineHeight: 1.8, boxShadow: 'var(--shadow-lg)'}}>
        <div style={{display: 'grid', gap: 32}}>
          <section>
            <h3 style={{fontSize: '1.5rem', fontWeight: 700, marginBottom: 12, color: 'var(--accent-color)'}}>1. Penggunaan Gratis</h3>
            <p>Layanan ini disediakan secara gratis untuk penggunaan personal maupun komersial tanpa batasan jumlah file. Kami mendukung kreativitas tanpa hambatan biaya.</p>
          </section>

          <section>
            <h3 style={{fontSize: '1.5rem', fontWeight: 700, marginBottom: 12, color: 'var(--accent-color)'}}>2. Tanpa Jaminan</h3>
            <p>Meskipun kami berusaha memberikan kualitas terbaik, layanan ini disediakan "sebagaimana adanya" tanpa jaminan hasil konversi yang sempurna untuk setiap jenis file atau kondisi teknis tertentu.</p>
          </section>

          <section>
            <h3 style={{fontSize: '1.5rem', fontWeight: 700, marginBottom: 12, color: 'var(--accent-color)'}}>3. Tanggung Jawab Pengguna</h3>
            <p>Anda bertanggung jawab penuh atas konten yang Anda konversi. Pastikan Anda memiliki hak legal atau lisensi yang tepat atas gambar yang Anda proses menggunakan alat kami.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export const WordPressPlugin: React.FC<PageProps> = () => {
  return (
    <div className="static-page animate-fade-in" style={{maxWidth: 1100, margin: '60px auto', padding: '0 24px'}}>
       <div style={{textAlign: 'center', marginBottom: 80}}>
          <div style={{display: 'inline-flex', padding: '10px 20px', background: 'var(--icon-bg)', borderRadius: 100, color: 'var(--accent-color)', fontWeight: 700, fontSize: '0.85rem', marginBottom: 24, gap: 8, alignItems: 'center', border: '1px solid var(--glass-border)'}}>
            <Zap size={16} fill="currentColor" /> OFFICIAL WORDPRESS EXTENSION
          </div>
          <h1 style={{fontSize: '4rem', fontWeight: 950, marginBottom: 24, letterSpacing: '-0.04em', lineHeight: 1.1}}>
            Optimasi <span className="text-gradient">WordPress</span> Tanpa Batas
          </h1>
          <p style={{fontSize: '1.3rem', color: 'var(--text-secondary)', maxWidth: 750, margin: '0 auto', lineHeight: 1.6, fontWeight: 500}}>
            Soto WebP Converter adalah solusi otomatis untuk mempercepat situs web Anda. Ubah setiap unggahan menjadi format WebP modern secara instan dan hemat penyimpanan hingga 80%.
          </p>
          <div style={{marginTop: 48, display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap'}}>
             <a href="/soto-webp-converter.zip" download className="primary-btn" style={{padding: '18px 44px', fontSize: '1.1rem', borderRadius: '16px', boxShadow: '0 20px 40px var(--accent-glow)'}}>
                <Download size={22} style={{marginRight: 10}} /> Download v2.1.0 Free
             </a>
             <Link to="/" className="secondary-btn" style={{padding: '18px 44px', fontSize: '1.1rem', borderRadius: '16px'}}>
                Pelajari Dokumentasi
             </Link>
          </div>
          
          <div style={{marginTop: 32, display: 'flex', justifyContent: 'center', gap: 32, color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 8}}><CheckCircle2 size={16} color="#10b981" /> WP 5.0+ Tested</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 8}}><CheckCircle2 size={16} color="#10b981" /> PHP 7.4 - 8.2</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 8}}><CheckCircle2 size={16} color="#10b981" /> No API Key Required</div>
          </div>
       </div>

       <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, marginBottom: 100}}>
          {[
            { icon: <Rocket />, title: 'Instan WebP Generation', desc: 'Sistem cerdas kami mendeteksi setiap unggahan baru dan langsung melakukan konversi tanpa jeda.' },
            { icon: <BarChart3 />, title: 'Kompresi Lossless', desc: 'Mengecilkan ukuran file secara drastis tanpa mengurangi kualitas visual gambar Anda sedikitpun.' },
            { icon: <Globe />, title: 'Global Compatibilty', desc: 'Mendukung semua browser modern dan memberikan fallback otomatis untuk browser lama.' }
          ].map((feat, i) => (
            <div key={i} className="feature-card-premium" style={{background: 'var(--surface)', padding: 40, borderRadius: 32, border: '1px solid var(--glass-border)', transition: 'all 0.3s ease', cursor: 'default'}}>
               <div style={{width: 60, height: 60, background: 'var(--icon-bg)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)', marginBottom: 28}}>
                 {feat.icon}
               </div>
               <h3 style={{fontSize: '1.4rem', fontWeight: 800, marginBottom: 16}}>{feat.title}</h3>
               <p style={{color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.05rem'}}>{feat.desc}</p>
            </div>
          ))}
       </div>

       <div style={{background: 'var(--primary-gradient)', padding: '60px 40px', borderRadius: 40, textAlign: 'center', color: 'white', marginBottom: 80}}>
          <h2 style={{fontSize: '2.2rem', fontWeight: 850, marginBottom: 16}}>Siap Meluncurkan Situs Tercepat Anda?</h2>
          <p style={{fontSize: '1.1rem', opacity: 0.9, marginBottom: 32, maxWidth: 600, margin: '0 auto 32px'}}>Bergabunglah dengan ribuan pemilik situs yang telah beralih ke optimasi gambar otomatis.</p>
          <a href="/soto-webp-converter.zip" download className="white-btn" style={{background: 'white', color: 'black', padding: '16px 40px', borderRadius: '14px', fontWeight: 750, textDecoration: 'none', display: 'inline-block'}}>
            Get Started Now
          </a>
       </div>
    </div>
  );
};

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
        <h1 style={{fontSize: 'clamp(2rem, 8vw, 3rem)', fontWeight: 900, marginBottom: 16, letterSpacing: '-0.02em'}}>Kebijakan Privasi</h1>
        <p style={{color: 'var(--text-secondary)', fontSize: '1.1rem'}}>Bagaimana kami menjaga keamanan dan privasi data Anda.</p>
      </div>
      
      <div className="content-card" style={{background: 'var(--surface)', padding: 'clamp(24px, 5vw, 40px)', borderRadius: 32, border: '1px solid var(--glass-border)', lineHeight: 1.8, boxShadow: 'var(--shadow-lg)'}}>
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
        <h1 style={{fontSize: 'clamp(2rem, 8vw, 3rem)', fontWeight: 900, marginBottom: 16, letterSpacing: '-0.02em'}}>Ketentuan Layanan</h1>
        <p style={{color: 'var(--text-secondary)', fontSize: '1.1rem'}}>Panduan dan tanggung jawab penggunaan platform Soto Converter.</p>
      </div>

      <div className="content-card" style={{background: 'var(--surface)', padding: 'clamp(24px, 5vw, 40px)', borderRadius: 32, border: '1px solid var(--glass-border)', lineHeight: 1.8, boxShadow: 'var(--shadow-lg)'}}>
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
          <h1 style={{fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 950, marginBottom: 24, letterSpacing: '-0.04em', lineHeight: 1.1}}>
            Optimasi <span className="text-gradient">WordPress</span> Tanpa Batas
          </h1>
          <p style={{fontSize: '1.3rem', color: 'var(--text-secondary)', maxWidth: 750, margin: '0 auto', lineHeight: 1.6, fontWeight: 500}}>
            Soto WebP Converter adalah solusi otomatis untuk mempercepat situs web Anda. Ubah setiap unggahan menjadi format WebP modern secara instan dan hemat penyimpanan hingga 80%.
          </p>
          <div style={{marginTop: 48, display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap'}}>
             <a href="https://github.com/Ghasalime/soto-converter/raw/main/public/soto-webp-converter.zip" download className="primary-btn" style={{padding: 'clamp(14px, 4vw, 18px) clamp(24px, 6vw, 44px)', fontSize: 'clamp(1rem, 3vw, 1.1rem)', borderRadius: '16px', boxShadow: '0 20px 40px var(--accent-glow)'}}>
                <Download size={22} style={{marginRight: 10}} /> Download v2.1.0 Free
             </a>
             <Link to="/" className="secondary-btn" style={{padding: 'clamp(14px, 4vw, 18px) clamp(24px, 6vw, 44px)', fontSize: 'clamp(1rem, 3vw, 1.1rem)', borderRadius: '16px'}}>
                Pelajari Dokumentasi
             </Link>
          </div>
          
          <div style={{marginTop: 32, display: 'flex', justifyContent: 'center', gap: 32, color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 8}}><CheckCircle2 size={16} color="#10b981" /> WP 5.0+ Tested</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 8}}><CheckCircle2 size={16} color="#10b981" /> PHP 7.4 - 8.2</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 8}}><CheckCircle2 size={16} color="#10b981" /> No API Key Required</div>
          </div>
       </div>

       <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 32, marginBottom: 100}}>
          {[
            { icon: <Rocket />, title: 'Instan WebP Generation', desc: 'Sistem cerdas kami mendeteksi setiap unggahan baru dan langsung melakukan konversi tanpa jeda.' },
            { icon: <BarChart3 />, title: 'Kompresi Lossless', desc: 'Mengecilkan ukuran file secara drastis tanpa mengurangi kualitas visual gambar Anda sedikitpun.' },
            { icon: <Globe />, title: 'Global Compatibilty', desc: 'Mendukung semua browser modern dan memberikan fallback otomatis untuk browser lama.' }
          ].map((feat, i) => (
            <div key={i} className="feature-card-premium" style={{background: 'var(--surface)', padding: 'clamp(24px, 5vw, 40px)', borderRadius: 32, border: '1px solid var(--glass-border)', transition: 'all 0.3s ease', cursor: 'default'}}>
               <div style={{width: 60, height: 60, background: 'var(--icon-bg)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)', marginBottom: 28}}>
                 {feat.icon}
               </div>
               <h3 style={{fontSize: '1.4rem', fontWeight: 800, marginBottom: 16}}>{feat.title}</h3>
               <p style={{color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.05rem'}}>{feat.desc}</p>
            </div>
          ))}
       </div>

       <div style={{background: 'var(--primary-gradient)', padding: 'clamp(30px, 8vw, 60px) clamp(20px, 5vw, 40px)', borderRadius: 40, textAlign: 'center', color: 'white', marginBottom: 80}}>
          <h2 style={{fontSize: 'clamp(1.5rem, 6vw, 2.2rem)', fontWeight: 850, marginBottom: 16}}>Siap Meluncurkan Situs Tercepat Anda?</h2>
          <p style={{fontSize: '1.1rem', opacity: 0.9, marginBottom: 32, maxWidth: 600, margin: '0 auto 32px'}}>Bergabunglah dengan ribuan pemilik situs yang telah beralih ke optimasi gambar otomatis.</p>
          <a href="https://github.com/Ghasalime/soto-converter/raw/main/public/soto-webp-converter.zip" download className="white-btn" style={{background: 'white', color: 'black', padding: '16px 40px', borderRadius: '14px', fontWeight: 750, textDecoration: 'none', display: 'inline-block'}}>
            Get Started Now
          </a>
       </div>
    </div>
  );
};

export const ApiDocs: React.FC<PageProps> = () => {
  return (
    <div className="static-page animate-fade-in" style={{maxWidth: 1100, margin: '60px auto', padding: '0 24px'}}>
      <div style={{textAlign: 'center', marginBottom: 60}}>
        <h1 style={{fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', fontWeight: 900, marginBottom: 20, letterSpacing: '-0.02em'}}>Dokumentasi <span className="text-gradient">API</span></h1>
        <p style={{fontSize: 'clamp(1rem, 3.5vw, 1.2rem)', color: 'var(--text-secondary)', maxWidth: 800, margin: '0 auto', lineHeight: 1.7}}>
          Pelajari bagaimana Soto Converter memproses ribuan file secara batch tanpa pernah menyentuh cloud. Universal Client-Side Processing untuk masa depan web yang privat.
        </p>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: 32, marginBottom: 60}}>
        <div className="content-card" style={{background: 'var(--surface)', padding: 'clamp(24px, 6vw, 48px)', borderRadius: 32, border: '1px solid var(--glass-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'}}>
          <h2 style={{fontSize: '1.8rem', fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12}}>
             <Zap color="var(--accent-color)" size={28} /> Arsitektur Engine
          </h2>
          <p style={{lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 32}}>
            Soto Converter menggunakan <strong>Web Workers API</strong> dan <strong>Offscreen Canvas</strong> untuk memindahkan beban pemrosesan berat dari main thread UI.
          </p>
          <div style={{display: 'grid', gap: 20}}>
            <div style={{display: 'flex', gap: 16}}>
              <div style={{minWidth: 40, height: 40, borderRadius: 12, background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <CheckCircle2 size={20} color="#10b981" />
              </div>
              <div>
                <div style={{fontWeight: 700, fontSize: '1.05rem', marginBottom: 4}}>Local Sandbox</div>
                <div style={{fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5}}>Data diproses di memori RAM terisolasi browser Anda.</div>
              </div>
            </div>
            <div style={{display: 'flex', gap: 16}}>
              <div style={{minWidth: 40, height: 40, borderRadius: 12, background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <CheckCircle2 size={20} color="#10b981" />
              </div>
              <div>
                <div style={{fontWeight: 700, fontSize: '1.05rem', marginBottom: 4}}>Zero Latency</div>
                <div style={{fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5}}>Tanpa delay jaringan, kecepatan murni perangkat Anda.</div>
              </div>
            </div>
            <div style={{display: 'flex', gap: 16}}>
              <div style={{minWidth: 40, height: 40, borderRadius: 12, background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <CheckCircle2 size={20} color="#10b981" />
              </div>
              <div>
                <div style={{fontWeight: 700, fontSize: '1.05rem', marginBottom: 4}}>Batch Processing</div>
                <div style={{fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5}}>Mendukung antrian paralel hingga 50 file sekaligus.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-card" style={{background: 'var(--surface)', padding: 'clamp(24px, 6vw, 48px)', borderRadius: 32, border: '1px solid var(--glass-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'}}>
          <h2 style={{fontSize: '1.8rem', fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12}}>
             <Globe color="var(--accent-color)" size={28} /> Integrasi Lokal
          </h2>
          <p style={{lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 24}}>
            Logika pemrosesan kami (`converter.ts`) didesain modular sehingga dapat diintegrasikan ke dalam workflow pipeline gambar Anda secara lokal.
          </p>
          <div style={{background: '#0d1117', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)'}}>
            <div style={{background: 'rgba(255,255,255,0.05)', padding: '12px 16px', display: 'flex', gap: 6, borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
              <div style={{width: 10, height: 10, borderRadius: '50%', background: '#ff5f56'}}></div>
              <div style={{width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e'}}></div>
              <div style={{width: 10, height: 10, borderRadius: '50%', background: '#27c93f'}}></div>
            </div>
            <div style={{padding: '24px', fontFamily: '"Fira Code", "Source Code Pro", monospace', fontSize: '0.85rem', lineHeight: 1.6, overflowX: 'auto'}}>
              <div style={{color: '#8b949e'}}>// Contoh Integrasi Worker</div>
              <div style={{marginTop: 8}}>
                <span style={{color: '#ff7b72'}}>import</span> {'{ '} 
                <span style={{color: '#79c0ff'}}>processImage</span> {' } '} 
                <span style={{color: '#ff7b72'}}>from</span> <span style={{color: '#a5d6ff'}}>'./engine'</span>;
              </div>
              <div style={{marginTop: 12}}>
                <span style={{color: '#ff7b72'}}>const</span> <span style={{color: '#79c0ff'}}>result</span> = <span style={{color: '#ff7b72'}}>await</span> <span style={{color: '#d2a8ff'}}>processImage</span>(file, {'{'});
              </div>
              <div style={{marginLeft: 16}}>
                <span style={{color: '#79c0ff'}}>format</span>: <span style={{color: '#a5d6ff'}}>"webp"</span>, 
                <span style={{color: '#79c0ff'}}>quality</span>: <span style={{color: '#79c0ff'}}>0.8</span>
              </div>
              <div>{'}'});</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{background: 'var(--surface)', padding: '60px 40px', borderRadius: 40, textAlign: 'center', border: '1px solid var(--accent-color)', position: 'relative', overflow: 'hidden'}}>
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at center, rgba(var(--accent-rgb), 0.05) 0%, transparent 70%)', pointerEvents: 'none'}}></div>
        <h3 style={{fontSize: '2rem', fontWeight: 800, marginBottom: 16, position: 'relative', color: 'var(--text-primary)'}}>Butuh SDK atau API Khusus?</h3>
        <p style={{color: 'var(--text-secondary)', marginBottom: 32, fontSize: '1.1rem', position: 'relative'}}>Kami sedang mengembangkan versi CLI dan NPM package untuk otomatisasi tingkat lanjut.</p>
        <div style={{display: 'flex', justifyContent: 'center', position: 'relative'}}>
          <a href="mailto:gmail@ghasali.id" className="primary-btn" style={{padding: '16px 40px', borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 280, fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 10px 20px rgba(var(--accent-rgb), 0.2)', textDecoration: 'none'}}>
            Hubungi Pengembang
          </a>
        </div>
      </div>
    </div>
  );
};

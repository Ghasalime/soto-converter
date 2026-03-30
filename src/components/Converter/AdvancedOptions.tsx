import React from 'react';
import { Settings2, ChevronDown, Lock } from 'lucide-react';

interface AdvancedOptionsProps {
  showAdvanced: boolean;
  setShowAdvanced: (val: boolean) => void;
  resizeWidth: string;
  setResizeWidth: (val: string) => void;
  resizeHeight: string;
  setResizeHeight: (val: string) => void;
  watermarkText: string;
  setWatermarkText: (val: string) => void;
  customPrefix: string;
  setCustomPrefix: (val: string) => void;
  globalStatus: string;
}

export const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({
  showAdvanced, setShowAdvanced, resizeWidth, setResizeWidth,
  resizeHeight, setResizeHeight, watermarkText, setWatermarkText,
  customPrefix, setCustomPrefix, globalStatus
}) => {
  return (
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
  );
};

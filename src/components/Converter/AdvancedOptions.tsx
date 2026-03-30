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
    <div className="advanced-options-container">
      <div 
        className={`advanced-toggle ${showAdvanced ? 'active' : ''}`} 
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        <div className="toggle-label">
          <Settings2 size={16} /> <span>Fitur Lanjutan (Pro)</span>
        </div>
        <ChevronDown size={14} className="toggle-icon" />
      </div>
      
      {showAdvanced && (
         <div className="advanced-panel animate-fade-in">
            <div className="advanced-field">
              <label>Ubah Ukuran Lebar & Tinggi (px)</label>
              <div className="input-split">
                <input type="number" placeholder="Lebar" value={resizeWidth} onChange={e => setResizeWidth(e.target.value)} className="glass-input" disabled={globalStatus === 'processing'} />
                <input type="number" placeholder="Tinggi" value={resizeHeight} onChange={e => setResizeHeight(e.target.value)} className="glass-input" disabled={globalStatus === 'processing'} />
              </div>
              <small>Kosongkan salah satu untuk resolusi otomatis.</small>
            </div>
            
            <div className="advanced-field">
              <label>Sisipkan Watermark Visual</label>
              <input type="text" placeholder="Ketik label cap air Anda..." value={watermarkText} onChange={e => setWatermarkText(e.target.value)} className="glass-input full-width" disabled={globalStatus === 'processing'} />
            </div>

            <div className="advanced-field">
              <label>Format Nama ZIP & PDF</label>
              <input type="text" placeholder="Misal: FotoProduk" value={customPrefix} onChange={e => setCustomPrefix(e.target.value)} className="glass-input full-width" disabled={globalStatus === 'processing'} />
            </div>
            
            <div className="info-alert">
               <Lock size={14} className="text-accent" /> 
               <span>Metadata (GPS/Kamera) otomatis dibersihkan untuk perlindungan privasi EXIF Anda.</span>
            </div>
         </div>
      )}
    </div>
  );
};

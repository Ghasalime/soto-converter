import { useState, useRef, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { UploadCloud, RefreshCw, CheckCircle2, Archive, ShieldCheck, Zap, FileText, SlidersHorizontal } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import { convertPDFToImages } from '../../utils/pdfUtils';
import { processImageFile } from '../../utils/converterUtils';
import { seoConfig, type ImageFormat } from '../../constants/seoData';
import { AdvancedOptions } from './AdvancedOptions';
import { FileListItem, type FileItem } from './FileListItem';

export type GlobalStatus = 'idle' | 'processing' | 'success' | 'parsing' | 'error';

interface ConverterPageProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const ConverterPage: React.FC<ConverterPageProps> = ({ theme: _theme, toggleTheme: _toggleTheme }) => {
  const loc = useLocation();
  const currentPath = loc.pathname;
  const pageSEO = seoConfig[currentPath] || seoConfig['/'];
  
  const isPdfToImage = currentPath === '/pdf-to-image';
  const isImageToPdf = currentPath === '/image-to-pdf';
  const isGifToWebp = currentPath === '/gif-to-webp';
  const isWebpToGif = currentPath === '/webp-to-gif';
  const isVectorizer = currentPath === '/image-to-svg';
  const isWatermarkTool = currentPath === '/image-watermark';

  const [files, setFiles] = useState<FileItem[]>([]);
  const [globalStatus, setGlobalStatus] = useState<GlobalStatus>('idle');
  const [targetFormat, setTargetFormat] = useState<ImageFormat>(isWebpToGif ? 'image/gif' : (pageSEO?.defaultTarget || 'image/webp'));
  const [quality] = useState(0.85);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resizeWidth, setResizeWidth] = useState('');
  const [resizeHeight, setResizeHeight] = useState('');
  const [watermarkText, setWatermarkText] = useState(isWatermarkTool ? 'Soto Converter' : '');
  const [customPrefix, setCustomPrefix] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setFiles([]);
    setGlobalStatus('idle');
    setTargetFormat(isWebpToGif ? 'image/gif' : (pageSEO?.defaultTarget || 'image/webp'));
    setWatermarkText(isWatermarkTool ? 'Soto Converter' : '');
  }, [currentPath, isWebpToGif, isWatermarkTool, pageSEO]);

  const processFilesInput = useCallback(async (selectedFiles: FileList | File[]) => {
    if (selectedFiles.length === 0) return;
    
    if (isPdfToImage) {
      setGlobalStatus('parsing');
      try {
        const file = selectedFiles[0];
        const images = await convertPDFToImages(file);
        const newItems: FileItem[] = images.map((blob, idx) => ({
          id: `${Date.now()}-${idx}`,
          file: new File([blob], `${file.name.split('.')[0]}-page-${idx + 1}.png`, { type: 'image/png' }),
          previewUrl: URL.createObjectURL(blob),
          status: 'idle'
        }));
        setFiles(prev => [...prev, ...newItems]);
      } catch (err) {
        console.error(err);
        setGlobalStatus('error');
      } finally {
        setGlobalStatus('idle');
      }
      return;
    }

    const newFiles: FileItem[] = Array.from(selectedFiles).map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'idle'
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, [isPdfToImage]);

  const removeFile = (id: string) => {
    setFiles(prev => {
      const filtered = prev.filter(f => f.id !== id);
      const removed = prev.find(f => f.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return filtered;
    });
  };

  const handleConvertAll = async () => {
    setGlobalStatus('processing');
    const updatedFiles = [...files];
    
    for (let i = 0; i < updatedFiles.length; i++) {
      if (updatedFiles[i].status === 'success') continue;
      
      updatedFiles[i] = { ...updatedFiles[i], status: 'processing' };
      setFiles([...updatedFiles]);

      try {
        const result = await processImageFile(updatedFiles[i].file, {
          targetFormat,
          quality,
          resizeWidth,
          resizeHeight,
          watermarkText: watermarkText || undefined
        });

        updatedFiles[i] = {
          ...updatedFiles[i],
          status: 'success',
          resultUrl: URL.createObjectURL(result),
          resultSize: result.size,
          resultBlob: result
        };
      } catch (error) {
        console.error(error);
        updatedFiles[i] = { ...updatedFiles[i], status: 'error' };
      }
      setFiles([...updatedFiles]);
    }
    setGlobalStatus('success');
  };

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    const folderName = customPrefix || 'soto-converted';
    const folder = zip.folder(folderName);
    
    files.forEach((item, idx) => {
      if (item.resultBlob) {
        const ext = isVectorizer ? 'svg' : targetFormat.split('/')[1];
        const fileName = customPrefix 
          ? `${customPrefix}-${idx + 1}.${ext}`
          : item.file.name.replace(/\.[^/.]+$/, "") + `.${ext}`;
        folder?.file(fileName, item.resultBlob);
      }
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${folderName}.zip`;
    link.click();
  };

  const handleDownloadPDF = async () => {
    const doc = new jsPDF();
    
    setGlobalStatus('processing');
    
    try {
      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        const imgBlob = item.resultBlob || item.file;
        const imgData = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(imgBlob);
        });

        const img = new Image();
        await new Promise((resolve) => {
          img.onload = resolve;
          img.src = imgData;
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        
        if (i > 0) doc.addPage();
        doc.addImage(imgData, 'JPEG', (pageWidth - w) / 2, (pageHeight - h) / 2, w, h);
      }
      doc.save(`${customPrefix || 'soto-document'}.pdf`);
      setGlobalStatus('success');
    } catch (err) {
      console.error(err);
      setGlobalStatus('error');
    }
  };

  return (
    <div className="converter-container" style={{maxWidth: 1200, margin: '0 auto', padding: '20px'}}>
      <Helmet>
        <title>{pageSEO?.title}</title>
        <meta name="description" content={pageSEO?.desc} />
      </Helmet>

      <div className="tool-header animate-fade-in" style={{textAlign: 'center', marginBottom: 40}}>
        <h1 style={{fontSize: '2.5rem', fontWeight: 800, marginBottom: 12, background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
          {pageSEO?.title?.split(' - ')[0]}
        </h1>
        <p style={{color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6}}>
           {pageSEO?.desc}
        </p>
      </div>

      <div className="converter-grid" style={{display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: 32}}>
        <div className="main-workarea">
          <div 
            className={`dropzone ${isDragging ? 'dragging' : ''} ${files.length > 0 ? 'has-files' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFilesInput(e.dataTransfer.files); }}
            onClick={() => fileInputRef.current?.click()}
            style={{border: '2px dashed var(--glass-border)', borderRadius: 24, padding: 60, textAlign: 'center', background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', transition: '0.3s', cursor: 'pointer'}}
          >
            <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && processFilesInput(e.target.files)} multiple hidden accept={isPdfToImage ? '.pdf' : 'image/*,.heic'} />
            <div className="dropzone-content">
              <UploadCloud size={64} className="text-accent" style={{marginBottom: 20, opacity: 0.8}} />
              <h3 style={{fontSize: '1.2rem', fontWeight: 700, marginBottom: 8}}>
                {isPdfToImage ? 'Pilih atau Seret File PDF' : 'Seret & Lepas Gambar'}
              </h3>
              <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Bersifat batch (bisa banyak sekaligus) & 100% Client-side</p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="file-list-section animate-fade-in" style={{marginTop: 32}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
                <h4 style={{fontWeight: 700}}>Antrean File ({files.length})</h4>
                <button className="text-btn" onClick={() => setFiles([])} style={{fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 600}}>Hapus Semua</button>
              </div>
              <div className="file-items-grid" style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                {files.map((file, idx) => (
                  <FileListItem 
                    key={file.id} 
                    item={file} 
                    idx={idx} 
                    formatBytes={formatBytes} 
                    onRemove={removeFile}
                    onEdit={() => {}}
                    isVectorizer={isVectorizer}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="options-sidebar" style={{position: 'sticky', top: 100, height: 'fit-content'}}>
          <div className="sidebar-card" style={{background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', borderRadius: 24, padding: 24, border: '1px solid var(--glass-border)'}}>
            <h4 style={{fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8}}>
              <SlidersHorizontal size={20} className="text-accent" /> Control Panel
            </h4>
            
            {!isVectorizer && !isWebpToGif && (
              <div className="control-group" style={{marginBottom: 20}}>
                <label style={{display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600}}>Format Output</label>
                <select 
                  className="custom-select" 
                  value={targetFormat} 
                  onChange={(e) => setTargetFormat(e.target.value as ImageFormat)}
                  style={{width: '100%', padding: '12px', borderRadius: 12, border: '1px solid var(--glass-border)', background: 'var(--surface)', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer'}}
                >
                  <option value="image/webp">WEBP (Rekomendasi)</option>
                  <option value="image/png">PNG (Lossless)</option>
                  <option value="image/jpeg">JPG (Kualitas Foto)</option>
                  <option value="image/avif">AVIF (Next-Gen)</option>
                </select>
              </div>
            )}

            <AdvancedOptions 
              showAdvanced={showAdvanced}
              setShowAdvanced={setShowAdvanced}
              resizeWidth={resizeWidth}
              setResizeWidth={setResizeWidth}
              resizeHeight={resizeHeight}
              setResizeHeight={setResizeHeight}
              watermarkText={watermarkText}
              setWatermarkText={setWatermarkText}
              customPrefix={customPrefix}
              setCustomPrefix={setCustomPrefix}
              globalStatus={globalStatus}
            />

            <div className="action-section" style={{marginTop: 24}}>
              {globalStatus === 'idle' || globalStatus === 'error' ? (
                <button className="primary-btn" onClick={isImageToPdf ? handleDownloadPDF : handleConvertAll} style={{width: '100%'}}>
                  {isImageToPdf ? <FileText size={20} className="btn-icon" /> : <Zap size={20} className="btn-icon" />}
                  {isImageToPdf ? 'Generate & Download PDF' : 
                   isGifToWebp ? 'Convert GIF to WebP' :
                   isWebpToGif ? 'Convert WebP to GIF' :
                   isVectorizer ? 'Vectorize to SVG' :
                   isWatermarkTool ? 'Apply Watermark' : 'Convert Semua'}
                </button>
              ) : globalStatus === 'processing' ? (
                 <div className="processing-indicator" style={{textAlign: 'center', padding: '12px', background: 'var(--icon-bg)', borderRadius: 12}}>
                    <RefreshCw size={24} className="spinning text-accent" style={{margin: '0 auto 8px'}} />
                    <span style={{fontSize: '0.9rem', fontWeight: 600}}>Sedang Memproses...</span>
                 </div>
              ) : globalStatus === 'success' ? (
                 <div className="success-actions animate-bounce-in" style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 8, color: 'var(--success)', fontWeight: 600, justifyContent: 'center', marginBottom: 8}}>
                       <CheckCircle2 size={20} /> Konversi Selesai!
                    </div>
                    {!isImageToPdf && (
                      <button className="primary-btn download-btn" onClick={handleDownloadZip} style={{width: '100%'}}>
                        <Archive size={20} className="btn-icon" /> Download All (.zip)
                      </button>
                    )}
                    <button className="secondary-btn" onClick={() => setGlobalStatus('idle')} style={{width: '100%'}}>Konversi Lagi</button>
                 </div>
              ) : null}
            </div>

            <div className="security-badge" style={{marginTop: 24, padding: 12, borderRadius: 12, background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', gap: 8}}>
              <ShieldCheck size={20} className="text-success" />
              <span style={{fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4}}>
                <b>Privasi Terjamin:</b> Proses dilakukan 100% di browser Anda. Tidak ada data yang dikirim ke server.
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

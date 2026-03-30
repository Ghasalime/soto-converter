import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Check, RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react';
import type { FileItem } from './FileListItem';

interface ImageEditorModalProps {
  item: FileItem;
  onSave: (newFile: File, newPreviewUrl: string) => void;
  onClose: () => void;
}

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ item, onSave, onClose }) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imgSrc, setImgSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Transformation states
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);

  useEffect(() => {
    setImgSrc(item.previewUrl);
  }, [item]);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        1,
        width,
        height
      ),
      width,
      height
    );
    setCrop(initialCrop);
  }

  async function handleSave() {
    if (!imgRef.current || !completedCrop) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set canvas size to the cropped area size
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    ctx.imageSmoothingQuality = 'high';

    // Handle transformations (Rotation & Flip)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.save();
    
    // Move to center to rotate/flip
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    ctx.translate(-centerX, -centerY);

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.restore();

    canvas.toBlob((blob) => {
      if (blob) {
        const newFile = new File([blob], item.file.name, { type: item.file.type });
        const newPreviewUrl = URL.createObjectURL(blob);
        onSave(newFile, newPreviewUrl);
      }
    }, item.file.type);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content editor-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-info">
            <h3>Edit & Potong</h3>
            <p>{item.file.name}</p>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="editor-body">
          <div className="crop-area">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
            >
              <img
                ref={imgRef}
                src={imgSrc}
                alt="Editor"
                onLoad={onImageLoad}
                className="editor-image-preview"
                style={{ 
                    transform: `rotate(${rotation}deg) scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`,
                }}
              />
            </ReactCrop>
          </div>

          <div className="editor-sidebar-controls">
            <div className="control-section">
                <label className="section-label">Transformasi</label>
                <div className="button-grid-small">
                    <button className="tool-button" onClick={() => setRotation(prev => (prev + 90) % 360)} title="Rotasi 90°">
                        <RotateCw size={18} />
                    </button>
                    <button className={`tool-button ${flipX ? 'active' : ''}`} onClick={() => setFlipX(!flipX)} title="Flip Horizontal">
                        <FlipHorizontal size={18} />
                    </button>
                    <button className={`tool-button ${flipY ? 'active' : ''}`} onClick={() => setFlipY(!flipY)} title="Flip Vertical">
                        <FlipVertical size={18} />
                    </button>
                </div>
            </div>
            
            <div className="modal-footer-actions">
                <button className="secondary-btn" onClick={onClose}>Batal</button>
                <button className="primary-btn" onClick={handleSave}>
                    <Check size={18} className="btn-icon" /> Simpan
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

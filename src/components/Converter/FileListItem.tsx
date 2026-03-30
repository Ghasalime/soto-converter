import React from 'react';
import { X, Download, Scissors } from 'lucide-react';

export interface FileItem {
  id: string;
  file: File;
  previewUrl: string;
  status: 'idle' | 'processing' | 'success' | 'error';
  resultUrl?: string;
  resultSize?: number;
  resultBlob?: Blob;
}

interface FileListItemProps {
  item: FileItem;
  idx: number;
  formatBytes: (bytes: number) => string;
  onRemove: (id: string) => void;
  onEdit: (item: FileItem) => void;
  isVectorizer: boolean;
}

export const FileListItem: React.FC<FileListItemProps> = ({
  item, idx: _idx, formatBytes, onRemove, onEdit, isVectorizer
}) => {
  return (
    <div className={`file-item animate-fade-in ${item.status}`} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--glass-border)', transition: '0.3s'
    }}>
      <div className="file-preview" style={{width: 48, height: 48, borderRadius: 8, overflow: 'hidden', flexShrink: 0, position: 'relative', background: 'var(--icon-bg)'}}>
        <img src={item.previewUrl} alt="preview" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
      
      <div className="file-info" style={{flex: 1, minWidth: 0}}>
        <div className="file-name" style={{fontSize: '0.9rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
          {item.file.name}
        </div>
        <div className="file-meta" style={{fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: 8}}>
          <span>{formatBytes(item.file.size)}</span>
          {item.status === 'success' && item.resultSize && (
            <span className="text-success" style={{fontWeight: 600}}>
              → {formatBytes(item.resultSize)} ({Math.round((1 - item.resultSize / item.file.size) * 100)}% hemat)
            </span>
          )}
        </div>
      </div>

      <div className="file-actions" style={{display: 'flex', gap: 6}}>
        {item.status === 'idle' && (
          <button className="icon-btn" onClick={() => onEdit(item)} title="Edit & Potong">
            <Scissors size={18} />
          </button>
        )}
        
        {item.status === 'success' && item.resultUrl && (
          <a href={item.resultUrl} download={item.file.name.split('.')[0] + (isVectorizer ? '.svg' : '.webp')} className="icon-btn success">
            <Download size={18} />
          </a>
        )}
        
        <button className="icon-btn danger" onClick={() => onRemove(item.id)}>
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

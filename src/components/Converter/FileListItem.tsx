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
    <div className={`file-card animate-fade-in ${item.status}`}>
      <div className="mini-preview-container">
        <img src={item.previewUrl} alt="preview" className="mini-preview" />
      </div>
      
      <div className="file-details">
        <div className="filename">
          {item.file.name}
        </div>
        <div className="filesize-info">
          <span>{formatBytes(item.file.size)}</span>
          {item.status === 'success' && item.resultSize && (
            <span className="new-size">
              → {formatBytes(item.resultSize)} ({Math.round((1 - item.resultSize / item.file.size) * 100)}% hemat)
            </span>
          )}
        </div>
      </div>

      <div className="file-actions">
        {item.status === 'idle' && (
          <button className="icon-btn edit-btn" onClick={() => onEdit(item)} title="Edit & Potong">
            <Scissors size={18} />
          </button>
        )}
        
        {item.status === 'success' && item.resultUrl && (
          <a href={item.resultUrl} download={item.file.name.split('.')[0] + (isVectorizer ? '.svg' : '.webp')} className="icon-btn download-single">
            <Download size={18} />
          </a>
        )}
        
        <button className="icon-btn remove-single" onClick={() => onRemove(item.id)}>
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

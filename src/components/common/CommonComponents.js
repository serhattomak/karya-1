/**
 * Common UI Components
 * Reusable components to reduce duplication
 */

import React from 'react';
import { LOADING_STATES, UI_DEFAULTS } from '../config/constants';
import './CommonComponents.css';

// Loading Component
export const Loading = ({ 
  text = UI_DEFAULTS.LOADING_TEXT, 
  size = 'medium',
  className = '' 
}) => {
  return (
    <div className={`loading-container ${size} ${className}`}>
      <div className="loading-spinner"></div>
      <span className="loading-text">{text}</span>
    </div>
  );
};

// Error Component
export const ErrorMessage = ({ 
  message, 
  onRetry, 
  retryText = UI_DEFAULTS.RETRY_TEXT,
  className = ''
}) => {
  return (
    <div className={`error-container ${className}`}>
      <div className="error-icon">⚠️</div>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button 
          className="error-retry-button" 
          onClick={onRetry}
        >
          {retryText}
        </button>
      )}
    </div>
  );
};

// Empty State Component
export const EmptyState = ({ 
  message = UI_DEFAULTS.NO_DATA_TEXT,
  icon = "📄",
  action,
  actionText,
  className = ''
}) => {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state-icon">{icon}</div>
      <p className="empty-state-message">{message}</p>
      {action && actionText && (
        <button 
          className="empty-state-action" 
          onClick={action}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

// Form Field Component
export const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  placeholder,
  disabled = false,
  className = '',
  ...props
}) => {
  const hasError = touched && error;

  return (
    <div className={`form-field ${hasError ? 'has-error' : ''} ${className}`}>
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required-marker">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="form-textarea"
          {...props}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className="form-select"
          {...props}
        >
          {props.children}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="form-input"
          {...props}
        />
      )}
      
      {hasError && (
        <span className="form-error">{error}</span>
      )}
    </div>
  );
};

// File Upload Component
export const FileUpload = ({
  onFileSelect,
  accept,
  multiple = false,
  maxSize,
  className = '',
  children,
  dragDropText = "Dosyaları buraya sürükleyin veya tıklayarak seçin"
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    onFileSelect(multiple ? files : files[0]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    onFileSelect(multiple ? files : files[0]);
  };

  return (
    <div 
      className={`file-upload ${isDragOver ? 'drag-over' : ''} ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="file-upload-input"
        id="file-upload"
      />
      
      <label htmlFor="file-upload" className="file-upload-label">
        {children || (
          <div className="file-upload-content">
            <div className="file-upload-icon">📁</div>
            <p className="file-upload-text">{dragDropText}</p>
            {maxSize && (
              <p className="file-upload-size">Maksimum dosya boyutu: {maxSize}</p>
            )}
          </div>
        )}
      </label>
    </div>
  );
};

// Pagination Component
export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showSizeChanger = true,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  total,
  className = ''
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`pagination ${className}`}>
      <div className="pagination-controls">
        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          « Önceki
        </button>
        
        {getPageNumbers().map(pageNum => (
          <button
            key={pageNum}
            className={`pagination-btn ${pageNum === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </button>
        ))}
        
        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Sonraki »
        </button>
      </div>
      
      {showSizeChanger && (
        <div className="pagination-size-changer">
          <label>
            Sayfa başına:
            <select 
              value={pageSize} 
              onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
            >
              {pageSizeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
      )}
      
      {total && (
        <div className="pagination-total">
          Toplam {total} kayıt
        </div>
      )}
    </div>
  );
};

// Modal Component
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  closeOnBackdrop = true,
  className = ''
}) => {
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className={`modal-overlay ${className}`}
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div 
        className={`modal-content ${size}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button 
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

// Search Component
export const SearchInput = ({
  value,
  onChange,
  placeholder = "Ara...",
  onClear,
  debounceMs = 300,
  className = ''
}) => {
  const [localValue, setLocalValue] = React.useState(value);
  const timeoutRef = React.useRef();

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  React.useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange(localValue);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [localValue, onChange, debounceMs]);

  return (
    <div className={`search-input ${className}`}>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="search-field"
      />
      <div className="search-icon">🔍</div>
      {localValue && onClear && (
        <button 
          className="search-clear"
          onClick={() => {
            setLocalValue('');
            onClear();
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

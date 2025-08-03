import React, { useState, useEffect } from "react";
import { getActiveDocuments } from "../../../api";
import "./DocumentSelectorModal.css";

const DocumentSelectorModal = ({ 
  isOpen, 
  onClose, 
  onSelectDocuments, 
  selectedDocumentIds = [],
  title = "Dosya Seç",
  multiple = true 
}) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState(selectedDocumentIds);

  useEffect(() => {
    if (isOpen) {
      fetchDocuments();
      setSelectedIds(selectedDocumentIds);
    }
  }, [isOpen, selectedDocumentIds]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await getActiveDocuments();
      const docs = response?.data?.data || response?.data || [];
      setDocuments(docs);
    } catch (error) {
      console.error("Dosyalar yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentToggle = (documentId) => {
    if (multiple) {
      setSelectedIds(prev => 
        prev.includes(documentId)
          ? prev.filter(id => id !== documentId)
          : [...prev, documentId]
      );
    } else {
      setSelectedIds([documentId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredDocuments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDocuments.map(doc => doc.id));
    }
  };

  const handleConfirm = () => {
    const selectedDocuments = documents.filter(doc => selectedIds.includes(doc.id));
    onSelectDocuments(selectedDocuments);
    onClose();
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = [...new Set(documents.map(doc => doc.category).filter(Boolean))];

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="document-selector-modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="modal-filters">
          <div className="search-section">
            <input
              type="text"
              placeholder="Dosya ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-section">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="category-filter"
            >
              <option value="">Tüm Kategoriler</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {multiple && (
              <button 
                onClick={handleSelectAll}
                className="select-all-btn"
              >
                {selectedIds.length === filteredDocuments.length ? 'Tümünü Kaldır' : 'Tümünü Seç'}
              </button>
            )}
          </div>
        </div>

        <div className="documents-list">
          {loading ? (
            <div className="loading">Dosyalar yükleniyor...</div>
          ) : filteredDocuments.length === 0 ? (
            <div className="no-documents">
              {searchTerm || categoryFilter 
                ? "Filtrelere uygun dosya bulunamadı."
                : "Aktif dosya bulunamadı."
              }
            </div>
          ) : (
            <div className="documents-grid">
              {filteredDocuments.map(document => (
                <div 
                  key={document.id}
                  className={`document-card ${selectedIds.includes(document.id) ? 'selected' : ''}`}
                  onClick={() => handleDocumentToggle(document.id)}
                >
                  <div className="document-preview">
                    {document.previewImageUrl ? (
                      <img 
                        src={document.previewImageUrl} 
                        alt={document.name}
                        className="preview-image"
                      />
                    ) : (
                      <div className="no-preview">📄</div>
                    )}
                    
                    <div className="selection-indicator">
                      {selectedIds.includes(document.id) && <span>✓</span>}
                    </div>
                  </div>

                  <div className="document-info">
                    <h4 className="document-name">{document.name}</h4>
                    
                    {document.description && (
                      <p className="document-description">{document.description}</p>
                    )}
                    
                    <div className="document-meta">
                      {document.category && (
                        <span className="category-tag">{document.category}</span>
                      )}
                      <span className="file-size">{formatFileSize(document.fileSize)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <div className="selection-info">
            {multiple ? (
              <span>{selectedIds.length} dosya seçili</span>
            ) : (
              <span>{selectedIds.length > 0 ? '1 dosya seçili' : 'Dosya seçin'}</span>
            )}
          </div>
          
          <div className="action-buttons">
            <button onClick={onClose} className="cancel-btn">
              İptal
            </button>
            <button 
              onClick={handleConfirm} 
              className="confirm-btn"
              disabled={selectedIds.length === 0}
            >
              Seç ({selectedIds.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentSelectorModal;

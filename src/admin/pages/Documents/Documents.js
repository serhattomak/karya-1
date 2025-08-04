import React, { useEffect, useState } from "react";
import { 
  getDocuments, 
  deleteDocument, 
  getProducts as getProductsAPI, 
  getPages as getPagesAPI,
  getFiles,
  deleteFile
} from "../../../api";
import DocumentModal from "./DocumentModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import DocumentDetailModal from "./DocumentDetailModal";
import Swal from 'sweetalert2';
import "./Documents.css";

const BASE_URL = "https://localhost:7103/";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [files, setFiles] = useState([]);
  const [combinedItems, setCombinedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, [pagination.pageIndex, pagination.pageSize]);

  const testBackendParams = async () => {
    console.log("=== Backend Parameter Test Başlıyor ===");
    
    const testCases = [
      { PageIndex: 0, PageSize: 10 },
      { PageIndex: 1, PageSize: 10 },
      { PageIndex: 0, PageSize: 1 },
    ];
    
    for (const testParams of testCases) {
      try {
        console.log(`Test: ${JSON.stringify(testParams)}`);
        const response = await getDocuments(testParams);
        console.log(`Başarılı: ${JSON.stringify(testParams)}`, response.data);
      } catch (error) {
        console.error(`Hata: ${JSON.stringify(testParams)}`, error.message);
      }
    }
    
    console.log("=== Backend Parameter Test Tamamlandı ===");
  };

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
    }
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      
      console.log("Document ve File fetch başlıyor...");
      
      const [documentsResponse, filesResponse] = await Promise.all([
        getDocuments().catch(error => {
          console.warn("Documents fetch hatası:", error);
          return { data: { items: [], totalCount: 0 } };
        }),
        getFiles().catch(error => {
          console.warn("Files fetch hatası:", error);
          return { data: [] };
        })
      ]);
      
      console.log("Documents API Response:", documentsResponse);
      console.log("Files API Response:", filesResponse);
      
      const documentsData = documentsResponse?.data?.data || documentsResponse?.data || documentsResponse;
      let documentItems = [];
      let totalCount = 0;
      
      if (documentsData && !documentsData.errorMessage) {
        documentItems = documentsData?.items || documentsData || [];
        totalCount = documentsData?.totalCount || 0;
      } else if (documentsData?.errorMessage && documentsData.errorMessage.includes("No documents found")) {
        console.log("Henüz dokuman bulunmuyor");
        documentItems = [];
        totalCount = 0;
      }
      
      const filesData = filesResponse?.data?.data || filesResponse?.data || filesResponse;
      let fileItems = [];
      
      if (Array.isArray(filesData)) {
        fileItems = filesData.map(file => ({
          ...file,
          type: 'file',
          name: file.fileName || file.name || 'Untitled',
          category: 'Sistem Dosyası',
          mimeType: file.contentType || file.mimeType,
          fileSize: file.size || file.fileSize,
          isActive: true,
          displayOrder: 999,
          previewImageUrl: file.path || file.url,
          slug: file.fileName ? file.fileName.toLowerCase().replace(/\s+/g, '-') : 'file-' + file.id
        }));
      }
      
      console.log("İşlenmiş Documents:", documentItems);
      console.log("İşlenmiş Files:", fileItems);
      
      const documentsWithType = documentItems.map(doc => ({
        ...doc,
        type: 'document'
      }));
      
      const combined = [...documentsWithType, ...fileItems];
      
      setDocuments(documentsWithType);
      setFiles(fileItems);
      setCombinedItems(combined);
      
      const totalPages = Math.max(1, Math.ceil((documentItems.length + fileItems.length) / 10));
      setPagination(prev => ({
        ...prev,
        pageIndex: 1,
        pageSize: 10,
        totalCount: documentItems.length + fileItems.length,
        totalPages: totalPages
      }));
      
    } catch (error) {
      console.error("Dosyalar yüklenirken hata:", error);
      console.error("Hata detayları:", error.response?.data);
      console.error("API URL:", error.config?.url);
      console.error("API Params:", error.config?.params);
      
      if (error.message?.includes('offset') || error.message?.includes('OFFSET')) {
        console.log("Pagination hatası tespit edildi, ilk sayfaya dönülüyor...");
        setPagination(prev => ({ ...prev, pageIndex: 1 }));
        return;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Dosyalar yüklenirken bir hata oluştu.',
        confirmButtonText: 'Tamam',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDocument = () => {
    setSelectedDocument(null);
    setShowModal(true);
  };

  const handleEditDocument = (document) => {
    setSelectedDocument(document);
    setShowModal(true);
  };

  const handleViewDetails = (document) => {
    setSelectedDocument(document);
    setShowDetailModal(true);
  };

  const handleDeleteClick = (document) => {
    setDocumentToDelete(document);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;
    
    try {
      if (documentToDelete.type === 'file') {
        await deleteFile(documentToDelete.id);
        setFiles(files.filter(f => f.id !== documentToDelete.id));
      } else {
        await deleteDocument(documentToDelete.id);
        setDocuments(documents.filter(d => d.id !== documentToDelete.id));
      }
      
      setCombinedItems(combinedItems.filter(item => item.id !== documentToDelete.id));
      
      setShowDeleteModal(false);
      setDocumentToDelete(null);
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Dosya başarıyla silindi!',
        confirmButtonText: 'Tamam',
        confirmButtonColor: '#28a745',
        timer: 2000,
        timerProgressBar: true
      });
    } catch (error) {
      console.error("Dosya silinirken hata:", error);
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Dosya silinirken bir hata oluştu.',
        confirmButtonText: 'Tamam',
        confirmButtonColor: '#dc3545'
      });
    }
  };

  const handleModalSave = () => {
    setShowModal(false);
    fetchDocuments();
  };

  const handlePageChange = (newPage) => {
    const totalPages = Math.max(1, pagination.totalPages);
    const safePage = Math.max(1, Math.min(newPage, totalPages));
    
    console.log(`Sayfa değişimi: ${pagination.pageIndex} -> ${safePage}`);
    
    if (safePage !== pagination.pageIndex) {
      setPagination(prev => ({ ...prev, pageIndex: safePage }));
    }
  };

  const handlePageSizeChange = (newSize) => {
    const safeSize = Math.max(1, Math.min(newSize, 100));
    
    console.log(`Sayfa boyutu değişimi: ${pagination.pageSize} -> ${safeSize}`);
    
    setPagination(prev => ({ 
      ...prev, 
      pageSize: safeSize, 
      pageIndex: 1
    }));
  };

  const filteredDocuments = combinedItems.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const matchesStatus = statusFilter === "" || 
                         (statusFilter === "active" && item.isActive) ||
                         (statusFilter === "inactive" && !item.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const uniqueCategories = [...new Set(combinedItems.map(item => item.category).filter(Boolean))];

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return 'Bilinmiyor';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const renderPagination = () => {
    const currentPage = Math.max(1, pagination.pageIndex);
    const totalPages = Math.max(1, pagination.totalPages);
    const totalCount = Math.max(0, pagination.totalCount);
    
    if (totalCount === 0) {
      return (
        <div className="pagination-controls">
          <div className="pagination-info">
            <span>Henüz dosya bulunmuyor</span>
          </div>
        </div>
      );
    }
    
    return (
      <div className="pagination-controls">
        <div className="pagination-info">
          <span>
            Toplam {totalCount} kayıt - Sayfa {currentPage} / {totalPages}
          </span>
        </div>
        <div className="pagination-buttons">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1 || totalCount === 0}
            className="pagination-btn"
          >
            İlk
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || totalCount === 0}
            className="pagination-btn"
          >
            Önceki
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalCount === 0}
            className="pagination-btn"
          >
            Sonraki
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || totalCount === 0}
            className="pagination-btn"
          >
            Son
          </button>
        </div>
        <div className="page-size-selector">
          <label>Sayfa başına: </label>
          <select
            value={pagination.pageSize}
            onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="documents-page">
        <div className="loading">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="documents-page">
      <div className="documents-header">
        <h1>Dosya Yönetimi</h1>
        <button onClick={handleAddDocument} className="add-btn">
          + Yeni Dosya Ekle
        </button>
      </div>

      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Dosya adı veya açıklama ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-controls">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Tüm Kategoriler</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Tüm Durumlar</option>
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
          </select>
        </div>
      </div>

      <div className="documents-table-container">
        <table className="documents-table">
          <thead>
            <tr>
              <th>Önizleme</th>
              <th>Ad</th>
              <th>Dosya Tipi</th>
              <th>Kategori</th>
              <th>Boyut</th>
              <th>Durum</th>
              <th>Sıra</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((document) => (
              <tr key={document.id}>
                <td>
                  <div className="document-preview">
                    {(document.previewImageUrl || document.previewImageFile?.path) ? (
                      <img 
                        src={
                          document.previewImageUrl && document.previewImageUrl.startsWith('http') 
                            ? document.previewImageUrl 
                            : document.previewImageFile?.path
                              ? `${BASE_URL}${document.previewImageFile.path}`
                              : document.previewImageUrl
                                ? `${BASE_URL}${document.previewImageUrl}`
                                : null
                        } 
                        alt={document.name}
                        className="preview-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="no-preview" style={{display: (document.previewImageUrl || document.previewImageFile?.path) ? 'none' : 'flex'}}>
                      {document.mimeType?.includes('image') ? '🖼️' :
                       document.mimeType?.includes('pdf') ? '📄' :
                       document.mimeType?.includes('word') ? '📝' :
                       document.mimeType?.includes('excel') || document.mimeType?.includes('sheet') ? '📊' :
                       document.mimeType?.includes('powerpoint') || document.mimeType?.includes('presentation') ? '📋' :
                       document.mimeType?.includes('zip') || document.mimeType?.includes('rar') ? '📦' :
                       '📄'}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="document-info">
                    <div className="document-name">{document.name}</div>
                    {document.description && (
                      <div className="document-description">{document.description}</div>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`file-type-badge ${document.type}`}>
                    {document.type === 'file' ? 'Sistem Dosyası' : 'Döküman'}
                  </span>
                </td>
                <td>
                  <span className="category-badge">
                    {document.category || 'Kategori Yok'}
                  </span>
                </td>
                <td>{formatFileSize(document.fileSize)}</td>
                <td>
                  <span className={`status-badge ${document.isActive ? 'active' : 'inactive'}`}>
                    {document.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td>{document.order || document.order === 0 ? document.order : 'Belirlenmemiş'}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleViewDetails(document)}
                      className="action-btn detail-btn"
                      title="Detayları Görüntüle"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                    </button>
                    {document.type === 'document' && (
                      <button
                        onClick={() => handleEditDocument(document)}
                        className="action-btn edit-btn"
                        title="Düzenle"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteClick(document)}
                      className="action-btn delete-btn"
                      title="Sil"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredDocuments.length === 0 && (
          <div className="no-data">
            {searchTerm || categoryFilter || statusFilter
              ? "Filtrelere uygun dosya bulunamadı."
              : "Henüz dosya eklenmemiş."}
          </div>
        )}
      </div>

      {renderPagination()}

      {showModal && (
        <DocumentModal
          document={selectedDocument}
          onSave={handleModalSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          document={documentToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {showDetailModal && (
        <DocumentDetailModal
          document={selectedDocument}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
};

export default Documents;

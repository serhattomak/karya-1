import React, { useState, useEffect } from "react";
import { getProducts, getPages, downloadDocument } from "../../../api";
import Swal from "sweetalert2";
import "./DocumentDetailModal.css";

const DocumentDetailModal = ({ document, onClose }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedPages, setRelatedPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (document) {
      fetchRelatedData();
    }
  }, [document]);

  const fetchRelatedData = async () => {
    try {
      setLoading(true);
      
      // İlişkili ürünleri ve sayfaları getir
      const [productsResponse, pagesResponse] = await Promise.all([
        getProducts({}),
        getPages({})
      ]);

      const products = productsResponse?.data?.data?.items || productsResponse?.data?.items || [];
      const pages = pagesResponse?.data?.data?.items || pagesResponse?.data?.items || [];

      // Dosya ID'si ile ilişkili ürün ve sayfaları filtrele
      const linkedProducts = products.filter(product => 
        product.fileIds && product.fileIds.includes(document.fileId)
      );

      const linkedPages = pages.filter(page => 
        page.fileIds && page.fileIds.includes(document.fileId)
      );

      setRelatedProducts(linkedProducts);
      setRelatedPages(linkedPages);
    } catch (error) {
      console.error("İlişkili veriler yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await downloadDocument(document.id);
      
      // Blob'dan dosya oluştur ve indir
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', document.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      Swal.fire({
        icon: 'success',
        title: 'İndirme Başladı!',
        text: 'Dosya indirme işlemi başlatıldı.',
        timer: 2000,
        timerProgressBar: true
      });
    } catch (error) {
      console.error("Dosya indirilirken hata:", error);
      Swal.fire({
        icon: 'error',
        title: 'İndirme Hatası!',
        text: 'Dosya indirilirken bir hata oluştu.',
        confirmButtonColor: '#dc3545'
      });
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return 'Bilinmiyor';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatMimeType = (mimeType) => {
    if (!mimeType) return 'Bilinmiyor';
    
    const mimeTypeMap = {
      'application/pdf': 'PDF Dosyası',
      'application/msword': 'Word Belgesi',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Belgesi (.docx)',
      'application/vnd.ms-excel': 'Excel Dosyası',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Dosyası (.xlsx)',
      'application/vnd.ms-powerpoint': 'PowerPoint Sunumu',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint Sunumu (.pptx)',
      'application/zip': 'ZIP Arşivi',
      'application/x-rar-compressed': 'RAR Arşivi',
      'text/plain': 'Metin Dosyası',
      'image/jpeg': 'JPEG Resmi',
      'image/png': 'PNG Resmi',
      'image/gif': 'GIF Resmi',
      'image/webp': 'WebP Resmi'
    };
    
    return mimeTypeMap[mimeType] || mimeType;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!document) return null;

  return (
    <div className="AdminModalOverlay">
      <div className="AdminDocumentDetailModal">
        <div className="AdminModalHeader">
          <h2>Dosya Detayları</h2>
          <button onClick={onClose} className="AdminCloseBtn">×</button>
        </div>

        <div className="AdminModalContent">
          <div className="AdminDocumentInfoSection">
            <div className="AdminDocumentPreviewSection">
              {(document.previewImageUrl || document.previewImageFile?.path) ? (
                <img 
                  src={
                    document.previewImageUrl && document.previewImageUrl.startsWith('http') 
                      ? document.previewImageUrl 
                      : document.previewImageFile?.path
                        ? `https://localhost:7103/${document.previewImageFile.path}`
                        : document.previewImageUrl
                          ? `https://localhost:7103/${document.previewImageUrl}`
                          : null
                  } 
                  alt={document.name}
                  className="AdminPreviewImageLarge"
                />
              ) : (
                <div className="AdminNoPreviewLarge">
                  {document.mimeType?.includes('image') ? '�️' :
                   document.mimeType?.includes('pdf') ? '�📄' :
                   document.mimeType?.includes('word') ? '📝' :
                   document.mimeType?.includes('excel') || document.mimeType?.includes('sheet') ? '📊' :
                   document.mimeType?.includes('powerpoint') || document.mimeType?.includes('presentation') ? '📋' :
                   document.mimeType?.includes('zip') || document.mimeType?.includes('rar') ? '📦' :
                   '📄'}
                </div>
              )}
            </div>

            <div className="AdminDocumentDetails">
              <h3>{document.name}</h3>
              
              <div className="AdminDetailGrid">
                <div className="AdminDetailItem">
                  <label>Kategori:</label>
                  <span className="AdminCategoryBadge">
                    {document.category || 'Kategori Yok'}
                  </span>
                </div>

                <div className="AdminDetailItem">
                  <label>Durum:</label>
                  <span className={`AdminStatusBadge ${document.isActive ? 'active' : 'inactive'}`}>
                    {document.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>

                <div className="AdminDetailItem">
                  <label>Dosya Boyutu:</label>
                  <span>{formatFileSize(document.fileSize)}</span>
                </div>

                <div className="AdminDetailItem">
                  <label>MIME Tipi:</label>
                  <span>{formatMimeType(document.mimeType)}</span>
                </div>

                <div className="AdminDetailItem">
                  <label>Sıra:</label>
                  <span>{document.order || document.order === 0 ? document.order : 'Belirlenmemiş'}</span>
                </div>

                <div className="AdminDetailItem">
                  <label>Slug:</label>
                  <span className="AdminSlugText">{document.slug}</span>
                </div>
              </div>

              {document.description && (
                <div className="AdminDescriptionSection">
                  <label>Açıklama:</label>
                  <p className="AdminDescriptionText">{document.description}</p>
                </div>
              )}

              {document.url && (
                <div className="AdminUrlSection">
                  <label>Harici URL:</label>
                  <a href={document.url} target="_blank" rel="noopener noreferrer" className="AdminExternalLink">
                    {document.url}
                  </a>
                </div>
              )}

              <div className="AdminActionSection">
                <button onClick={handleDownload} className="AdminDownloadBtn">
                  📥 Dosyayı İndir
                </button>
              </div>
            </div>
          </div>

          <div className="AdminRelatedContentSection">
            <h4>İlişkili İçerik</h4>
            
            {loading ? (
              <div className="AdminLoadingRelated">Yükleniyor...</div>
            ) : (
              <>
                <div className="AdminRelatedProducts">
                  <h5>İlişkili Ürünler ({relatedProducts.length})</h5>
                  {relatedProducts.length > 0 ? (
                    <div className="AdminRelatedList">
                      {relatedProducts.map(product => (
                        <div key={product.id} className="AdminRelatedItem">
                          <span className="AdminItemName">{product.name}</span>
                          <span className="AdminItemSlug">{product.slug}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="AdminNoRelated">Bu dosyayı kullanan ürün bulunamadı.</p>
                  )}
                </div>

                <div className="AdminRelatedPages">
                  <h5>İlişkili Sayfalar ({relatedPages.length})</h5>
                  {relatedPages.length > 0 ? (
                    <div className="AdminRelatedList">
                      {relatedPages.map(page => (
                        <div key={page.id} className="AdminRelatedItem">
                          <span className="AdminItemName">{page.name}</span>
                          <span className="AdminItemSlug">{page.slug}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="AdminNoRelated">Bu dosyayı kullanan sayfa bulunamadı.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="AdminModalActions">
          <button onClick={onClose} className="AdminCloseModalBtn">
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailModal;

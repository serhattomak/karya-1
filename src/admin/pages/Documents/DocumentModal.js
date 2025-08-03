import React, { useState, useEffect } from "react";
import { createDocument, updateDocument, uploadFile, getFiles, checkBackendHealth } from "../../../api";
import Swal from "sweetalert2";
import "./DocumentModal.css";

const DocumentModal = ({ document, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    url: "",
    fileId: "",
    previewImageUrl: "",
    previewImageFileId: "",
    category: "",
    order: 0,
    isActive: true,
    mimeType: "",
    fileSize: 0
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState(null);
  const [availableFiles, setAvailableFiles] = useState([]);
  const [showFileSelector, setShowFileSelector] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [backendHealthy, setBackendHealthy] = useState(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  useEffect(() => {
    if (document) {
      const documentSlug = document.slug || generateSlug(document.name || 'document');
      setFormData({
        name: document.name || "",
        slug: documentSlug,
        description: document.description || "",
        url: document.url || "",
        fileId: document.fileId || "",
        previewImageUrl: document.previewImageUrl || "",
        previewImageFileId: document.previewImageFileId || "",
        category: document.category || "",
        order: document.order || 0,
        isActive: document.isActive !== undefined ? document.isActive : true,
        mimeType: document.mimeType || "",
        fileSize: document.fileSize || 0
      });
      
      // Preview URL'lerini set et
      if (document.previewImageUrl) {
        setPreviewUrl(document.previewImageUrl);
      } else if (document.previewImageFile?.path) {
        setPreviewUrl(`https://localhost:7103/${document.previewImageFile.path}`);
      }
      
      if (document.file?.path && document.file?.contentType?.startsWith('image/')) {
        setFilePreviewUrl(`https://localhost:7103/${document.file.path}`);
      }
    } else {
      // Yeni dosya oluşturma - form sıfırlama
      setFormData({
        name: "",
        slug: "",
        description: "",
        url: "",
        fileId: "",
        previewImageUrl: "",
        previewImageFileId: "",
        category: "",
        order: 0,
        isActive: true,
        mimeType: "",
        fileSize: 0
      });
      setSelectedFile(null);
      setSelectedPreviewImage(null);
      setPreviewUrl(null);
      setFilePreviewUrl(null);
    }
    
    fetchAvailableFiles();
  }, [document]);

  const fetchAvailableFiles = async () => {
    try {
      const response = await getFiles();
      setAvailableFiles(response.data || []);
    } catch (error) {
      console.error("Dosyalar yüklenirken hata:", error);
      setAvailableFiles([]);
    }
  };

  const generateSlug = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return 'Bilinmiyor';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "name") {
      const generatedSlug = generateSlug(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        slug: generatedSlug || 'document-slug' // Fallback slug
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("🔍 Dosya seçildi:", {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        isPDF: file.type === 'application/pdf'
      });

      // Dosya boyutu kontrolü (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        console.warn("❌ Dosya çok büyük:", file.size, "bytes");
        Swal.fire({
          icon: 'warning',
          title: 'Dosya Çok Büyük!',
          text: 'Dosya boyutu 10MB\'dan küçük olmalıdır.',
          confirmButtonColor: '#ffc107'
        });
        return;
      }

      // PDF dosyalar için özel kontrol
      if (file.type === 'application/pdf') {
        console.log("📄 PDF dosyası tespit edildi, özel kontroller yapılıyor...");
        
        // PDF boyut kontrolü
        if (file.size === 0) {
          console.error("❌ PDF dosyası boş!");
          Swal.fire({
            icon: 'error',
            title: 'PDF Dosyası Boş!',
            text: 'Seçilen PDF dosyası boş görünüyor. Lütfen başka bir dosya deneyin.',
            confirmButtonColor: '#dc3545'
          });
          return;
        }

        // PDF max boyut kontrolü (özel limit)
        const pdfMaxSize = 50 * 1024 * 1024; // PDF için 50MB
        if (file.size > pdfMaxSize) {
          console.warn("❌ PDF çok büyük:", file.size, "bytes");
          Swal.fire({
            icon: 'warning',
            title: 'PDF Dosyası Çok Büyük!',
            text: `PDF dosyası ${Math.round(file.size / (1024 * 1024))}MB. Maksimum 50MB olmalıdır.`,
            confirmButtonColor: '#ffc107'
          });
          return;
        }
      }

      setSelectedFile(file);
      setFormData(prev => ({
        ...prev,
        mimeType: file.type,
        fileSize: file.size
      }));
      
      // File preview oluştur
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setFilePreviewUrl(url);
      } else {
        setFilePreviewUrl(null);
      }

      console.log("✅ Dosya başarıyla seçildi ve form güncellendi");
    }
  };

  const handlePreviewImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Görsel boyutu kontrolü (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        Swal.fire({
          icon: 'warning',
          title: 'Görsel Çok Büyük!',
          text: 'Görsel boyutu 5MB\'dan küçük olmalıdır.',
          confirmButtonColor: '#ffc107'
        });
        return;
      }

      setSelectedPreviewImage(file);
      
      // Preview URL oluştur
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Sistemdeki dosyalardan seçme
  const handleSelectFromSystem = (file, isPreviewImage = false) => {
    if (isPreviewImage) {
      setFormData(prev => ({
        ...prev,
        previewImageFileId: file.id
      }));
      setPreviewUrl(`https://localhost:7103/${file.path}`);
      setShowImageSelector(false);
    } else {
      setFormData(prev => ({
        ...prev,
        fileId: file.id,
        mimeType: file.contentType || file.mimeType || "",
        fileSize: file.size || 0
      }));
      if (file.contentType?.startsWith('image/')) {
        setFilePreviewUrl(`https://localhost:7103/${file.path}`);
      }
      setShowFileSelector(false);
    }
  };

  // Backend sağlık kontrolü
  const handleHealthCheck = async () => {
    setCheckingHealth(true);
    try {
      const healthResult = await checkBackendHealth();
      setBackendHealthy(healthResult.isHealthy);
      
      if (healthResult.isHealthy) {
        Swal.fire({
          icon: 'success',
          title: 'Backend Sağlıklı! ✅',
          text: healthResult.message,
          confirmButtonColor: '#28a745'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Backend Bağlantı Problemi! ❌',
          html: `
            <p><strong>Sorun:</strong> ${healthResult.message}</p>
            <div style="text-align: left; margin-top: 15px;">
              <strong>Öneriler:</strong>
              <ul style="margin: 10px 0;">
                ${healthResult.suggestions.map(s => `<li>${s}</li>`).join('')}
              </ul>
            </div>
          `,
          confirmButtonColor: '#dc3545',
          width: '600px'
        });
      }
    } catch (error) {
      setBackendHealthy(false);
      Swal.fire({
        icon: 'error',
        title: 'Sağlık Kontrolü Başarısız!',
        text: 'Backend durumu kontrol edilemedi: ' + error.message,
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setCheckingHealth(false);
    }
  };

  // PDF test fonksiyonu
  const handlePDFTest = async () => {
    try {
      // Basit bir PDF test dosyası oluştur (minimal PDF header)
      const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Test PDF) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000125 00000 n 
0000000221 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
314
%%EOF`;

      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const testFile = new File([blob], 'test.pdf', { type: 'application/pdf' });
      
      console.log("🧪 PDF Test dosyası oluşturuldu:", {
        name: testFile.name,
        type: testFile.type,
        size: testFile.size
      });

      Swal.fire({
        title: 'PDF Test Başlatılıyor...',
        text: 'Küçük bir test PDF dosyası yükleniyor...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const uploadedId = await uploadFileAndGetId(testFile);
      
      Swal.fire({
        icon: 'success',
        title: 'PDF Test Başarılı! ✅',
        text: `Test PDF başarıyla yüklendi. File ID: ${uploadedId}`,
        confirmButtonColor: '#28a745'
      });

    } catch (error) {
      console.error("PDF test hatası:", error);
      Swal.fire({
        icon: 'error',
        title: 'PDF Test Başarısız! ❌',
        text: 'PDF test yüklemesi başarısız: ' + error.message,
        confirmButtonColor: '#dc3545'
      });
    }
  };

  const uploadFileAndGetId = async (file, retries = 3) => {
    console.log("🚀 Upload başlıyor:", {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      isPDF: file.type === 'application/pdf'
    });

    // Dosya boyutu kontrolü
    const maxSize = file.type === 'application/pdf' ? 50 * 1024 * 1024 : 100 * 1024 * 1024; // PDF için 50MB, diğerleri için 100MB
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      throw new Error(`Dosya boyutu çok büyük. Maksimum ${maxSizeMB}MB olmalıdır.`);
    }

    const fileFormData = new FormData();
    fileFormData.append('file', file);

    // PDF için özel formData kontrolü
    if (file.type === 'application/pdf') {
      console.log("📄 PDF FormData oluşturuluyor...");
      console.log("FormData entries:", Array.from(fileFormData.entries()));
    }

    // Upload state'ini başlat
    setUploadingFile(true);
    setUploadProgress(0);

    try {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          console.log(`📤 Dosya yükleniyor (Deneme ${attempt}/${retries}):`, file.name);
          
          // PDF için özel timeout ayarları
          const timeoutDuration = file.type === 'application/pdf' ? 600000 : 300000; // PDF için 10 dakika, diğerleri için 5 dakika
          
          const response = await uploadFile(fileFormData, {
            timeout: timeoutDuration,
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log(`📊 Upload progress (${file.name}): ${percentCompleted}%`);
                setUploadProgress(percentCompleted);
              }
            },
            // PDF için özel headers
            ...(file.type === 'application/pdf' && {
              maxContentLength: 50 * 1024 * 1024,
              maxBodyLength: 50 * 1024 * 1024,
            })
          });
          
          console.log("✅ Dosya yükleme response:", response);
          
          // Backend response yapısını analiz et
          console.log("🔍 Response data analizi:", {
            responseData: response.data,
            responseDataType: typeof response.data,
            hasData: !!response.data?.data,
            dataKeys: response.data ? Object.keys(response.data) : [],
            dataDataKeys: response.data?.data ? Object.keys(response.data.data) : []
          });
          
          // Yüklenen dosya ID'sini farklı yollardan bulmaya çalış
          let uploadedFileId = null;
          
          // 1. Önce direkt response.data.fileId veya id ara
          if (response.data?.fileId) {
            uploadedFileId = response.data.fileId;
            console.log("📌 File ID bulundu (fileId):", uploadedFileId);
          } else if (response.data?.id) {
            uploadedFileId = response.data.id;
            console.log("📌 File ID bulundu (id):", uploadedFileId);
          }
          // 2. Backend nested response yapısı varsa data.data içinde ara
          else if (response.data?.data?.fileId) {
            uploadedFileId = response.data.data.fileId;
            console.log("📌 File ID bulundu (data.fileId):", uploadedFileId);
          } else if (response.data?.data?.id) {
            uploadedFileId = response.data.data.id;
            console.log("📌 File ID bulundu (data.id):", uploadedFileId);
          }
          // 3. Backend'in response.data'nın kendisi string ID ise
          else if (typeof response.data === 'string') {
            uploadedFileId = response.data;
            console.log("📌 File ID bulundu (string):", uploadedFileId);
          }
          
          if (uploadedFileId) {
            console.log("🆔 Upload başarılı, File ID:", uploadedFileId);
            setFormData(prev => ({
              ...prev,
              mimeType: file.type,
              fileSize: file.size
            }));
            
            // Upload tamamlandı
            setUploadProgress(100);
            setTimeout(() => {
              setUploadingFile(false);
              setUploadProgress(0);
            }, 1000); // 1 saniye sonra progress bar'ı gizle
            
            return uploadedFileId;
          } else {
            // Tüm response'u logla ki backend'in tam olarak ne döndürdüğünü görelim
            console.error("❌ File ID bulunamadı. Tam response:", {
              fullResponse: response,
              responseData: response.data,
              responseDataString: JSON.stringify(response.data, null, 2)
            });
            throw new Error("File ID alınamadı - Backend response'da ID bulunamadı. Response: " + JSON.stringify(response.data));
          }
          
        } catch (error) {
          console.error(`❌ Dosya yükleme hatası (Deneme ${attempt}/${retries}):`, {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers
          });
          
          if (attempt === retries) {
            // Son deneme de başarısız oldu
            let errorMessage = 'Dosya yükleme başarısız oldu.';
            
            // PDF için özel hata mesajları
            if (file.type === 'application/pdf') {
              if (error.message.includes('413') || error.response?.status === 413) {
                errorMessage = 'PDF dosyası çok büyük. Backend PDF boyut limitini kontrol edin.';
              } else if (error.message.includes('415') || error.response?.status === 415) {
                errorMessage = 'PDF dosya formatı desteklenmiyor. Backend MIME type ayarlarını kontrol edin.';
              } else if (error.message.includes('timeout') || error.code === 'ECONNABORTED') {
                errorMessage = 'PDF yükleme zaman aşımına uğradı. Backend timeout ayarlarını kontrol edin.';
              } else if (error.message.includes('ERR_HTTP2_PROTOCOL_ERROR')) {
                errorMessage = 'PDF yükleme sırasında HTTP/2 protokol hatası. Backend HTTP ayarlarını kontrol edin.';
              } else if (error.message.includes('Network Error')) {
                errorMessage = 'PDF yükleme sırasında ağ hatası. Backend bağlantısını kontrol edin.';
              }
            } else {
              // Genel hata mesajları
              if (error.message.includes('Ağ bağlantısı hatası')) {
                errorMessage = 'Ağ bağlantı hatası. İnternet bağlantınızı kontrol edin.';
              } else if (error.message.includes('Sunucu bağlantı hatası') || error.message.includes('ERR_HTTP2_PROTOCOL_ERROR')) {
                errorMessage = 'Sunucu protokol hatası. Dosya çok büyük olabilir, lütfen daha küçük bir dosya deneyin.';
              } else if (error.message.includes('zaman aşımına uğradı')) {
                errorMessage = 'Dosya yükleme zaman aşımına uğradı. Lütfen daha küçük bir dosya deneyin.';
              } else if (error.response?.status === 413) {
                errorMessage = 'Dosya çok büyük. Daha küçük bir dosya seçin.';
              } else if (error.response?.status === 415) {
                errorMessage = 'Desteklenmeyen dosya formatı.';
              } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
              } else if (error.message) {
                errorMessage = error.message;
              }
            }
            
            console.error("🔥 Final error:", errorMessage);
            throw new Error(errorMessage);
          }
          
          // Bir sonraki deneme için kısa bir bekleme
          if (attempt < retries) {
            const waitTime = file.type === 'application/pdf' ? 3000 : 2000; // PDF için daha uzun bekleme
            console.log(`⏳ ${attempt + 1}. deneme için ${waitTime/1000} saniye bekleniyor...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
        }
      }
    } finally {
      // Her durumda upload state'ini temizle
      setUploadingFile(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("🚀 Form submit başlıyor...");
    
    if (!formData.name?.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Eksik Bilgi!',
        text: 'Dosya adı zorunludur.',
        confirmButtonColor: '#ffc107'
      });
      return;
    }

    setLoading(true);

    try {
      let finalFormData = { ...formData };

      // Ana dosya yükleme (eğer yeni dosya seçilmişse)
      if (selectedFile) {
        console.log("📁 Ana dosya yükleniyor...", {
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size,
          isPDF: selectedFile.type === 'application/pdf'
        });
        
        // PDF için özel trace
        if (selectedFile.type === 'application/pdf') {
          console.trace("📄 PDF yükleme başlıyor - stack trace:");
        }
        
        const uploadedFileId = await uploadFileAndGetId(selectedFile);
        finalFormData.fileId = uploadedFileId;
        
        console.log("✅ Ana dosya yüklendi, ID:", uploadedFileId);
      }

      // Önizleme görseli yükleme (eğer yeni görsel seçilmişse)
      if (selectedPreviewImage) {
        console.log("🖼️ Önizleme görseli yükleniyor...", {
          name: selectedPreviewImage.name,
          type: selectedPreviewImage.type,
          size: selectedPreviewImage.size
        });
        const uploadedPreviewImageId = await uploadFileAndGetId(selectedPreviewImage);
        finalFormData.previewImageFileId = uploadedPreviewImageId;
        
        console.log("✅ Önizleme görseli yüklendi, ID:", uploadedPreviewImageId);
      }

      // Slug alanını kontrol et ve varsa kullan
      if (!finalFormData.slug || finalFormData.slug.trim() === '') {
        finalFormData.slug = generateSlug(finalFormData.name) || 'document-slug';
      }

      console.log("📋 Document kayıt data:", finalFormData);

      // Document oluştur/güncelle
      let response;
      if (document?.id) {
        finalFormData.id = document.id;
        response = await updateDocument(finalFormData);
      } else {
        response = await createDocument(finalFormData);
      }

      console.log("✅ Document kayıt response:", response);

      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: document ? 'Dosya güncellendi.' : 'Dosya oluşturuldu.',
        confirmButtonColor: '#28a745'
      });

      onSave();
      onClose();
    } catch (error) {
      console.error("❌ Document kayıt hatası:", error);
      console.error("Error response:", error.response?.data);
      console.trace("❌ Hata stack trace:");
      
      let errorMessage = 'Kayıt işlemi başarısız oldu.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        html: `
          <p><strong>Hata:</strong> ${errorMessage}</p>
          <p><small>Detaylar için tarayıcı konsolunu kontrol edin.</small></p>
        `,
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="document-modal">
        <div className="modal-header">
          <h2>{document ? "Dosya Düzenle" : "Yeni Dosya"}</h2>
          <div className="header-actions">
            <button 
              type="button"
              onClick={handlePDFTest}
              className="test-btn"
              title="PDF yükleme testi yap"
            >
              🧪 PDF Test
            </button>
            <button 
              type="button"
              onClick={handleHealthCheck}
              disabled={checkingHealth}
              className={`health-check-btn ${backendHealthy === true ? 'healthy' : backendHealthy === false ? 'unhealthy' : ''}`}
              title="Backend durumunu kontrol et"
            >
              {checkingHealth ? '🔄' : backendHealthy === true ? '✅' : backendHealthy === false ? '❌' : '🔍'}
            </button>
            <button onClick={onClose} className="close-btn">×</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Dosya Adı *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Dosya adını girin"
              />
            </div>
            <div className="form-group">
              <label htmlFor="slug">URL Slug *</label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                placeholder="URL-dostu slug"
              />
              <small className="field-hint">
                Dosya adı girildiğinde otomatik oluşturulur
              </small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Açıklama</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Dosya açıklaması"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Kategori</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Kategori adı"
              />
            </div>
            <div className="form-group">
              <label htmlFor="order">Sıra</label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="url">Harici URL</label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              placeholder="https://example.com/file.pdf"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="file">Ana Dosya</label>
              <div className="file-input-group">
                <input
                  type="file"
                  id="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
                />
                <button 
                  type="button" 
                  onClick={() => setShowFileSelector(true)}
                  className="select-existing-btn"
                >
                  Sistemdeki Dosyalardan Seç
                </button>
              </div>
              {selectedFile && (
                <div className="file-info">
                  <span>Yeni dosya: {selectedFile.name}</span>
                  <span>({formatFileSize(selectedFile.size)})</span>
                </div>
              )}
              {formData.fileId && !selectedFile && (
                <div className="file-info">
                  <span>Mevcut dosya seçili (ID: {formData.fileId})</span>
                </div>
              )}
              {uploadingFile && uploadProgress > 0 && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{uploadProgress}% yüklendi</span>
                </div>
              )}
              {filePreviewUrl && (
                <div className="file-preview">
                  <img src={filePreviewUrl} alt="Dosya önizlemesi" className="file-preview-image" />
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="previewImage">Önizleme Resmi</label>
              <div className="file-input-group">
                <input
                  type="file"
                  id="previewImage"
                  onChange={handlePreviewImageSelect}
                  accept="image/*"
                />
                <button 
                  type="button" 
                  onClick={() => setShowImageSelector(true)}
                  className="select-existing-btn"
                >
                  Sistemdeki Görsellerden Seç
                </button>
              </div>
              {selectedPreviewImage && (
                <div className="file-info">
                  <span>Yeni görsel: {selectedPreviewImage.name}</span>
                </div>
              )}
              {formData.previewImageFileId && !selectedPreviewImage && (
                <div className="file-info">
                  <span>Mevcut görsel seçili (ID: {formData.previewImageFileId})</span>
                </div>
              )}
              {previewUrl && (
                <div className="preview-image-container">
                  <img src={previewUrl} alt="Önizleme" className="preview-image-modal" />
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="previewImageUrl">Önizleme Resmi URL</label>
            <input
              type="url"
              id="previewImageUrl"
              name="previewImageUrl"
              value={formData.previewImageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/preview.jpg"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
              />
              <span>Aktif</span>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              İptal
            </button>
            <button type="submit" disabled={loading} className="save-btn">
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>

      {/* File Selector Modal */}
      {showFileSelector && (
        <FileSelector
          files={availableFiles}
          onSelect={(file) => handleSelectFromSystem(file, false)}
          onClose={() => setShowFileSelector(false)}
          title="Dosya Seç"
          filterType="all"
        />
      )}

      {/* Image Selector Modal */}
      {showImageSelector && (
        <FileSelector
          files={availableFiles.filter(f => f.contentType?.startsWith('image/'))}
          onSelect={(file) => handleSelectFromSystem(file, true)}
          onClose={() => setShowImageSelector(false)}
          title="Görsel Seç"
          filterType="image"
        />
      )}
    </div>
  );
};

// File Selector Component
const FileSelector = ({ files, onSelect, onClose, title, filterType }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFiles = files.filter(file => 
    file.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return 'Bilinmiyor';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const isImageFile = (contentType) => {
    return contentType?.startsWith('image/');
  };

  return (
    <div className="modal-overlay">
      <div className="file-selector-modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="modal-content">
          <div className="search-section">
            <input
              type="text"
              placeholder="Dosya ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="files-grid">
            {filteredFiles.map(file => (
              <div key={file.id} className="file-item" onClick={() => onSelect(file)}>
                <div className="file-preview">
                  {isImageFile(file.contentType) ? (
                    <img 
                      src={`https://localhost:7103/${file.path}`} 
                      alt={file.name}
                      className="file-thumbnail"
                    />
                  ) : (
                    <div className="file-icon">
                      {file.contentType?.includes('pdf') ? '📄' :
                       file.contentType?.includes('word') ? '📝' :
                       file.contentType?.includes('excel') ? '📊' :
                       file.contentType?.includes('powerpoint') ? '📋' :
                       file.contentType?.includes('zip') ? '📦' :
                       '📄'}
                    </div>
                  )}
                </div>
                <div className="file-info">
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">{formatFileSize(file.size)}</div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredFiles.length === 0 && (
            <div className="no-files">
              {searchTerm ? "Arama sonucu bulunamadı." : "Henüz dosya yüklenmemiş."}
            </div>
          )}
        </div>
        
        <div className="modal-actions">
          <button onClick={onClose} className="cancel-btn">İptal</button>
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;

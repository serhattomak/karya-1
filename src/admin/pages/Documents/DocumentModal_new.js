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
      
      if (document.previewImageUrl) {
        setPreviewUrl(document.previewImageUrl);
      } else if (document.previewImageFile?.path) {
        setPreviewUrl(`https://localhost:7103/${document.previewImageFile.path}`);
      }
      
      if (document.file?.path && document.file?.contentType?.startsWith('image/')) {
        setFilePreviewUrl(`https://localhost:7103/${document.file.path}`);
      }
    } else {
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
        slug: generatedSlug || 'document-slug'
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
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        Swal.fire({
          icon: 'warning',
          title: 'Dosya Çok Büyük!',
          text: 'Dosya boyutu 10MB\'dan küçük olmalıdır.',
          confirmButtonColor: '#ffc107'
        });
        return;
      }

      setSelectedFile(file);
      setFormData(prev => ({
        ...prev,
        mimeType: file.type,
        fileSize: file.size
      }));
      
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setFilePreviewUrl(url);
      } else {
        setFilePreviewUrl(null);
      }
    }
  };

  const handlePreviewImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024;
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
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

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

  const uploadFileAndGetId = async (file, retries = 3) => {
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error(`Dosya boyutu çok büyük. Maksimum ${maxSize / (1024 * 1024)}MB olmalıdır.`);
    }

    const fileFormData = new FormData();
    fileFormData.append('file', file);

    setUploadingFile(true);
    setUploadProgress(0);

    try {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          console.log(`Dosya yükleniyor (Deneme ${attempt}/${retries}):`, file.name, file.type, file.size);
          
          const response = await uploadFile(fileFormData, {
            timeout: 300000,
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log(`Upload progress: ${percentCompleted}%`);
                setUploadProgress(percentCompleted);
              }
            }
          });
          
          console.log("Dosya yükleme response:", response);
          
          const uploadedFileId = response.data?.fileId || response.data?.id;
          
          if (uploadedFileId) {
            setFormData(prev => ({
              ...prev,
              mimeType: file.type,
              fileSize: file.size
            }));
            
            setUploadProgress(100);
            setTimeout(() => {
              setUploadingFile(false);
              setUploadProgress(0);
            }, 1000);
            
            return uploadedFileId;
          } else {
            throw new Error("File ID alınamadı");
          }
          
        } catch (error) {
          console.error(`Dosya yükleme hatası (Deneme ${attempt}/${retries}):`, error);
          
          if (attempt === retries) {
            let errorMessage = 'Dosya yükleme başarısız oldu.';
            
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
            
            throw new Error(errorMessage);
          }
          
          if (attempt < retries) {
            console.log(`${attempt + 1}. deneme için 2 saniye bekleniyor...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      }
    } finally {
      setUploadingFile(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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

      if (selectedFile) {
        console.log("Ana dosya yükleniyor...");
        const uploadedFileId = await uploadFileAndGetId(selectedFile);
        finalFormData.fileId = uploadedFileId;
      }

      if (selectedPreviewImage) {
        console.log("Önizleme görseli yükleniyor...");
        const uploadedPreviewImageId = await uploadFileAndGetId(selectedPreviewImage);
        finalFormData.previewImageFileId = uploadedPreviewImageId;
      }

      if (!finalFormData.slug || finalFormData.slug.trim() === '') {
        finalFormData.slug = generateSlug(finalFormData.name) || 'document-slug';
      }

      console.log("Document kayıt data:", finalFormData);

      let response;
      if (document?.id) {
        finalFormData.id = document.id;
        response = await updateDocument(finalFormData);
      } else {
        response = await createDocument(finalFormData);
      }

      console.log("Document kayıt response:", response);

      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: document ? 'Dosya güncellendi.' : 'Dosya oluşturuldu.',
        confirmButtonColor: '#28a745'
      });

      onSave();
      onClose();
    } catch (error) {
      console.error("Document kayıt hatası:", error);
      console.error("Error response:", error.response?.data);
      
      let errorMessage = 'Kayıt işlemi başarısız oldu.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: errorMessage,
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="AdminModalOverlay">
      <div className="AdminDocumentModal">
        <div className="AdminModalHeader">
          <h2>{document ? "Dosya Düzenle" : "Yeni Dosya"}</h2>
          <div className="AdminHeaderActions">
            <button 
              type="button"
              onClick={handleHealthCheck}
              disabled={checkingHealth}
              className={`AdminHealthCheckBtn ${backendHealthy === true ? 'healthy' : backendHealthy === false ? 'unhealthy' : ''}`}
              title="Backend durumunu kontrol et"
            >
              {checkingHealth ? '🔄' : backendHealthy === true ? '✅' : backendHealthy === false ? '❌' : '🔍'}
            </button>
            <button onClick={onClose} className="AdminCloseBtn">×</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="AdminModalForm">
          <div className="AdminFormRow">
            <div className="AdminFormGroup">
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
            <div className="AdminFormGroup">
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
              <small className="AdminFieldHint">
                Dosya adı girildiğinde otomatik oluşturulur
              </small>
            </div>
          </div>

          <div className="AdminFormGroup">
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

          <div className="AdminFormRow">
            <div className="AdminFormGroup">
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
            <div className="AdminFormGroup">
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

          <div className="AdminFormGroup">
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

          <div className="AdminFormRow">
            <div className="AdminFormGroup">
              <label htmlFor="file">Ana Dosya</label>
              <div className="AdminFileInputGroup">
                <input
                  type="file"
                  id="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
                />
                <button 
                  type="button" 
                  onClick={() => setShowFileSelector(true)}
                  className="AdminSelectExistingBtn"
                >
                  Sistemdeki Dosyalardan Seç
                </button>
              </div>
              {selectedFile && (
                <div className="AdminFileInfo">
                  <span>Yeni dosya: {selectedFile.name}</span>
                  <span>({formatFileSize(selectedFile.size)})</span>
                </div>
              )}
              {formData.fileId && !selectedFile && (
                <div className="AdminFileInfo">
                  <span>Mevcut dosya seçili (ID: {formData.fileId})</span>
                </div>
              )}
              {uploadingFile && uploadProgress > 0 && (
                <div className="AdminUploadProgress">
                  <div className="AdminProgressBar">
                    <div 
                      className="AdminProgressFill" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span className="AdminProgressText">{uploadProgress}% yüklendi</span>
                </div>
              )}
              {filePreviewUrl && (
                <div className="AdminFilePreview">
                  <img src={filePreviewUrl} alt="Dosya önizlemesi" className="AdminFilePreviewImage" />
                </div>
              )}
            </div>
            <div className="AdminFormGroup">
              <label htmlFor="previewImage">Önizleme Resmi</label>
              <div className="AdminFileInputGroup">
                <input
                  type="file"
                  id="previewImage"
                  onChange={handlePreviewImageSelect}
                  accept="image/*"
                />
                <button 
                  type="button" 
                  onClick={() => setShowImageSelector(true)}
                  className="AdminSelectExistingBtn"
                >
                  Sistemdeki Görsellerden Seç
                </button>
              </div>
              {selectedPreviewImage && (
                <div className="AdminFileInfo">
                  <span>Yeni görsel: {selectedPreviewImage.name}</span>
                </div>
              )}
              {formData.previewImageFileId && !selectedPreviewImage && (
                <div className="AdminFileInfo">
                  <span>Mevcut görsel seçili (ID: {formData.previewImageFileId})</span>
                </div>
              )}
              {previewUrl && (
                <div className="AdminPreviewImageContainer">
                  <img src={previewUrl} alt="Önizleme" className="AdminPreviewImageModal" />
                </div>
              )}
            </div>
          </div>

          <div className="AdminFormGroup">
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

          <div className="AdminFormGroup">
            <label className="AdminCheckboxLabel">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
              />
              <span>Aktif</span>
            </label>
          </div>

          <div className="AdminModalActions">
            <button type="button" onClick={onClose} className="AdminCancelBtn">
              İptal
            </button>
            <button type="submit" disabled={loading} className="AdminSaveBtn">
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>

      {showFileSelector && (
        <FileSelector
          files={availableFiles}
          onSelect={(file) => handleSelectFromSystem(file, false)}
          onClose={() => setShowFileSelector(false)}
          title="Dosya Seç"
          filterType="all"
        />
      )}

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
    <div className="AdminModalOverlay">
      <div className="AdminFileSelectorModal">
        <div className="AdminModalHeader">
          <h3>{title}</h3>
          <button onClick={onClose} className="AdminCloseBtn">×</button>
        </div>
        
        <div className="AdminModalContent">
          <div className="AdminSearchSection">
            <input
              type="text"
              placeholder="Dosya ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="AdminSearchInput"
            />
          </div>
          
          <div className="AdminFilesGrid">
            {filteredFiles.map(file => (
              <div key={file.id} className="AdminFileItem" onClick={() => onSelect(file)}>
                <div className="AdminFilePreview">
                  {isImageFile(file.contentType) ? (
                    <img 
                      src={`https://localhost:7103/${file.path}`} 
                      alt={file.name}
                      className="AdminFileThumbnail"
                    />
                  ) : (
                    <div className="AdminFileIcon">
                      {file.contentType?.includes('pdf') ? '📄' :
                       file.contentType?.includes('word') ? '📝' :
                       file.contentType?.includes('excel') ? '📊' :
                       file.contentType?.includes('powerpoint') ? '📋' :
                       file.contentType?.includes('zip') ? '📦' :
                       '📄'}
                    </div>
                  )}
                </div>
                <div className="AdminFileInfo">
                  <div className="AdminFileName">{file.name}</div>
                  <div className="AdminFileSize">{formatFileSize(file.size)}</div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredFiles.length === 0 && (
            <div className="AdminNoFiles">
              {searchTerm ? "Arama sonucu bulunamadı." : "Henüz dosya yüklenmemiş."}
            </div>
          )}
        </div>
        
        <div className="AdminModalActions">
          <button onClick={onClose} className="AdminCancelBtn">İptal</button>
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;

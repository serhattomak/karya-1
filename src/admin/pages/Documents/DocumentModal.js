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
      console.log("🔍 Dosyalar getiriliyor...");
      const response = await getFiles();
      console.log("📦 API Response:", response);
      console.log("📦 Response data:", response.data);
      
      const files = response.data?.data || response.data || response || [];
      console.log("📂 Dosya listesi:", files);
      console.log("📂 Dosya sayısı:", Array.isArray(files) ? files.length : 'Array değil');
      console.log("📂 İlk dosya örneği:", files[0]);
      
      setAvailableFiles(Array.isArray(files) ? files : []);
    } catch (error) {
      console.error("❌ Dosyalar yüklenirken hata:", error);
      setAvailableFiles([]);
    }
  };

  const generateSlug = (text) => {
    if (!text) return '';
    const trMap = {
      'ç': 'c', 'Ç': 'c',
      'ğ': 'g', 'Ğ': 'g',
      'ı': 'i', 'I': 'i',
      'İ': 'i',
      'ö': 'o', 'Ö': 'o',
      'ş': 's', 'Ş': 's',
      'ü': 'u', 'Ü': 'u'
    };
    let slug = text
      .split('')
      .map(char => trMap[char] || char)
      .join('');
    return slug
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
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
      console.log("🔍 Dosya seçildi:", {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        isPDF: file.type === 'application/pdf'
      });

      const maxSize = 10 * 1024 * 1024;
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

      if (file.type === 'application/pdf') {
        console.log("📄 PDF dosyası tespit edildi, özel kontroller yapılıyor...");
        
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

        const pdfMaxSize = 50 * 1024 * 1024;
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

  const handlePDFTest = async () => {
    try {
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

    const maxSize = file.type === 'application/pdf' ? 50 * 1024 * 1024 : 100 * 1024 * 1024;
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      throw new Error(`Dosya boyutu çok büyük. Maksimum ${maxSizeMB}MB olmalıdır.`);
    }

    const fileFormData = new FormData();
    fileFormData.append('file', file);

    if (file.type === 'application/pdf') {
      console.log("📄 PDF FormData oluşturuluyor...");
      console.log("FormData entries:", Array.from(fileFormData.entries()));
    }

    setUploadingFile(true);
    setUploadProgress(0);

    try {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          console.log(`📤 Dosya yükleniyor (Deneme ${attempt}/${retries}):`, file.name);
          
          const timeoutDuration = file.type === 'application/pdf' ? 600000 : 300000;
          
          const response = await uploadFile(fileFormData, {
            timeout: timeoutDuration,
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log(`📊 Upload progress (${file.name}): ${percentCompleted}%`);
                setUploadProgress(percentCompleted);
              }
            },
            ...(file.type === 'application/pdf' && {
              maxContentLength: 50 * 1024 * 1024,
              maxBodyLength: 50 * 1024 * 1024,
            })
          });
          
          console.log("✅ Dosya yükleme response:", response);
          
          console.log("🔍 Response data analizi:", {
            responseData: response.data,
            responseDataType: typeof response.data,
            hasData: !!response.data?.data,
            dataKeys: response.data ? Object.keys(response.data) : [],
            dataDataKeys: response.data?.data ? Object.keys(response.data.data) : []
          });
          
          let uploadedFileId = null;
          
          if (response.data?.fileId) {
            uploadedFileId = response.data.fileId;
            console.log("📌 File ID bulundu (fileId):", uploadedFileId);
          } else if (response.data?.id) {
            uploadedFileId = response.data.id;
            console.log("📌 File ID bulundu (id):", uploadedFileId);
          }
          else if (response.data?.data?.fileId) {
            uploadedFileId = response.data.data.fileId;
            console.log("📌 File ID bulundu (data.fileId):", uploadedFileId);
          } else if (response.data?.data?.id) {
            uploadedFileId = response.data.data.id;
            console.log("📌 File ID bulundu (data.id):", uploadedFileId);
          }
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
            
            setUploadProgress(100);
            setTimeout(() => {
              setUploadingFile(false);
              setUploadProgress(0);
            }, 1000);
            
            return uploadedFileId;
          } else {
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
            let errorMessage = 'Dosya yükleme başarısız oldu.';
            
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
          
          if (attempt < retries) {
            const waitTime = file.type === 'application/pdf' ? 3000 : 2000; // PDF için daha uzun bekleme
            console.log(`⏳ ${attempt + 1}. deneme için ${waitTime/1000} saniye bekleniyor...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
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

    const hasUrl = formData.url && formData.url.trim() !== '';
    const hasFileId = formData.fileId && formData.fileId.trim() !== '';
    const hasSelectedFile = selectedFile !== null;

    if (!hasUrl && !hasFileId && !hasSelectedFile) {
      Swal.fire({
        icon: 'warning',
        title: 'Eksik Bilgi!',
        text: 'Bir dosya yükleyin, sistemden dosya seçin veya harici URL girin.',
        confirmButtonColor: '#ffc107'
      });
      return;
    }

    if (hasUrl) {
      try {
        new URL(formData.url);
      } catch (error) {
        Swal.fire({
          icon: 'warning',
          title: 'Geçersiz URL!',
          text: 'Lütfen geçerli bir URL formatı girin (örn: https://example.com/file.pdf)',
          confirmButtonColor: '#ffc107'
        });
        return;
      }
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

      // URL ile document ekleme durumunda boş file alanlarını temizle
      if (finalFormData.url && finalFormData.url.trim() !== '') {
        // URL varsa ve file ID yoksa, file ile ilgili alanları temizle
        if (!finalFormData.fileId || finalFormData.fileId.trim() === '') {
          console.log("🌐 URL ile document ekleniyor, file alanları temizleniyor...");
          console.log("🌐 URL:", finalFormData.url);
          console.log("🌐 Önceki fileId:", finalFormData.fileId);
          console.log("🌐 Önceki mimeType:", finalFormData.mimeType);
          console.log("🌐 Önceki fileSize:", finalFormData.fileSize);
          
          delete finalFormData.fileId;
          delete finalFormData.mimeType;
          delete finalFormData.fileSize;
          finalFormData.mimeType = null;
          finalFormData.fileSize = null;
          
          console.log("🌐 Temizlendikten sonra fileId:", finalFormData.fileId);
          console.log("🌐 Temizlendikten sonra mimeType:", finalFormData.mimeType);
          console.log("🌐 Temizlendikten sonra fileSize:", finalFormData.fileSize);
        }
      }

      Object.keys(finalFormData).forEach(key => {
        if (finalFormData[key] === '' || finalFormData[key] === undefined) {
          if (key === 'fileId' || key === 'previewImageFileId') {
            delete finalFormData[key];
          } else if (key === 'mimeType' || key === 'fileSize') {
            finalFormData[key] = null;
          }
        }
      });

      console.log("📋 Document kayıt data (temizlenmiş):", finalFormData);

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
      let errorDetails = '';
      
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        console.log("🔍 Validation errors:", validationErrors);
        
        if (validationErrors.documentDto || validationErrors['$.fileId']) {
          errorMessage = 'Backend veri formatı hatası.';
          errorDetails = 'URL ile dosya eklerken backend veri formatı sorunu oluştu. ';
          
          if (validationErrors['$.fileId']) {
            errorDetails += 'FileId alanı ile ilgili format hatası. ';
          }
          
          if (validationErrors.documentDto) {
            errorDetails += 'DocumentDto alanı gerekli ama eksik. ';
          }
          
          errorDetails += 'Lütfen tüm gerekli alanları doldurun ve tekrar deneyin.';
        } else {
          const errorKeys = Object.keys(validationErrors);
          errorMessage = `Validation hatası: ${errorKeys.join(', ')}`;
          errorDetails = Object.values(validationErrors).flat().join(' ');
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        html: `
          <p><strong>Hata:</strong> ${errorMessage}</p>
          ${errorDetails ? `<p><strong>Detay:</strong> ${errorDetails}</p>` : ''}
          <p><small>Teknik detaylar için tarayıcı konsolunu kontrol edin.</small></p>
        `,
        confirmButtonColor: '#dc3545',
        width: '500px'
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
              onClick={handlePDFTest}
              className="AdminTestBtn"
              title="PDF yükleme testi yap"
            >
              🧪 PDF Test
            </button>
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
            <small className="AdminFieldHint">
              Harici URL kullanıyorsanız aşağıdaki "Ana Dosya" alanını boş bırakabilirsiniz.
            </small>
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
              <small className="AdminFieldHint">
                Dosya yüklemek yerine yukarıdaki "Harici URL" alanını da kullanabilirsiniz.
              </small>
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
          files={Array.isArray(availableFiles) ? availableFiles : []}
          onSelect={(file) => handleSelectFromSystem(file, false)}
          onClose={() => setShowFileSelector(false)}
          title="Dosya Seç"
          filterType="all"
        />
      )}

      {/* Image Selector Modal */}
      {showImageSelector && (
        <FileSelector
          files={Array.isArray(availableFiles) ? availableFiles.filter(f => f.contentType?.startsWith('image/')) : []}
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
const FileSelector = ({ files = [], onSelect, onClose, title, filterType }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fileSortAsc, setFileSortAsc] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");

  // files'ın array olduğundan emin ol
  const safeFiles = Array.isArray(files) ? files : [];

  const filteredFiles = safeFiles.filter(file => 
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
        <div className="AdminFileSelectorContent modern">
          <div className="AdminFileSelectorHeader modern">
            <h3>{title || "Dosya Seç"}</h3>
            <button
              type="button"
              className="delete-btn"
              onClick={onClose}
            >
              ×
            </button>
          </div>
          <div className="AdminFileSelectorBody modern">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12 }}>
              <input
                type="text"
                className="AdminFileSearchInput"
                placeholder="Dosya ismiyle ara..."
                value={searchTerm || ""}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ flex: 2, padding: "8px 12px", borderRadius: 8, border: "1px solid #e9ecef", fontSize: 14 }}
              />
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #e9ecef", fontSize: 14 }}
              >
                <option value="all">Tümü</option>
                <option value="image">Görseller</option>
                <option value="pdf">PDF</option>
                <option value="doc">Word/Excel/PowerPoint</option>
                <option value="other">Diğer</option>
              </select>
              <button
                type="button"
                className="sort-btn"
                style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#f68b1f", color: "white", fontWeight: 600, cursor: "pointer" }}
                onClick={() => setFileSortAsc(prev => !prev)}
              >
                {fileSortAsc ? "A-Z" : "Z-A"}
              </button>
            </div>
            <div className="AdminFilesGrid modern">
              {filteredFiles
                .filter(file => {
                  if (typeFilter === "all") return true;
                  if (typeFilter === "image") return file.contentType?.startsWith("image/") || file.path?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                  if (typeFilter === "pdf") return file.contentType?.includes("pdf") || file.path?.match(/\.pdf$/i);
                  if (typeFilter === "doc") return file.contentType?.includes("word") || file.contentType?.includes("excel") || file.contentType?.includes("powerpoint") || file.path?.match(/\.(docx?|xlsx?|pptx?)/i);
                  if (typeFilter === "other") return !((file.contentType?.startsWith("image/") || file.path?.match(/\.(jpg|jpeg|png|gif|webp)$/i)) || (file.contentType?.includes("pdf") || file.path?.match(/\.pdf$/i)) || (file.contentType?.includes("word") || file.contentType?.includes("excel") || file.contentType?.includes("powerpoint") || file.path?.match(/\.(docx?|xlsx?|pptx?)/i)));
                  return true;
                })
                .sort((a, b) => fileSortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name))
                .map((file) => (
                  <div
                    key={file.id}
                    className="AdminFileItem modern"
                    onClick={() => onSelect(file)}
                    style={{ boxShadow: "0 2px 8px rgba(246,139,31,0.08)", border: "1px solid #f68b1f", borderRadius: 12, padding: 12, cursor: "pointer", transition: "all 0.2s", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center" }}
                  >
                    {file.contentType?.startsWith("image/") || file.path?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img
                        src={`https://localhost:7103/${file.path}`}
                        alt={file.name}
                        loading="lazy"
                        style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}
                      />
                    ) : (
                      <div className="AdminFileIcon" style={{ width: "100%", height: "100px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fa", borderRadius: "8px", marginBottom: "8px" }}>
                        <span style={{ fontSize: "48px" }}>📄</span>
                      </div>
                    )}
                    <div className="AdminFileInfo" style={{ textAlign: "center" }}>
                      <span className="AdminFileName" style={{ fontWeight: 600, color: "#333", fontSize: 14 }}>{file.name}</span>
                      <span className="AdminFileSize" style={{ color: "#666", fontSize: 12 }}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                ))}
            </div>
            {filteredFiles.length === 0 && (
              <div style={{ textAlign: "center", color: "#999", marginTop: 32 }}>Hiç dosya bulunamadı.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;

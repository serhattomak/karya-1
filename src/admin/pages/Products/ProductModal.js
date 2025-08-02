import React, { useState, useEffect, useRef } from "react";
import { createProduct, updateProduct, getFiles } from "../../../api";
import Swal from 'sweetalert2';

const BASE_URL = "https://localhost:7103/";

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const token = localStorage.getItem("token");
  const response = await fetch("https://localhost:7103/api/File/upload", {
    method: "POST",
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) throw new Error("Dosya yüklenemedi");
  return await response.json();
};

const ProductModal = ({ product, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [titles, setTitles] = useState([""]);
  const [subtitles, setSubtitles] = useState([""]);
  const [descriptions, setDescriptions] = useState([""]);
  const [listItems, setListItems] = useState([""]);
  const [urls, setUrls] = useState([""]);
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [productImageId, setProductImageId] = useState("");
  const [documentImageIds, setDocumentImageIds] = useState([]);
  const [productDetailImageIds, setProductDetailImageIds] = useState([]);
  const [productDetailImages, setProductDetailImages] = useState([]); // Ürün detay görselleri için ayrı state
  const [documentFiles, setDocumentFiles] = useState([]); // Döküman dosyaları
  const [productImages, setProductImages] = useState([]);
  const [availableFiles, setAvailableFiles] = useState([]);
  const [showFileSelector, setShowFileSelector] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState('');
  const [loading, setLoading] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setTitles(product.titles || [""]);
      setSubtitles(product.subtitles || [""]);
      setDescriptions(product.descriptions || [""]);
      setListItems(product.listItems || [""]);
      setUrls(product.urls || [""]);
      setBannerImageUrl(product.bannerImageUrl || "");
      setProductImageId(product.productImageId || "");
      setDocumentImageIds(product.documentImageIds || []);
      setProductDetailImageIds(product.productDetailImageIds || []);
      
      let allDocumentFiles = [];
      
      if (product.documentFiles && product.documentFiles.length > 0) {
        const documents = product.documentFiles.map(file => ({
          id: file.id,
          name: file.name,
          path: file.path,
          url: file.path ? BASE_URL + file.path : "",
          isExisting: true,
          isDocumentImage: false
        }));
        allDocumentFiles = [...allDocumentFiles, ...documents];
      }
      
      if (product.documentImages && product.documentImages.length > 0) {
        const docImages = product.documentImages.map(file => ({
          id: file.id,
          name: file.name,
          path: file.path,
          url: file.path ? BASE_URL + file.path : "",
          isExisting: true,
          isDocumentImage: true
        }));
        allDocumentFiles = [...allDocumentFiles, ...docImages];
      }
      
      setDocumentFiles(allDocumentFiles);
      
      if (product.files && product.files.length > 0) {
        const images = product.files.map(file => ({
          id: file.id,
          url: file.path ? BASE_URL + file.path : "",
          isExisting: true
        }));
        setProductImages(images);
      }
      
      if (product.productImages && product.productImages.length > 0) {
        const prodImages = product.productImages.map(file => ({
          id: file.id,
          url: file.path ? BASE_URL + file.path : "",
          name: file.name,
          isExisting: true
        }));
        setProductDetailImages(prodImages);
      }
    } else {
      setDocumentFiles([]);
      setProductDetailImages([]);
      setProductImages([]);
    }
  }, [product]);

  useEffect(() => {
    const fetchAvailableFiles = async () => {
      try {
        const response = await getFiles();
        const files = response?.data?.data || response?.data || [];
        setAvailableFiles(files);
      } catch (error) {
        console.error("Dosyalar yüklenirken hata:", error);
      }
    };

    fetchAvailableFiles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalBannerImageUrl = bannerImageUrl;
      if (bannerImageFile) {
        const uploaded = await uploadFile(bannerImageFile);
        const uploadedFile = uploaded?.data || uploaded;
        if (uploadedFile && uploadedFile.path) {
          finalBannerImageUrl = BASE_URL + uploadedFile.path;
        }
      }

      const fileIds = [];
      for (const image of productImages) {
        if (image.isExisting) {
          fileIds.push(image.id);
        } else if (image.file) {
          const uploaded = await uploadFile(image.file);
          const uploadedFileId = uploaded?.data?.id || uploaded?.id;
          if (uploadedFileId) {
            fileIds.push(uploadedFileId);
          }
        }
      }

      const documentFileIds = [];
      const documentImageFileIds = [];
      
      for (const doc of documentFiles) {
        if (doc.isExisting) {
          if (doc.isDocumentImage) {
            documentImageFileIds.push(doc.id);
          } else {
            documentFileIds.push(doc.id);
          }
        } else if (doc.file) {
          const uploaded = await uploadFile(doc.file);
          const uploadedFileId = uploaded?.data?.id || uploaded?.id;
          if (uploadedFileId) {
            if (doc.isDocumentImage) {
              documentImageFileIds.push(uploadedFileId);
            } else {
              documentFileIds.push(uploadedFileId);
            }
          }
        }
      }

      const productDetailFileIds = [];
      for (const image of productDetailImages) {
        if (image.isExisting) {
          productDetailFileIds.push(image.id);
        } else if (image.file) {
          const uploaded = await uploadFile(image.file);
          const uploadedFileId = uploaded?.data?.id || uploaded?.id;
          if (uploadedFileId) {
            productDetailFileIds.push(uploadedFileId);
          }
        }
      }

      const productData = {
        name,
        titles: titles.filter(t => t.trim() !== ""),
        subtitles: subtitles.filter(st => st.trim() !== ""),
        descriptions: descriptions.filter(d => d.trim() !== ""),
        listItems: listItems.filter(li => li.trim() !== ""),
        urls: urls.filter(u => u.trim() !== ""),
        bannerImageUrl: finalBannerImageUrl.trim() || null,
        productImageId: productImageId.trim() || null,
        documentImageIds: documentImageFileIds,
        productDetailImageIds: productDetailImageIds.filter(id => String(id).trim() !== ""),
        fileIds,
        documentFileIds,
        productDetailFileIds
      };

      if (product) {
        productData.id = product.id;
        await updateProduct(productData);
        Swal.fire({
          icon: 'success',
          title: 'Başarılı!',
          text: 'Ürün başarıyla güncellendi!',
          confirmButtonText: 'Tamam',
          confirmButtonColor: '#28a745',
          timer: 2000,
          timerProgressBar: true
        });
      } else {
        await createProduct(productData);
        Swal.fire({
          icon: 'success',
          title: 'Başarılı!',
          text: 'Ürün başarıyla eklendi!',
          confirmButtonText: 'Tamam',
          confirmButtonColor: '#28a745',
          timer: 2000,
          timerProgressBar: true
        });
      }

      onSave();
    } catch (error) {
      console.error("Ürün kaydedilirken hata:", error);
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Ürün kaydedilirken bir hata oluştu.',
        confirmButtonText: 'Tamam',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setLoading(false);
    }
  };

  const removeDocumentFile = (fileId) => {
    setDocumentFiles(prev => prev.filter(doc => doc.id !== fileId));
  };

  // Ana ürün görseli için seçilen dosyayı bul
  const getSelectedProductImage = () => {
    if (!productImageId) return null;
    return availableFiles.find(file => file.id === productImageId);
  };

  const handleBannerFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setBannerImageUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openFileSelector = (fileType) => {
    setSelectedFileType(fileType);
    setShowFileSelector(true);
  };

  const selectFileFromSystem = (file) => {
    const fileUrl = BASE_URL + file.path;
    
    switch (selectedFileType) {
      case 'banner':
        setBannerImageUrl(fileUrl);
        setBannerImageFile(null);
        break;
      case 'productImage':
        setProductImageId(file.id);
        break;
      case 'documentImage':
        setDocumentFiles(prev => [...prev, {
          id: file.id,
          name: file.name,
          path: file.path,
          url: fileUrl,
          isExisting: true,
          isDocumentImage: true
        }]);
        break;
      case 'productDetailImage':
        setProductDetailImageIds([...productDetailImageIds, file.id]);
        setProductDetailImages(prev => [...prev, {
          id: file.id,
          name: file.name,
          path: file.path,
          url: fileUrl,
          isExisting: true
        }]);
        break;
      case 'documentFile':
        setDocumentFiles(prev => [...prev, {
          id: file.id,
          name: file.name,
          path: file.path,
          url: fileUrl,
          isExisting: true,
          isDocumentImage: false
        }]);
        break;
    }
    
    setShowFileSelector(false);
    setSelectedFileType('');
  };

  const addTitle = () => {
    setTitles([...titles, ""]);
  };

  const updateTitle = (index, value) => {
    const updated = [...titles];
    updated[index] = value;
    setTitles(updated);
  };

  const removeTitle = (index) => {
    setTitles(titles.filter((_, i) => i !== index));
  };

  const addSubtitle = () => {
    setSubtitles([...subtitles, ""]);
  };

  const updateSubtitle = (index, value) => {
    const updated = [...subtitles];
    updated[index] = value;
    setSubtitles(updated);
  };

  const removeSubtitle = (index) => {
    setSubtitles(subtitles.filter((_, i) => i !== index));
  };

  const addDescription = () => {
    setDescriptions([...descriptions, ""]);
  };

  const updateDescription = (index, value) => {
    const updated = [...descriptions];
    updated[index] = value;
    setDescriptions(updated);
  };

  const removeDescription = (index) => {
    setDescriptions(descriptions.filter((_, i) => i !== index));
  };

  const addListItem = () => {
    setListItems([...listItems, ""]);
  };

  const updateListItem = (index, value) => {
    const updated = [...listItems];
    updated[index] = value;
    setListItems(updated);
  };

  const removeListItem = (index) => {
    setListItems(listItems.filter((_, i) => i !== index));
  };

  const addUrl = () => {
    setUrls([...urls, ""]);
  };

  const updateUrl = (index, value) => {
    const updated = [...urls];
    updated[index] = value;
    setUrls(updated);
  };

  const removeUrl = (index) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const handleOverlayClick = (e) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" ref={modalRef} onClick={handleOverlayClick}>
      <div className="modal-content product-modal">
        <div className="modal-header">
          <h3>{product ? "Ürün Düzenle" : "Yeni Ürün Ekle"}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Ürün Adı *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ürün adını girin"
              required
            />
          </div>

          {/* Başlıklar */}
          <div className="form-group">
            <label>Başlıklar</label>
            {titles.map((title, index) => (
              <div key={index} className="input-group">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => updateTitle(index, e.target.value)}
                  placeholder={`Başlık ${index + 1}`}
                />
                {titles.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn danger"
                    onClick={() => removeTitle(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-btn secondary" onClick={addTitle}>
              + Başlık Ekle
            </button>
          </div>

          {/* Alt Başlıklar */}
          <div className="form-group">
            <label>Alt Başlıklar</label>
            {subtitles.map((subtitle, index) => (
              <div key={index} className="input-group">
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => updateSubtitle(index, e.target.value)}
                  placeholder={`Alt başlık ${index + 1}`}
                />
                {subtitles.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn danger"
                    onClick={() => removeSubtitle(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-btn secondary" onClick={addSubtitle}>
              + Alt Başlık Ekle
            </button>
          </div>

          {/* Açıklamalar */}
          <div className="form-group">
            <label>Açıklamalar</label>
            {descriptions.map((description, index) => (
              <div key={index} className="input-group">
                <textarea
                  value={description}
                  onChange={(e) => updateDescription(index, e.target.value)}
                  placeholder={`Açıklama ${index + 1}`}
                  rows="3"
                />
                {descriptions.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn danger"
                    onClick={() => removeDescription(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-btn secondary" onClick={addDescription}>
              + Açıklama Ekle
            </button>
          </div>

          {/* Liste Öğeleri */}
          <div className="form-group">
            <label>Liste Öğeleri</label>
            {listItems.map((item, index) => (
              <div key={index} className="input-group">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem(index, e.target.value)}
                  placeholder={`Liste öğesi ${index + 1}`}
                />
                {listItems.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn danger"
                    onClick={() => removeListItem(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-btn secondary" onClick={addListItem}>
              + Liste Öğesi Ekle
            </button>
          </div>

          {/* URL'ler */}
          <div className="form-group">
            <label>URL'ler</label>
            {urls.map((url, index) => (
              <div key={index} className="input-group">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => updateUrl(index, e.target.value)}
                  placeholder={`URL ${index + 1}`}
                />
                {urls.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn danger"
                    onClick={() => removeUrl(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-btn secondary" onClick={addUrl}>
              + URL Ekle
            </button>
          </div>

          {/* Banner Image URL */}
          <div className="form-group">
            <label>Banner Görseli</label>
            <div className="banner-image-input">
              <input
                type="url"
                value={bannerImageUrl}
                onChange={(e) => setBannerImageUrl(e.target.value)}
                placeholder="Banner görsel URL'si girebilir ya da dosya seçebilirsiniz"
              />
              <div className="banner-image-controls">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerFileSelect}
                  style={{ display: 'none' }}
                  id="banner-file-input"
                />
                <label htmlFor="banner-file-input" className="file-select-btn primary">
                  Dosya Seç
                </label>
                <button
                  type="button"
                  className="file-select-btn primary"
                  onClick={() => openFileSelector('banner')}
                >
                  Sistemden Seç
                </button>
              </div>
              {bannerImageUrl && (
                <div className="banner-preview">
                  <img src={bannerImageUrl} alt="Banner önizleme" style={{ maxWidth: '200px', maxHeight: '100px' }} />
                </div>
              )}
            </div>
          </div>

          {/* Product Image ID */}
          <div className="form-group">
            <label>Ana Ürün Görseli</label>
            <div className="product-image-selector">
              <div className="upload-controls">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      try {
                        const uploadedFile = await uploadFile(file);
                        setProductImageId(uploadedFile.id);
                        setAvailableFiles(prev => [...prev, uploadedFile]);
                      } catch (error) {
                        console.error("Dosya yüklenirken hata:", error);
                        Swal.fire({
                          icon: 'error',
                          title: 'Hata!',
                          text: 'Dosya yüklenirken bir hata oluştu.',
                          confirmButtonText: 'Tamam',
                          confirmButtonColor: '#dc3545'
                        });
                      }
                    }
                  }}
                  style={{ display: 'none' }}
                  id="product-image-input"
                />
                <label htmlFor="product-image-input" className="file-select-btn primary">
                  Yeni Görsel Yükle
                </label>
                <button
                  type="button"
                  className="file-select-btn primary"
                  onClick={() => openFileSelector('productImage')}
                >
                  Sistemden Seç
                </button>
              </div>
              {productImageId && (
                <div className="selected-file-info">
                  <div className="selected-image-preview">
                    {(() => {
                      const selectedImage = getSelectedProductImage();
                      return selectedImage ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img 
                            src={BASE_URL + selectedImage.path} 
                            alt={selectedImage.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                          <span>{selectedImage.name}</span>
                        </div>
                      ) : (
                        <span>Seçilen görsel ID: {productImageId}</span>
                      );
                    })()}
                  </div>
                  <button
                    type="button"
                    className="remove-btn danger"
                    onClick={() => setProductImageId('')}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Document Image IDs */}
          <div className="form-group">
            <label>Döküman Görselleri</label>
            <div className="document-images-selector">
              <div className="upload-controls">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    files.forEach(file => {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const tempId = `temp_${Date.now()}_${Math.random()}`;
                        setDocumentFiles(prev => [...prev, {
                          id: tempId,
                          name: file.name,
                          path: file.name,
                          url: event.target.result,
                          file: file,
                          isExisting: false,
                          isDocumentImage: true
                        }]);
                      };
                      reader.readAsDataURL(file);
                    });
                  }}
                  style={{ display: 'none' }}
                  id="document-image-input"
                />
                <label htmlFor="document-image-input" className="file-select-btn primary">
                  Yeni Görsel Yükle
                </label>
                <button
                  type="button"
                  className="file-select-btn primary"
                  onClick={() => openFileSelector('documentImage')}
                >
                  Sistemden Seç
                </button>
              </div>
              {documentFiles.filter(doc => doc.isDocumentImage).length > 0 && (
                <div className="selected-images">
                  {documentFiles
                    .filter(doc => doc.isDocumentImage)
                    .sort((a, b) => {
                      // Yeni eklenen dosyalar önce gelsin (isExisting false olanlar)
                      if (!a.isExisting && b.isExisting) return -1;
                      if (a.isExisting && !b.isExisting) return 1;
                      // ID'ye göre sırala
                      return a.id.toString().localeCompare(b.id.toString());
                    })
                    .map((docFile, index) => (
                    <div key={docFile.id} className="selected-image-item">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img 
                          src={docFile.url} 
                          alt={docFile.name}
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <span>{docFile.name}</span>
                      </div>
                      <button
                        type="button"
                        className="remove-btn danger"
                        onClick={() => {
                          setDocumentFiles(prev => prev.filter(doc => doc.id !== docFile.id));
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Detail Image IDs */}
          <div className="form-group">
            <label>Ürün Detay Görselleri</label>
            <div className="product-detail-images-selector">
              <div className="upload-controls">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    files.forEach(file => {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const newId = Date.now() + Math.random();
                        setProductDetailImageIds(prev => [...prev, newId]);
                        setProductDetailImages(prev => [...prev, {
                          id: newId,
                          url: event.target.result,
                          name: file.name,
                          file: file,
                          isExisting: false
                        }]);
                      };
                      reader.readAsDataURL(file);
                    });
                  }}
                  style={{ display: 'none' }}
                  id="detail-image-input"
                />
                <label htmlFor="detail-image-input" className="file-select-btn primary">
                  Yeni Görsel Yükle
                </label>
                <button
                  type="button"
                  className="file-select-btn primary"
                  onClick={() => openFileSelector('productDetailImage')}
                >
                  Sistemden Seç
                </button>
              </div>
              {productDetailImageIds.length > 0 && (
                <div className="selected-images">
                  {productDetailImageIds.map((id, index) => {
                    const image = productDetailImages.find(img => img.id === id);
                    return (
                      <div key={index} className="selected-image-item">
                        {image ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img 
                              src={image.url} 
                              alt={image.name || `Detay görseli ${index + 1}`}
                              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                            <span>{image.name || `Detay görseli ${index + 1}`}</span>
                          </div>
                        ) : (
                          <span>Görsel ID: {id}</span>
                        )}
                        <button
                          type="button"
                          className="remove-btn danger"
                          onClick={() => {
                            setProductDetailImageIds(productDetailImageIds.filter((_, i) => i !== index));
                            setProductDetailImages(prev => prev.filter(img => img.id !== id));
                          }}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Ürün Dosyaları/Dökümanları */}
          <div className="form-group">
            <label>Ürün Dosyaları/Dökümanları</label>
            <div className="document-files-selector">
              <div className="upload-controls">
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    files.forEach(file => {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setDocumentFiles(prev => [...prev, {
                          id: `temp_${Date.now()}_${Math.random()}`,
                          name: file.name,
                          path: file.name,
                          url: event.target.result,
                          file: file,
                          isExisting: false,
                          isDocumentImage: false
                        }]);
                      };
                      reader.readAsDataURL(file);
                    });
                  }}
                  style={{ display: 'none' }}
                  id="document-file-input"
                />
                <label htmlFor="document-file-input" className="file-select-btn primary">
                  Yeni Dosya Yükle
                </label>
                <button
                  type="button"
                  className="file-select-btn primary"
                  onClick={() => openFileSelector('documentFile')}
                >
                  Sistemden Seç
                </button>
              </div>
              {documentFiles.filter(doc => !doc.isDocumentImage).length > 0 && (
                <div className="selected-files">
                  {documentFiles.filter(doc => !doc.isDocumentImage).map((doc, index) => (
                    <div key={doc.id} className="selected-file-item">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {doc.url && doc.path?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <img 
                            src={doc.url} 
                            alt={doc.name}
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        ) : (
                          <div style={{ 
                            width: '40px', 
                            height: '40px', 
                            background: '#f0f0f0', 
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px'
                          }}>
                            📄
                          </div>
                        )}
                        <span>{doc.name}</span>
                      </div>
                      <button
                        type="button"
                        className="remove-btn danger"
                        onClick={() => removeDocumentFile(doc.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn danger" onClick={onClose}>
              İptal
            </button>
            <button type="submit" className="save-btn primary" disabled={loading}>
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>

      {/* Dosya Seçici Modal */}
      {showFileSelector && (
        <div className="file-selector-modal">
          <div className="file-selector-content">
            <div className="file-selector-header">
              <h3>Dosya Seç</h3>
              <button
                type="button"
                className="close-btn"
                onClick={() => setShowFileSelector(false)}
              >
                ×
              </button>
            </div>
            <div className="file-selector-body">
              <div className="files-grid">
                {availableFiles
                  .filter(file => {
                    // Görsel seçimi için sadece resimleri göster
                    if (['banner', 'productImage', 'documentImage', 'productDetailImage'].includes(selectedFileType)) {
                      return file.contentType?.startsWith('image/') || file.path?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                    }
                    // Döküman dosyası seçimi için tüm dosyaları göster
                    if (selectedFileType === 'documentFile') {
                      return true;
                    }
                    return true;
                  })
                  .map(file => (
                    <div
                      key={file.id}
                      className="file-item"
                      onClick={() => selectFileFromSystem(file)}
                    >
                      {file.contentType?.startsWith('image/') || file.path?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        <img
                          src={BASE_URL + file.path}
                          alt={file.name}
                          loading="lazy"
                        />
                      ) : (
                        <div className="file-icon">
                          <span style={{ fontSize: '48px' }}>📄</span>
                        </div>
                      )}
                      <div className="file-info">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductModal;

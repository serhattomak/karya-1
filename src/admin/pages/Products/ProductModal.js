import React, { useState, useEffect, useRef } from "react";
import { createProduct, updateProduct } from "../../../api";
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
  const [descriptions, setDescriptions] = useState([""]);
  const [urls, setUrls] = useState([""]);
  const [productImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setTitles(product.titles || [""]);
      setDescriptions(product.descriptions || [""]);
      setUrls(product.urls || [""]);
      
      // Mevcut dosyaları ayarla
      if (product.files && product.files.length > 0) {
        const images = product.files.map(file => ({
          id: file.id,
          url: file.path ? BASE_URL + file.path : "",
          isExisting: true
        }));
        setProductImages(images);
      }
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Yeni yüklenen dosyaları işle
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

      const productData = {
        name,
        titles: titles.filter(t => t.trim() !== ""),
        descriptions: descriptions.filter(d => d.trim() !== ""),
        urls: urls.filter(u => u.trim() !== ""),
        fileIds
      };

      if (product) {
        // Güncelleme
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
        // Yeni ekleme
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProductImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: event.target.result,
          file: file,
          isExisting: false
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (imageId) => {
    setProductImages(prev => prev.filter(img => img.id !== imageId));
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
                    className="remove-btn"
                    onClick={() => removeTitle(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-btn" onClick={addTitle}>
              + Başlık Ekle
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
                    className="remove-btn"
                    onClick={() => removeDescription(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-btn" onClick={addDescription}>
              + Açıklama Ekle
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
                    className="remove-btn"
                    onClick={() => removeUrl(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-btn" onClick={addUrl}>
              + URL Ekle
            </button>
          </div>

          {/* Görseller */}
          <div className="form-group">
            <label>Ürün Görselleri</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="file-input"
            />
            
            {productImages.length > 0 && (
              <div className="image-preview-grid">
                {productImages.map((image) => (
                  <div key={image.id} className="image-preview-item">
                    <img src={image.url} alt="Ürün görseli" />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeImage(image.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              İptal
            </button>
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;

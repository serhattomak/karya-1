import React, { useState, useEffect, useRef } from "react";
import {
  createProduct,
  updateProduct,
  getFiles,
  getDocuments,
  getDocument,
} from "../../../api";
import { createSlugFromProduct } from "../../../utils/slugUtils";
import Swal from "sweetalert2";
import { uploadFile as uploadFileApi } from "../../../api";

const BASE_URL = "https://localhost:7103/";

// Dosya yükleme işlemi artık api.js'deki uploadFile fonksiyonunu kullanıyor
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await uploadFileApi(formData);
    if (response && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Dosya yükleme hatası:", error);
    throw error;
  }
};

const ProductModal = ({ product, onClose, onSave }) => {
  // Checkbox için state
  const [showContact, setShowContact] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [homePageSubtitle, setHomePageSubtitle] = useState("");
  const [titles, setTitles] = useState([""]);
  const [subtitles, setSubtitles] = useState([""]);
  const [descriptions, setDescriptions] = useState([""]);
  const [listTitles, setListTitles] = useState([""]);
  const [listItems, setListItems] = useState([""]);
  const [urls, setUrls] = useState([""]);
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [videoUrls, setVideoUrls] = useState([""]);
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [productMainImageId, setProductMainImageId] = useState("");
  const [productMainImagePreview, setProductMainImagePreview] = useState("");
  const [productMainImageName, setProductMainImageName] = useState("");
  const [productMainImageFile, setProductMainImageFile] = useState(null);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [productImageId, setProductImageId] = useState("");
  const [documentImageIds, setDocumentImageIds] = useState([]);
  const [productDetailImageIds, setProductDetailImageIds] = useState([]);
  const [productDetailImages, setProductDetailImages] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [availableFiles, setAvailableFiles] = useState([]);
  const [availableDocuments, setAvailableDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [showFileSelector, setShowFileSelector] = useState(false);
  const [showDocumentSelector, setShowDocumentSelector] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setSlug(product.slug || "");
      setHomePageSubtitle(product.homePageSubtitle || "");
      setTitles(product.titles || [""]);
      setSubtitles(product.subtitles || [""]);
      setDescriptions(product.descriptions || [""]);
      setListTitles(product.listTitles || [""]);
      setListItems(product.listItems || [""]);
      setUrls(product.urls || [""]);
      setBannerImageUrl(product.bannerImageUrl || "");
      setProductImageId(product.productImageId || "");
      setDocumentImageIds(product.documentImageIds || []);
      setProductDetailImageIds(product.productDetailImageIds || []);
      setVideoUrls(product.videoUrls || [""]);
      setMainImageUrl(product.mainImageUrl || "");
      setProductMainImageId(product.productMainImageId || "");
      setShowContact(product.showContact === true);

      // Handle productMainImage - find the file info if it exists
      if (product.productMainImageId) {
        // We'll set the name when availableFiles is loaded
        setProductMainImagePreview(""); // Clear any preview since this is from system
        setProductMainImageFile(null); // Clear any file since this is from system
      } else {
        // Clear everything if no productMainImageId
        setProductMainImagePreview("");
        setProductMainImageName("");
        setProductMainImageFile(null);
      }

      // Selected documents from documentIds
      if (product.documentIds && product.documentIds.length > 0) {
        setSelectedDocuments(product.documentIds);
      } else {
        setSelectedDocuments([]);
      }

      // ... rest of your existing code for handling other files
      let allDocumentFiles = [];

      if (product.documentFiles && product.documentFiles.length > 0) {
        const documents = product.documentFiles.map((file) => ({
          id: file.id,
          name: file.name,
          path: file.path,
          url: file.path ? BASE_URL + file.path : "",
          isExisting: true,
          isDocumentImage: false,
        }));
        allDocumentFiles = [...allDocumentFiles, ...documents];
      }

      if (product.documentImages && product.documentImages.length > 0) {
        const docImages = product.documentImages.map((file) => ({
          id: file.id,
          name: file.name,
          path: file.path,
          url: file.path ? BASE_URL + file.path : "",
          isExisting: true,
          isDocumentImage: true,
        }));
        allDocumentFiles = [...allDocumentFiles, ...docImages];
      }

      setDocumentFiles(allDocumentFiles);

      if (product.files && product.files.length > 0) {
        const images = product.files.map((file) => ({
          id: file.id,
          url: file.path ? BASE_URL + file.path : "",
          isExisting: true,
        }));
        setProductImages(images);
      }

      if (product.productImages && product.productImages.length > 0) {
        const prodImages = product.productImages.map((file) => ({
          id: file.id,
          url: file.path ? BASE_URL + file.path : "",
          name: file.name,
          isExisting: true,
        }));
        setProductDetailImages(prodImages);
      }
    } else {
      setDocumentFiles([]);
      setProductDetailImages([]);
      setProductImages([]);
      setProductMainImageFile(null);
      setProductMainImagePreview("");
      setProductMainImageName("");
      setShowContact(false);
    }
  }, [product]);

  useEffect(() => {
    const fetchAvailableData = async () => {
      try {
        // Fetch available files
        const filesResponse = await getFiles();
        const files = filesResponse?.data?.data || filesResponse?.data || [];
        setAvailableFiles(files);

        // Fetch available documents
        const documentsResponse = await getDocuments();
        const documentsData =
          documentsResponse?.data?.data ||
          documentsResponse?.data ||
          documentsResponse;
        const documents = documentsData?.items || documentsData || [];
        setAvailableDocuments(documents);
      } catch (error) {
        console.error("Error fetching available data:", error);
      }
    };

    fetchAvailableData();
  }, []);

  useEffect(() => {
    if (productMainImageId && availableFiles.length > 0) {
      const selectedImage = availableFiles.find(
        (file) => file.id === productMainImageId
      );
      if (selectedImage && selectedImage.name) {
        setProductMainImageName(selectedImage.name);
      }
    }
  }, [productMainImageId, availableFiles]);

  const handleSubmit = async (e) => {
    // Eksik tanımlanan değişkenler
    let documentImageFileIds = [];
    let documentFileIds = [];
    let productDetailFileIds = [];
    e.preventDefault();
    setLoading(true);

    try {
      if (!name.trim()) {
        Swal.fire({
          icon: "error",
          title: "Hata!",
          text: "Ürün adı zorunludur.",
          confirmButtonText: "Tamam",
        });
        setLoading(false);
        return;
      }

      const finalSlug = slug.trim() || createSlugFromProduct({ name });
      if (!finalSlug) {
        Swal.fire({
          icon: "error",
          title: "Hata!",
          text: "Geçerli bir slug oluşturulamadı.",
          confirmButtonText: "Tamam",
        });
        setLoading(false);
        return;
      }

      let finalBannerImageUrl = bannerImageUrl;
      if (bannerImageFile) {
        const uploaded = await uploadFile(bannerImageFile);
        const uploadedFile = uploaded?.data || uploaded;
        if (uploadedFile && uploadedFile.path) {
          finalBannerImageUrl = BASE_URL + uploadedFile.path;
        }
      }

      // Handle product main image upload
      let finalProductMainImageId = productMainImageId;
      if (productMainImageFile && !productMainImageId) {
        try {
          const uploaded = await uploadFile(productMainImageFile);
          const uploadedFile = uploaded?.data || uploaded;
          if (uploadedFile && uploadedFile.id) {
            finalProductMainImageId = uploadedFile.id;
          }
        } catch (error) {
          console.error("Ana ürün görseli yüklenirken hata:", error);
          Swal.fire({
            icon: "error",
            title: "Hata!",
            text: "Ana ürün görseli yüklenirken bir hata oluştu.",
            confirmButtonText: "Tamam",
            confirmButtonColor: "#dc3545",
          });
          setLoading(false);
          return;
        }
      }

      const fileIds = [];
      for (const image of productImages) {
        if (image.isExisting) {
          fileIds.push(image.id);
        } else if (image.file) {
          const uploaded = await uploadFile(image.file);
          const uploadedFileId = uploaded?.data?.id || uploaded?.id;
          // ...burada dosya yükleme sonrası yapılacak işlemler...
        }
      }

      // Ürün detay görselleri için sadece GUID olanları productDetailImageIds'e ekle
      const validProductDetailImageIds = productDetailImageIds.filter(id => {
        // GUID ise string ve 36 karakter olmalı, tireli
        return typeof id === 'string' && /^[0-9a-fA-F-]{36}$/.test(id);
      });
      // Yeni yüklenen dosyalar için id'yi productDetailFileIds'e ekle
      const validProductDetailFileIds = productDetailImages
        .filter(img => img.isExisting === false && img.file && typeof img.id !== 'string')
        .map(img => img.id);

      const productData = {
        name,
        slug: finalSlug,
        titles: titles.filter((t) => t.trim() !== ""),
        subtitles: subtitles.filter((st) => st.trim() !== ""),
        descriptions: descriptions.filter((d) => d.trim() !== ""),
        listTitles: listTitles.filter((lt) => lt.trim() !== ""),
        listItems: listItems.filter((li) => li.trim() !== ""),
        urls: urls.filter((u) => u.trim() !== ""),
        bannerImageUrl: finalBannerImageUrl.trim() || null,
        productImageId: productImageId.trim() || null,
        productMainImageId: finalProductMainImageId || null,
        documentImageIds: documentImageFileIds,
        productDetailImageIds: validProductDetailImageIds,
        documentIds: selectedDocuments,
        fileIds,
        documentFileIds,
        productDetailFileIds: validProductDetailFileIds,
        homePageSubtitle,
        showContact,
      };

      if (product) {
        productData.id = product.id;
        await updateProduct(productData);
        Swal.fire({
          icon: "success",
          title: "Başarılı!",
          text: "Ürün başarıyla güncellendi!",
          confirmButtonText: "Tamam",
          confirmButtonColor: "#28a745",
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        await createProduct(productData);
        Swal.fire({
          icon: "success",
          title: "Başarılı!",
          text: "Ürün başarıyla eklendi!",
          confirmButtonText: "Tamam",
          confirmButtonColor: "#28a745",
          timer: 2000,
          timerProgressBar: true,
        });
      }

      onSave();
    } catch (error) {
      console.error("Ürün kaydedilirken hata:", error);
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "Ürün kaydedilirken bir hata oluştu.",
        confirmButtonText: "Tamam",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeDocumentFile = (fileId) => {
    setDocumentFiles((prev) => prev.filter((doc) => doc.id !== fileId));
  };

  // Ana ürün görseli için seçilen dosyayı bul
  const getSelectedProductImage = () => {
    if (!productImageId) return null;
    return availableFiles.find((file) => file.id === productImageId);
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

  const openDocumentSelector = () => {
    setShowDocumentSelector(true);
  };

  const selectDocument = (document) => {
    if (!selectedDocuments.includes(document.id)) {
      setSelectedDocuments([...selectedDocuments, document.id]);
    }
    setShowDocumentSelector(false);
  };

  const removeDocument = (documentId) => {
    setSelectedDocuments(selectedDocuments.filter((id) => id !== documentId));
  };

  const getSelectedDocumentData = (documentId) => {
    return availableDocuments.find((doc) => doc.id === documentId);
  };

  const selectFileFromSystem = (file) => {
    const fileUrl = BASE_URL + file.path;

    switch (selectedFileType) {
      case "banner":
        setBannerImageUrl(fileUrl);
        setBannerImageFile(null);
        break;
      case "productImage":
        setProductImageId(file.id);
        break;
      case "productMainImage": // This should already be there
        setProductMainImageId(file.id);
        setProductMainImagePreview(""); // Clear any uploaded preview
        setProductMainImageName(file.name);
        setProductMainImageFile(null); // Clear any uploaded file
        break;
      case "documentImage":
        setDocumentFiles((prev) => [
          ...prev,
          {
            id: file.id,
            name: file.name,
            path: file.path,
            url: fileUrl,
            isExisting: true,
            isDocumentImage: true,
          },
        ]);
        break;
      case "productDetailImage":
        setProductDetailImageIds([...productDetailImageIds, file.id]);
        setProductDetailImages((prev) => [
          ...prev,
          {
            id: file.id,
            name: file.name,
            path: file.path,
            url: fileUrl,
            isExisting: true,
          },
        ]);
        break;
      case "documentFile":
        setDocumentFiles((prev) => [
          ...prev,
          {
            id: file.id,
            name: file.name,
            path: file.path,
            url: fileUrl,
            isExisting: true,
            isDocumentImage: false,
          },
        ]);
        break;
    }

    setShowFileSelector(false);
    setSelectedFileType("");
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

  const addListTitle = () => {
    setListTitles([...listTitles, ""]);
  };

  const updateListTitle = (index, value) => {
    const updated = [...listTitles];
    updated[index] = value;
    setListTitles(updated);
  };

  const removeListTitle = (index) => {
    setListTitles(listTitles.filter((_, i) => i !== index));
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

  // Ürün detay görselleri yükleme ve GUID ile ekleme
  const handleDetailImagesUpload = async (files) => {
    setLoading(true);
    try {
      const uploadedIds = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await uploadFile(file);
        const uploadedFile = response?.data || response;
        if (uploadedFile && uploadedFile.id) {
          uploadedIds.push(uploadedFile.id);
          setProductDetailImages((prev) => [
            ...prev,
            {
              id: uploadedFile.id,
              url: BASE_URL + uploadedFile.path,
              name: uploadedFile.name,
              isExisting: true,
            },
          ]);
        }
      }
      setProductDetailImageIds((prev) => [...prev, ...uploadedIds]);
    } catch (error) {
      console.error("Detay görseli yüklenirken hata:", error);
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "Detay görseli yüklenirken bir hata oluştu.",
        confirmButtonText: "Tamam",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="AdminModalOverlay"
      ref={modalRef}
      onClick={handleOverlayClick}
    >
      <div className="AdminModalContent AdminProductModal">
        <div className="AdminModalHeader">
          <h3>{product ? "Ürün Düzenle" : "Yeni Ürün Ekle"}</h3>
          <button className="delete-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="AdminModalForm">
          <div className="form-group">
            <label>Ürün Adı *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                const newName = e.target.value;
                setName(newName);
                if (!slug || slug === createSlugFromProduct({ name })) {
                  setSlug(createSlugFromProduct({ name: newName }));
                }
              }}
              placeholder="Ürün adını girin"
              required
            />
            {name && (
              <div
                style={{
                  marginTop: "8px",
                  padding: "8px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                <strong>URL Önizleme:</strong> /product/
                {slug || createSlugFromProduct({ name })}
              </div>
            )}
          </div>

          {/* Slug */}
          <div className="form-group">
            <label>URL Slug *</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="url-dostu-slug"
              required
            />
            <small style={{ color: "#666", fontSize: "12px" }}>
              SEO dostu URL için kullanılır. Boş bırakırsanız ürün adından
              otomatik oluşturulur.
            </small>
          </div>

          {/* Ana Sayfa Alt Başlık */}
          <div className="form-group">
            <label>Ana Sayfa Alt Başlık *</label>
            <input
              type="text"
              value={homePageSubtitle}
              onChange={(e) => setHomePageSubtitle(e.target.value)}
              placeholder="Ana sayfa alt başlığını girin  "
            />
            <small style={{ color: "#666", fontSize: "12px" }}>
              Ana Sayfada gösterilecek ürünün alt başlığı olarak kullanılır.
            </small>
          </div>

          {/* Başlıklar */}
          <div className="form-group">
            <label>Başlıklar</label>
            {titles.map((title, index) => (
              <div key={index} className="AdminInputGroup">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => updateTitle(index, e.target.value)}
                  placeholder={`Başlık ${index + 1}`}
                />
                {titles.length > 1 && (
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => removeTitle(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="add-btn secondary"
              onClick={addTitle}
            >
              <span>+ Başlık Ekle</span>
            </button>
          </div>

          {/* Alt Başlıklar */}
          <div className="form-group">
            <label>Alt Başlıklar</label>
            {subtitles.map((subtitle, index) => (
              <div key={index} className="AdminInputGroup">
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => updateSubtitle(index, e.target.value)}
                  placeholder={`Alt başlık ${index + 1}`}
                />
                {subtitles.length > 1 && (
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => removeSubtitle(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="add-btn secondary"
              onClick={addSubtitle}
            >
              <span>+ Alt Başlık Ekle</span>
            </button>
          </div>

          {/* Açıklamalar */}
          <div className="form-group">
            <label>Açıklamalar</label>
            {descriptions.map((description, index) => (
              <div key={index} className="AdminInputGroup">
                <textarea
                  value={description}
                  onChange={(e) => updateDescription(index, e.target.value)}
                  placeholder={`Açıklama ${index + 1}`}
                  rows="3"
                />
                {descriptions.length > 1 && (
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => removeDescription(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="add-btn secondary"
              onClick={addDescription}
            >
              <span>+ Açıklama Ekle</span>
            </button>
          </div>

          {/* Liste Başlıkları */}
          <div className="form-group">
            <label>Liste Başlıkları</label>
            {listTitles.map((listTitle, index) => (
              <div key={index} className="AdminInputGroup">
                <input
                  type="text"
                  value={listTitle}
                  onChange={(e) => updateListTitle(index, e.target.value)}
                  placeholder={`Liste başlığı ${index + 1}`}
                />
                {listTitles.length > 1 && (
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => removeListTitle(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="add-btn secondary"
              onClick={addListTitle}
            >
              <span>+ Liste Başlığı Ekle</span>
            </button>
          </div>

          {/* Liste Öğeleri */}
          <div className="form-group">
            <label>Liste Öğeleri</label>
            {listItems.map((item, index) => (
              <div key={index} className="AdminInputGroup">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem(index, e.target.value)}
                  placeholder={`Liste öğesi ${index + 1}`}
                />
                {listItems.length > 1 && (
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => removeListItem(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="add-btn secondary"
              onClick={addListItem}
            >
              <span>+ Liste Öğesi Ekle</span>
            </button>
          </div>

          {/* URL'ler */}
          <div className="form-group">
            <label>URL'ler</label>
            {urls.map((url, index) => (
              <div key={index} className="AdminInputGroup">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => updateUrl(index, e.target.value)}
                  placeholder={`URL ${index + 1}`}
                />
                {urls.length > 1 && (
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => removeUrl(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="add-btn secondary"
              onClick={addUrl}
            >
              <span>+ URL Ekle</span>
            </button>
          </div>
          {/* Video URL'leri */}
          <div className="form-group">
            <label>Video URL'leri</label>
            {videoUrls.map((videoUrl, index) => (
              <div key={index} className="AdminInputGroup">
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => {
                    const updated = [...videoUrls];
                    updated[index] = e.target.value;
                    setVideoUrls(updated);
                  }}
                  placeholder={`Video URL ${index + 1}`}
                />
                {videoUrls.length > 1 && (
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() =>
                      setVideoUrls(videoUrls.filter((_, i) => i !== index))
                    }
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="add-btn secondary"
              onClick={() => setVideoUrls([...videoUrls, ""])}
            >
              <span>+ Video URL Ekle</span>
            </button>
          </div>
          {/* Ana Görsel URL */}
          <div className="form-group">
            <label>Ana Görsel URL</label>
            <input
              type="url"
              value={mainImageUrl}
              onChange={(e) => setMainImageUrl(e.target.value)}
              placeholder="Ana görsel URL'si"
            />
            {mainImageUrl && (
              <div className="AdminBannerPreview">
                <img
                  src={mainImageUrl}
                  alt="Ana görsel önizleme"
                  style={{ maxWidth: "200px", maxHeight: "100px" }}
                />
              </div>
            )}
          </div>

          {/* Banner Image URL */}
          <div className="form-group">
            <label>Banner Görseli</label>
            <div className="AdminBannerImageInput">
              <input
                type="url"
                value={bannerImageUrl}
                onChange={(e) => setBannerImageUrl(e.target.value)}
                placeholder="Banner görsel URL'si girebilir ya da dosya seçebilirsiniz"
              />
              <div className="AdminBannerImageControls">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerFileSelect}
                  style={{ display: "none" }}
                  id="banner-file-input"
                />
                <label
                  htmlFor="banner-file-input"
                  className="AdminFileSelectBtn primary"
                >
                  <span className="file-select-btn">Dosya Seç</span>
                </label>
                <button
                  type="button"
                  className="file-select-btn"
                  onClick={() => openFileSelector("banner")}
                >
                  Sistemden Seç
                </button>
              </div>
              {bannerImageUrl && (
                <div className="AdminBannerPreview">
                  <img
                    src={bannerImageUrl}
                    alt="Banner önizleme"
                    style={{ maxWidth: "200px", maxHeight: "100px" }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Product Image ID */}
          <div className="form-group">
            <label>Sayfa Görseli</label>
            <div className="AdminProductImageSelector">
              <div className="AdminUploadControls">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      try {
                        const uploadedFile = await uploadFile(file);
                        setProductImageId(uploadedFile.id);
                        setAvailableFiles((prev) => [...prev, uploadedFile]);
                      } catch (error) {
                        console.error("Dosya yüklenirken hata:", error);
                        Swal.fire({
                          icon: "error",
                          title: "Hata!",
                          text: "Dosya yüklenirken bir hata oluştu.",
                          confirmButtonText: "Tamam",
                          confirmButtonColor: "#dc3545",
                        });
                      }
                    }
                  }}
                  style={{ display: "none" }}
                  id="product-image-input"
                />
                <label
                  htmlFor="product-image-input"
                  className="AdminFileSelectBtn primary"
                >
                  <span className="file-select-btn">Yeni Görsel Yükle</span>
                </label>
                <button
                  type="button"
                  className="file-select-btn"
                  onClick={() => openFileSelector("productImage")}
                >
                  Sistemden Seç
                </button>
              </div>
              {productImageId && (
                <div className="AdminSelectedFileInfo">
                  <div className="AdminSelectedImagePreview">
                    {(() => {
                      const selectedImage = getSelectedProductImage();
                      return selectedImage ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <img
                            src={BASE_URL + selectedImage.path}
                            alt={selectedImage.name}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
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
                    className="delete-btn"
                    onClick={() => setProductImageId("")}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Product Main Image ID */}
          <div className="form-group">
            <label>Ana Ürün Görseli</label>
            <div className="AdminProductImageSelector">
              <div className="AdminUploadControls">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Store the file for later upload
                      setProductMainImageFile(file);
                      setProductMainImageName(file.name);

                      // Create preview
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setProductMainImagePreview(event.target.result);
                      };
                      reader.readAsDataURL(file);

                      // Clear system selection
                      setProductMainImageId("");
                    }
                  }}
                  style={{ display: "none" }}
                  id="product-main-image-input"
                />
                <label
                  htmlFor="product-main-image-input"
                  className="AdminFileSelectBtn primary"
                >
                  <span className="file-select-btn">Yeni Ana Görsel Yükle</span>
                </label>
                <button
                  type="button"
                  className="file-select-btn"
                  onClick={() => openFileSelector("productMainImage")}
                >
                  Sistemden Seç
                </button>
              </div>
              {(productMainImageId || productMainImagePreview) && (
                <div className="AdminSelectedFileInfo">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {productMainImagePreview ? (
                      <img
                        src={productMainImagePreview}
                        alt={
                          productMainImageName || "Ana ürün görseli önizleme"
                        }
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    ) : (
                      productMainImageId &&
                      (() => {
                        const selectedImage = availableFiles.find(
                          (file) => file.id === productMainImageId
                        );
                        if (selectedImage && selectedImage.path) {
                          return (
                            <img
                              src={BASE_URL + selectedImage.path}
                              alt={selectedImage.name || "Ana ürün görseli"}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                            />
                          );
                        }
                        return null;
                      })()
                    )}
                    <span>
                      {productMainImagePreview ? productMainImageName : ""}
                      {!productMainImagePreview &&
                        productMainImageId &&
                        (() => {
                          const selectedImage = availableFiles.find(
                            (file) => file.id === productMainImageId
                          );
                          return selectedImage
                            ? selectedImage.name
                            : `Seçilen görsel ID: ${productMainImageId}`;
                        })()}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => {
                      setProductMainImageId("");
                      setProductMainImagePreview("");
                      setProductMainImageName("");
                      setProductMainImageFile(null);
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Product Documents */}
          <div className="form-group">
            <label>Ürün Dökümanları</label>
            <div className="AdminDocumentsSelector">
              <div className="AdminUploadControls">
                <button
                  type="button"
                  className="file-select-btn"
                  onClick={openDocumentSelector}
                >
                  Döküman Seç
                </button>
              </div>
              {selectedDocuments.length > 0 && (
                <div className="AdminSelectedDocuments">
                  {selectedDocuments.map((documentId) => {
                    const document = getSelectedDocumentData(documentId);
                    if (!document) return null;

                    return (
                      <div
                        key={documentId}
                        className="AdminSelectedDocumentItem"
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          {document.previewImageUrl ? (
                            <img
                              src={
                                document.previewImageUrl.startsWith("http")
                                  ? document.previewImageUrl
                                  : BASE_URL + document.previewImageUrl
                              }
                              alt={document.name}
                              style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                backgroundColor: "#f0f0f0",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              📄
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: "500" }}>
                              {document.name}
                            </div>
                            <div style={{ fontSize: "12px", color: "#666" }}>
                              {document.category || "Kategori Yok"}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => removeDocument(documentId)}
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

          {/* Product Detail Image IDs */}
          <div className="form-group">
            <label>Ürün Detay Görselleri</label>
            <div className="AdminProductDetailImagesSelector">
              <div className="AdminUploadControls">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const files = Array.from(e.target.files);
                    await handleDetailImagesUpload(files);
                  }}
                  style={{ display: "none" }}
                  id="detail-image-input"
                />
                <label
                  htmlFor="detail-image-input"
                  className="AdminFileSelectBtn primary"
                >
                  <span className="file-select-btn">Yeni Görsel Yükle</span>
                </label>
                <button
                  type="button"
                  className="file-select-btn"
                  onClick={() => openFileSelector("productDetailImage")}
                >
                  Sistemden Seç
                </button>
              </div>
              {productDetailImageIds.length > 0 && (
                <div className="AdminSelectedImages">
                  {productDetailImageIds.map((id, index) => {
                    const image = productDetailImages.find(
                      (img) => img.id === id
                    );
                    return (
                      <div key={id} className="AdminSelectedFileItem">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          {image && image.url ? (
                            <img
                              src={image.url}
                              alt={image.name}
                              style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                background: "#f0f0f0",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                              }}
                            >
                              📄
                            </div>
                          )}
                          <span>{image ? image.name : "Görsel"}</span>
                        </div>
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => {
                            setProductDetailImageIds((ids) =>
                              ids.filter((i) => i !== id)
                            );
                            setProductDetailImages((imgs) =>
                              imgs.filter((img) => img.id !== id)
                            );
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

          <div className="form-group" style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <label htmlFor="showContactCheckbox" style={{ marginBottom: 0 }}>
              İletişim Linki Gözüksün mü?
            </label>
            <input
              id="showContactCheckbox"
              type="checkbox"
              checked={showContact}
              onChange={e => setShowContact(e.target.checked)}
              style={{ width: "18px", height: "18px" }}
            />
          </div>
          <div className="AdminModalFooter">
            <button type="button" className="cancel-btn" onClick={onClose}>
              <span>İptal</span>
            </button>
            <button type="submit" className="save-btn" disabled={loading}>
              <span>{loading ? "Kaydediliyor..." : "Kaydet"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Dosya Seçici Modal */}
      {showFileSelector && (
        <div className="AdminFileSelectorModal">
          <div className="AdminFileSelectorContent">
            <div className="AdminFileSelectorHeader">
              <h3>Dosya Seç</h3>
              <button
                type="button"
                className="delete-btn"
                onClick={() => setShowFileSelector(false)}
              >
                ×
              </button>
            </div>
            <div className="AdminFileSelectorBody">
              <div className="AdminFilesGrid">
                {availableFiles
                  .filter((file) => {
                    // Görsel seçimi için sadece resimleri göster
                    if (
                      [
                        "banner",
                        "productImage",
                        "documentImage",
                        "productDetailImage",
                      ].includes(selectedFileType)
                    ) {
                      return (
                        file.contentType?.startsWith("image/") ||
                        file.path?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                      );
                    }
                    // Döküman dosyası seçimi için tüm dosyaları göster
                    if (selectedFileType === "documentFile") {
                      return true;
                    }
                    return true;
                  })
                  .map((file) => (
                    <div
                      key={file.id}
                      className="AdminFileItem"
                      onClick={() => selectFileFromSystem(file)}
                    >
                      {file.contentType?.startsWith("image/") ||
                      file.path?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        <img
                          src={BASE_URL + file.path}
                          alt={file.name}
                          loading="lazy"
                        />
                      ) : (
                        <div className="AdminFileIcon">
                          <span style={{ fontSize: "48px" }}>📄</span>
                        </div>
                      )}
                      <div className="AdminFileInfo">
                        <span className="AdminFileName">{file.name}</span>
                        <span className="AdminFileSize">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Seçici Modal */}
      {showDocumentSelector && (
        <div className="AdminFileSelectorModal">
          <div className="AdminFileSelectorContent">
            <div className="AdminFileSelectorHeader">
              <h3>Döküman Seç</h3>
              <button
                type="button"
                className="delete-btn"
                onClick={() => setShowDocumentSelector(false)}
              >
                ×
              </button>
            </div>
            <div className="AdminFileSelectorBody">
              <div className="AdminDocumentsGrid">
                {availableDocuments
                  .filter((doc) => !selectedDocuments.includes(doc.id))
                  .map((document) => (
                    <div
                      key={document.id}
                      className="AdminFileItem AdminDocumentItem"
                      onClick={() => selectDocument(document)}
                    >
                      {document.previewImageUrl ? (
                        <img
                          src={
                            document.previewImageUrl.startsWith("http")
                              ? document.previewImageUrl
                              : BASE_URL + document.previewImageUrl
                          }
                          alt={document.name}
                          loading="lazy"
                        />
                      ) : (
                        <div className="AdminFileIcon">
                          <span style={{ fontSize: "48px" }}>📄</span>
                        </div>
                      )}
                      <div className="AdminFileInfo">
                        <span className="AdminFileName">{document.name}</span>
                        <span className="AdminFileCategory">
                          {document.category || "Kategori Yok"}
                        </span>
                        {document.description && (
                          <span className="AdminFileDescription">
                            {document.description}
                          </span>
                        )}
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

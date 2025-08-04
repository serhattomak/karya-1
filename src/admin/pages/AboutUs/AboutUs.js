import React, { useEffect, useState, useRef } from "react";
import { getPage, getPageByName, updatePage } from "../../../api";
import Swal from "sweetalert2";
import "./AboutUs.css";

const BASE_URL = "https://localhost:7103/";
const API_BASE_URL = "https://localhost:7103";

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

const AboutUs = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [titles, setTitles] = useState([""]);
  const [subtitles, setSubtitles] = useState([""]);
  const [descriptions, setDescriptions] = useState([""]);
  const [image, setImage] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [availableImages, setAvailableImages] = useState([]);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [servicesTitle, setServicesTitle] = useState("Hizmetlerimiz");
  const [servicesList, setServicesList] = useState([""]);
  const [serviceGroups, setServiceGroups] = useState([
    { title: "Hizmetlerimiz", items: [""] }
  ]);
  const [applicationAreaImages, setApplicationAreaImages] = useState([
    null,
    null,
    null,
    null,
  ]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pageType, setPageType] = useState(0);
  const [name, setName] = useState("");
  const [urls, setUrls] = useState([]);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [productIds, setProductIds] = useState([]);
  const [additionalFields, setAdditionalFields] = useState([]);
  const applicationFileInputRefs = useRef([]);
  const selectedApplicationImageIndexRef = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPageByName("Hakkımızda");
        const data = response?.data?.data || response?.data || response;
        
        console.log("API Response:", response);
        console.log("Parsed Data:", data);
        
        setPageData(data);
        setTitles(data.titles && data.titles.length > 0 ? data.titles : [""]);
        setSubtitles(data.subtitles && data.subtitles.length > 0 ? data.subtitles : [""]);
        setDescriptions(data.descriptions && data.descriptions.length > 0 ? data.descriptions : [""]);
        setImage(data.bannerImageUrl || "");
        setBannerImageUrl(data.bannerImageUrl || "");
        
        setServicesTitle(data.listTitles && data.listTitles.length > 0 ? data.listTitles[0] : "Hizmetlerimiz");
        setServicesList(data.listItems && data.listItems.length > 0 ? data.listItems : [""]);
        
        if (data.titles && data.listItems) {
          const groups = [];
          let serviceStartIndex = data.titles.length > 0 ? 1 : 0;
          
          if (data.titles.length > serviceStartIndex && data.listItems.length > 0) {
            groups.push({
              title: data.titles[serviceStartIndex] || "Hizmetlerimiz",
              items: data.listItems.length > 0 ? data.listItems : [""]
            });
          } else {
            groups.push({ title: "Hizmetlerimiz", items: [""] });
          }
          setServiceGroups(groups);
        } else {
          setServiceGroups([{ title: "Hizmetlerimiz", items: [""] }]);
        }
        setPageType(typeof data.pageType !== "undefined" ? data.pageType : 0);
        setName(data.name || "Hakkımızda");
        setUrls(data.urls || []);
        setBackgroundImageUrl(data.backgroundImageUrl || "");
        setProductIds(data.productIds || []);
        setAdditionalFields(data.additionalFields || []);
        
        let appImages = [null, null, null, null];
        if (Array.isArray(data.files)) {
          appImages = data.files.slice(0, 4).map((f) => ({
            id: f.id,
            url: f.path ? BASE_URL + f.path : "",
          }));
          while (appImages.length < 4) appImages.push(null);
        }
        setApplicationAreaImages(appImages);

        try {
          const imagesResponse = await fetch(`${API_BASE_URL}/api/File`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          console.log("Images API Response Status:", imagesResponse.status);
          if (imagesResponse.ok) {
            const imagesData = await imagesResponse.json();
            console.log("Images API Data:", imagesData);
            
            const files = imagesData?.data || imagesData || [];
            console.log("Processed Files:", files);
            
            const imagePaths = files
              .filter(file => file.contentType?.startsWith('image/'))
              .map(file => file.path)
              .filter(Boolean);
            console.log("Processed Image Paths:", imagePaths);
            setAvailableImages(imagePaths);
          } else {
            console.error("Images API Error Status:", imagesResponse.status);
            const testImages = [
              "uploads/1738834392185.webp",
              "uploads/1738834413931.webp", 
              "uploads/1738834418863.webp",
              "uploads/1738834423358.webp",
              "uploads/1738835993151.jpeg"
            ];
            setAvailableImages(testImages);
          }
        } catch (imageError) {
          console.warn("Görseller yüklenirken hata:", imageError);
          const testImages = [
            "uploads/1738834392185.webp",
            "uploads/1738834413931.webp", 
            "uploads/1738834418863.webp",
            "uploads/1738834423358.webp",
            "uploads/1738835993151.jpeg"
          ];
          setAvailableImages(testImages);
        }
      } catch (error) {
        console.error("Veri çekme hatası: ", error);
        Swal.fire({
          icon: "error",
          title: "Hata!",
          text: "Veriler yüklenirken bir hata oluştu.",
          confirmButtonText: "Tamam",
          confirmButtonColor: "#dc3545",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let uploadedImageUrl = image;
    if (selectedFile) {
      try {
        const uploaded = await uploadFile(selectedFile);
        uploadedImageUrl = uploaded.url || uploaded.path || uploaded.imageUrl || image;
      } catch (error) {
        console.error("Resim yükleme hatası:", error);
        Swal.fire({
          icon: "error",
          title: "Hata!",
          text: "Resim yüklenirken bir hata oluştu.",
          confirmButtonText: "Tamam",
          confirmButtonColor: "#dc3545",
        });
        return;
      }
    }

    const updatedData = {
      id: pageData?.id,
      pageType,
      name: "Hakkımızda",
      slug: pageData?.slug || "hakkimizda",
      titles: titles.filter(Boolean),
      subtitles: subtitles.filter(Boolean),
      descriptions: descriptions.filter(Boolean),
      listTitles: [servicesTitle].filter(Boolean),
      listItems: servicesList.filter(Boolean),
      urls,
      backgroundImageUrl,
      bannerImageUrl: uploadedImageUrl,
      fileIds: applicationAreaImages
        .filter((img) => img && img.id)
        .map((img) => img.id),
      productIds,
      documentIds: [],
      additionalFields,
    };
    try {
      console.log("Güncelleme verisi:", updatedData);
      await updatePage(updatedData);
      
      Swal.fire({
        icon: "success",
        title: "Başarılı!",
        text: "Hakkımızda sayfası başarıyla güncellendi!",
        confirmButtonText: "Tamam",
        confirmButtonColor: "#28a745",
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Güncelleme hatası: ", error);
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "Güncelleme sırasında bir hata oluştu.",
        confirmButtonText: "Tamam",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  const handleApplicationImageUpload = async (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      try {
        const uploaded = await uploadFile(file);
        console.log("uploadFile yanıtı:", uploaded);
        
        const imageUrl = uploaded?.data?.path
          ? BASE_URL + uploaded.data.path
          : uploaded?.path
          ? BASE_URL + uploaded.path
          : "";
        console.log("Kullanılan imageUrl:", imageUrl);
        
        const fileId = uploaded?.data?.id || uploaded?.id || null;
        console.log("File ID:", fileId);
        
        setApplicationAreaImages((prevImages) => {
          const updatedImages = [...prevImages];
          updatedImages[selectedApplicationImageIndexRef.current] = fileId
            ? { id: fileId, url: imageUrl }
            : null;
          return updatedImages;
        });
        
        Swal.fire({
          icon: "success",
          title: "Başarılı!",
          text: "Görsel başarıyla yüklendi!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      } catch (error) {
        console.error("Uygulama alanı görseli yüklenemedi", error);
        Swal.fire({
          icon: "error",
          title: "Hata!",
          text: "Görsel yüklenirken bir hata oluştu.",
          confirmButtonText: "Tamam",
          confirmButtonColor: "#dc3545",
        });
      }
    }
  };

  const triggerApplicationFileInput = (index) => {
    selectedApplicationImageIndexRef.current = index;
    applicationFileInputRefs.current[index]?.click();
  };

  const addTitle = () => setTitles([...titles, ""]);
  const updateTitle = (index, value) => {
    const updated = [...titles];
    updated[index] = value;
    setTitles(updated);
  };
  const removeTitle = (index) => {
    if (titles.length > 1) {
      setTitles(titles.filter((_, i) => i !== index));
    }
  };

  const addSubtitle = () => setSubtitles([...subtitles, ""]);
  const updateSubtitle = (index, value) => {
    const updated = [...subtitles];
    updated[index] = value;
    setSubtitles(updated);
  };
  const removeSubtitle = (index) => {
    if (subtitles.length > 1) {
      setSubtitles(subtitles.filter((_, i) => i !== index));
    }
  };

  const addDescription = () => setDescriptions([...descriptions, ""]);
  const updateDescription = (index, value) => {
    const updated = [...descriptions];
    updated[index] = value;
    setDescriptions(updated);
  };
  const removeDescription = (index) => {
    if (descriptions.length > 1) {
      setDescriptions(descriptions.filter((_, i) => i !== index));
    }
  };

  const addServiceGroup = () => {
    setServiceGroups([...serviceGroups, { title: "", items: [""] }]);
  };
  const updateServiceGroupTitle = (groupIndex, value) => {
    const updated = [...serviceGroups];
    updated[groupIndex].title = value;
    setServiceGroups(updated);
  };
  const removeServiceGroup = (groupIndex) => {
    if (serviceGroups.length > 1) {
      setServiceGroups(serviceGroups.filter((_, i) => i !== groupIndex));
    }
  };
  const addServiceItem = (groupIndex) => {
    const updated = [...serviceGroups];
    updated[groupIndex].items.push("");
    setServiceGroups(updated);
  };
  const updateServiceItem = (groupIndex, itemIndex, value) => {
    const updated = [...serviceGroups];
    updated[groupIndex].items[itemIndex] = value;
    setServiceGroups(updated);
  };
  const removeServiceItem = (groupIndex, itemIndex) => {
    const updated = [...serviceGroups];
    if (updated[groupIndex].items.length > 1) {
      updated[groupIndex].items = updated[groupIndex].items.filter((_, i) => i !== itemIndex);
      setServiceGroups(updated);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "bannerImageUrl") setBannerImageUrl(value);
  };

  const openImageSelector = () => {
    setShowImageSelector(true);
  };

  const selectImageFromSystem = (imagePath) => {
    setBannerImageUrl(`${API_BASE_URL}/${imagePath}`);
    setShowImageSelector(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Hakkımızda sayfası yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="section-header">
        <h2 className="panel-title">🏢 Hakkımızda Sayfası Yönetimi</h2>
        <p className="panel-description">
          Şirket hakkında bilgileri, hizmetlerinizi ve galeri görsellerini düzenleyin.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-section">
          <h3 className="form-section-title">📝 Temel Bilgiler</h3>

          {/* Banner Image Section */}
          <div className="form-group">
            <label htmlFor="bannerImageUrl" className="form-label">Banner Görsel URL:</label>
            <input
              type="text"
              id="bannerImageUrl"
              name="bannerImageUrl"
              value={bannerImageUrl}
              onChange={handleChange}
              className="form-input"
              placeholder="Banner görsel URL'si girin"
            />

            <label className="form-label" style={{ marginTop: "15px" }}>Veya Banner Resmi Yükle</label>
            <input 
              type="file" 
              accept="image/*" 
              className="form-input" 
              onChange={handleFileChange} 
            />
            {image && (
              <img
                className="preview-image"
                src={image}
                alt="Önizleme"
                style={{ width: "150px", marginTop: "10px", borderRadius: "8px" }}
              />
            )}
            
            <div className="banner-image-options">
              <p className="form-helper-text" style={{ marginTop: "15px" }}>Veya sistemden görsel seçin:</p>
              <button
                type="button"
                className="add-btn secondary"
                onClick={openImageSelector}
              >
                📁 Sistemden Görsel Seç
              </button>
            </div>
            
            {bannerImageUrl && (
              <div className="selected-image-preview">
                <p className="form-helper-text">Seçili banner görseli:</p>
                <img src={bannerImageUrl} alt="Selected banner" className="preview-image" style={{ width: "200px", marginTop: "10px", borderRadius: "8px" }} />
              </div>
            )}
          </div>

          {/* Multiple Titles Section */}
          <div className="form-group">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label className="form-label">Başlıklar:</label>
              <button
                type="button"
                onClick={addTitle}
                className="add-btn primary btn-sm"
              >
                + Başlık Ekle
              </button>
            </div>
            {titles.map((title, index) => (
              <div key={index} className="multi-field-item" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => updateTitle(index, e.target.value)}
                  className="form-input"
                  placeholder={`Başlık ${index + 1}`}
                  style={{ flex: 1 }}
                />
                {titles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTitle(index)}
                    className="btn btn-danger btn-sm"
                  >
                    Sil
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Multiple Subtitles Section */}
          <div className="form-group">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label className="form-label">Alt Başlıklar:</label>
              <button
                type="button"
                onClick={addSubtitle}
                className="add-btn primary btn-sm"
              >
                + Alt Başlık Ekle
              </button>
            </div>
            {subtitles.map((subtitle, index) => (
              <div key={index} className="multi-field-item" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => updateSubtitle(index, e.target.value)}
                  className="form-input"
                  placeholder={`Alt Başlık ${index + 1}`}
                  style={{ flex: 1 }}
                />
                {subtitles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubtitle(index)}
                    className="btn btn-danger btn-sm"
                  >
                    Sil
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Multiple Descriptions Section */}
          <div className="form-group">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label className="form-label">İçerik Paragrafları:</label>
              <button
                type="button"
                onClick={addDescription}
                className="add-btn primary btn-sm"
              >
                + Paragraf Ekle
              </button>
            </div>
            {descriptions.map((description, index) => (
              <div key={index} className="multi-field-item" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <textarea
                  value={description}
                  onChange={(e) => updateDescription(index, e.target.value)}
                  className="form-input form-textarea"
                  rows="4"
                  placeholder={`Paragraf ${index + 1}`}
                  style={{ flex: 1 }}
                />
                {descriptions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDescription(index)}
                    className="remove-btn danger btn-sm"
                    style={{ alignSelf: 'flex-start' }}
                  >
                    Sil
                  </button>
                )}
              </div>
            ))}
          </div>

        </div>

        <div className="form-section">
          <h3 className="form-section-title">🎯 Hizmetler Bölümü</h3>

          <div className="form-group service-section">
            <label htmlFor="servicesTitle" className="form-label">Hizmetler Başlığı</label>
            <input
              type="text"
              id="servicesTitle"
              className="form-input"
              value={servicesTitle}
              onChange={(e) => setServicesTitle(e.target.value)}
              placeholder="Hizmet başlığını girin"
            />

            <label className="form-label">Hizmet Maddeleri</label>
            {servicesList.map((item, index) => (
              <div key={index} className="service-item-row-old">
                <span className="index">{index + 1}.</span>
                <input
                  type="text"
                  className="form-input"
                  value={item}
                  onChange={(e) => {
                    const updated = [...servicesList];
                    updated[index] = e.target.value;
                    setServicesList(updated);
                  }}
                  placeholder={`Madde ${index + 1}`}
                />
                <button
                  type="button"
                  className="remove-btn danger btn-sm"
                  onClick={() => {
                    const updated = servicesList.filter((_, i) => i !== index);
                    setServicesList(updated);
                  }}
                  title="Sil"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className="add-btn secondary"
              onClick={() => setServicesList([...servicesList, ""])}
            >
              + Yeni Madde Ekle
            </button>
          </div>
        </div>

        {/* Hizmet Grupları - GEÇİCİ OLARAK DEVRE DIŞI 
        <div className="form-section">
          <h3 className="form-section-title">🎯 Hizmet Grupları</h3>

          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <p className="form-helper-text">Hizmetlerinizi gruplar halinde organize edin</p>
            <button
              type="button"
              onClick={addServiceGroup}
              className="btn btn-primary"
            >
              + Hizmet Grubu Ekle
            </button>
          </div>

          {serviceGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="service-group" style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
              <div className="service-group-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4 className="form-section-title" style={{ margin: 0 }}>Hizmet Grubu {groupIndex + 1}</h4>
                {serviceGroups.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeServiceGroup(groupIndex)}
                    className="btn btn-danger btn-sm"
                  >
                    Grubu Sil
                  </button>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Grup Başlığı</label>
                <input
                  type="text"
                  className="form-input"
                  value={group.title}
                  onChange={(e) => updateServiceGroupTitle(groupIndex, e.target.value)}
                  placeholder={`Hizmet grubu ${groupIndex + 1} başlığı`}
                />
              </div>

              <div className="form-group">
                <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label className="form-label">Hizmet Maddeleri</label>
                  <button
                    type="button"
                    onClick={() => addServiceItem(groupIndex)}
                    className="btn btn-secondary btn-sm"
                  >
                    + Madde Ekle
                  </button>
                </div>

                {group.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="service-item-row" style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                    <span className="index" style={{ minWidth: '30px', fontWeight: 'bold' }}>{itemIndex + 1}.</span>
                    <input
                      type="text"
                      className="form-input"
                      value={item}
                      onChange={(e) => updateServiceItem(groupIndex, itemIndex, e.target.value)}
                      placeholder={`Madde ${itemIndex + 1}`}
                      style={{ flex: 1 }}
                    />
                    {group.items.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removeServiceItem(groupIndex, itemIndex)}
                        title="Sil"
                      >
                        Sil
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        */}

        <div className="form-section">
          <h3 className="form-section-title">🖼️ Galeri Görselleri</h3>
          <p className="form-help">En fazla 4 görsel yükleyebilirsiniz.</p>
        <div className="gallery-grid">
          {[0, 1, 2, 3].map((index) => {
            const imageObj = applicationAreaImages[index];
            return (
              <div key={index} className="gallery-item image-box">
                {imageObj && imageObj.url ? (
                  <>
                    <img
                      src={imageObj.url}
                      alt={`Uygulama Alanı ${index + 1}`}
                      className="image-preview-square"
                    />
                    <div className="image-overlay">
                      <span
                        className="edit-icon"
                        onClick={() => triggerApplicationFileInput(index)}
                        title="Resmi Değiştir"
                      >
                        ✏️
                      </span>
                    </div>
                  </>
                ) : (
                  <div
                    className="image-placeholder"
                    onClick={() => triggerApplicationFileInput(index)}
                  >
                    <div className="plus-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={(el) => (applicationFileInputRefs.current[index] = el)}
                  onChange={handleApplicationImageUpload}
                />
              </div>
            );
          })}
        </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn primary btn-lg">
            💾 Değişiklikleri Kaydet
          </button>
        </div>
      </form>

      {/* Image Selector Modal */}
      {showImageSelector && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target.className === 'modal-overlay') {
            setShowImageSelector(false);
          }
        }}>
          <div className="modal-content" style={{ maxWidth: '800px', maxHeight: '80vh', overflow: 'auto' }}>
            <div className="modal-header">
              <h3>Sistemden Görsel Seç</h3>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => setShowImageSelector(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="files-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                gap: '15px',
                padding: '20px'
              }}>
                {availableImages.map((imagePath, index) => (
                  <div
                    key={index}
                    className="file-item"
                    onClick={() => selectImageFromSystem(imagePath)}
                    style={{
                      cursor: 'pointer',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      backgroundColor: '#fff'
                    }}
                  >
                    <img
                      src={`${API_BASE_URL}/${imagePath}`}
                      alt={`Görsel ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '120px',
                        objectFit: 'cover'
                      }}
                      loading="lazy"
                    />
                    <div style={{
                      padding: '8px',
                      fontSize: '12px',
                      textAlign: 'center',
                      borderTop: '1px solid #f0f0f0'
                    }}>
                      {imagePath.split('/').pop()}
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

export default AboutUs;

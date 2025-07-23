// PoliuretanEnjeksiyon.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./PoliuretanEnjeksiyon.css"; // CSS dosyamızı dahil ediyoruz

const PoliuretanEnjeksiyon = () => {
  const [formData, setFormData] = useState({
    mainBannerImage: "",
    mainTitle: "",
    descriptionTitle: "",
    descriptionText: "",
    applicationAreasTitle: "",
    applicationAreas: [],
    galleryTitle: "",
    galleryImages: [],
    detailsTitle: "",
    detailsText: "",
    youtubeLink: "",
    bottomInfoTitle: "",
    bottomInfoText: "",
    documents: [],
    homepageTitle: "",
    homepageSubtitle: "",
    homepageImage: "",
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [mainBannerImageFile, setMainBannerImageFile] = useState(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [homepageImageFile, setHomepageImageFile] = useState(null);
  const applicationFileInputRefs = useRef([]);
  const selectedApplicationImageIndexRef = useRef(0);
  const [servicesTitle, setServicesTitle] = useState("Uygulama Alanları");
  const [servicesList, setServicesList] = useState([
    "Diyafram duvarları",
    "Soğuk derzler",
    "Segregasyon bölgeler",
    " Asansör kuyuları",
    "Otoparklar",
    "Otoparklar",
    "Metro",
    "Su depoları",
    "Yüksek basınçlı veya yüksek debili su sızıntıları.",
    "Arıtma tesisleri gibi yapıların betonarmede her türlü oluşan su sızıntılarının durdurulması.",
  ]);
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/poliuretan-enjeksiyon"
        );
        setFormData({
          mainBannerImage: response.data.mainBannerImage || "",
          mainTitle: response.data.mainTitle || "",
          descriptionTitle: response.data.descriptionTitle || "",
          descriptionText: response.data.descriptionText || "",
          applicationAreasTitle: response.data.applicationAreasTitle || "",
          applicationAreas: response.data.applicationAreas || [],
          galleryTitle: response.data.galleryTitle || "",
          galleryImages: response.data.galleryImages || [],
          detailsTitle: response.data.detailsTitle || "",
          detailsText: response.data.detailsText || "",
          youtubeLink: response.data.youtubeLink || "",
          bottomInfoTitle: response.data.bottomInfoTitle || "",
          bottomInfoText: response.data.bottomInfoText || "",
          documents: response.data.documents || [],
          homepageTitle: response.data.homepageTitle || "",
          homepageSubtitle: response.data.homepageSubtitle || "",
          homepageImage: response.data.homepageImage || "",
        });
        setLoading(false);
      } catch (error) {
        console.error(
          "Poliüretan Enjeksiyon verileri alınırken hata oluştu:",
          error
        );
        setLoading(false);
        setFormData({
          mainBannerImage: "",
          mainTitle: "",
          descriptionTitle: "",
          descriptionText: "",
          applicationAreasTitle: "",
          applicationAreas: [],
          galleryTitle: "",
          galleryImages: [],
          detailsTitle: "",
          detailsText: "",
          youtubeLink: "",
          bottomInfoTitle: "",
          bottomInfoText: "",
          documents: [],
          homepageTitle: "",
          homepageSubtitle: "",
          homepageImage: "",
        });
      }
    };
    fetchPageData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddApplicationArea = () => {
    setFormData((prev) => ({
      ...prev,
      applicationAreas: [...prev.applicationAreas, ""],
    }));
  };

  const handleApplicationAreaChange = (index, value) => {
    const newAreas = [...formData.applicationAreas];
    newAreas[index] = value;
    setFormData((prev) => ({ ...prev, applicationAreas: newAreas }));
  };

  const handleRemoveApplicationArea = (index) => {
    const newAreas = formData.applicationAreas.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, applicationAreas: newAreas }));
  };

  const uploadFile = async (file, endpoint) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        `http://localhost:5001/api/upload/${endpoint}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.url;
    } catch (error) {
      console.error(`${endpoint} yüklenirken hata:`, error);
      alert(`Dosya yüklenirken hata oluştu: ${endpoint}`);
      return null;
    }
  };

  const handleMainBannerImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const imageUrl = await uploadFile(file, "poliuretan-banner");
    if (imageUrl) {
      setFormData((prev) => ({ ...prev, mainBannerImage: imageUrl }));
      setMainBannerImageFile(file);
      alert("Banner görseli başarıyla yüklendi!");
    }
    setUploading(false);
  };

  const handleHomepageImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const imageUrl = await uploadFile(file, "poliuretan-homepage-product");
    if (imageUrl) {
      setFormData((prev) => ({ ...prev, homepageImage: imageUrl }));
      setHomepageImageFile(file);
      alert("Anasayfa ürün görseli başarıyla yüklendi!");
    }
    setUploading(false);
  };

  const handleGalleryImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const uploadedUrls = [];
    for (const file of files) {
      const imageUrl = await uploadFile(file, "poliuretan-gallery");
      if (imageUrl) {
        uploadedUrls.push(imageUrl);
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...uploadedUrls],
      }));
      setGalleryImageFiles((prev) => [...prev, ...files]);
      alert("Galeri görselleri başarıyla yüklendi!");
    }
    setUploading(false);
    e.target.value = null;
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    const newGalleryImages = formData.galleryImages.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData((prev) => ({ ...prev, galleryImages: newGalleryImages }));
    setGalleryImageFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleDocumentUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const uploadedUrls = [];
    for (const file of files) {
      const docUrl = await uploadFile(file, "poliuretan-documents");
      if (docUrl) {
        uploadedUrls.push(docUrl);
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...uploadedUrls],
      }));
      setDocumentFiles((prev) => [...prev, ...files]);
      alert("Dökümanlar başarıyla yüklendi!");
    }
    setUploading(false);
    e.target.value = null;
  };

  const handleRemoveDocument = (indexToRemove) => {
    const newDocuments = formData.documents.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData((prev) => ({ ...prev, documents: newDocuments }));
    setDocumentFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleApplicationImageUpload = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setApplicationAreaImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages[selectedApplicationImageIndexRef.current] = imageUrl;
        return updatedImages;
      });
    }
  };
  const triggerApplicationFileInput = (index) => {
    selectedApplicationImageIndexRef.current = index;
    applicationFileInputRefs.current[index]?.click();
  };

  const [applicationAreaImages, setApplicationAreaImages] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      await axios.put(
        "http://localhost:5001/api/poliuretan-enjeksiyon",
        formData
      );
      alert("Poliüretan Enjeksiyon sayfası başarıyla güncellendi!");
    } catch (error) {
      console.error("Veriler güncellenirken hata oluştu:", error);
      alert("Veriler güncellenirken bir hata oluştu.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="loading-message">Veriler Yükleniyor...</div>;
  }

  return (
    <div className="poliuretan-editor-container">
      <form onSubmit={handleSubmit}>
        <div className="poliuretan-editor-section">
          <h4 className="admin-title">Anasayfa Ürün Düzenlemesi</h4>
          <div className="form-group">
            <label htmlFor="homepageTitle">Başlık:</label>
            <input
              type="text"
              id="homepageTitle"
              name="homepageTitle"
              value={formData.homepageTitle}
              onChange={handleChange}
              placeholder="Anasayfa kartı başlığı"
            />
          </div>
          <div className="form-group">
            <label htmlFor="homepageSubtitle">Alt Başlık:</label>
            <input
              type="text"
              id="homepageSubtitle"
              name="homepageSubtitle"
              value={formData.homepageSubtitle}
              onChange={handleChange}
              placeholder="Anasayfa kartı alt başlığı"
            />
          </div>
          <div className="form-group">
            <label htmlFor="homepageImage">Görsel Seç:</label>
            <input
              type="file"
              id="homepageImage"
              accept="image/*"
              onChange={handleHomepageImageUpload}
              disabled={uploading}
            />
            {(formData.homepageImage || homepageImageFile) && (
              <img
                src={
                  homepageImageFile
                    ? URL.createObjectURL(homepageImageFile)
                    : formData.homepageImage
                }
                alt="Anasayfa Ürün Önizleme"
                className="image-preview uploaded-image"
                style={{ maxWidth: "200px", display: "block" }}
              />
            )}
            {homepageImageFile && (
              <p>Yeni Anasayfa Görseli: {homepageImageFile.name}</p>
            )}
            {uploading && <p>Görsel yükleniyor...</p>}
          </div>
        </div>

        {/* Banner/Ana Başlık Kısmı */}
        <h4 className="panel-title">Ürün İçerik Düzenlemesi</h4>

        <div className="poliuretan-editor-section">
          <div className="form-group">
            <label htmlFor="mainTitle"> Banner Başlık:</label>
            <input
              type="text"
              id="mainTitle"
              name="mainTitle"
              value={formData.mainTitle}
              onChange={handleChange}
            />
       
            <label htmlFor="mainBannerImage">Banner Görseli:</label>
            <input
              type="file"
              id="mainBannerImage"
              accept="image/*"
              onChange={handleMainBannerImageUpload}
              disabled={uploading}
            />
            {formData.mainBannerImage && (
              <img
                src={formData.mainBannerImage}
                alt="Ana Banner"
                className="image-preview uploaded-image"
              />
            )}
            {mainBannerImageFile && (
              <p>Yeni görsel: {mainBannerImageFile.name}</p>
            )}
            {uploading && <p>Görsel yükleniyor...</p>}
          </div>
        </div>

        {/* Bilgi Kısmı */}
        <h4 className="panel-title">Poliüretan Enjeksiyon Bilgisi</h4>

        <div className="poliuretan-editor-section">
          <div className="form-group">
            <label htmlFor="descriptionTitle">Başlık:</label>
            <input
              type="text"
              id="descriptionTitle"
              name="descriptionTitle"
              value={formData.descriptionTitle}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="descriptionText">Açıklama Metni:</label>
            <textarea
              id="descriptionText"
              name="descriptionText"
              value={formData.descriptionText}
              onChange={handleChange}
              rows={6}
            />
          </div>

          <div className="form-group service-section">
            <label htmlFor="servicesTitle">Başlık</label>
            <input
              type="text"
              id="servicesTitle"
              className="input full"
              value={servicesTitle}
              onChange={(e) => setServicesTitle(e.target.value)}
              placeholder="Hizmet başlığını girin"
            />

            <label>Maddeler</label>
            {servicesList.map((item, index) => (
              <div key={index} className="service-item-row">
                <span className="index">{index + 1}.</span>
                <input
                  type="text"
                  className="input"
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
                  className="delete-btn"
                  onClick={() => {
                    const updated = servicesList.filter((_, i) => i !== index);
                    setServicesList(updated);
                  }}
                >
                  ❌
                </button>
              </div>
            ))}

            <button
              type="button"
              className="add-btn"
              onClick={() => setServicesList([...servicesList, ""])}
            >
              + Yeni Madde Ekle
            </button>
          </div>
        </div>

        {/* Uygulama Alanlarına Ait Görseller Kısmı */}
        <h4 className="panel-title">Uygulama Alanlarına Ait Görseller</h4>
        <div className="gallery-grid">
          {Array.from({ length: 8 }, (_, i) => i).map((index) => {
            const imageUrl = applicationAreaImages[index];

            return (
              <div key={index} className="gallery-item image-box">
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
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
                    <div className="plus-icon">Görsel Ekle ➕</div>
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

        {/*  video Kısmı */}
        <h4 className="panel-title">Detaylar ve Video</h4>

        <div className="poliuretan-editor-section">
          <div className="form-group">
            <label htmlFor="detailsTitle">Başlık:</label>
            <input
              type="text"
              id="detailsTitle"
              name="detailsTitle"
              value={formData.detailsTitle}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="detailsText">Açıklama Metni:</label>
            <textarea
              id="detailsText"
              name="detailsText"
              value={formData.detailsText}
              onChange={handleChange}
              rows={6}
            />
          </div>
          <div className="form-group">
            <label htmlFor="youtubeLink">YouTube Video Bağlantısı:</label>
            <input
              type="url"
              id="youtubeLink"
              name="youtubeLink"
              value={formData.youtubeLink}
              onChange={handleChange}
              placeholder="Örn: https://www.youtube.com/watch?v=xxxxxxxxxxx"
            />
            {formData.youtubeLink && (
              <p>
                Mevcut video:{" "}
                <a
                  href={formData.youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {formData.youtubeLink}
                </a>
              </p>
            )}
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={uploading}>
          {uploading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
};

export default PoliuretanEnjeksiyon;

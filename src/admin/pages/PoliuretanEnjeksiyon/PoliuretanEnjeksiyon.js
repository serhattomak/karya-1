// PoliuretanEnjeksiyon.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PoliuretanEnjeksiyon.css"; // CSS dosyamızı dahil ediyoruz

const PoliuretanEnjeksiyon = () => {
  const [formData, setFormData] = useState({
    mainBannerImage: "", // Ana banner görseli URL'si
    mainTitle: "", // "Poliüretan Enjeksiyon" (banner'daki)
    descriptionTitle: "", // "Poliüretan Enjeksiyon" (sol bölüm başlığı)
    descriptionText: "", // Sol bölümdeki açıklama metni
    applicationAreasTitle: "", // "Uygulama Alanları" başlığı
    applicationAreas: [], // Uygulama alanları listesi (string array)
    galleryTitle: "", // "Uygulama Alanlarına Ait Görseller" başlığı
    galleryImages: [], // Galeri görselleri URL'leri (string array)
    detailsTitle: "", // "Poliüretan Enjeksiyon Detayları" başlığı
    detailsText: "", // Detaylar açıklama metni
    youtubeLink: "", // YouTube video URL'si
    bottomInfoTitle: "", // "Ürün hakkında daha fazla bilgi almak için..." başlığı
    bottomInfoText: "", // Alt açıklama metni
    documents: [], // Döküman URL'leri (string array)
    // YENİ EKLENEN KISIM: Anasayfa Ürün Bilgisi için alanlar
    homepageTitle: "",
    homepageSubtitle: "",
    homepageImage: "",
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); // Genel yükleme durumu

  // Dosya önizlemeleri için state'ler (her resim/döküman için ayrı ayrı)
  const [mainBannerImageFile, setMainBannerImageFile] = useState(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);
  // YENİ EKLENEN KISIM: Anasayfa Ürün Görseli önizlemesi için state
  const [homepageImageFile, setHomepageImageFile] = useState(null);

  // Verileri Backend'den Çekme
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/poliuretan-enjeksiyon"
        );
        // Backend'den gelen veriyi ve eksikse varsayılan değerleri set et
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
          // YENİ EKLENEN KISIM: Anasayfa Ürün Bilgisi alanlarını varsayılanlarla doldur
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
        // Hata durumunda varsayılan boş değerlerle devam et
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

  // Input alanlarındaki değişiklikleri yönetme
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Uygulama Alanları için özel handler'lar
  const handleAddApplicationArea = () => {
    setFormData((prev) => ({
      ...prev,
      applicationAreas: [...prev.applicationAreas, ""], // Yeni boş alan ekle
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

  // Resim/Döküman yükleme genel fonksiyonu
  const uploadFile = async (file, endpoint) => {
    const formData = new FormData();
    formData.append("file", file); // Backend'de 'file' olarak bekliyor varsayalım

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
      return response.data.url; // Yüklenen dosyanın URL'sini dönsün
    } catch (error) {
      console.error(`${endpoint} yüklenirken hata:`, error);
      alert(`Dosya yüklenirken hata oluştu: ${endpoint}`);
      return null;
    }
  };

  // Ana Banner Görseli Yükleme
  const handleMainBannerImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const imageUrl = await uploadFile(file, "poliuretan-banner"); // Backend endpoint'i
    if (imageUrl) {
      setFormData((prev) => ({ ...prev, mainBannerImage: imageUrl }));
      setMainBannerImageFile(file); // Önizleme için dosya objesini sakla
      alert("Banner görseli başarıyla yüklendi!");
    }
    setUploading(false);
  };

  // YENİ EKLENEN KISIM: Anasayfa Ürün Görseli Yükleme
  const handleHomepageImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const imageUrl = await uploadFile(file, "poliuretan-homepage-product"); // Backend endpoint'i
    if (imageUrl) {
      setFormData((prev) => ({ ...prev, homepageImage: imageUrl }));
      setHomepageImageFile(file); // Önizleme için dosya objesini sakla
      alert("Anasayfa ürün görseli başarıyla yüklendi!");
    }
    setUploading(false);
  };
  // YENİ EKLENEN KISIM SONU

  // Galeri Görselleri Yükleme (Çoklu)
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
    e.target.value = null; // Input'u temizle
  };

  // Galeri Görseli Silme (Mevcut Görsellerden)
  const handleRemoveGalleryImage = (indexToRemove) => {
    const newGalleryImages = formData.galleryImages.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData((prev) => ({ ...prev, galleryImages: newGalleryImages }));
    // Eğer önizleme için dosya objesi tutuluyorsa onu da güncellemek gerekebilir
    // Bu kısım şu an için basit tutuldu, daha detaylı bir state yönetimi gerekebilir
    setGalleryImageFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  // Döküman Yükleme (Çoklu)
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
    e.target.value = null; // Input'u temizle
  };

  // Döküman Silme (Mevcut Dökümanlardan)
  const handleRemoveDocument = (indexToRemove) => {
    const newDocuments = formData.documents.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData((prev) => ({ ...prev, documents: newDocuments }));
    setDocumentFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  // Tüm verileri Backend'e kaydetme
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true); // Kaydetme işlemi başladı

    try {
      // Sadece form verilerini gönderiyoruz, dosya yüklemeleri ayrı yapıldı
      await axios.put(
        "http://localhost:5001/api/poliuretan-enjeksiyon",
        formData
      );
      alert("Poliüretan Enjeksiyon sayfası başarıyla güncellendi!");
    } catch (error) {
      console.error("Veriler güncellenirken hata oluştu:", error);
      alert("Veriler güncellenirken bir hata oluştu.");
    } finally {
      setUploading(false); // Kaydetme işlemi bitti
    }
  };

  if (loading) {
    return <div className="loading-message">Veriler Yükleniyor...</div>;
  }

  return (
    <div className="poliuretan-editor-container">
      <form onSubmit={handleSubmit}>

        {/* YENİ EKLENEN KISIM: Anasayfa Ürün Bilgisi */}
        <div className="poliuretan-editor-section">
        <h2 className="admin-title">Anasayfa Ürün Düzenlemesi</h2>
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
                src={homepageImageFile ? URL.createObjectURL(homepageImageFile) : formData.homepageImage}
                alt="Anasayfa Ürün Önizleme"
                className="image-preview uploaded-image" // Mevcut stilleri kullan
                style={{ maxWidth: "200px", display: "block" }} // Daha küçük önizleme
              />
            )}
            {homepageImageFile && <p>Yeni Anasayfa Görseli: {homepageImageFile.name}</p>}
            {uploading && <p>Görsel yükleniyor...</p>}
          </div>
        </div>
        {/* YENİ EKLENEN KISIM SONU */}

        {/* 1. Banner/Ana Başlık Kısmı */}
        <div className="poliuretan-editor-section">
        <h2 className="admin-title">Ürün İçerik Düzenlemesi</h2>
        <div className="form-group">
            <label htmlFor="mainTitle"> Banner Başlık:</label>
            <input
              type="text"
              id="mainTitle"
              name="mainTitle"
              value={formData.mainTitle}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
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

        {/* 2. Poliüretan Enjeksiyon Bilgi Kısmı */}
        <div className="poliuretan-editor-section">
          <h3>Poliüretan Enjeksiyon Bilgisi</h3>
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
        </div>

        {/* 3. Uygulama Alanları Kısmı */}
        <div className="poliuretan-editor-section">
          <h3>Uygulama Alanları</h3>
          <div className="form-group">
            <label htmlFor="applicationAreasTitle">Başlık:</label>
            <input
              type="text"
              id="applicationAreasTitle"
              name="applicationAreasTitle"
              value={formData.applicationAreasTitle}
              onChange={handleChange}
            />
          </div>
          <label>Alanlar:</label>
          <div className="application-areas-list">
            {formData.applicationAreas.map((area, index) => (
              <div key={index} className="application-area-item">
                <input
                  type="text"
                  value={area}
                  onChange={(e) =>
                    handleApplicationAreaChange(index, e.target.value)
                  }
                  placeholder={`Alan ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveApplicationArea(index)}
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddApplicationArea}
            className="add-area-button"
          >
            Alan Ekle
          </button>
        </div>

        {/* 4. Uygulama Alanlarına Ait Görseller Kısmı */}
        <div className="poliuretan-editor-section">
          <h3>Galeri Görselleri</h3>
          <div className="form-group">
            <label htmlFor="galleryTitle">Başlık:</label>
            <input
              type="text"
              id="galleryTitle"
              name="galleryTitle"
              value={formData.galleryTitle}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="galleryImages">Görsel Yükle:</label>
            <input
              type="file"
              id="galleryImages"
              accept="image/*"
              multiple
              onChange={handleGalleryImagesUpload}
              disabled={uploading}
            />
            {uploading && <p>Görseller yükleniyor...</p>}
          </div>
          <div className="gallery-images">
            {formData.galleryImages.map((imageUrl, index) => (
              <div key={index} className="gallery-image-item">
                <img src={imageUrl} alt={`Galeri Görseli ${index + 1}`} />
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryImage(index)}
                >
                  X
                </button>
              </div>
            ))}
            {/* Önizleme için yeni yüklenen dosyaları gösterme (sadece adlarını) */}
            {galleryImageFiles.map((file, index) => (
              <p key={`new-gallery-${index}`}>{file.name}</p>
            ))}
          </div>
        </div>

        {/* 5. Poliüretan Enjeksiyon Detayları Kısmı */}
        <div className="poliuretan-editor-section">
          <h3>Detaylar ve Video</h3>
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

        {/* 6. Alt Bilgi / Döküman Kısmı */}
        <div className="poliuretan-editor-section">
          <h3>Alt Bilgi ve Dökümanlar</h3>
          <div className="form-group">
            <label htmlFor="bottomInfoTitle">Başlık:</label>
            <input
              type="text"
              id="bottomInfoTitle"
              name="bottomInfoTitle"
              value={formData.bottomInfoTitle}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="bottomInfoText">Açıklama Metni:</label>
            <textarea
              id="bottomInfoText"
              name="bottomInfoText"
              value={formData.bottomInfoText}
              onChange={handleChange}
              rows={4}
            />
          </div>
          <div className="form-group">
            <label htmlFor="documents">
              Döküman Yükle (PDF, DOC, JPG, PNG):
            </label>
            <input
              type="file"
              id="documents"
              accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
              multiple
              onChange={handleDocumentUpload}
              disabled={uploading}
            />
            {uploading && <p>Dökümanlar yükleniyor...</p>}
          </div>
          <div className="documents-list">
            {formData.documents.map((docUrl, index) => (
              <div key={index} className="document-item">
                <a href={docUrl} target="_blank" rel="noopener noreferrer">
                  {`Döküman ${index + 1} (${docUrl.substring(
                    docUrl.lastIndexOf("/") + 1
                  )})`}
                </a>
                <button
                  type="button"
                  onClick={() => handleRemoveDocument(index)}
                >
                  Sil
                </button>
              </div>
            ))}
            {/* Önizleme için yeni yüklenen dosyaları gösterme (sadece adlarını) */}
            {documentFiles.map((file, index) => (
              <p key={`new-doc-${index}`}>{file.name}</p>
            ))}
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
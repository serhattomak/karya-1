// ContactEditor.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ContactPage.css";

const ContactEditor = () => {
  const [formData, setFormData] = useState({
    bannerTitle: "", // "Asil Nun X" yazan yer, "İletişim" olarak düşünülebilir
    bannerImage: "", // Banner arkaplan görseli URL'si

    phoneTitle: "",
    phoneNumber: "",
    emailTitle: "",
    emailAddress: "",
    locationTitle: "",
    locationAddress: "",
    instagramTitle: "",
    instagramUsername: "",

    messageFormTitle: "",
    messageFormDescription: "",

    mapTitle: "",
    mapIframeCode: "", // Google Maps embed kodu
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); // Genel yükleme durumu

  // Dosya önizlemeleri için state (şimdilik sadece banner görseli için)
  const [bannerImageFile, setBannerImageFile] = useState(null);

  // Verileri Backend'den Çekme
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/contact"); // Backend endpoint'i
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("İletişim sayfası verileri alınırken hata oluştu:", error);
        setLoading(false);
        // Hata durumunda varsayılan boş değerlerle devam et
      }
    };
    fetchPageData();
  }, []);

  // Input alanlarındaki değişiklikleri yönetme
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Resim yükleme genel fonksiyonu
  const uploadFile = async (file, endpoint) => {
    const formData = new FormData();
    formData.append("file", file); // Backend'de 'file' olarak bekliyor varsayalım

    try {
      const response = await axios.post(`http://localhost:5001/api/upload/${endpoint}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.url; // Yüklenen dosyanın URL'sini dönsün
    } catch (error) {
      console.error(`${endpoint} yüklenirken hata:`, error);
      alert(`Dosya yüklenirken hata oluştu: ${endpoint}`);
      return null;
    }
  };

  // Banner Görseli Yükleme
  const handleBannerImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const imageUrl = await uploadFile(file, "contact-banner"); // Backend endpoint'i
    if (imageUrl) {
      setFormData((prev) => ({ ...prev, bannerImage: imageUrl }));
      setBannerImageFile(file); // Önizleme için dosya objesini sakla
      alert("Banner görseli başarıyla yüklendi!");
    }
    setUploading(false);
  };

  // Tüm verileri Backend'e kaydetme
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true); // Kaydetme işlemi başladı

    try {
      // Sadece form verilerini gönderiyoruz, dosya yüklemeleri ayrı yapıldı
      await axios.put("http://localhost:5001/api/contact", formData); // Backend endpoint'i
      alert("İletişim sayfası başarıyla güncellendi!");
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
    <div className="contact-editor-container">
      <h2>İletişim Sayfası Düzenleme</h2>
      <form onSubmit={handleSubmit}>

        {/* 1. Banner Alanı */}
        <div className="contact-editor-section">
          <h3 className="admin-title">Sayfa Banner Alanı</h3>
          <div className="form-group">
            <label htmlFor="bannerTitle">Banner Başlık:</label>
            <input
              type="text"
              id="bannerTitle"
              name="bannerTitle"
              value={formData.bannerTitle}
              onChange={handleChange}
              placeholder="Örn: İletişim"
            />
          </div>
          <div className="form-group">
            <label htmlFor="bannerImage">Banner Arkaplan Görseli:</label>
            <input
              type="file"
              id="bannerImage"
              accept="image/*"
              onChange={handleBannerImageUpload}
              disabled={uploading}
            />
            {formData.bannerImage && (
              <img
                src={formData.bannerImage}
                alt="Banner Önizleme"
                className="image-preview uploaded-image"
              />
            )}
            {bannerImageFile && (
                <p>Yeni görsel: {bannerImageFile.name}</p>
            )}
            {uploading && <p>Görsel yükleniyor...</p>}
          </div>
        </div>

        {/* 2. İletişim Bilgileri (Sol Kısım) */}
        <div className="contact-editor-section">
          <h3 className="admin-title">İletişim Bilgileri</h3>
     
          <div className="form-group">
            <label htmlFor="phoneNumber">Telefon Numarası</label>
            <input type="text" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}/>
          </div>

         
          <div className="form-group">
            <label htmlFor="emailAddress">E-posta Adresi</label>
            <input type="email" id="emailAddress" name="emailAddress" value={formData.emailAddress} onChange={handleChange} />
          </div>

        
          <div className="form-group">
            <label htmlFor="locationAddress">Lokasyon Adresi</label>
            <textarea id="locationAddress" name="locationAddress" value={formData.locationAddress} onChange={handleChange}  />
          </div>

       
          <div className="form-group">
            <label htmlFor="instagramUsername">Instagram Kullanıcı Adı</label>
            <input type="text" id="instagramUsername" name="instagramUsername" value={formData.instagramUsername} onChange={handleChange} />
          </div>
        </div>

     

        {/* 4. Harita Kısmı */}
        <div className="contact-editor-section">
          <h3 className="admin-title">Harita </h3>
       
          <div className="form-group">
            <label htmlFor="mapIframeCode">Adres</label>
            <textarea
              id="mapIframeCode"
              name="mapIframeCode"
              value={formData.mapIframeCode}
              onChange={handleChange}
              placeholder="Google Haritalar'dan alınan <iframe> kodunu buraya yapıştırın."
            />
          </div>
        </div>

        <button
                type="submit"
                disabled={uploading}
                className="save-button"
              >
                {uploading ? "Kaydediliyor..." : "Kaydet"}
              </button>
      </form>
    </div>
  );
};

export default ContactEditor;
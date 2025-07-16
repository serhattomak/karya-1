import React, { useState, useRef } from "react";
import "./TelBeton.css";

const TelBeton = () => {
  const [bannerImage, setBannerImage] = useState("");
  const [pageTitle, setPageTitle] = useState("Sayfa Başlığı");
  const [contentTitle, setContentTitle] = useState("İçerik Başlığı");
  const [contentMainText, setContentMainText] = useState("İçerik Metni");
  const [bannerTitle, setBannerTitle] = useState("Banner Başlığı");
  const [contentImage, setContentImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [homepageTitle, setHomepageTitle] = useState("");
  const [homepageSubtitle, setHomepageSubtitle] = useState("");
  const [homepageImage, setHomepageImage] = useState("");

  const [applicationAreaImages, setApplicationAreaImages] = useState([
    "",
    "",
    "",
    "",
  ]);
  const applicationFileInputRefs = useRef([]);
  const selectedApplicationImageIndexRef = useRef(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Banner Resmi:", bannerImage);
    console.log("Sayfa Başlığı:", pageTitle);
    console.log("İçerik Başlığı:", contentTitle);
    console.log("İçerik Metni:", contentMainText);
    console.log("İçerik Resmi:", contentImage);
    console.log("Anasayfa Ürün Başlığı:", homepageTitle);
    console.log("Anasayfa Ürün Alt Başlığı:", homepageSubtitle);
    console.log("Anasayfa Ürün Resmi:", homepageImage);
    console.log("Uygulama Alanları Görselleri:", applicationAreaImages);
    alert("Form verileri konsola yazdırıldı (kayıt işlemi simüle edildi).");
  };

  const handleBannerUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setBannerImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleHomepageImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setHomepageImage(URL.createObjectURL(file));
    }
  };

  const handleContentImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setContentImage(URL.createObjectURL(event.target.files[0]));
    }
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

  return (
    <div className="page-editor">
      <form onSubmit={handleSubmit}>
        <h2 className="admin-title">Anasayfa Ürün Düzenlemesi</h2>
        <div className="form-group">
          <div className="product-banner">
            <label htmlFor="homepageTitle">Başlık</label>
            <input
              type="text"
              id="homepageTitle"
              value={homepageTitle}
              onChange={(e) => setHomepageTitle(e.target.value)}
              placeholder="Anasayfa kartı başlığı"
            />
          </div>

          <label htmlFor="homepageSubtitle">Alt Başlık</label>
          <input
            type="text"
            id="homepageSubtitle"
            value={homepageSubtitle}
            onChange={(e) => setHomepageSubtitle(e.target.value)}
            placeholder="Anasayfa kartı alt başlığı"
          />

          <label htmlFor="homepageImage">Görsel Seç</label>
          <input
            type="file"
            id="homepageImage"
            accept="image/*"
            onChange={handleHomepageImageUpload}
          />
          {homepageImage && (
            <img
              src={homepageImage}
              alt="Anasayfa Ürün Önizleme"
              className="preview-image"
              style={{
                maxWidth: "200px",
                display: "block",
                marginTop: "10px",
                borderRadius: "8px",
                backgroundColor: "#f8f8f8",
              }}
            />
          )}
        </div>

        <h2 className="admin-title">Ürün İçerik Düzenlemesi</h2>
        <div className="form-group">
          <label htmlFor="bannerImage">Banner Resim:</label>
          <input
            type="file"
            id="bannerImage"
            accept="image/*"
            onChange={handleBannerUpload}
            required
          />
          {bannerImage && (
            <img
              src={bannerImage}
              alt="Banner Önizleme"
              className="preview-image"
            />
          )}
        </div>
        <div className="form-group">
          <label htmlFor="bannerTitle">Banner Başlık:</label>
          <input
            type="text"
            id="bannerTitle"
            value={bannerTitle}
            onChange={(e) => setBannerTitle(e.target.value)}
            placeholder="Başlık ekleyin"
            required
          />
        </div>

        <h2 className="panel-title">Sayfa Genel Bilgisi</h2>
        <div className="form-group">
          <label htmlFor="pageTitle">Sayfa Başlık:</label>
          <input
            type="text"
            id="pageTitle"
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            placeholder="Sayfa başlığını girin"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contentTitle">İçerik Başlığı:</label>
          <input
            type="text"
            id="contentTitle"
            value={contentTitle}
            onChange={(e) => setContentTitle(e.target.value)}
            placeholder="İçerik başlığını girin"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contentMainText">İçerik Metni:</label>
          <textarea
            id="contentMainText"
            value={contentMainText}
            onChange={(e) => setContentMainText(e.target.value)}
            placeholder="İçerik metni"
            rows={6}
            required
          />
        </div>

        <h2 className="panel-title">Uygulama Alanlarına Ait Görseller</h2>
        <div className="gallery-grid">
          {[0, 1, 2, 3].map((index) => {
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
                    <div className="plus-icon"> Görsel Ekle ➕</div>
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

        <button type="submit" disabled={uploading} className="save-button">
          {uploading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
};

export default TelBeton;

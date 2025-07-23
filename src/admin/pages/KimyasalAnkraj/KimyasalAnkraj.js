import React, { useState, useRef } from "react";
import "../KimyasalAnkraj/KimyasalAnkraj.css";

const KimyasalAnkraj = () => {
  const [bannerImage, setBannerImage] = useState("");
  const [pageTitle, setPageTitle] = useState("Sayfa Başlığı");
  const [contentTitle, setContentTitle] = useState("İçerik Başlığı");
  const [contentText, setContentText] = useState("İçerik Metni");
  const [bannerTitle, setBannerTitle] = useState("Banner Başlığı");

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
    console.log("Banner Başlığı:", bannerTitle);
    console.log("İçerik Başlığı:", contentTitle);
    console.log("İçerik Metni:", contentText);
    console.log("Anasayfa Başlık:", homepageTitle);
    console.log("Anasayfa Alt Başlık:", homepageSubtitle);
    console.log("Anasayfa Görsel:", homepageImage);
    console.log("Uygulama Alanları Görselleri:", applicationAreaImages);
    alert("Form verileri konsola yazdırıldı.");
  };

  const handleBannerUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setBannerImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleHomepageImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setHomepageImage(URL.createObjectURL(event.target.files[0]));
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
    <div className="page-editor kimyasal-ankraj-editor">
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
              placeholder="Anasayfa ürün başlığı"
            />
          </div>

          <label htmlFor="homepageSubtitle">Alt Başlık</label>
          <input
            type="text"
            id="homepageSubtitle"
            value={homepageSubtitle}
            onChange={(e) => setHomepageSubtitle(e.target.value)}
            placeholder="Anasayfa ürün alt başlığı"
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
          <label htmlFor="contentText">İçerik Metni:</label>
          <textarea
            id="contentText"
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
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
                    <div className="plus-icon"> Görsel Ekle ➕</div>{" "}
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

        <button type="submit" className="save-button">
          Kaydet
        </button>
      </form>
    </div>
  );
};

export default KimyasalAnkraj;

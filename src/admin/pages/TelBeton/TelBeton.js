import React, { useState } from "react";
import "../AsilNunX/AsilNunX.css";

const TelBeton = () => {
  const [bannerImage, setBannerImage] = useState("");
  const [pageTitle, setPageTitle] = useState("Sayfa Başlığı");
  const [contentTitle, setContentTitle] = useState("İçerik Başlığı");
  const [contentMainText, setContentMainText] = useState("İçerik Metni");
  const [bannerTitle, setBannerTitle] = useState("Banner Başlığı");
  const [contentImage, setContentImage] = useState(null);

  // YENİ EKLENEN KISIM: Anasayfa Ürün Bilgisi için state'ler
  const [homepageTitle, setHomepageTitle] = useState("");
  const [homepageSubtitle, setHomepageSubtitle] = useState("");
  const [homepageImage, setHomepageImage] = useState(null);

  // Kutu bilgileri (Uygulama Alanlarına ait Görseller için)
  const [boxes, setBoxes] = useState([
    { title: "Kutu 1 Başlığı", image: null },
    { title: "Kutu 2 Başlığı", image: null },
    { title: "Kutu 3 Başlığı", image: null },
    { title: "Kutu 4 Başlığı", image: null },
  ]);

  // Yeni ve güncellenmiş updateBox fonksiyonu
  const updateBox = (index, field, value) => {
    setBoxes(prevBoxes => {
      const updatedBoxes = [...prevBoxes];
      updatedBoxes[index] = { ...updatedBoxes[index], [field]: value };
      return updatedBoxes;
    });
  };


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
  };

  const handleBoxSubmit = (event, index) => {
    event.preventDefault();
    console.log("Kutu", index + 1, "Başlık:", boxes[index].title);
    console.log("Kutu", index + 1, "Fotoğraf:", boxes[index].image);
  };

  const handleImageUpload = (index, event) => {
    const image = event.target.files[0];
    if (image) {
      updateBox(index, "image", URL.createObjectURL(image)); // Güncellenmiş kullanım
    }
  };

  const handleBannerUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setBannerImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleContentImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setContentImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  // YENİ EKLENEN KISIM: Anasayfa Ürün Görseli Yükleme
  const handleHomepageImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setHomepageImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="page-editor">
      {/* <h2 className="admin-title">Halatlı Tel-Beton Kesme Sayfası Düzenleme</h2> */}
      <form onSubmit={handleSubmit}>

      <h2 className="admin-title">Anasayfa Ürün Düzenlemesi</h2>
      <div className="form-group">
          <div className="product-banner">
            <label htmlFor="homepageTitle">Başlık:</label>
            <input
              type="text"
              id="homepageTitle"
              value={homepageTitle}
              onChange={(e) => setHomepageTitle(e.target.value)}
              placeholder="Anasayfa kartı başlığı"
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="homepageSubtitle">Alt Başlık:</label>
          <input
            type="text"
            id="homepageSubtitle"
            value={homepageSubtitle}
            onChange={(e) => setHomepageSubtitle(e.target.value)}
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
          />
          {homepageImage && (
            <img
              src={homepageImage}
              alt="Anasayfa Ürün Önizleme"
              className="preview-image"
              style={{ maxWidth: "200px", display: "block", marginTop: "10px", borderRadius: "8px", backgroundColor: "#f8f8f8" }}
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

        <button type="submit" className="submit-btn">
          Tüm Sayfayı Kaydet
        </button>

        <h2 className="panel-title"> Uygulama Alanlarına Ait Görseller</h2>
        {boxes.map((box, index) => (
          <div key={index} className="form-group box-item-group">
            <h3 className="sub-panel-title">Kutu {index + 1} Görseli</h3>
            <div className="form-group">
                <label htmlFor={`boxTitle${index}`}>Kutu {index + 1} Başlığı:</label>
                <input
                    type="text"
                    id={`boxTitle${index}`}
                    value={box.title}
                    onChange={(e) => updateBox(index, "title", e.target.value)} // Burası güncellendi
                    placeholder={`Kutu ${index + 1} Başlığını girin`}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor={`boxImage${index}`}>
                    Kutu {index + 1} Fotoğraf Yükle:
                </label>
                <input
                    type="file"
                    id={`boxImage${index}`}
                    accept="image/*"
                    onChange={(e) => handleImageUpload(index, e)}
                    required
                />
            </div>
            {box.image && (
                <img
                    src={box.image}
                    alt={`Kutu ${index + 1}`}
                    className="preview-image"
                />
            )}
            <button type="button" onClick={(e) => handleBoxSubmit(e, index)} className="submit-btn save-box-btn">
                Kutu {index + 1} Kaydet
            </button>
          </div>
        ))}
      </form>
    </div>
  );
};

export default TelBeton;
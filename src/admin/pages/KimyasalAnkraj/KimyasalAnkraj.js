import React, { useState } from "react";
import "../KimyasalAnkraj/KimyasalAnkraj.css"; // Mevcut CSS yolu

const KimyasalAnkraj = () => {
  const [bannerImage, setBannerImage] = useState("");
  const [pageTitle, setPageTitle] = useState("Sayfa Başlığı");
  const [contentTitle, setContentTitle] = useState("İçerik Başlığı");
  const [contentText, setContentText] = useState(""); // İçerik metni için ayrı state
  const [bannerTitle, setBannerTitle] = useState("Banner Başlığı");

  // YENİ EKLENEN KISIM İÇİN STATE'LER
  const [homepageTitle, setHomepageTitle] = useState("");
  const [homepageSubtitle, setHomepageSubtitle] = useState("");
  const [homepageImage, setHomepageImage] = useState(""); // Anasayfa ürün görseli için state
  // YENİ EKLENEN KISIM İÇİN STATE'LER SONU

  const [boxes, setBoxes] = useState([
    { title: "Kutu 1 Başlığı", image: null },
    { title: "Kutu 2 Başlığı", image: null },
    { title: "Kutu 3 Başlığı", image: null },
    { title: "Kutu 4 Başlığı", image: null },
  ]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Banner Resmi:", bannerImage);
    console.log("Sayfa Başlığı:", pageTitle);
    console.log("Banner Başlığı:", bannerTitle);
    console.log("İçerik Başlığı:", contentTitle);
    console.log("İçerik Metni:", contentText);
    console.log("Kutular:", boxes);
    // YENİ EKLENEN KISIM İÇİN CONSOLE.LOG'LAR
    console.log("Anasayfa Başlık:", homepageTitle);
    console.log("Anasayfa Alt Başlık:", homepageSubtitle);
    console.log("Anasayfa Görsel:", homepageImage);
    // YENİ EKLENEN KISIM İÇİN CONSOLE.LOG'LAR SONU
  };

  const handleBannerUpload = (event) => {
    setBannerImage(URL.createObjectURL(event.target.files[0]));
  };

  // YENİ EKLENEN KISIM İÇİN HANDLER
  const handleHomepageImageUpload = (event) => {
    setHomepageImage(URL.createObjectURL(event.target.files[0]));
  };
  // YENİ EKLENEN KISIM İÇİN HANDLER SONU

  const handleBoxImageUpload = (index, event) => {
    const image = event.target.files[0];
    const updatedBoxes = [...boxes];
    updatedBoxes[index].image = URL.createObjectURL(image);
    setBoxes(updatedBoxes);
  };

  const handleBoxTitleChange = (index, newTitle) => {
    const updatedBoxes = [...boxes];
    updatedBoxes[index].title = newTitle;
    setBoxes(updatedBoxes);
  };

  return (
    <div className="page-editor kimyasal-ankraj-editor">
      {/* <h2 className="admin-title">Kimyasal Ankraj Filiz Ekim</h2> */}
      <form onSubmit={handleSubmit}>

        {/* YENİ EKLENEN KISIM: Anasayfa Ürün Bilgisi */}
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
                style={{
                  marginTop: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#f8f8f8",
                  maxWidth: "200px", // Küçük bir önizleme boyutu
                  display: "block"
                }}
              />
            )}
          </div>
        </div>
        {/* YENİ EKLENEN KISIM SONU */}
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
            required
            rows={4}
          />
        </div>

        <button type="submit" className="submit-btn">
          Kaydet
        </button>
      </form>

      <h2 className="panel-title">Uygulama Alanlarına ait Görseller</h2>
      <div className="boxes-container">
        {boxes.map((box, index) => (
          <div className="box" key={index}>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor={`boxTitle${index}`}>
                  Kutu {index + 1} Başlık:
                </label>
                <input
                  type="text"
                  id={`boxTitle${index}`}
                  value={box.title}
                  onChange={(e) => handleBoxTitleChange(index, e.target.value)}
                  placeholder={`Kutu ${index + 1} başlığı`}
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
                  onChange={(e) => handleBoxImageUpload(index, e)}
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
              {/* Kaydet butonunu kutu bazında istersen ekleyebilirsin */}
            </form>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KimyasalAnkraj;
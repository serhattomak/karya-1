import React, { useState } from "react";
import "../KimyasalAnkraj/KimyasalAnkraj.css";

const KimyasalAnkraj = () => {
  const [bannerImage, setBannerImage] = useState("");
  const [pageTitle, setPageTitle] = useState("Sayfa Başlığı");
  const [contentTitle, setContentTitle] = useState("İçerik Başlığı");
  const [contentText, setContentText] = useState(""); // İçerik metni için ayrı state
  const [bannerTitle, setBannerTitle] = useState("Banner Başlığı");

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
  };

  const handleBannerUpload = (event) => {
    setBannerImage(URL.createObjectURL(event.target.files[0]));
  };

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
      <h2>Kimyasal Ankraj Filiz Ekim</h2>
      <form onSubmit={handleSubmit}>
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

import React, { useState } from "react";
import "./AsilNunX.css";

const AsilNunX = () => {
  const [bannerImage, setBannerImage] = useState("");
  const [pageTitle, setPageTitle] = useState("Sayfa Başlığı");
  const [contentTitle, setContentTitle] = useState("İçerik Başlığı");
  const [bannerTitle, setBannerTitle] = useState("Banner Başlığı");
  const [contentImage, setContentImage] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Banner Resmi:", bannerImage);
    console.log("Sayfa Başlığı:", pageTitle);
    console.log("İçerik Başlığı:", contentTitle);
    console.log("İçerik Resmi:", contentImage);
  };

  // Kutu bilgileri
  const [boxes, setBoxes] = useState([
    { title: "Kutu 1 Başlığı", image: null },
    { title: "Kutu 2 Başlığı", image: null },
    { title: "Kutu 3 Başlığı", image: null },
    { title: "Kutu 4 Başlığı", image: null },
  ]);

  // Kutu güncelleme fonksiyonu
  const updateBox = (index, newTitle, newImage) => {
    const updatedBoxes = [...boxes];
    updatedBoxes[index] = {
      title: newTitle,
      image: newImage || updatedBoxes[index].image,
    };
    setBoxes(updatedBoxes);
  };

  const handleBoxSubmit = (event, index) => {
    event.preventDefault();
    console.log("Kutu", index + 1, "Başlık:", boxes[index].title);
    console.log("Kutu", index + 1, "Fotoğraf:", boxes[index].image);
  };

  const handleImageUpload = (index, event) => {
    const image = event.target.files[0];
    const updatedBoxes = [...boxes];
    updatedBoxes[index].image = URL.createObjectURL(image);
    setBoxes(updatedBoxes);
  };

  const handleBannerUpload = (event) => {
    setBannerImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleContentImageUpload = (event) => {
    setContentImage(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <div className="page-editor">
      <h2>AsilNunX</h2>
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
            onChange={(e) => setPageTitle(e.target.value)}
            placeholder="Sayfa başlığını girin"
            required
          />
        </div>
        {/* 
        <div className="form-group">
          <label htmlFor="contentTitle">İçerik Başlığı:</label>
          <input
            type="text"
            id="contentTitle"
            onChange={(e) => setContentTitle(e.target.value)}
            placeholder="İçerik başlığını girin"
            required
          />
        </div> */}

        <div className="form-group">
          <label htmlFor="contentTitle">İçerik Başlığı:</label>
          <input
            type="text"
            id="contentTitle"
            // value={contentTitle}
            onChange={(e) => setContentTitle(e.target.value)}
            placeholder="İçerik başlığını girin"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contentTitle">İçerik Metni:</label>
          <input
            type="text"
            id="contentTitle"
            // value={contentTitle}
            onChange={(e) => setContentTitle(e.target.value)}
            placeholder="İçerik metni"
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Kaydet
        </button>
        <h2 className="panel-title"> Görseller </h2>
        {boxes.map((box, index) => (
          <form
            key={index}
            onSubmit={(e) => handleBoxSubmit(e, index)}
            className="box-form"
          >
            <div className="box">
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
              <button type="submit" className="submit-btn">
                Kaydet
              </button>
            </div>
          </form>
        ))}
      </form>
    </div>
  );
};

export default AsilNunX;

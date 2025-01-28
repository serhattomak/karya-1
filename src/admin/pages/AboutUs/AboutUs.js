import React, { useState } from "react";
import "./AboutUs.css";

const AboutUs = () => {
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

  const handleBannerUpload = (event) => {
    setBannerImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleContentImageUpload = (event) => {
    setContentImage(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <div className="page-editor">
      <h2>Hakkımızda</h2>
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

        <div className="form-group">
          <label htmlFor="contentTitle">İçerik Başlık 1:</label>
          <input
            type="text"
            id="contentTitle"
            onChange={(e) => setContentTitle(e.target.value)}
            placeholder="İçerik başlığını girin"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contentImage">İçerik Resim 1:</label>
          <input
            type="file"
            id="contentImage"
            accept="image/*"
            onChange={handleContentImageUpload}
            required
          />
          {contentImage && (
            <img
              src={contentImage}
              alt="İçerik Önizleme"
              className="preview-image"
            />
          )}
        </div>

        <div className="form-group">
          <label htmlFor="contentTitle">İçerik Başlık 2:</label>
          <input
            type="text"
            id="contentTitle"
            onChange={(e) => setContentTitle(e.target.value)}
            placeholder="İçerik başlığını girin"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contentImage">İçerik Resim 2:</label>
          <input
            type="file"
            id="contentImage"
            accept="image/*"
            onChange={handleContentImageUpload}
            required
          />
          {contentImage && (
            <img
              src={contentImage}
              alt="İçerik Önizleme"
              className="preview-image"
            />
          )}
        </div>

        <button type="submit" className="submit-btn">
          Sayfa Kaydet
        </button>
      </form>
    </div>
  );
};

export default AboutUs;

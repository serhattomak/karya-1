import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  const [boxes, setBoxes] = useState([
    { title: "", subtitle: "", image: null },
    { title: "", subtitle: "", image: null },
    { title: "", subtitle: "", image: null },
    { title: "", subtitle: "", image: null },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/home");
        const { banner, boxes } = response.data;

        setBannerTitle(banner.title || "");
        setBannerSubtitle(banner.subtitle || "");
        setBoxes(boxes || []);
      } catch (error) {
        console.error("Home verisi alınırken hata oluştu:", error);
      }
    };

    fetchData();
  }, []);

  const updateBox = (index, field, value) => {
    const updatedBoxes = [...boxes];
    updatedBoxes[index][field] = value;
    setBoxes(updatedBoxes);
  };

  const handleImageUpload = async (index, event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/home/upload-image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const imageUrl = response.data.imageUrl;
      const updatedBoxes = [...boxes];
      updatedBoxes[index].image = imageUrl;
      setBoxes(updatedBoxes);
    } catch (error) {
      console.error("Resim yüklenirken hata oluştu:", error);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const updatedData = {
      banner: { title: bannerTitle, subtitle: bannerSubtitle },
      boxes: boxes,
    };

    try {
      await axios.put("http://localhost:5001/api/home", updatedData);
      alert("Değişiklikler başarıyla kaydedildi!");
    } catch (error) {
      console.error("Veriler kaydedilirken hata oluştu:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="admin-panel">
      {/* {isAuthenticated ? ( */}
      <>
        <h2 className="panel-title">Banner</h2>
        <form onSubmit={handleSave}>
          <div className="banner-form">
            <div className="form-group">
              <label htmlFor="formTitle">Banner Başlık:</label>
              <input
                type="text"
                id="bannerTitle"
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                placeholder="Başlık ekleyin"
              />
            </div>
            <div className="form-group">
              <label htmlFor="bannerSubtitle">Banner Alt Başlık:</label>
              <input
                type="text"
                id="bannerSubtitle"
                value={bannerSubtitle}
                onChange={(e) => setBannerSubtitle(e.target.value)}
                placeholder="Alt başlık ekleyin"
              />
            </div>
          </div>

          <h2 className="panel-title">Ürün Listesi </h2>
          {boxes.map((box, index) => (
            <div key={index} className="box">
              <div className="form-group">
                <label htmlFor={`boxTitle${index}`}>
                  Ürün {index + 1} Başlık :
                </label>
                <input
                  type="text"
                  id={`boxTitle${index}`}
                  value={box.title}
                  onChange={(e) => updateBox(index, "title", e.target.value)}
                  placeholder="Başlık ekleyin"
                />
              </div>
              <div className="form-group">
                <label htmlFor={`boxSubtitle${index}`}>
                  Ürün {index + 1} Alt Başlık :
                </label>
                <input
                  type="text"
                  id={`boxSubtitle${index}`}
                  value={box.subtitle}
                  onChange={(e) => updateBox(index, "subtitle", e.target.value)}
                  placeholder="Alt Başlık ekleyin"
                />
              </div>
              <div className="form-group">
                <label htmlFor={`boxImage${index}`}>
                  Ürün {index + 1} Fotoğraf :
                </label>
                <input
                  type="file"
                  id={`boxImage${index}`}
                  accept="image/*"
                  onChange={(e) => handleImageUpload(index, e)}
                />
              </div>
              {box.image && (
                <img
                  src={box.image}
                  alt={`Ürün ${index + 1}`}
                  className="preview-image"
                />
              )}
            </div>
          ))}

          <button type="submit" className="submit-btn">
            Kaydet
          </button>
        </form>
      </>
    </div>
  );
};

export default Home;

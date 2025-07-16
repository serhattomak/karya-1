import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  const [boxes, setBoxes] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const [tempSubtitle, setTempSubtitle] = useState("");

  const navigate = useNavigate();

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

  const pageRoutes = [
    "/admin/asilnunx",
    "/admin/Poliuretan",
    "/admin/telbeton",
    "/admin/KimyasalAnkraj",
  ];

  const openModal = () => {
    setTempTitle(bannerTitle);
    setTempSubtitle(bannerSubtitle);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSave = () => {
    setBannerTitle(tempTitle);
    setBannerSubtitle(tempSubtitle);
    setIsModalOpen(false);
  };

  return (
    <div className="admin-panel">
      <form onSubmit={handleSave}>
        <h2 className="panel-title">Anasayfa Banner</h2>
        <div className="banner-form">
          <div className="text-section">
            <h1>{bannerTitle || "Başlık eklenmedi"}</h1>
            <p>{bannerSubtitle || "Alt başlık eklenmedi"}</p>
            <div className="controls below-title">
              <button type="button" className="fix-button" onClick={openModal}>
                Düzenle
              </button>
              {/* <button type="button" className="delete-button" disabled>
                Sil
              </button> */}
            </div>
          </div>
        </div>

        <h2 className="panel-title">Ürünler</h2>
        <div className="boxes-wrapper">
          {boxes.map((box, index) => (
            <div key={index} className="box">
              {box.image && (
                <img
                  src={
                    typeof box.image === "string"
                      ? box.image
                      : URL.createObjectURL(box.image)
                  }
                  alt={`Box ${index + 1}`}
                  className="preview-image"
                />
              )}
              <div className="product_titles">
                <h3>{box.title || " "}</h3>
                <h4>{box.subtitle || " "}</h4>
              </div>
              <div className="controls">
                <button
                  type="button"
                  className="fix-button"
                  onClick={() => navigate(pageRoutes[index])}
                >
                  Düzenle
                </button>
                {/* <button type="button" className="delete-button" disabled>
                  Sil
                </button> */}
              </div>
            </div>
          ))}
        </div>
        {/* 
        <button type="submit" className="submit-btn">
          Kaydet
        </button> */}
      </form>

      {/* Banner modalı */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Banner Düzenle</h3>
            <label>Başlık</label>
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
            />
            <label>Alt Başlık</label>
            <input
              type="text"
              value={tempSubtitle}
              onChange={(e) => setTempSubtitle(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="save-button" onClick={handleModalSave}>
                Kaydet
              </button>
              <button className="close-button" onClick={closeModal}>
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

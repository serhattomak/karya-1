import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // navigate için
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Varsayılan olarak giriş yapılmış kabul ediliyor
  const navigate = useNavigate();

  // Banner ve kutular için state'ler
  const [bannerBackground, setBannerBackground] = useState("");
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");

  const [boxes, setBoxes] = useState([
    { title: "", subtitle: "", image: null },
    { title: "", subtitle: "", image: null },
    { title: "", subtitle: "", image: null },
    { title: "", subtitle: "", image: null },
  ]);

  // Başlangıç verilerini API'den al veya localStorage'dan yükle
  useEffect(() => {
    const loadData = () => {
      const localBannerTitle = localStorage.getItem("bannerTitle");
      const localBannerSubtitle = localStorage.getItem("bannerSubtitle");
      const localBoxes = JSON.parse(localStorage.getItem("boxes")) || boxes;

      // localStorage'dan alınan verilerle state güncelleme
      setBannerTitle(localBannerTitle || "");
      setBannerSubtitle(localBannerSubtitle || "");
      setBoxes(localBoxes);
    };

    loadData();
  }, []); // Bu useEffect yalnızca component mount edildiğinde çalışacak

  // Verileri API'den al ve localStorage'a kaydet
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/home");

      const { banner, boxes } = response.data;

      // localStorage'a kaydet
      localStorage.setItem("bannerBackground", banner.background || "");
      localStorage.setItem("bannerTitle", banner.title || "");
      localStorage.setItem("bannerSubtitle", banner.subtitle || "");
      localStorage.setItem("boxes", JSON.stringify(boxes));

      setBannerBackground(banner.background || "");
      setBannerTitle(banner.title || "");
      setBannerSubtitle(banner.subtitle || "");
      setBoxes(
        boxes.map((box) => ({
          title: box.title || "",
          subtitle: box.subtitle || "",
          image: box.image || null,
        }))
      );
    } catch (error) {
      console.error("Veri alırken hata:", error);
    }
  };

  // component mount edildiğinde verileri API'den yükle
  useEffect(() => {
    fetchData();
  }, []);

  const updateBox = (index, field, value) => {
    const updatedBoxes = [...boxes];
    updatedBoxes[index][field] = value;
    setBoxes(updatedBoxes);
    // localStorage'ı güncelle
    localStorage.setItem("boxes", JSON.stringify(updatedBoxes));
  };

  const handleImageUpload = (index, event) => {
    const image = event.target.files[0];
    const updatedBoxes = [...boxes];
    updatedBoxes[index].image = URL.createObjectURL(image);
    setBoxes(updatedBoxes);
    // localStorage'ı güncelle
    localStorage.setItem("boxes", JSON.stringify(updatedBoxes));
  };

  const handleSave = async (event) => {
    event.preventDefault(); // Sayfanın yenilenmesini engeller

    const updatedData = {
      banner: {
        background: bannerBackground,
        title: bannerTitle,
        subtitle: bannerSubtitle,
      },
      boxes: boxes,
    };

    try {
      const response = await axios.put(
        "http://localhost:5001/api/home",
        updatedData
      );

      if (response.status === 200) {
        alert("Değişiklikler başarıyla kaydedildi!");

        // Verileri localStorage'a kaydet
        localStorage.setItem("bannerTitle", bannerTitle);
        localStorage.setItem("bannerSubtitle", bannerSubtitle);
        localStorage.setItem("bannerBackground", bannerBackground);
        localStorage.setItem("boxes", JSON.stringify(boxes));

        // Kaydedilen verileri yüklemek için verileri tekrar al
        fetchData();
      }
    } catch (error) {
      console.error(
        "Veriler kaydedilirken hata oluştu:",
        error.response || error.message || error
      );
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="admin-panel">
      {isAuthenticated ? (
        <>
          <h2 className="panel-title">Banner</h2>
          <form onSubmit={handleSave} className="banner-form">
            <div className="form-group">
              <label htmlFor="bannerTitle">Banner Başlık:</label>
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

            <h2 className="panel-title">Kutu Başlıkları ve Alt Başlıkları</h2>
            {boxes.map((box, index) => (
              <div key={index} className="box">
                <div className="form-group">
                  <label htmlFor={`boxTitle${index}`}>
                    Kutu {index + 1} Başlığı:
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
                    Kutu {index + 1} Alt Başlık:
                  </label>
                  <input
                    type="text"
                    id={`boxSubtitle${index}`}
                    value={box.subtitle}
                    onChange={(e) =>
                      updateBox(index, "subtitle", e.target.value)
                    }
                    placeholder="Alt Başlık ekleyin"
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
                  />
                </div>
                {box.image && (
                  <img
                    src={box.image}
                    alt={`Kutu ${index + 1}`}
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
      ) : (
        <h2>Yükleniyor...</h2>
      )}
    </div>
  );
};

export default Home;

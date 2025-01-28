import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [bannerBackground, setBannerBackground] = useState("");
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");

  const [boxes, setBoxes] = useState([
    { title: "", image: null },
    { title: "", image: null },
    { title: "", image: null },
    { title: "", image: null },
  ]);

  // Başlangıç verilerini API'den al veya localStorage'dan yükle
  useEffect(() => {
    const loadData = () => {
      const localBannerBackground = localStorage.getItem("bannerBackground");
      const localBannerTitle = localStorage.getItem("bannerTitle");
      const localBannerSubtitle = localStorage.getItem("bannerSubtitle");
      const localBoxes = JSON.parse(localStorage.getItem("boxes")) || boxes;

      setBannerBackground(localBannerBackground || "");
      setBannerTitle(localBannerTitle || "");
      setBannerSubtitle(localBannerSubtitle || "");
      setBoxes(localBoxes);
    };

    loadData();
  }, []);

  // Verileri API'den al ve localStorage'a kaydet
  const fetchData = async () => {
    try {
      const response = await axios.get("/api/home");
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

  const updateBox = (index, newTitle) => {
    const updatedBoxes = [...boxes];
    updatedBoxes[index].title = newTitle;
    setBoxes(updatedBoxes);
    // localStorage'ı güncelle
    localStorage.setItem("boxes", JSON.stringify(updatedBoxes));
  };

  const handleBannerSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put("http://localhost:5001/api/home", {
        banner: {
          background: bannerBackground,
          title: bannerTitle,
          subtitle: bannerSubtitle,
        },
        boxes: boxes.map((box) => ({
          title: box.title,
          image: box.image,
        })),
      });

      if (response.status === 200) {
        console.log("Banner ve kutular başarıyla güncellendi.");
      }
    } catch (error) {
      console.error("Veri güncellerken hata:", error);
    }
  };

  const handleImageUpload = (index, event) => {
    const image = event.target.files[0];
    const updatedBoxes = [...boxes];
    updatedBoxes[index].image = URL.createObjectURL(image);
    setBoxes(updatedBoxes);
    // localStorage'ı güncelle
    localStorage.setItem("boxes", JSON.stringify(updatedBoxes));
  };

  return (
    <div className="admin-panel">
      <h2 className="panel-title">Banner</h2>
      <form onSubmit={handleBannerSubmit} className="banner-form">
        <div className="form-group">
          <label htmlFor="bannerBackground">Banner Resmi:</label>
          <input
            type="file"
            id="bannerBackground"
            accept="image/*"
            onChange={(e) =>
              setBannerBackground(URL.createObjectURL(e.target.files[0]))
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="bannerTitle">Banner Başlık:</label>
          <input
            type="text"
            id="bannerTitle"
            value={bannerTitle} // Kullanıcının girdiği değer burada görünüyor
            onChange={(e) => setBannerTitle(e.target.value)}
            placeholder="Başlık ekleyin"
          />
        </div>
        <div className="form-group">
          <label htmlFor="bannerSubtitle">Banner Alt Başlık:</label>
          <input
            type="text"
            id="bannerSubtitle"
            value={bannerSubtitle} // Kullanıcının girdiği değer burada görünüyor
            onChange={(e) => setBannerSubtitle(e.target.value)}
            placeholder="Alt başlık ekleyin"
          />
        </div>

        <h2 className="panel-title">Ürünler</h2>
        {boxes.map((box, index) => (
          <div key={index} className="box">
            <div className="form-group">
              <label htmlFor={`boxTitle${index}`}>
                Kutu {index + 1} Başlığı:
              </label>
              <input
                type="text"
                id={`boxTitle${index}`}
                value={box.title} // Kullanıcının girdiği değer burada görünüyor
                onChange={(e) => updateBox(index, e.target.value)}
                placeholder="Başlık ekleyin"
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
    </div>
    
  );
};

export default Home;

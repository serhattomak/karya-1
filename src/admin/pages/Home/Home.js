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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const [tempSubtitle, setTempSubtitle] = useState("");

  const [boxModalOpen, setBoxModalOpen] = useState(false);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState(null);
  const [tempBoxData, setTempBoxData] = useState({
    title: "",
    subtitle: "",
    image: null,
    preview: "",
  });
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

  // modal
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

  const openBoxModal = (index) => {
    const current = boxes[index];
    let preview = "";

    if (typeof current.image === "string") {
      preview = current.image;
    } else if (current.image instanceof File) {
      preview = URL.createObjectURL(current.image);
    }

    setSelectedBoxIndex(index);
    setTempBoxData({
      title: current.title,
      subtitle: current.subtitle,
      image: current.image,
      preview,
    });
    setBoxModalOpen(true);
  };

  const handleBoxModalSave = async () => {
    const updatedBoxes = [...boxes];

    if (tempBoxData.image instanceof File) {
      const formData = new FormData();
      formData.append("image", tempBoxData.image);

      try {
        const response = await axios.post(
          "http://localhost:5001/api/home/upload-image",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const imageUrl = response.data.imageUrl;
        updatedBoxes[selectedBoxIndex] = {
          title: tempBoxData.title,
          subtitle: tempBoxData.subtitle,
          image: imageUrl,
        };
      } catch (error) {
        console.error("Modal içi resim yüklenemedi:", error);
        alert("Resim yüklenirken hata oluştu.");
        return;
      }
    } else {
      // Eğer yeni resim seçilmemişse
      updatedBoxes[selectedBoxIndex] = {
        title: tempBoxData.title,
        subtitle: tempBoxData.subtitle,
        image: tempBoxData.image,
      };
    }

    setBoxes(updatedBoxes);
    setBoxModalOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setTempBoxData({
      ...tempBoxData,
      image: file,
      preview: URL.createObjectURL(file),
    });
  };

  return (
    <div className="admin-panel">
      {/* {isAuthenticated ? ( */}
      <>
        <form onSubmit={handleSave}>
          <h2 className="panel-title">Anasayfa Banner</h2>
          <div className="banner-form">
            <div className="text-section">
              <h1>{bannerTitle || "Başlık eklenmedi"}</h1>
              <p>{bannerSubtitle || "Alt başlık eklenmedi"}</p>
              <div className="controls below-title">
                <button
                  type="button"
                  className="fix-button"
                  onClick={openModal}
                >
                  Düzenle
                </button>
                <button type="button" className="delete-button" disabled>
                  {/* TODO: Banner silme işlemi */}
                  Sil
                </button>
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
                    onClick={() => openBoxModal(index)}
                  >
                    Düzenle
                  </button>
                  <button type="button" className="delete-button" disabled>
                    {/* TODO: Kutu silme işlemi */}
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button type="submit" className="submit-btn">
            Kaydet
          </button>
        </form>
      </>
      {/* Banner Modal */}
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

      {/* Box Modal */}
      {boxModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Anasayfa Ürün</h3>
            <label>Başlık</label>
            <input
              type="text"
              value={tempBoxData.title}
              onChange={(e) =>
                setTempBoxData({ ...tempBoxData, title: e.target.value })
              }
            />
            <label>Alt Başlık</label>
            <input
              type="text"
              value={tempBoxData.subtitle}
              onChange={(e) =>
                setTempBoxData({ ...tempBoxData, subtitle: e.target.value })
              }
            />
            <label>Görsel Seç</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {tempBoxData.preview && (
              <img
                src={tempBoxData.preview}
                alt="Önizleme"
                style={{
                  width: "50%",
                  marginTop: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#f8f8f8",
                }}
              />
            )}
            <div className="modal-buttons">
              <button className="save-button" onClick={handleBoxModalSave}>
                Kaydet
              </button>
              <button
                className="close-button"
                onClick={() => setBoxModalOpen(false)}
              >
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

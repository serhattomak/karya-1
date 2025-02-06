import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AsilNunX.css";

const AsilNunX = () => {
  const [asilNunXData, setAsilNunXData] = useState({
    title: "",
    description: "",
    details: "",
    info: "",
    image: "",
    documents: [],
    text: "Varsayılan metin", // Varsayılan metin
    linkText: "Varsayılan Link Metni", // Varsayılan link metni
    link: "", // Varsayılan link
  });
  const [loading, setLoading] = useState(true); // Yükleme durumu ekleyelim

  // Sayfa verilerini al
  useEffect(() => {
    const fetchAsilNunXData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/asilnunx");
        setAsilNunXData(response.data);
        setLoading(false); // Yükleme tamamlandığında
      } catch (error) {
        console.error("Veri alınırken hata oluştu: ", error);
        setLoading(false); // Yükleme hata durumunda da tamamlanmış kabul edilir
      }
    };

    fetchAsilNunXData();
  }, []);

  // Veriler yüklenene kadar "Yükleniyor..." mesajı gösterelim
  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  // Resim yükleme işlemi
  const handleImageUpload = async (event) => {
    const formData = new FormData();
    formData.append("image", event.target.files[0]);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/asilnunx/upload-image",
        formData
      );
      setAsilNunXData({ ...asilNunXData, image: response.data.imageUrl }); // Resim URL'sini güncelle
    } catch (error) {
      console.error("Resim yüklenirken hata oluştu:", error);
    }
  };

  // Döküman yükleme işlemi
  const handleDocumentUpload = async (event) => {
    const formData = new FormData();
    Array.from(event.target.files).forEach((file) => {
      formData.append("documents", file);
    });

    try {
      const response = await axios.put(
        "http://localhost:5001/api/asilnunx",
        formData
      );
      setAsilNunXData({ ...asilNunXData, documents: response.data.documents });
    } catch (error) {
      console.error("Döküman yüklenirken hata oluştu:", error);
    }
  };

  // Form verilerini güncelleme
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put("http://localhost:5001/api/asilnunx", {
        ...asilNunXData,
      });
      console.log("Veri başarıyla güncellendi:", response.data);
    } catch (error) {
      console.error("Veri güncellenirken hata oluştu:", error);
    }
  };

  return (
    <div className="asil-nun-x-container">
      <div className="asil-nun-x-content">
        <form onSubmit={handleSubmit}>
          <div className="asil-nun-x-text">
            <h2 className="asil-nun-x-title">AŞİL NUN X</h2>

            <div className="form-group">
              <label htmlFor="title">Başlık:</label>
              <input
                type="text"
                id="title"
                value={asilNunXData.title}
                onChange={(e) =>
                  setAsilNunXData({ ...asilNunXData, title: e.target.value })
                }
                placeholder="Başlık"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Açıklama:</label>
              <textarea
                id="description"
                value={asilNunXData.description}
                onChange={(e) =>
                  setAsilNunXData({
                    ...asilNunXData,
                    description: e.target.value,
                  })
                }
                placeholder="Açıklama"
              />
            </div>

            <div className="form-group">
              <label htmlFor="details">Detaylar:</label>
              <textarea
                id="details"
                value={asilNunXData.details}
                onChange={(e) =>
                  setAsilNunXData({ ...asilNunXData, details: e.target.value })
                }
                placeholder="Detaylar"
              />
            </div>

            <div className="form-group">
              <label htmlFor="info">Bilgi:</label>
              <textarea
                id="info"
                value={asilNunXData.info}
                onChange={(e) =>
                  setAsilNunXData({ ...asilNunXData, info: e.target.value })
                }
                placeholder="Bilgi"
              />
            </div>

            <div className="form-group">
              <label htmlFor="text">Metin:</label>
              <input
                type="text"
                id="text"
                value={asilNunXData.text}
                onChange={(e) =>
                  setAsilNunXData({ ...asilNunXData, text: e.target.value })
                }
                placeholder="Metin"
              />
            </div>

            <div className="form-group">
              <label htmlFor="linkText">Buton Metni:</label>
              <input
                type="text"
                id="linkText"
                value={asilNunXData.linkText}
                onChange={(e) =>
                  setAsilNunXData({ ...asilNunXData, linkText: e.target.value })
                }
                placeholder="Buton Metni"
              />
            </div>

            <div className="form-group">
              <label htmlFor="link">Bağlantı:</label>
              <input
                type="text"
                id="link"
                value={asilNunXData.link}
                onChange={(e) =>
                  setAsilNunXData({ ...asilNunXData, link: e.target.value })
                }
                placeholder="Bağlantı"
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Ana Resim:</label>
              <input
                type="file"
                id="image"
                onChange={handleImageUpload}
                accept="image/*"
              />
              {asilNunXData.image && (
                <img src={asilNunXData.image} alt="Asil Nun X" />
              )}
            </div>

            <div className="form-group">
              <label htmlFor="documents">Dökümanlar:</label>
              <input
                type="file"
                id="documents"
                onChange={handleDocumentUpload}
                accept=".pdf, .doc, .docx, .jpg, .png"
                multiple
              />
              <div className="documents-list">
                {asilNunXData.documents.map((doc, index) => (
                  <a
                    key={index}
                    href={doc}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {`Döküman ${index + 1}`}
                  </a>
                ))}
              </div>
            </div>

            <button type="submit">Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AsilNunX;

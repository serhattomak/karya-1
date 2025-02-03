import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AboutUs.css";

const AboutUsInfo = () => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
    image: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  // Sayfa yüklendiğinde veriyi çek
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:5001/api/about")
      .then((response) => {
        setFormData(response.data);
      })
      .catch((error) => console.error("Veri çekme hatası: ", error));
  };

  // Input değişimini takip et
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Yeni resim seçildiğinde dosya bilgisini state'e kaydet
  // Yeni resim seçildiğinde dosya bilgisini state'e kaydet
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // Yalnızca seçilen dosyanın bilgisini kaydediyoruz
  };

  // Resmi sunucuya yükleme fonksiyonu
  const uploadImage = async () => {
    if (!selectedFile) return formData.image; // Yeni resim seçilmediyse eskisini kullan

    const formDataUpload = new FormData();
    formDataUpload.append("image", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/about/upload-image",
        formDataUpload
      );
      return response.data.imageUrl; // Yeni yüklenen resmin URL'sini döndür
    } catch (error) {
      console.error("Resim yükleme hatası:", error);
      return formData.image; // Hata olursa eski resmi kullan
    }
  };

  // Formu gönder
  const handleSubmit = async (e) => {
    e.preventDefault();

    const uploadedImageUrl = await uploadImage(); // Önce resmi yükle
    const updatedData = { ...formData, image: uploadedImageUrl }; // Yeni resimle güncelle

    axios
      .put("http://localhost:5001/api/about", updatedData)
      .then(() => {
        setFormData(updatedData); // Güncellenmiş veriyi anında state'e kaydet
        alert("Güncelleme başarılı!");
      })
      .catch((error) => {
        console.error("Güncelleme hatası: ", error);
        alert("Güncellenirken bir hata oluştu.");
      });
  };

  return (
    <div className="admin-panel">
      <h2 className="panel-title">Hakkımızda</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Başlık</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Başlık"
          />
        </div>
        <div className="form-group">
          <label>Alt Başlık</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Alt Başlık"
          />
        </div>
        <div className="form-group">
          <label>İçerik</label>
          <textarea
            className="text-area"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="İçerik"
          ></textarea>
        </div>
        <div className="form-group">
          <label>Resim Yükle</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        {formData.image && (
          <img
            className="preview-image"
            src={formData.image}
            alt="Önizleme"
            style={{ width: "150px", marginTop: "10px" }}
          />
        )}
        <button type="submit">Kaydet</button>
      </form>
    </div>
  );
};

export default AboutUsInfo;

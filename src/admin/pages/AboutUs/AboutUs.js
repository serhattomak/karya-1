import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AboutUs.css";

const AboutUs = () => {
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);

      // Resmi hemen base64 formatında göstermek için FileReader'ı kullan
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          image: reader.result, // Base64 formatındaki resmi hemen göster
        }));
      };
      reader.readAsDataURL(file); // Dosyayı base64 formatına çevir
    }
  };

  // Resmi sunucuya yükleme fonksiyonu
  const uploadImage = async () => {
    if (!selectedFile) return formData.image; // Yeni resim seçilmemişse eski resmi kullan

    const formDataUpload = new FormData();
    formDataUpload.append("image", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/about/upload-image",
        formDataUpload
      );
      return response.data.imageUrl; // Resmin yeni URL'sini döndür
    } catch (error) {
      console.error("Resim yükleme hatası:", error);
      return formData.image; // Hata olursa eski resmi kullan
    }
  };

  // Formu gönder
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Resmi yükle ve URL'ini al
    const uploadedImageUrl = await uploadImage();
    // Form verisini yeni resimle birlikte güncelle
    const updatedData = { ...formData, image: uploadedImageUrl };

    // Veriyi backend'e gönder
    axios
      .put("http://localhost:5001/api/about", updatedData)
      .then(() => {
        setFormData(updatedData); // Backend'den dönen veriyi anında güncelle
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

export default AboutUs;

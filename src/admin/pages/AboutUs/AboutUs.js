import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./AboutUs.css";

const AboutUs = () => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
    image: "",
  });

  const [servicesTitle, setServicesTitle] = useState(
    "Hizmet Verdiğimiz Konular"
  );
  const [servicesList, setServicesList] = useState([
    "Poliüretan enjeksiyon reçine satışı.",
    "Her türlü negatif yönden su sızıntılarına karşı poliüretan enjeksiyon reçinesi ile su yalıtımı.",
    "Epoksi enjeksiyon reçinesi ile yapısal çatlak tamiri.",
    "Epoksi ile demir filiz ekimi.",
    "Epoksi ile rot montajı.",
    "Karot makineleri ile beton delme.",
    "Hidrolik raylı sistemler ile beton kesme.",
    "Halatlı - tel beton kesme.",
  ]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [bannerTitle, setBannerTitle] = useState("Banner Başlığı");
  const [bannerImage, setBannerImage] = useState("");
  const applicationFileInputRefs = useRef([]);
  const selectedApplicationImageIndexRef = useRef(0);
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

  const handleApplicationImageUpload = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setApplicationAreaImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages[selectedApplicationImageIndexRef.current] = imageUrl;
        return updatedImages;
      });
    }
  };
  const triggerApplicationFileInput = (index) => {
    selectedApplicationImageIndexRef.current = index;
    applicationFileInputRefs.current[index]?.click();
  };

  const [applicationAreaImages, setApplicationAreaImages] = useState([
    "",
    "",
    "",
    "",
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setBannerImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return formData.image;
    const formDataUpload = new FormData();
    formDataUpload.append("image", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/about/upload-image",
        formDataUpload
      );
      return response.data.imageUrl;
    } catch (error) {
      console.error("Resim yükleme hatası:", error);
      return formData.image;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uploadedImageUrl = await uploadImage();
    const updatedData = { ...formData, image: uploadedImageUrl };

    axios
      .put("http://localhost:5001/api/about", updatedData)
      .then(() => {
        setFormData(updatedData);
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
      <div className="form-group">
        <label htmlFor="bannerTitle">Banner Başlık:</label>
        <input
          type="text"
          id="bannerTitle"
          value={bannerTitle}
          onChange={(e) => setBannerTitle(e.target.value)}
          placeholder="Başlık ekleyin"
          required
        />

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
          <label>Alt Başlık</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Alt Başlık"
          />
          <label>İçerik</label>
          <textarea
            className="text-area"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="İçerik"
          ></textarea>
          <label>Resim Yükle</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {formData.image && (
            <img
              className="preview-image"
              src={formData.image}
              alt="Önizleme"
              style={{ width: "150px", marginTop: "10px" }}
            />
          )}{" "}
        </div>

        <div className="form-group service-section">
          <label htmlFor="servicesTitle">Başlık</label>
          <input
            type="text"
            id="servicesTitle"
            className="input full"
            value={servicesTitle}
            onChange={(e) => setServicesTitle(e.target.value)}
            placeholder="Hizmet başlığını girin"
          />

          <label>Maddeler</label>
          {servicesList.map((item, index) => (
            <div key={index} className="service-item-row">
              <span className="index">{index + 1}.</span>
              <input
                type="text"
                className="input"
                value={item}
                onChange={(e) => {
                  const updated = [...servicesList];
                  updated[index] = e.target.value;
                  setServicesList(updated);
                }}
                placeholder={`Madde ${index + 1}`}
              />
              <button
                type="button"
                className="delete-btn"
                onClick={() => {
                  const updated = servicesList.filter((_, i) => i !== index);
                  setServicesList(updated);
                }}
              >
                ❌
              </button>
            </div>
          ))}

          <button
            type="button"
            className="add-btn"
            onClick={() => setServicesList([...servicesList, ""])}
          >
            + Yeni Madde Ekle
          </button>
        </div>

        <h4 className="panel-title">Görseller</h4>
        <div className="gallery-grid">
          {[0, 1, 2, 3].map((index) => {
            const imageUrl = applicationAreaImages[index];

            return (
              <div key={index} className="gallery-item image-box">
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt={`Uygulama Alanı ${index + 1}`}
                      className="image-preview-square"
                    />
                    <div className="image-overlay">
                      <span
                        className="edit-icon"
                        onClick={() => triggerApplicationFileInput(index)}
                        title="Resmi Değiştir"
                      >
                        ✏️
                      </span>
                    </div>
                  </>
                ) : (
                  <div
                    className="image-placeholder"
                    onClick={() => triggerApplicationFileInput(index)}
                  >
                    <div className="plus-icon">Görsel Ekle ➕</div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={(el) => (applicationFileInputRefs.current[index] = el)}
                  onChange={handleApplicationImageUpload}
                />
              </div>
            );
          })}
        </div>

        <button type="submit">Kaydet</button>
      </form>
    </div>
  );
};

export default AboutUs;

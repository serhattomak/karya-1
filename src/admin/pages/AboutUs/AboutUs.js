import React, { useEffect, useState, useRef } from "react";
import { getPage, getPageByName, updatePage } from "../../../api";
import Swal from 'sweetalert2';
import "./AboutUs.css";
const BASE_URL = "https://localhost:7103/";
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const token = localStorage.getItem("token");
  const response = await fetch("https://localhost:7103/api/File/upload", {
    method: "POST",
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) throw new Error("Dosya yüklenemedi");
  return await response.json();
};


const AboutUs = () => {
  const [pageData, setPageData] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [servicesTitle, setServicesTitle] = useState("");
  const [servicesList, setServicesList] = useState([]);
  const [applicationAreaImages, setApplicationAreaImages] = useState([null, null, null, null]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pageType, setPageType] = useState(0);
  const [name, setName] = useState("");
  const [urls, setUrls] = useState([]);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [productIds, setProductIds] = useState([]);
  const [additionalFields, setAdditionalFields] = useState([]);
  const applicationFileInputRefs = useRef([]);
  const selectedApplicationImageIndexRef = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPageByName("Hakkımızda");
        const data = response?.data?.data || response?.data || response;
        setPageData(data);
        setTitle((data.titles && data.titles[0]) || "");
        setSubtitle((data.subtitles && data.subtitles[0]) || "");
        setContent((data.descriptions && data.descriptions[0]) || "");
        setImage(data.bannerImageUrl || "");
        setServicesTitle((data.titles && data.titles[1]) || "");
        setServicesList(data.listItems || []);
        setPageType(typeof data.pageType !== 'undefined' ? data.pageType : 0);
        setName(data.name || "");
        setUrls(data.urls || []);
        setBackgroundImageUrl(data.backgroundImageUrl || "");
        setProductIds(data.productIds || []);
        setAdditionalFields(data.additionalFields || []);
        let appImages = [null, null, null, null];
        if (Array.isArray(data.files)) {
          appImages = data.files.slice(0, 4).map(f => ({
            id: f.id,
            url: f.path ? BASE_URL + f.path : ""
          }));
          while (appImages.length < 4) appImages.push(null);
        }
        setApplicationAreaImages(appImages);
      } catch (error) {
        console.error("Veri çekme hatası: ", error);
      }
    };
    fetchData();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let uploadedImageUrl = image;
    if (selectedFile) {
      try {
        const uploaded = await uploadFile(selectedFile);
        uploadedImageUrl = uploaded.url || uploaded.path || uploaded.imageUrl || image;
      } catch (error) {
        console.error("Resim yükleme hatası:", error);
      }
    }
    const updatedData = {
      id: pageData?.id,
      pageType,
      name,
      titles: [title, servicesTitle],
      subtitles: [subtitle],
      descriptions: [content],
      listItems: servicesList,
      urls,
      backgroundImageUrl,
      bannerImageUrl: uploadedImageUrl,
      fileIds: applicationAreaImages.filter(img => img && img.id).map(img => img.id),
      productIds,
      additionalFields,
    };
    try {
      await updatePage(updatedData);
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Güncelleme başarılı!',
        confirmButtonText: 'Tamam',
        confirmButtonColor: '#28a745',
        timer: 2000,
        timerProgressBar: true
      });
    } catch (error) {
      console.error("Güncelleme hatası: ", error);
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Güncellenirken bir hata oluştu.',
        confirmButtonText: 'Tamam',
        confirmButtonColor: '#dc3545'
      });
    }
  };

  const handleApplicationImageUpload = async (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      try {
        const uploaded = await uploadFile(file);
        console.log("uploadFile yanıtı:", uploaded);
        const imageUrl = uploaded?.data?.path ? BASE_URL + uploaded.data.path : "";
        console.log("Kullanılan imageUrl:", imageUrl);
        const fileId = uploaded?.data?.id || null;
        setApplicationAreaImages((prevImages) => {
          const updatedImages = [...prevImages];
          updatedImages[selectedApplicationImageIndexRef.current] = fileId ? { id: fileId, url: imageUrl } : null;
          return updatedImages;
        });
      } catch (error) {
        console.error("Uygulama alanı görseli yüklenemedi", error);
      }
    }
  };

  const triggerApplicationFileInput = (index) => {
    selectedApplicationImageIndexRef.current = index;
    applicationFileInputRefs.current[index]?.click();
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") setTitle(value);
    else if (name === "subtitle") setSubtitle(value);
    else if (name === "content") setContent(value);
  };



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
            value={title}
            onChange={handleChange}
            placeholder="Başlık"
          />
          <label>Alt Başlık</label>
          <input
            type="text"
            name="subtitle"
            value={subtitle}
            onChange={handleChange}
            placeholder="Alt Başlık"
          />
          <label>İçerik</label>
          <textarea
            className="text-area"
            name="content"
            value={content}
            onChange={handleChange}
            placeholder="İçerik"
          ></textarea>
          <label>Resim Yükle</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {image && (
            <img
              className="preview-image"
              src={image}
              alt="Önizleme"
              style={{ width: "150px", marginTop: "10px" }}
            />
          )}
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
            const imageObj = applicationAreaImages[index];
            return (
              <div key={index} className="gallery-item image-box">
                {imageObj && imageObj.url ? (
                  <>
                    <img
                      src={imageObj.url}
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

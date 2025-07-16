import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./AsilNunX.css";

const AsilNunX = ({ onClose }) => {
  const [asilNunXData, setAsilNunXData] = useState({
    title: "",
    description: "",
    details: "",
    info: "",
    image: "",
    documents: [],
    text: "Varsayılan metin",
    linkText: "Varsayılan Link Metni",
    link: "",
    gallery: ["", "", "", ""],
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [tempBoxData, setTempBoxData] = useState({
    title: "",
    subtitle: "",
    image: null,
    preview: "",
  });

  const documentInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const selectedDocIndexRef = useRef(0);
  const fileInputRefs = useRef({});
  const selectedGalleryIndexRef = useRef(0);

  const [previewDocuments, setPreviewDocuments] = useState([
    null,
    null,
    null,
    null,
  ]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewURL = URL.createObjectURL(file);
    setAsilNunXData((prev) => ({
      ...prev,
      image: previewURL,
    }));
  };

  useEffect(() => {
    setAsilNunXData((prev) => ({
      ...prev,
      gallery: ["", "", "", ""],
      documents: [],
    }));
    setLoading(false);
  }, []);

  if (loading) return <div>Yükleniyor...</div>;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewURL = URL.createObjectURL(file);
    setTempBoxData((prev) => ({
      ...prev,
      image: file,
      preview: previewURL,
    }));
  };

  const handleEditClick = (index) => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].click();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Veriler frontendde simule edildi, backend'e gönderilmedi.");
  };

  return (
    <div className="asil-nun-x-admin-container">
      <div className="asil-nun-x-content">
        <form onSubmit={handleSubmit}>
          <div className="form-container">
            <h2 className="admin-title">Anasayfa Ürün Düzenlemesi</h2>

            <div className="form-group">
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
                    marginTop: "10px",
                    borderRadius: "8px",
                    backgroundColor: "#f8f8f8",
                    maxWidth: "100px",
                  }}
                />
              )}
            </div>

            <div className="asil-nun-x-text">
              <h2 className="admin-title">Ürün İçerik Düzenlemesi</h2>

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
                    setAsilNunXData({
                      ...asilNunXData,
                      details: e.target.value,
                    })
                  }
                  placeholder="Detaylar"
                />
              </div>
              <div className="form-group">
                <label className="section-label">Ana Resim</label>
                <div className="image-box">
                  {asilNunXData.image ? (
                    <>
                      <img
                        src={asilNunXData.image}
                        alt="Ana görsel"
                        className="gallery-image"
                      />
                      <div
                        className="edit-icon"
                        onClick={() =>
                          document.getElementById("mainImageInput").click()
                        }
                        title="Resmi değiştir"
                      >
                        ✏️
                      </div>
                    </>
                  ) : (
                    <div
                      className="document-placeholder"
                      onClick={() =>
                        document.getElementById("mainImageInput").click()
                      }
                    >
                      <div className="document-icon-preview">➕</div>
                      <p>Görsel Ekle</p>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  id="mainImageInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
              </div>

              <div className="documents-grid">
                {[0, 1, 2, 3].map((index) => {
                  const file = previewDocuments[index];
                  const fileName = file ? file.name : null;

                  return (
                    <div key={index} className="document-box">
                      {file ? (
                        <>
                          <div className="document-icon-preview">📄</div>
                          <p className="document-filename" title={fileName}>
                            {fileName.length > 25
                              ? fileName.substring(0, 22) + "..."
                              : fileName}
                          </p>

                          <div
                            className="edit-icon"
                            onClick={() => {
                              selectedDocIndexRef.current = index;
                              documentInputRef.current?.click();
                            }}
                            title="Dökümanı değiştir"
                          >
                            ✏️
                          </div>
                        </>
                      ) : (
                        <div
                          className="document-placeholder"
                          onClick={() => {
                            selectedDocIndexRef.current = index;
                            documentInputRef.current?.click();
                          }}
                        >
                          <div className="document-icon-preview">➕</div>
                          <p>Yeni Döküman Ekle</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <input
                type="file"
                accept=".pdf,.doc,.docx, "
                ref={documentInputRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const index = selectedDocIndexRef.current;
                    setPreviewDocuments((prev) => {
                      const updated = [...prev];
                      updated[index] = file;
                      return updated;
                    });
                  }
                }}
              />

              <div className="gallery-grid">
                {[0, 1, 2, 3].map((index) => {
                  const imageUrl = asilNunXData.gallery[index];

                  return (
                    <div key={index} className="gallery-item">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`Galeri ${index + 1}`}
                          className="gallery-image"
                        />
                      ) : (
                        <div className="gallery-placeholder">Resim Yok</div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={galleryInputRef}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const previewURL = URL.createObjectURL(file);
                            setAsilNunXData((prev) => {
                              const updated = [...prev.gallery];
                              updated[selectedGalleryIndexRef.current] =
                                previewURL;
                              return { ...prev, gallery: updated };
                            });
                          }
                        }}
                      />

                      <div
                        className="edit-icon"
                        onClick={() => {
                          selectedGalleryIndexRef.current = index;
                          galleryInputRef.current?.click();
                        }}
                        title="Resmi değiştir"
                      >
                        ✏️
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="save-button"
              >
                {uploading ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AsilNunX;

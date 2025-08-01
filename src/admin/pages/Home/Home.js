import React, { useState, useEffect } from "react";
import { getPage, updatePage } from "../../../api";
import Swal from 'sweetalert2';
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
        const response = await getPage("C569F4BC-D5F8-4768-8DFE-21618933F647");
        const data = response.data && response.data.data ? response.data.data : response.data;
        setBannerTitle((data.titles && data.titles[0]) || "");
        setBannerSubtitle((data.subtitles && data.subtitles[0]) || "");
        const API_URL = process.env.REACT_APP_API_URL || "https://localhost:7103";
        setBoxes(
          (data.products || []).map((product) => {
            let imagePath = (product.files && product.files[0] && product.files[0].path) || "";
            if (imagePath && imagePath.startsWith("uploads/")) {
              imagePath = `${API_URL}/${imagePath}`;
            }
            return {
              title: (product.titles && product.titles[0]) || "",
              subtitle: (product.subtitles && product.subtitles[0]) || "",
              image: imagePath,
              id: product.id,
            };
          })
        );
      } catch (error) {
        console.error("Page verisi alınırken hata oluştu:", error);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (event) => {
    if (event) event.preventDefault();

    try {
      const response = await getPage("C569F4BC-D5F8-4768-8DFE-21618933F647");
      const page = response.data && response.data.data ? response.data.data : response.data;

      let updatedProducts = boxes.map((box, idx) => {
        const oldProduct = (page.products && page.products[idx]) || {};
        return {
          id: oldProduct.id,
          name: oldProduct.name || box.title || "Ürün",
          titles: [box.title],
          subtitles: [box.subtitle],
          descriptions: oldProduct.descriptions || [],
          urls: oldProduct.urls || [],
          fileIds: oldProduct.fileIds || [],
          files: oldProduct.files || [],
          ...Object.fromEntries(Object.entries(oldProduct).filter(([k]) => !["id","name","titles","subtitles","descriptions","urls","fileIds","files"].includes(k)))
        };
      });

      if (page.products && page.products.length > boxes.length) {
        updatedProducts = [
          ...updatedProducts,
          ...page.products.slice(boxes.length)
        ];
      }

      const boxIds = boxes.map((b) => b.id).filter(Boolean);
      let mergedProductIds = Array.isArray(page.productIds) ? [...page.productIds] : [];
      boxIds.forEach((id) => {
        if (!mergedProductIds.includes(id)) mergedProductIds.push(id);
      });

      mergedProductIds = Array.from(new Set([...mergedProductIds, ...boxIds]));

      const updatedPage = {
        ...page,
        titles: [tempTitle || bannerTitle],
        subtitles: [tempSubtitle || bannerSubtitle],
        descriptions: page.descriptions || [],
        products: updatedProducts,
        name: page.name || "Anasayfa",
        productIds: mergedProductIds,
      };

      await updatePage(updatedPage);
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Değişiklikler başarıyla kaydedildi!',
        confirmButtonText: 'Tamam',
        confirmButtonColor: '#28a745',
        timer: 2000,
        timerProgressBar: true
      });
    } catch (error) {
      console.error("Veriler kaydedilirken hata oluştu:", error);
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Bir hata oluştu. Lütfen tekrar deneyin.',
        confirmButtonText: 'Tamam',
        confirmButtonColor: '#dc3545'
      });
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

  const handleModalSave = async () => {
    setBannerTitle(tempTitle);
    setBannerSubtitle(tempSubtitle);
    setIsModalOpen(false);
    setTimeout(() => {
      handleSave();
    }, 0);
  };

  return (
    <div className="admin-panel">
      <form id="home-form" onSubmit={handleSave}>
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
              <button className="save-button" type="button" onClick={handleModalSave}>
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

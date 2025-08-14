import React, { useState, useEffect } from "react";
import {
  getPage,
  getPageByName,
  updatePage,
  getProductsAuth as getProducts,
  updatePageProductOrder,
  getFile,
} from "../../../api";
import Swal from "sweetalert2";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const [tempSubtitle, setTempSubtitle] = useState("");
  const [draggedItem, setDraggedItem] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const pageResponse = await getPageByName("Anasayfa");
        const pageData =
          pageResponse.data && pageResponse.data.data
            ? pageResponse.data.data
            : pageResponse.data;

        setBannerTitle((pageData.titles && pageData.titles[0]) || "");
        setBannerSubtitle((pageData.subtitles && pageData.subtitles[0]) || "");

        const productsResponse = await getProducts({
          PageIndex: 1,
          PageSize: 100,
        });
        const allProducts =
          productsResponse?.data?.data?.items ||
          productsResponse?.data?.items ||
          productsResponse?.data ||
          [];
        console.log("API'dan gelen tüm ürünler:", allProducts);

        setAvailableProducts(allProducts);

        const API_URL =
          process.env.REACT_APP_API_URL || "https://localhost:7103";
        const currentSelectedProducts = await Promise.all(
          (pageData.products || []).map(async (product) => {
            console.log("Sayfa yüklenirken ürün:", product);
            console.log("productImage:", product.productImage);
            console.log("productImageId:", product.productImageId);
            console.log("files:", product.files);

            let imagePath = "";

            if (product.productImage && product.productImage.path) {
              imagePath = product.productImage.path;
              console.log("productImage.path kullanıldı:", imagePath);
            } else if (product.productImageId) {
              try {
                console.log(
                  "File API'sinden dosya çekiliyor:",
                  product.productImageId
                );
                const fileResponse = await getFile(product.productImageId);
                const fileData =
                  fileResponse.data && fileResponse.data.data
                    ? fileResponse.data.data
                    : fileResponse.data;
                if (fileData && fileData.path) {
                  imagePath = fileData.path;
                  console.log("File API'sinden dosya bulundu:", imagePath);
                } else {
                  console.log("File API'sinden dosya bulunamadı");
                }
              } catch (error) {
                console.log("File API'sinden dosya çekilirken hata:", error);

                // Fallback: Önce kendi files array'inde ara
                if (product.files && product.files.length > 0) {
                  const productImageFile = product.files.find(
                    (file) =>
                      file.id === product.productImageId ||
                      file.id === String(product.productImageId) ||
                      String(file.id) === String(product.productImageId)
                  );
                  if (productImageFile) {
                    imagePath = productImageFile.path;
                    console.log(
                      "productImageId ile eşleşen dosya bulundu (kendi files):",
                      imagePath
                    );
                  }
                }

                // Eğer kendi files'ında yoksa, availableProducts'tan ara
                if (!imagePath && allProducts && allProducts.length > 0) {
                  console.log(
                    "availableProducts'tan aranıyor, allProducts uzunluğu:",
                    allProducts.length
                  );
                  const availableProduct = allProducts.find(
                    (p) => p.id === product.id
                  );
                  console.log(
                    "availableProduct bulundu mu:",
                    !!availableProduct
                  );
                  if (availableProduct) {
                    console.log(
                      "availableProduct files:",
                      availableProduct.files
                    );
                    if (
                      availableProduct.files &&
                      availableProduct.files.length > 0
                    ) {
                      const productImageFile = availableProduct.files.find(
                        (file) =>
                          file.id === product.productImageId ||
                          file.id === String(product.productImageId) ||
                          String(file.id) === String(product.productImageId)
                      );
                      if (productImageFile) {
                        imagePath = productImageFile.path;
                        console.log(
                          "productImageId ile eşleşen dosya bulundu (availableProducts):",
                          imagePath
                        );
                      } else {
                        console.log(
                          "availableProducts'ta da productImageId ile eşleşen dosya bulunamadı"
                        );
                      }
                    } else {
                      console.log("availableProduct'ta da files boş");
                    }
                  } else {
                    console.log("availableProducts'ta ürün bulunamadı");
                  }
                }
              }

              if (!imagePath) {
                console.log("productImageId ile eşleşen dosya bulunamadı");
              }
            } else if (
              product.files &&
              product.files[0] &&
              product.files[0].path
            ) {
              imagePath = product.files[0].path;
              console.log("İlk dosya kullanıldı:", imagePath);
            }

            if (imagePath) {
              if (imagePath.startsWith("uploads/")) {
                imagePath = `${API_URL}/${imagePath}`;
              } else if (!imagePath.startsWith("http")) {
                imagePath = `${API_URL}/${imagePath}`;
              }
              console.log("Final imagePath:", imagePath);
            } else {
              console.log("Hiç görsel bulunamadı");
            }

            return {
              ...product,
              imagePath,
            };
          })
        );

        setSelectedProducts(currentSelectedProducts);
      } catch (error) {
        console.error("Veriler yüklenirken hata oluştu:", error);
        Swal.fire({
          icon: "error",
          title: "Hata!",
          text: "Veriler yüklenirken bir hata oluştu.",
          confirmButtonText: "Tamam",
          confirmButtonColor: "#dc3545",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const updatedProducts = [...selectedProducts];
    const draggedProduct = updatedProducts[draggedItem];

    updatedProducts.splice(draggedItem, 1);
    updatedProducts.splice(dropIndex, 0, draggedProduct);

    setSelectedProducts(updatedProducts);
    setDraggedItem(null);

    try {
      const pageResponse = await getPageByName("Anasayfa");
      const page =
        pageResponse.data && pageResponse.data.data
          ? pageResponse.data.data
          : pageResponse.data;

      const productIds = updatedProducts.map((p) => p.id);
      const productOrderData = {
        pageId: page.id,
        productIds: productIds,
      };

      await updatePageProductOrder(productOrderData);

      Swal.fire({
        icon: "success",
        title: "Sıralama güncellendi!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Sıralama kaydedilirken hata:", error);
      Swal.fire({
        icon: "error",
        title: "Sıralama kaydedilemedi!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const addProductToHome = async (product) => {
    if (selectedProducts.length >= 4) {
      Swal.fire({
        icon: "warning",
        title: "Uyarı!",
        text: "Ana sayfada maksimum 4 ürün gösterilebilir.",
        confirmButtonText: "Tamam",
        confirmButtonColor: "#ffc107",
      });
      return;
    }

    console.log("Ürün ekleniyor:", product);
    console.log("productImage:", product.productImage);
    console.log("productImageId:", product.productImageId);
    console.log("files:", product.files);

    const API_URL = process.env.REACT_APP_API_URL || "https://localhost:7103";
    let imagePath = "";

    if (product.productImage && product.productImage.path) {
      imagePath = product.productImage.path;
      console.log("productImage.path kullanıldı:", imagePath);
    } else if (product.productImageId) {
      try {
        console.log("File API'sinden dosya çekiliyor:", product.productImageId);
        const fileResponse = await getFile(product.productImageId);
        const fileData =
          fileResponse.data && fileResponse.data.data
            ? fileResponse.data.data
            : fileResponse.data;
        if (fileData && fileData.path) {
          imagePath = fileData.path;
          console.log("File API'sinden dosya bulundu:", imagePath);
        } else {
          console.log("File API'sinden dosya bulunamadı");
        }
      } catch (error) {
        console.log("File API'sinden dosya çekilirken hata:", error);

        // Fallback: files dizisinden ara
        if (product.files) {
          const productImageFile = product.files.find(
            (file) => file.id === product.productImageId
          );
          if (productImageFile) {
            imagePath = productImageFile.path;
            console.log("productImageId ile eşleşen dosya bulundu:", imagePath);
          } else {
            console.log("productImageId ile eşleşen dosya bulunamadı");
          }
        }
      }
    } else if (product.files && product.files[0] && product.files[0].path) {
      imagePath = product.files[0].path;
      console.log("İlk dosya kullanıldı:", imagePath);
    }

    if (imagePath) {
      if (imagePath.startsWith("uploads/")) {
        imagePath = `${API_URL}/${imagePath}`;
      } else if (!imagePath.startsWith("http")) {
        imagePath = `${API_URL}/${imagePath}`;
      }
      console.log("Final imagePath:", imagePath);
    } else {
      console.log("Hiç görsel bulunamadı");
    }

    const productWithImage = {
      ...product,
      imagePath,
    };

    console.log("Eklenen ürün:", productWithImage);
    setSelectedProducts((prev) => [...prev, productWithImage]);
    setShowProductModal(false);
  };

  const removeProductFromHome = (productId) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const openBannerModal = () => {
    setTempTitle(bannerTitle);
    setTempSubtitle(bannerSubtitle);
    setShowBannerModal(true);
  };

  const openProductModal = () => {
    setShowProductModal(true);
  };

  const closeBannerModal = () => {
    setShowBannerModal(false);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
  };

  const saveBannerChanges = async () => {
    try {
      setBannerTitle(tempTitle);
      setBannerSubtitle(tempSubtitle);
      setShowBannerModal(false);

      const pageResponse = await getPageByName("Anasayfa");
      const page =
        pageResponse.data && pageResponse.data.data
          ? pageResponse.data.data
          : pageResponse.data;

      const updatedProducts = selectedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        titles: product.titles || [],
        subtitles: product.subtitles || [],
        descriptions: product.descriptions || [],
        listItems: product.listItems || [],
        urls: product.urls || [],
        bannerImageUrl: product.bannerImageUrl || null,
        productImageId: product.productImageId || null,
        documentImageIds: product.documentImageIds || [],
        productDetailImageIds: product.productDetailImageIds || [],
        fileIds: product.fileIds || [],
        files: product.files || [],
      }));

      const productIds = selectedProducts.map((p) => p.id);

      const updatedPage = {
        ...page,
        titles: [tempTitle],
        subtitles: [tempSubtitle],
        products: updatedProducts,
        productIds: productIds,
      };

      await updatePage(updatedPage);

      const productOrderData = {
        pageId: page.id,
        productIds: productIds,
      };

      await updatePageProductOrder(productOrderData);

      Swal.fire({
        icon: "success",
        title: "Banner Güncellendi!",
        text: "Banner başlığı ve alt başlığı başarıyla kaydedildi!",
        confirmButtonText: "Tamam",
        confirmButtonColor: "#28a745",
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Banner kaydedilirken hata oluştu:", error);
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "Banner kaydetme sırasında bir hata oluştu.",
        confirmButtonText: "Tamam",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  const saveAllChanges = async () => {
    try {
      const pageResponse = await getPageByName("Anasayfa");
      const page =
        pageResponse.data && pageResponse.data.data
          ? pageResponse.data.data
          : pageResponse.data;

      const updatedProducts = selectedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        titles: product.titles || [],
        subtitles: product.subtitles || [],
        descriptions: product.descriptions || [],
        listItems: product.listItems || [],
        urls: product.urls || [],
        bannerImageUrl: product.bannerImageUrl || null,
        productImageId: product.productImageId || null,
        documentImageIds: product.documentImageIds || [],
        productDetailImageIds: product.productDetailImageIds || [],
        fileIds: product.fileIds || [],
        files: product.files || [],
      }));

      const productIds = selectedProducts.map((p) => p.id);

      const updatedPage = {
        ...page,
        titles: [bannerTitle],
        subtitles: [bannerSubtitle],
        products: updatedProducts,
        productIds: productIds,
      };

      await updatePage(updatedPage);

      const productOrderData = {
        pageId: page.id,
        productIds: productIds,
      };

      await updatePageProductOrder(productOrderData);

      Swal.fire({
        icon: "success",
        title: "Başarılı!",
        text: "Değişiklikler başarıyla kaydedildi!",
        confirmButtonText: "Tamam",
        confirmButtonColor: "#28a745",
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Veriler kaydedilirken hata oluştu:", error);
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "Bir hata oluştu. Lütfen tekrar deneyin.",
        confirmButtonText: "Tamam",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  if (loading) {
    return <div className="AdminLoading">Yükleniyor...</div>;
  }

  return (
    <div className="AdminPanel">
      {/* Banner Bölümü */}
      <div className="AdminHomeSection">
        <div className="AdminSectionHeader">
          <h2 className="AdminSectionTitle">Ana Sayfa Banner</h2>
          <button className="edit-btn primary" onClick={openBannerModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
            Düzenle
          </button>
        </div>

        <div className="AdminBannerPreview">
          <div className="AdminBannerContent">
            <h1 className="AdminBannerTitle">
              {bannerTitle || "Başlık eklenmedi"}
            </h1>
            <p className="AdminBannerSubtitle">
              {bannerSubtitle || "Alt başlık eklenmedi"}
            </p>
          </div>
        </div>
      </div>

      {/* Ürünler Bölümü */}
      <div className="AdminHomeSection">
        <div className="AdminSectionHeader">
          <h2 className="AdminSectionTitle">Ana Sayfada Gösterilecek Ürünler</h2>
          <button className="add-btn primary" onClick={openProductModal}>
            Ürün Seç
          </button>
        </div>

        <div className="AdminSelectedProducts">
          {selectedProducts.length === 0 ? (
            <div className="AdminNoProducts">
              <p>
                Henüz ürün seçilmedi. Ürün eklemek için yukarıdaki butona
                tıklayın.
              </p>
            </div>
          ) : (
            <div className="AdminProductsGrid">
              {selectedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="AdminProductItem"
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div className="AdminDragHandle">⋮⋮</div>
                  <div className="AdminProductImage">
                    {product.imagePath ? (
                      <img src={product.imagePath} alt={product.name} />
                    ) : (
                      <div className="AdminNoImage">Görsel Yok</div>
                    )}
                  </div>
                  <div className="AdminProductInfo">
                    <h3>{product.name}</h3>
                    <p>
                      {product.titles && product.titles[0]
                        ? product.titles[0]
                        : "Başlık yok"}
                    </p>
                  </div>
                  <div className="AdminProductActions">
                    <span className="AdminOrderNumber">{index + 1}</span>
                    <button
                      className="remove-btn"
                      onClick={() => removeProductFromHome(product.id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="AdminSaveSection">
          <button className="save-btn primary" onClick={saveAllChanges}>
            Değişiklikleri Kaydet
          </button>
        </div>
      </div>

      {/* Banner Düzenleme Modalı */}
      {showBannerModal && (
        <div className="AdminModalOverlay">
          <div className="AdminModalContent">
            <div className="AdminModalHeader">
              <h3>Banner Düzenle</h3>
              <button className="close-btn" onClick={closeBannerModal}>
                ×
              </button>
            </div>
            <div className="AdminModalBody">
              <div className="form-group">
                <label>Başlık</label>
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  placeholder="Banner başlığını girin"
                />
              </div>
              <div className="form-group">
                <label>Alt Başlık</label>
                <input
                  type="text"
                  value={tempSubtitle}
                  onChange={(e) => setTempSubtitle(e.target.value)}
                  placeholder="Banner alt başlığını girin"
                />
              </div>
            </div>
            <div className="AdminModalFooter">
              <button className="cancel-btn" onClick={closeBannerModal}>
                İptal
              </button>
              <button className="save-btn" onClick={saveBannerChanges}>
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ürün Seçim Modalı */}
      {showProductModal && (
        <div className="AdminModalOverlay">
          <div className="AdminModalContent large">
            <div className="AdminModalHeader">
              <h3>Ürün Seç</h3>
              <button className="close-btn" onClick={closeProductModal}>
                ×
              </button>
            </div>
            <div className="AdminModalBody">
              <div className="AdminAvailableProductsGrid">
                {availableProducts
                  .filter(
                    (product) =>
                      !selectedProducts.some(
                        (selected) => selected.id === product.id
                      )
                  )
                  .map((product) => {
                    const API_URL =
                      process.env.REACT_APP_API_URL || "https://localhost:7103";
                    let imagePath = "";

                    if (product.productImage && product.productImage.path) {
                      imagePath = product.productImage.path;
                    }
                    else if (product.productImageId && product.files) {
                      const productImageFile = product.files.find(
                        (file) => file.id === product.productImageId
                      );
                      if (productImageFile) {
                        imagePath = productImageFile.path;
                      }
                    }
                    else if (
                      product.files &&
                      product.files[0] &&
                      product.files[0].path
                    ) {
                      imagePath = product.files[0].path;
                    }

                    if (imagePath) {
                      if (imagePath.startsWith("uploads/")) {
                        imagePath = `${API_URL}/${imagePath}`;
                      } else if (!imagePath.startsWith("http")) {
                        imagePath = `${API_URL}/${imagePath}`;
                      }
                    }

                    return (
                      <div key={product.id} className="AdminAvailableProductItem">
                        <div className="AdminProductImage">
                          {imagePath ? (
                            <img src={imagePath} alt={product.name} />
                          ) : (
                            <div className="AdminNoImage">Görsel Yok</div>
                          )}
                        </div>
                        <div className="AdminProductInfo">
                          <h4>{product.name}</h4>
                          <p>
                            {product.titles && product.titles[0]
                              ? product.titles[0]
                              : "Başlık yok"}
                          </p>
                        </div>
                        <button
                          className="AdminAddProductBtn"
                          onClick={() => addProductToHome(product)}
                          disabled={selectedProducts.length >= 4}
                        >
                          Ekle
                        </button>
                      </div>
                    );
                  })}
              </div>
              {availableProducts.filter(
                (product) =>
                  !selectedProducts.some(
                    (selected) => selected.id === product.id
                  )
              ).length === 0 && (
                <div className="AdminNoProducts">
                  <p>Tüm ürünler zaten seçilmiş.</p>
                </div>
              )}
            </div>
            <div className="AdminModalFooter">
              <button className="cancel-btn" onClick={closeProductModal}>
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

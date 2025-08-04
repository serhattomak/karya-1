import React, { useEffect, useState } from "react";
import { getProductsAuth as getProducts, deleteProduct } from "../../../api";
import ProductModal from "./ProductModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import Swal from "sweetalert2";
import "./Products.css";

const BASE_URL = "https://localhost:7103/";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, [pagination.pageIndex, pagination.pageSize]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        PageIndex: Math.max(1, pagination.pageIndex - 1),
        PageSize: Math.max(1, pagination.pageSize),
      };
      console.log("API'ye gönderilen parametreler:", params);
      const response = await getProducts(params);
      const data = response?.data?.data || response?.data || response;

      setProducts(data.items || data || []);
      setPagination((prev) => ({
        ...prev,
        totalCount: data.totalCount || 0,
        totalPages: data.totalPages || 0,
      }));
    } catch (error) {
      console.error("Ürünler yüklenirken hata:", error);
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "Ürünler yüklenirken bir hata oluştu.",
        confirmButtonText: "Tamam",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id);
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      setShowDeleteModal(false);
      setProductToDelete(null);
      Swal.fire({
        icon: "success",
        title: "Başarılı!",
        text: "Ürün başarıyla silindi!",
        confirmButtonText: "Tamam",
        confirmButtonColor: "#28a745",
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Ürün silinirken hata:", error);
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "Ürün silinirken bir hata oluştu.",
        confirmButtonText: "Tamam",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleProductSaved = () => {
    fetchProducts();
    handleModalClose();
  };

  const handlePageChange = (newPageIndex) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: Math.max(1, newPageIndex),
    }));
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="admin-panel">
      <div className="panel-header">
        <h2 className="panel-title">Ürün Yönetimi</h2>
        <button className="add-btn primary" onClick={handleAddProduct}>
          + Yeni Ürün Ekle
        </button>
      </div>

      <div className="products-grid">
        {products.length === 0 ? (
          <div className="no-products">
            <p>Henüz ürün bulunmuyor.</p>
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {(() => {
                  if (product.productImage && product.productImage.path) {
                    return (
                      <img
                        src={BASE_URL + product.productImage.path}
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = "/placeholder.jpg";
                        }}
                      />
                    );
                  }

                  if (product.productImageId && product.files) {
                    const mainImage = product.files.find(
                      (file) =>
                        file.id === product.productImageId ||
                        file.id === String(product.productImageId) ||
                        String(file.id) === String(product.productImageId)
                    );
                    if (mainImage && mainImage.path) {
                      return (
                        <img
                          src={BASE_URL + mainImage.path}
                          alt={product.name}
                          onError={(e) => {
                            e.target.src = "/placeholder.jpg";
                          }}
                        />
                      );
                    }
                  }

                  if (product.files && product.files.length > 0) {
                    const firstFile = product.files.find((file) => file.path);
                    if (firstFile) {
                      return (
                        <img
                          src={BASE_URL + firstFile.path}
                          alt={product.name}
                          onError={(e) => {
                            e.target.src = "/placeholder.jpg";
                          }}
                        />
                      );
                    }
                  }

                  return (
                    <div className="no-image">
                      <span>Görsel Yok</span>
                    </div>
                  );
                })()}
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-title">
                  {product.titles && product.titles[0]
                    ? product.titles[0]
                    : "Başlık yok"}
                </p>
                {/* Alt başlıklar */}
                {product.subtitles && product.subtitles.length > 0 && (
                  <div className="product-subtitles">
                    {product.subtitles.slice(0, 2).map((subtitle, index) => (
                      <span key={index} className="product-subtitle">
                        {subtitle}
                      </span>
                    ))}
                    {product.subtitles.length > 2 && (
                      <span className="more-subtitles">
                        +{product.subtitles.length - 2} daha
                      </span>
                    )}
                  </div>
                )}
                <p className="product-description">
                  {product.descriptions && product.descriptions[0]
                    ? product.descriptions[0].substring(0, 100) + "..."
                    : "Açıklama yok"}
                </p>
                {/* Liste öğeleri */}
                {product.listItems && product.listItems.length > 0 && (
                  <div className="product-list-items">
                    {product.listTitles && product.listTitles.length > 0 && (
                      <h5>{product.listTitles[0]}</h5>
                    )}
                    <ul>
                      {product.listItems.slice(0, 3).map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                      {product.listItems.length > 3 && (
                        <li className="more-items">
                          +{product.listItems.length - 3} madde daha
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="product-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditProduct(product)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                    Düzenle
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteClick(product)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(pagination.pageIndex - 1)}
            disabled={pagination.pageIndex === 1}
            className="pagination-btn"
          >
            « Önceki
          </button>

          <span className="pagination-info">
            Sayfa {pagination.pageIndex} / {pagination.totalPages}
          </span>

          <button
            onClick={() => handlePageChange(pagination.pageIndex + 1)}
            disabled={pagination.pageIndex >= pagination.totalPages}
            className="pagination-btn"
          >
            Sonraki »
          </button>
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <ProductModal
          product={selectedProduct}
          onClose={handleModalClose}
          onSave={handleProductSaved}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          productName={productToDelete?.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteModal(false);
            setProductToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default Products;

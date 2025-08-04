/**
 * Refactored Admin Products Component
 * Demonstrates modern React patterns with hooks and services
 */

import React from "react";
import { useApi, usePagination, useForm } from "../../../hooks";
import { productService } from "../../../services/apiService";
import { buildImageUrl } from "../../../utils/httpUtils";
import { 
  Loading, 
  ErrorMessage, 
  Pagination, 
  SearchInput, 
  Modal 
} from "../../../components/common/CommonComponents";
import ProductModal from "./ProductModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import Swal from 'sweetalert2';
import "./Products.css";

const Products = () => {
  // Hooks for state management
  const { pagination, goToPage, changePageSize } = usePagination(10);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [productToDelete, setProductToDelete] = React.useState(null);

  // API hooks
  const { 
    data: productsData, 
    loading, 
    error,
    fetchData: fetchProducts 
  } = useApi((params) => productService.getAll(params, true));

  // Effects
  React.useEffect(() => {
    const params = {
      PageIndex: pagination.pageIndex,
      PageSize: pagination.pageSize,
      SortColumn: pagination.sortColumn,
      SortDirection: pagination.sortDirection
    };
    
    fetchProducts(params);
  }, [pagination, fetchProducts]);

  // Event handlers
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleProductSaved = () => {
    setShowModal(false);
    setSelectedProduct(null);
    fetchProducts({
      PageIndex: pagination.pageIndex,
      PageSize: pagination.pageSize
    });
    
    Swal.fire({
      icon: 'success',
      title: 'Başarılı!',
      text: 'Ürün başarıyla kaydedildi.',
      timer: 2000,
      showConfirmButton: false
    });
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await productService.delete(productToDelete.id);
      
      setShowDeleteModal(false);
      setProductToDelete(null);
      
      // Refresh the list
      fetchProducts({
        PageIndex: pagination.pageIndex,
        PageSize: pagination.pageSize
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Silindi!',
        text: 'Ürün başarıyla silindi.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Ürün silinirken bir hata oluştu.',
        confirmButtonText: 'Tamam'
      });
    }
  };

  const handlePageChange = (newPage) => {
    goToPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    changePageSize(newSize);
  };

  const getProductImage = (product) => {
    if (product.productImage?.path) {
      return buildImageUrl(product.productImage.path);
    }
    
    if (product.files?.[0]?.path) {
      return buildImageUrl(product.files[0].path);
    }
    
    return "/assets/images/Group 300.webp";
  };

  // Render loading state
  if (loading) {
    return (
      <div className="products-page">
        <Loading size="large" />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="products-page">
        <ErrorMessage 
          message={error} 
          onRetry={() => fetchProducts({
            PageIndex: pagination.pageIndex,
            PageSize: pagination.pageSize
          })}
        />
      </div>
    );
  }

  const products = productsData?.items || [];
  const totalCount = productsData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize);

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Ürün Yönetimi</h1>
        <button onClick={handleAddProduct} className="add-btn">
          + Yeni Ürün Ekle
        </button>
      </div>

      <div className="products-filters">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Ürün adı ara..."
        />
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img 
                src={getProductImage(product)} 
                alt={product.name}
                loading="lazy"
              />
            </div>
            
            <div className="product-info">
              <h3 className="product-title">{product.name}</h3>
              <p className="product-description">
                {product.descriptions?.[0] || 'Açıklama yok'}
              </p>
            </div>
            
            <div className="product-actions">
              <button 
                onClick={() => handleEditProduct(product)}
                className="edit-btn"
              >
                Düzenle
              </button>
              <button 
                onClick={() => handleDeleteProduct(product)}
                className="delete-btn"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={pagination.pageIndex}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        pageSize={pagination.pageSize}
        onPageSizeChange={handlePageSizeChange}
        total={totalCount}
      />

      {/* Modals */}
      {showModal && (
        <ProductModal
          product={selectedProduct}
          onClose={handleModalClose}
          onSave={handleProductSaved}
        />
      )}

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

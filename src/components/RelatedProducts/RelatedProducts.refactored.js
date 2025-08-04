/**
 * Refactored RelatedProducts Component
 * Uses new hooks and services for better state management
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks";
import { productService } from "../../services/apiService";
import { buildImageUrl } from "../../utils/httpUtils";
import { getProductUrl } from "../../utils/slugUtils";
import { Loading } from "../common/CommonComponents";
import "./RelatedProducts.css";

const RelatedProducts = ({ currentProductId, productName = "Ürünler" }) => {
  const navigate = useNavigate();
  
  // Use custom API hook for cleaner state management
  const { 
    data: productsData, 
    loading, 
    error 
  } = useApi(() => productService.getAll({ PageSize: 8 }), [currentProductId]);

  // Memoized filtered products
  const relatedProducts = React.useMemo(() => {
    if (!productsData) return [];
    
    const products = productsData.items || productsData || [];
    return products
      .filter(product => product.id !== currentProductId)
      .slice(0, 4);
  }, [productsData, currentProductId]);

  // Event handlers
  const handleProductClick = React.useCallback((product) => {
    const productUrl = getProductUrl(product);
    navigate(productUrl);
    window.scrollTo(0, 0);
  }, [navigate]);

  // Helper function to get product image
  const getProductImage = React.useCallback((product) => {
    // Product image from productImage relationship
    if (product.productImage?.path) {
      return buildImageUrl(product.productImage.path);
    }
    
    // Product image from productImages array
    if (product.productImages?.[0]?.path) {
      return buildImageUrl(product.productImages[0].path);
    }
    
    // Fallback to files array
    if (product.files?.[0]?.path) {
      return buildImageUrl(product.files[0].path);
    }
    
    // Default fallback image
    return "/assets/images/Group 300.webp";
  }, []);

  // Early returns for loading/error/empty states
  if (loading) {
    return (
      <div className="related-products-container">
        <Loading size="medium" />
      </div>
    );
  }

  if (error) {
    console.error("İlgili ürünler yüklenirken hata:", error);
    return null; // Silently fail for this non-critical component
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="related-products-container">
      <div className="related-products-content">
        <h3 className="related-products-title">Diğer Ürünlerimiz</h3>
        <div className="related-products-grid">
          {relatedProducts.map((product) => (
            <div 
              key={product.id} 
              className="related-product-card"
              onClick={() => handleProductClick(product)}
            >
              <div className="related-product-image">
                <img 
                  src={getProductImage(product)} 
                  alt={product.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "/assets/images/Group 300.webp";
                  }}
                />
              </div>
              <div className="related-product-info">
                <h4 className="related-product-title">
                  {product.titles?.[0] || product.name}
                </h4>
                <p className="related-product-description">
                  {product.descriptions?.[0] && 
                    (product.descriptions[0].length > 100 
                      ? `${product.descriptions[0].substring(0, 100)}...`
                      : product.descriptions[0]
                    )
                  }
                </p>
                <button className="related-product-button">
                  Detayları Gör
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(RelatedProducts);

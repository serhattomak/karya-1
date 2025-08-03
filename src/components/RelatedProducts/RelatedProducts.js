import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, getFile } from "../../api";
import { getProductUrl } from "../../utils/slugUtils";
import "./RelatedProducts.css";

const BASE_URL = "https://localhost:7103/";

const RelatedProducts = ({ currentProductId, productName = "Ürünler" }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await getProducts({ PageSize: 8 });
        const data = response?.data?.data || response?.data || response;
        const products = data.items || data || [];
        
        const filtered = products
          .filter(product => product.id !== currentProductId)
          .slice(0, 4);
        
        setRelatedProducts(filtered);
      } catch (error) {
        console.error("İlgili ürünler yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId]);

  const handleProductClick = (product) => {
    const productUrl = getProductUrl(product);
    navigate(productUrl);
    window.scrollTo(0, 0);
  };

  if (loading || relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="related-products-container">
      <div className="related-products-content">
        <h3 className="related-products-title">Diğer Ürünlerimiz</h3>
        <div className="related-products-grid">
          {relatedProducts.map((product) => {
            const mainImage = (() => {
              if (product.productImage && product.productImage.path) {
                return product.productImage.path.startsWith('http') 
                  ? product.productImage.path 
                  : BASE_URL + product.productImage.path;
              }
              if (product.productImageId && product.files) {
                const productImageFile = product.files.find(file => 
                  file.id === product.productImageId || 
                  file.id === String(product.productImageId) || 
                  String(file.id) === String(product.productImageId)
                );
                if (productImageFile && productImageFile.path) {
                  return productImageFile.path.startsWith('http') 
                    ? productImageFile.path 
                    : BASE_URL + productImageFile.path;
                }
              }
              if (product.files && product.files[0] && product.files[0].path) {
                return product.files[0].path.startsWith('http') 
                  ? product.files[0].path 
                  : BASE_URL + product.files[0].path;
              }
              return "/assets/images/Group 300.webp";
            })();
            
            return (
              <div 
                key={product.id} 
                className="related-product-card"
                onClick={() => handleProductClick(product)}
              >
                <div className="related-product-image">
                  <img 
                    src={mainImage} 
                    alt={product.titles?.[0] || product.name} 
                    loading="lazy"
                  />
                </div>
                <div className="related-product-info">
                  <h4>{product.titles?.[0] || product.name}</h4>
                  {product.subtitles?.[0] && (
                    <p>{product.subtitles[0]}</p>
                  )}
                  <span className="view-details">Detayları Gör →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;

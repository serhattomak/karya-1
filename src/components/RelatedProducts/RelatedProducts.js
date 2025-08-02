import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../api";
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

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
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
            const image = product.files && product.files[0] 
              ? BASE_URL + product.files[0].path 
              : "/assets/images/Group 300.webp";
            
            return (
              <div 
                key={product.id} 
                className="related-product-card"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="related-product-image">
                  <img 
                    src={image} 
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

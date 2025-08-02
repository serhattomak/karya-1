import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductSlider.css";

const ProductSlider = ({ products }) => {
  const trackRef = useRef(null);
  const navigate = useNavigate();

  const staticLinks = [
    "/AsilNunX",
    "/PoliuretanEnjeksiyon",
    "/HalatliTelBetonKesme",
    "/KimyasalAnkraj",
  ];

  const handleProductClick = (index) => {
    const product = products[index];
    // Eğer ürünün ID'si varsa, yeni dinamik sayfaya yönlendir
    if (product && product.id) {
      navigate(`/product/${product.id}`);
    } else {
      // Geriye dönük uyumluluk için statik linkler
      navigate(staticLinks[index] || "/");
    }
  };

  return (
    <div className="slider-container">
      <div className="slider-title">Ürün ve Hizmetlerimiz</div>
      <div className="slider">
        <ul className="slider__track" ref={trackRef}>
          {products.map((product, index) => (
            <li
              key={index}
              className={`slide ${product.subtitle ? "with-subtitle" : ""}`}
              onClick={() => handleProductClick(index)}
            >
              <img
                src={(() => {
                  // Dinamik ürünler için ana ürün görseli öncelikli
                  if (product.productImageId && product.files) {
                    const mainImage = product.files.find(file => file.id === product.productImageId);
                    if (mainImage) {
                      return `https://localhost:7103/${mainImage.path}`;
                    }
                  }
                  
                  // Statik ürünler için image field'ı veya banner
                  return product.image || product.bannerImageUrl || "/assets/images/Group 300.webp";
                })()}
                className="product-image"
                alt={product.title}
              />
              <h3 className="product-title">{product.title}</h3>
              {product.subtitle && (
                <p className="product-subtitle">{product.subtitle}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductSlider;

import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductSlider.css";

const BASE_URL = "https://localhost:7103/";

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
    if (product && product.id) {
      navigate(`/product/${product.id}`);
    } else {
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
                  if (product.productImage && product.productImage.path) {
                    return BASE_URL + product.productImage.path;
                  }
                  if (product.productImageId && product.files) {
                    const productImageFile = product.files.find(file => file.id === product.productImageId);
                    if (productImageFile) {
                      return BASE_URL + productImageFile.path;
                    }
                  }
                  if (product.files && product.files[0]) {
                    return BASE_URL + product.files[0].path;
                  }
                  if (product.image) {
                    return product.image;
                  }
                  return "/assets/images/Group 300.webp";
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

import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductSlider.css";

const ProductSlider = ({ products }) => {
  const trackRef = useRef(null);
  const navigate = useNavigate();

  const handleProductClick = (path) => {
    navigate(path);
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
              onClick={() => handleProductClick(product.path)}
            >
              <img
                src={product.image}
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

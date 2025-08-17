import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getProductUrl } from "../../utils/slugUtils";
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
    if (product && (product.id || product.name)) {
      const productUrl = getProductUrl(product);
      navigate(productUrl);
    } else {
      navigate(staticLinks[index] || "/");
    }
  };

  const getProductMainImage = (product) => {
    if (product.productMainImage && product.productMainImage.path) {
      return product.productMainImage.path.startsWith('http')
        ? product.productMainImage.path
        : BASE_URL + product.productMainImage.path;
    }
    if (product.productMainImageId && product.files && product.files.length > 0) {
      const mainImage = product.files.find(file => {
        const fileId = String(file.id).toLowerCase();
        const productMainImageId = String(product.productMainImageId).toLowerCase();
        return fileId === productMainImageId && file.path;
      });
      if (mainImage && mainImage.path) {
        return mainImage.path.startsWith('http')
          ? mainImage.path
          : BASE_URL + mainImage.path;
      }
    }
    if (product.ProductMainImageId && product.files && product.files.length > 0) {
      const mainImage = product.files.find(file => {
        const fileId = String(file.id).toLowerCase();
        const productMainImageId = String(product.ProductMainImageId).toLowerCase();
        return fileId === productMainImageId && file.path;
      });
      if (mainImage && mainImage.path) {
        return mainImage.path.startsWith('http')
          ? mainImage.path
          : BASE_URL + mainImage.path;
      }
    }
    if (product.files && product.files.length > 0) {
      const firstFile = product.files.find(file => file.path);
      if (firstFile) {
        return firstFile.path.startsWith('http')
          ? firstFile.path
          : BASE_URL + firstFile.path;
      }
    }
    if (product.mainImageUrl) {
      return product.mainImageUrl.startsWith('http')
        ? product.mainImageUrl
        : BASE_URL + product.mainImageUrl;
    }
    if (product.image) {
      return product.image;
    }
    return "/assets/images/Group 300.webp";
  };

  return (
    <div className="slider-container">
      <div className="slider-title">Ürün ve Hizmetlerimiz</div>
      <div className="slider">
        <ul className="slider__track" ref={trackRef}>
          {products.map((product, index) => (
            <li
              key={index}
              className={
                product.homePageSubtitle
                  ? "slide with-subtitle"
                  : "slide"
              }
              onClick={() => handleProductClick(index)}
            >
              <img
                src={getProductMainImage(product)}
                className="product-slider-image"
                alt={product.title}
                onError={(e) => {
                  e.target.src = "/assets/images/Group 300.webp";
                }}
              />
              <h3 className={product.homePageSubtitle ? "product-title" : "product-slider-title"}>{product.title}</h3>
              {product.homePageSubtitle && (
                <p className="product-subtitle">{product.homePageSubtitle}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductSlider;

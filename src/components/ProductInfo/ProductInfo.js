import React from "react";
import Gallery from "../Gallery/Gallery";
import "./ProductInfo.css";

const BASE_URL = "https://localhost:7103/";

const ProductInfo = ({ productData }) => {
  if (!productData) return null;

  const {
    name,
    titles = [],

    descriptions = [],
    listTitles = [],
    listItems = [],
    mainImage,
    productDetailImages = [],
  } = productData;

  return (
    <div className="info-product-container">
      <div className="info-product-left-content">
        <div className="info-product-text">
          <h2 className="info-product-title">{titles[0] || name}</h2>
          <hr className="line" />
          {descriptions.map((description, index) => (
            description ? (
              <p key={index} className="info-product-description">
                {description}
              </p>
            ) : null
          ))}
          <p className="info-product-contact">
            Ürün hakkında daha fazla bilgi almak için {" "}
            <a href="/contact">
              <span>bizimle iletişime geçin</span>
            </a>
          </p>
        </div>
        <div className="info-product-image">
          <div className="info-product-main-image">
            {mainImage && (
              <img
                src={mainImage || "/assets/images/Group 300.webp"}
                alt={titles[0] || name}
                loading="lazy"
              />
            )}
          </div>
        </div>
      </div>
      <div className="info-product-right-content">
          {listTitles.length > 0 && listItems.length > 0 && (
            <div className="info-product-list">
              <h2 className="p-title">{listTitles[0]}</h2>
              <hr className="line" />
              <ul>
                {listItems.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
      </div>
      {productDetailImages.length > 0 && (
        <div className="info-product-detail-gallery-section">
          <h2 className="p-title">Uygulama Alanlarına Ait Görseller</h2>
          <hr className="line" />
          <div className="info-product-gallery-images">
            {productDetailImages.map((imgSrc, idx) => (
              <img
                key={idx}
                src={imgSrc}
                alt={`Detay Görsel ${idx + 1}`}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;

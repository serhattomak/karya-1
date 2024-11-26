import React from "react";
import "./PolGallery.css";

const PolGallery = ({ title, images }) => {
  return (
    <div className="p-gallery-container">
      <h2 className="p-gallery-title">{title}</h2>
      <hr className="line"></hr>
      <div className="p-gallery-grid">
        {images.map((image, index) => (
          <div
            className={`p-gallery-item ${
              index < 4 ? "top-row" : "bottom-row" // İlk 4 resim "top-row", diğerleri "bottom-row"
            }`}
            key={index}
          >
            <img src={image.src} alt={image.alt} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PolGallery;

import React from "react";
import "./PolGallery.css";

const PolGallery = ({ title, images }) => {
  return (
    <div className="gallery-container">
      <h2 className="gallery-title">{title}</h2>
      <div className="gallery-grid">
        {images.map((image, index) => (
          <div
            className={`gallery-item ${
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

import React from "react";
import "./PolGallery.css";

const PolGallery = ({ title, images }) => {
  return (
    <div className="p-gallery-container">
      <h2 className="p-gallery-title">{title}</h2>
      <hr className="line" />
      <div className="p-gallery-grid">
        {images.map((image, index) => (
          <div className="p-gallery-item" key={index}>
            <img
              src={image.src}
              alt={image.alt}
              className="p-gallery-image"
              loading="lazy" // Lazy loading
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PolGallery;

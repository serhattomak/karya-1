import React from "react";
import "./Gallery.css";

const Gallery = ({ images, title }) => {
  if (!images || images.length === 0) {
    return null;
  }

  console.log("Gallery: Rendering with images:", images);

  return (
    <div className="gallery-container">
      <div className="gallery-content">
        <h2 className="gallery-title">{title}</h2>
        <hr className="line"></hr>
        <div className="gallery-images">
          {images.map((image, index) => {
            const imageSrc = image.src || image;
            const imageAlt = image.alt || `${title} ${index + 1}`;
            
            return (
              <img 
                key={index}
                src={imageSrc}
                alt={imageAlt}
                loading="lazy"
                onError={(e) => {
                  console.error(`Gallery image ${index} failed to load:`, imageSrc);
                  e.target.style.display = 'none';
                }}
                onLoad={() => {
                  console.log(`Gallery image ${index} loaded successfully:`, imageSrc);
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Gallery;

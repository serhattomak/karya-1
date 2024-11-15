import React from "react";
import "./Gallery.css";

const Gallery = () => {
  return (
    <div className="gallery-container">
      <div className="gallery-content">
        <h2 className="gallery-title">Görseller</h2>
        <div className="gallery-images">
          <img src="/assets/images/asilnunx.png" alt="Asil Nun X 1" />
          <img src="/assets/images/asilnunx.png" alt="Asil Nun X 2" />
          <img src="/assets/images/asilnunx.png" alt="Asil Nun X 3" />
          <img src="/assets/images/asilnunx.png" alt="Asil Nun X 4" />
        </div>
      </div>
    </div>
  );
};

export default Gallery;

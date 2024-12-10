import React from "react";
import "./ImageGallery.css";

const ImageGallery = () => {
  const images = [
    "/assets/images/poliuretanenjeksiyon.webp",

    "/assets/images/kimyasalankraj.webp",

    "/assets/images/htbk.webp",
    "/assets/images/asilnunx.webp",
  ];

  return (
    <div className="image-gallery">
      {images.map((image, index) => (
        <div key={index} className="image-container">
          <img src={image} className="gallery-image" loading="lazy" />
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;

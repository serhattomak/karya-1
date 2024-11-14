import React from "react";
import "./ImageGallery.css";

const ImageGallery = () => {
  const images = [
    "/assets/images/poliuretanenjeksiyon.png",

    "/assets/images/kimyasalankraj.png",

    "/assets/images/halatlıtelbetonkesme.png",
    "/assets/images/asilnunx.png",
  ];

  return (
    <div className="image-gallery">
      {images.map((image, index) => (
        <div key={index} className="image-container">
          <img src={image} className="gallery-image" />
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;

import React from "react";
import "./ImageGallery.css";

const ImageGallery = ({ galleryImages }) => {
  console.log("ImageGallery props:", { galleryImages });
  
  const defaultImages = [
    "/assets/images/poliuretanenjeksiyon.webp",
    "/assets/images/kimyasalankraj.webp",
    "/assets/images/htbk.webp",
    "/assets/images/asilnunx.webp",
  ];

  const images = galleryImages && galleryImages.length > 0 ? galleryImages : defaultImages;

  return (
    <div className="image-gallery">
      {images.map((image, index) => (
        <div key={index} className="image-container">
          <img src={image} className="gallery-image" loading="lazy" alt={`Galeri ${index + 1}`} />
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;

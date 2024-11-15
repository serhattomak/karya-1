// Banner.js
import React from "react";
import "./Banner.css";

const Banner = ({ imageSrc, title }) => {
  return (
    <div className="banner-about">
      <img
        src={imageSrc} // Dinamik resim kaynağı
        alt="Banner"
        className="banner-image-about"
      />
      <h1 className="banner-text-about">{title}</h1> {/* Dinamik başlık */}
    </div>
  );
};

export default Banner;

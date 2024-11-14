import React from "react";
import "./Banner.css";

const Banner = () => {
  return (
    <div className="banner-about">
      <img
        src="/assets/images/aboutbanner.png" /* Dinamik olarak güncellenebilecek resim kaynağı */
        alt="Banner"
        className="banner-image-about"
      />
      <h1 className="banner-text-about">Hakkımızda</h1>
    </div>
  );
};

export default Banner;

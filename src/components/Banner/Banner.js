import React from "react";
import "./Banner.css";

const Banner = ({ imageSrc, title }) => {
  return (
    <div className="banner-about">
      <img
        src={imageSrc}
        alt="Banner"
        className="banner-image-about"
        loading="lazy"
      />
      <h1 className="banner-text-about">{title}</h1>
    </div>
  );
};

export default Banner;

import React from "react";
import "./HomeBanner.css";

const HomeBanner = ({ title, subtitle, children }) => {
  return (
    <div
      className="banner"
      style={{
        backgroundImage: "url('/assets/images/3.webp')",
      }}
    >
      <div className="banner-container">
        <div className="banner-content">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default HomeBanner;

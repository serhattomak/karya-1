import React from "react";
import "./HomeBanner.css";

const HomeBanner = ({ children }) => {
  return (
    <div
      className="banner"
      style={{
        backgroundImage: "url('/assets/images/3.jpg')",
      }}
    >
      <div className="banner-container">
        <div className="banner-content">
          <h1>Güvenli Yapılar, Kalıcı Çözümler!</h1>
          <p>
            Betonarme yapılarda Poliüretan Enjeksiyon Sistemleriyle Su
            Sızıntılarına Son!
          </p>
        </div>
        {children} {/* ProductSlider burada gösterilecek */}
      </div>
    </div>
  );
};

export default HomeBanner;

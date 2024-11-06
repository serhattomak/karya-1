import React from "react";
import "./HomeBanner.css";

const HomeBanner = ({ data }) => {
  return (
    <div
      className="banner"
      style={{
        backgroundImage: "url('/assets/images/banner_background.png')",
      }}
    >
      <div className="banner-content">
        <h1>Güvenli Yapılar, Kalıcı Çözümler!</h1>
        <p>
          Betonarme yapılarda Poliüretan Enjeksiyon Sistemleriyle Su
          Sızıntılarına Son!
        </p>
      </div>
    </div>
  );
};

export default HomeBanner;

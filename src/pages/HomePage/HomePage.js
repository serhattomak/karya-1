import React from "react";
import HomeBanner from "../../components/HomeBanner/HomeBanner";
import ProductSlider from "../../components/ProductSlider/ProductSlider";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="home-container">
      <HomeBanner>
        <ProductSlider />{" "}
        <div className="banner-info">
          <a>www.karyayapi.com © 2007 - 2024 Karya Yapı San. Tic. Ltd. Şti.</a>
        </div>
      </HomeBanner>
    </div>
  );
}

export default HomePage;

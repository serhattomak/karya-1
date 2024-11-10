import React from "react";
import HomeBanner from "../../components/HomeBanner/HomeBanner";
import ProductSlider from "../../components/ProductSlider/ProductSlider";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="home-container">
      <HomeBanner>
        <ProductSlider /> {/* ProductSlider'ı HomeBanner'ın içinde gösteriyoruz */}
      </HomeBanner>
    </div>
  );
}

export default HomePage;

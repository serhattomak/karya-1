import React, { useEffect, useState } from "react";
import HomeBanner from "../../components/HomeBanner/HomeBanner";
import ProductSlider from "../../components/ProductSlider/ProductSlider";
import axios from "axios";
import "./HomePage.css";

function HomePage() {
  const [bannerData, setBannerData] = useState({
    title: "",
    subtitle: "",
  });
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/home");
        const { banner, boxes } = response.data;

        setBannerData({
          title: banner.title || "",
          subtitle: banner.subtitle || "",
        });
        setProductData(boxes || []);
      } catch (error) {
        console.error("API'den veriler alınırken hata oluştu:", error);
      }
    };

    fetchHomePageData();
  }, []);

  return (
    <div className="home-container">
      <HomeBanner title={bannerData.title} subtitle={bannerData.subtitle}>
        <ProductSlider products={productData} />
        <div className="banner-info">
          <a>www.karyayapi.com © Karya Yapı San. Tic. Ltd. Şti.</a>
        </div>
      </HomeBanner>
    </div>
  );
}

export default HomePage;

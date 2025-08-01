import React, { useEffect, useState } from "react";
import HomeBanner from "../../components/HomeBanner/HomeBanner";
import ProductSlider from "../../components/ProductSlider/ProductSlider";
import "./HomePage.css";
import { getPage } from "../../api";

const BASE_URL = "https://localhost:7103/";

function HomePage() {
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        const response = await getPage("C569F4BC-D5F8-4768-8DFE-21618933F647");
        const data = response?.data?.data || response?.data || response;
        setBannerTitle((data.titles && data.titles[0]) || "");
        setBannerSubtitle((data.subtitles && data.subtitles[0]) || "");
        const mappedProducts = (data.products || []).map((product) => ({
          ...product,
          image:
            product.files && product.files[0] && product.files[0].path
              ? BASE_URL + product.files[0].path
              : "",
          title: product.titles?.[0] || product.name || "",
          subtitle: product.subtitles?.[0] || "",
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error("API'den veriler alınırken hata oluştu:", error);
      }
    };
    fetchHomePageData();
  }, []);

  return (
    <div className="home-container">
      <HomeBanner title={bannerTitle} subtitle={bannerSubtitle}>
        <ProductSlider products={products} />
        <div className="banner-info">
          <a>www.karyayapi.com © Karya Yapı San. Tic. Ltd. Şti.</a>
        </div>
      </HomeBanner>
    </div>
  );
}

export default HomePage;

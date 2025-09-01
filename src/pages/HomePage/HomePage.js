import React, { useEffect, useState } from "react";
import HomeBanner from "../../components/HomeBanner/HomeBanner";
import ProductSlider from "../../components/ProductSlider/ProductSlider";
import "./HomePage.css";
import { getPageByName, getFile } from "../../api";

import { API_URL } from "../../api";

function HomePage() {
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        const response = await getPageByName("Anasayfa");
        const data = response?.data?.data || response?.data || response;
        setBannerTitle((data.titles && data.titles[0]) || "");
        setBannerSubtitle((data.subtitles && data.subtitles[0]) || "");
        const mappedProducts = await Promise.all(
          (data.products || []).map(async (product) => {
            let imagePath = "";

            if (product.productImage && product.productImage.path) {
              imagePath = product.productImage.path;
            } else if (product.productImageId) {
              try {
                const fileResponse = await getFile(product.productImageId);
                const fileData =
                  fileResponse.data && fileResponse.data.data
                    ? fileResponse.data.data
                    : fileResponse.data;
                if (fileData && fileData.path) {
                  imagePath = fileData.path;
                }
              } catch (error) {
                console.log("File API'sinden dosya çekilirken hata:", error);

                if (product.files && product.files.length > 0) {
                  const productImageFile = product.files.find(
                    (file) =>
                      file.id === product.productImageId ||
                      file.id === String(product.productImageId) ||
                      String(file.id) === String(product.productImageId)
                  );
                  if (productImageFile) {
                    imagePath = productImageFile.path;
                  }
                }
              }
            } else if (
              product.files &&
              product.files[0] &&
              product.files[0].path
            ) {
              imagePath = product.files[0].path;
            }

            let fullImageUrl = "";
            if (imagePath) {
              if (imagePath.startsWith("uploads/")) {
                fullImageUrl = API_URL + imagePath;
              } else if (!imagePath.startsWith("http")) {
                fullImageUrl = API_URL + imagePath;
              } else {
                fullImageUrl = imagePath;
              }
            }

            return {
              ...product,
              image: fullImageUrl,
              title: product.titles?.[0] || product.name || "",
              subtitle: product.subtitles?.[0] || "",
            };
          })
        );
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

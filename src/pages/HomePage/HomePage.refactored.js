/**
 * Refactored Component Example - HomePage
 * Shows how to use new hooks and services
 */

import React from "react";
import { useApi } from "../../hooks";
import { pageService, fileService } from "../../services/apiService";
import { buildImageUrl } from "../../utils/httpUtils";
import { Loading, ErrorMessage } from "../../components/common/CommonComponents";
import HomeBanner from "../../components/HomeBanner/HomeBanner";
import ProductSlider from "../../components/ProductSlider/ProductSlider";
import "./HomePage.css";

function HomePage() {
  // Use custom hooks for cleaner state management
  const { 
    data: pageData, 
    loading: pageLoading, 
    error: pageError,
    fetchData: fetchPageData 
  } = useApi(() => pageService.getByName("Anasayfa"));

  const [bannerTitle, setBannerTitle] = React.useState("");
  const [bannerSubtitle, setBannerSubtitle] = React.useState("");
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  React.useEffect(() => {
    if (pageData) {
      processPageData(pageData);
    }
  }, [pageData]);

  const processPageData = async (data) => {
    setBannerTitle((data.titles && data.titles[0]) || "");
    setBannerSubtitle((data.subtitles && data.subtitles[0]) || "");
    
    // Process products with improved image handling
    const mappedProducts = await Promise.all(
      (data.products || []).map(async (product) => {
        let imagePath = "";
        
        if (product.productImage && product.productImage.path) {
          imagePath = buildImageUrl(product.productImage.path);
        } else if (product.productImageId) {
          try {
            const fileData = await fileService.getById(product.productImageId);
            if (fileData && fileData.path) {
              imagePath = buildImageUrl(fileData.path);
            }
          } catch (error) {
            console.error("Error fetching product image:", error);
          }
        } else if (product.files && product.files[0] && product.files[0].path) {
          imagePath = buildImageUrl(product.files[0].path);
        }

        return {
          ...product,
          imagePath: imagePath || "/assets/images/Group 300.webp"
        };
      })
    );
    
    setProducts(mappedProducts);
  };

  if (pageLoading) {
    return <Loading size="large" />;
  }

  if (pageError) {
    return (
      <ErrorMessage 
        message={pageError} 
        onRetry={fetchPageData}
      />
    );
  }

  return (
    <div className="home-page">
      <HomeBanner title={bannerTitle} subtitle={bannerSubtitle} />
      <ProductSlider products={products} />
    </div>
  );
}

export default HomePage;

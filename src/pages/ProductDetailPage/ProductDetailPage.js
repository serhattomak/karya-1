import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Banner from "../../components/Banner/Banner";
import ProductInfo from "../../components/ProductInfo/ProductInfo";
import ContactSection from "../../components/ContactSection/ContactSection";
import Footer from "../../components/Footer/Footer";
import { getProductBySlug, getFile } from "../../api";
import "./ProductDetailPage.css";

import { API_URL } from "../../api";

function getEmbedUrl(url) {
  if (!url) return "";
  const ytShort = url.match(/^https?:\/\/youtu\.be\/([\w-]+)/);
  if (ytShort) {
    return `https://www.youtube.com/embed/${ytShort[1]}`;
  }
  const ytWatch = url.match(
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=([\w-]+)/
  );
  if (ytWatch) {
    return `https://www.youtube.com/embed/${ytWatch[2]}`;
  }
  return url;
}

function ProductDetailPage() {
  const { slug } = useParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProductBySlug(slug);
        const data = response?.data?.data || response?.data || response;

        let productImage = null;
        if (data.productImage) {
          try {
            const fileResponse = await getFile(data.productImageId);
            const fileData =
              fileResponse?.data?.data || fileResponse?.data || fileResponse;
            if (fileData && fileData.path) {
              productImage = fileData.path.startsWith("http")
                ? fileData.path
                : API_URL + fileData.path;
            }
          } catch (err) {
            productImage = null;
          }
        }

        let productDetailImages = [];
        if (
          data.productDetailImageIds &&
          data.productDetailImageIds.length > 0
        ) {
          const detailImagePromises = data.productDetailImageIds.map(
            async (imageId) => {
              try {
                const imageResponse = await getFile(imageId);
                const imageData =
                  imageResponse?.data?.data ||
                  imageResponse?.data ||
                  imageResponse;
                if (imageData && imageData.path) {
                  return imageData.path.startsWith("http")
                    ? imageData.path
                    : API_URL + imageData.path;
                }
              } catch (err) {
                return null;
              }
            }
          );
          const detailImages = await Promise.all(detailImagePromises);
          productDetailImages = detailImages.filter(Boolean);
        }

        let bannerImage = data.bannerImageUrl;
        if (bannerImage && !bannerImage.startsWith("http")) {
          bannerImage = API_URL + bannerImage;
        }
        if (!bannerImage) {
          bannerImage = "/assets/images/Group 300.webp";
        }

        let videoUrl = null;
        if (data.videoUrls && data.videoUrls.length > 0) {
          videoUrl = data.videoUrls[0];
        }

        setProductData({
          ...data,
          productImage,
          productDetailImages,
          bannerImage,
          videoUrl,
        });
        document.title = `${data.titles?.[0] || data.name} - Karya Yapı`;
      } catch (error) {
        setError("Ürün verileri yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProductData();
    } else {
      setError("Geçersiz ürün slug'ı.");
      setLoading(false);
    }

    return () => {
      document.title = "Karya Yapı";
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="details-product-detail-loading">
        <div className="details-loading-container">
          <div className="details-loading-spinner"></div>
          <p>Ürün bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="details-product-detail-error">
        <div className="details-error-container">
          <h2>Ürün Bulunamadı</h2>
          <p>{error || "Aradığınız ürün mevcut değil."}</p>
          <button onClick={() => window.history.back()}>Geri Dön</button>
        </div>
      </div>
    );
  }

  return (
    <div className="details-product-detail-page">
      <Banner
        imageSrc={productData.bannerImage}
        title={productData.titles?.[0] || productData.name}
      />
      <ProductInfo productData={productData} />
      {productData.videoUrl ? (
        <div className="details-video-section">
          <div className="details-video-content">
            <div className="details-video-col">
              <h2 className="details-video-title">
                {productData.videoTitles?.[0] || "Ürün Videosu"}
              </h2>
              <hr className="line" />
              {productData.videoDescriptions?.[0] && (
                <p className="details-video-description">
                  {productData.videoDescriptions[0]}
                </p>
              )}
            </div>
            <div className="details-video-col details-video-col-right">
              <iframe
                className="details-video-iframe"
                width="640"
                height="360"
                src={getEmbedUrl(productData.videoUrl)}
                title="Ürün Videosu"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      ) : null}
      <ContactSection />
      <Footer />
    </div>
  );
}

export default ProductDetailPage;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/navbar";
import Banner from "../../components/Banner/Banner";
import ProductInfo from "../../components/ProductInfo/ProductInfo";
import ContactSection from "../../components/ContactSection/ContactSection";
import Footer from "../../components/Footer/Footer";
import RelatedProducts from "../../components/RelatedProducts/RelatedProducts";
import { getProduct } from "../../api";
import "./ProductDetailPage.css";

const BASE_URL = "https://localhost:7103/";

function ProductDetailPage() {
  const { id } = useParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProduct(id);
        const data = response?.data?.data || response?.data || response;
        setProductData(data);
        
        if (data) {
          document.title = `${data.titles?.[0] || data.name} - Karya Yapı`;
        }
      } catch (error) {
        console.error("Ürün verileri alınırken hata oluştu:", error);
        if (error.response?.status === 404) {
          setError("Aradığınız ürün bulunamadı.");
        } else {
          setError("Ürün verileri yüklenirken bir hata oluştu.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    } else {
      setError("Geçersiz ürün ID'si.");
      setLoading(false);
    }

    return () => {
      document.title = "Karya Yapı";
    };
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail-loading">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Ürün bilgileri yükleniyor...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="product-detail-error">
        <Navbar />
        <div className="error-container">
          <h2>Ürün Bulunamadı</h2>
          <p>{error || "Aradığınız ürün mevcut değil."}</p>
          <button onClick={() => window.history.back()}>Geri Dön</button>
        </div>
        <Footer />
      </div>
    );
  }

  const bannerImage = productData.bannerImageUrl || 
    (productData.files && productData.files[0] 
      ? BASE_URL + productData.files[0].path 
      : "/assets/images/Group 300.webp");

  return (
    <div className="product-detail-page">
      <Navbar />
      <Banner
        imageSrc={bannerImage}
        title={productData.titles?.[0] || productData.name}
      />
      <ProductInfo productData={productData} />
      <RelatedProducts 
        currentProductId={productData.id}
        productName={productData.name}
      />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default ProductDetailPage;

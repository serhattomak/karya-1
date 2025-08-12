import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/navbar";
import Banner from "../../components/Banner/Banner";
import ProductInfo from "../../components/ProductInfo/ProductInfo";
import ContactSection from "../../components/ContactSection/ContactSection";
import Footer from "../../components/Footer/Footer";
import RelatedProducts from "../../components/RelatedProducts/RelatedProducts";
import { getProductBySlug, getFile, getDocument } from "../../api";
import "./ProductDetailPage.css";

const BASE_URL = "https://localhost:7103/";

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
        console.log("Fetching product with slug:", slug);

        const response = await getProductBySlug(slug);
        const data = response?.data?.data || response?.data || response;
        console.log("Product data received:", data);
        console.log("Product files:", data?.files);
        console.log("Product productImageId:", data?.productImageId);
        console.log("Product bannerImageUrl:", data?.bannerImageUrl);
        console.log(
          "Product productDetailImageIds:",
          data?.productDetailImageIds
        );
        console.log("Product productImages:", data?.productImages);
        console.log("Product documentImages:", data?.documentImages);
        console.log("Product documentIds:", data?.documentIds);
        console.log("Full product object keys:", Object.keys(data));

        setProductData(data);

        if (
          data &&
          (!data.files || data.files.length === 0) &&
          data.productImageId
        ) {
          try {
            console.log(
              "Files array is empty but productImageId exists, fetching file separately..."
            );
            const fileResponse = await getFile(data.productImageId);
            const fileData =
              fileResponse?.data?.data || fileResponse?.data || fileResponse;
            console.log("Fetched file data:", fileData);

            if (fileData) {
              const updatedData = {
                ...data,
                files: [fileData],
                productImage: fileData,
              };
              console.log(
                "Updated product data with fetched file:",
                updatedData
              );
              setProductData(updatedData);
            }
          } catch (fileError) {
            console.error("Error fetching product image file:", fileError);
          }
        }

        if (
          data &&
          data.productDetailImageIds &&
          data.productDetailImageIds.length > 0
        ) {
          try {
            console.log("Fetching product detail images...");
            const detailImagePromises = data.productDetailImageIds.map(
              async (imageId) => {
                try {
                  const imageResponse = await getFile(imageId);
                  return (
                    imageResponse?.data?.data ||
                    imageResponse?.data ||
                    imageResponse
                  );
                } catch (err) {
                  console.error(`Error fetching detail image ${imageId}:`, err);
                  return null;
                }
              }
            );

            const detailImages = await Promise.all(detailImagePromises);
            const validDetailImages = detailImages.filter(Boolean);

            if (validDetailImages.length > 0) {
              console.log("Fetched detail images:", validDetailImages);
              setProductData((prevData) => ({
                ...prevData,
                productImages: validDetailImages,
                files: [...(prevData.files || []), ...validDetailImages],
              }));
            }
          } catch (detailError) {
            console.error("Error fetching detail images:", detailError);
          }
        }

        // Fetch documents if documentIds exist
        if (data && data.documentIds && data.documentIds.length > 0) {
          try {
            console.log("Fetching product documents...");
            const documentPromises = data.documentIds.map(
              async (documentId) => {
                try {
                  const documentResponse = await getDocument(documentId);
                  return (
                    documentResponse?.data?.data ||
                    documentResponse?.data ||
                    documentResponse
                  );
                } catch (err) {
                  console.error(`Error fetching document ${documentId}:`, err);
                  return null;
                }
              }
            );

            const documents = await Promise.all(documentPromises);
            const validDocuments = documents.filter(Boolean);

            if (validDocuments.length > 0) {
              console.log("Fetched documents:", validDocuments);
              setProductData((prevData) => ({
                ...prevData,
                documents: validDocuments,
              }));
            }
          } catch (documentError) {
            console.error("Error fetching documents:", documentError);
          }
        }

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
        <Navbar />
        <div className="details-loading-container">
          <div className="details-loading-spinner"></div>
          <p>Ürün bilgileri yükleniyor...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="details-product-detail-error">
        <Navbar />
        <div className="details-error-container">
          <h2>Ürün Bulunamadı</h2>
          <p>{error || "Aradığınız ürün mevcut değil."}</p>
          <button onClick={() => window.history.back()}>Geri Dön</button>
        </div>
        <Footer />
      </div>
    );
  }

  const bannerImage = (() => {
    if (productData.bannerImageUrl) {
      return productData.bannerImageUrl.startsWith("http")
        ? productData.bannerImageUrl
        : BASE_URL + productData.bannerImageUrl;
    }
    if (
      productData.files &&
      productData.files[0] &&
      productData.files[0].path
    ) {
      return productData.files[0].path.startsWith("http")
        ? productData.files[0].path
        : BASE_URL + productData.files[0].path;
    }
    return "/assets/images/Group 300.webp";
  })();

  return (
    <div className="details-product-detail-page">
      {/* <Navbar /> */}
      <Banner
        imageSrc={bannerImage}
        title={productData.titles?.[0] || productData.name}
      />
      <ProductInfo productData={productData} />
      {/* <RelatedProducts
        currentProductId={productData.id}
        productName={productData.name}
      /> */}
      <ContactSection />
      <Footer />
    </div>
  );
}

export default ProductDetailPage;

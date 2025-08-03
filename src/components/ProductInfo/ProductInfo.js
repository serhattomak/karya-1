import React from "react";
import Gallery from "../Gallery/Gallery";
import "./ProductInfo.css";

const BASE_URL = "https://localhost:7103/";

const ProductInfo = ({ productData }) => {
  if (!productData) return null;

  const {
    name,
    titles = [],
    subtitles = [],
    descriptions = [],
    listTitles = [],
    listItems = [],
    urls = [],
    files = [],
    productImage = null,
    documentImages: apiDocumentImages = [],
    productImages: apiProductImages = [],
    documentImageIds = [],
    productDetailImageIds = [],
    productImageId = null
  } = productData;

  const mainImage = (() => {
    console.log("ProductInfo - Calculating main image:");
    console.log("- productImage:", productImage);
    console.log("- productImageId:", productImageId);
    console.log("- files:", files);
    console.log("- apiProductImages:", apiProductImages);
    console.log("- All productData keys:", Object.keys(productData));
    
    if (productImage && productImage.path) {
      console.log("Using productImage.path:", productImage.path);
      return productImage.path.startsWith('http') ? productImage.path : BASE_URL + productImage.path;
    }
    
    if (productData.productImage && productData.productImage.path) {
      console.log("Using productData.productImage.path:", productData.productImage.path);
      return productData.productImage.path.startsWith('http') ? productData.productImage.path : BASE_URL + productData.productImage.path;
    }
    
    if (productImageId && files && files.length > 0) {
      const productImageFile = files.find(file => {
        const match = file.id === productImageId || 
                     file.id === String(productImageId) || 
                     String(file.id) === String(productImageId);
        console.log(`Checking file ${file.id} against productImageId ${productImageId}: ${match}`);
        return match;
      });
      console.log("Found productImageFile:", productImageFile);
      
      if (productImageFile && productImageFile.path) {
        const finalUrl = productImageFile.path.startsWith('http') ? productImageFile.path : BASE_URL + productImageFile.path;
        console.log("Using productImageFile:", finalUrl);
        return finalUrl;
      }
    }
    
    if (files && files[0] && files[0].path) {
      console.log("Using first file:", files[0].path);
      return files[0].path.startsWith('http') ? files[0].path : BASE_URL + files[0].path;
    }
    
    if (apiProductImages && apiProductImages.length > 0 && apiProductImages[0].path) {
      console.log("Using first apiProductImage:", apiProductImages[0].path);
      return apiProductImages[0].path.startsWith('http') ? apiProductImages[0].path : BASE_URL + apiProductImages[0].path;
    }
    
    console.log("Using fallback image");
    return "/assets/images/Group 300.webp";
  })();

  const documentImages = (() => {
    if (apiDocumentImages && apiDocumentImages.length > 0) {
      return apiDocumentImages.map(img => ({
        ...img,
        path: img.path.startsWith('http') ? img.path : BASE_URL + img.path
      }));
    }
    if (documentImageIds.length > 0) {
      return documentImageIds.map(imageId => {
        const file = files.find(f => 
          f.id === imageId || 
          f.id === String(imageId) || 
          String(f.id) === String(imageId)
        );
        if (file && file.path) {
          return { 
            ...file, 
            path: file.path.startsWith('http') ? file.path : BASE_URL + file.path 
          };
        }
        return null;
      }).filter(Boolean);
    }
    return [];
  })();

  const productDetailImages = (() => {
    console.log("ProductInfo - Calculating productDetailImages:");
    console.log("- apiProductImages:", apiProductImages);
    console.log("- productDetailImageIds:", productDetailImageIds);
    console.log("- files for detail images:", files);
    
    if (apiProductImages && apiProductImages.length > 0) {
      console.log("Using apiProductImages");
      return apiProductImages.map(img => ({
        src: img.path.startsWith('http') ? img.path : BASE_URL + img.path,
        alt: img.name || name
      }));
    }
    
    if (productDetailImageIds.length > 0) {
      console.log("Using productDetailImageIds to find files");
      const detailImages = productDetailImageIds.map(imageId => {
        const file = files.find(f => 
          f.id === imageId || 
          f.id === String(imageId) || 
          String(f.id) === String(imageId)
        );
        console.log(`Looking for imageId ${imageId}, found file:`, file);
        
        if (file && file.path) {
          return {
            src: file.path.startsWith('http') ? file.path : BASE_URL + file.path,
            alt: file.name || name
          };
        }
        return null;
      }).filter(Boolean);
      
      console.log("Final detailImages from productDetailImageIds:", detailImages);
      return detailImages;
    }
    
    if (files && files.length > 1) {
      console.log("Using fallback: remaining files as detail images");
      const fallbackImages = files.slice(1).map(file => ({
        src: file.path.startsWith('http') ? file.path : BASE_URL + file.path,
        alt: file.name || name
      }));
      console.log("Fallback detail images:", fallbackImages);
      return fallbackImages;
    }
    
    console.log("No detail images found");
    return [];
  })();

  return (
    <div className="product-info-container">
      {/* Ürün Bilgileri ve Ana Görsel - Üst Kısım */}
      <div className="product-info-content">
        <div className="product-info-text">
          {/* Ana başlık */}
          <h2 className="product-info-title">
            {titles[0] || name}
          </h2>
          
          {/* Açıklamalar */}
          {descriptions.map((description, index) => (
            description && (
              <p key={index} className="product-info-description">
                {description}
              </p>
            )
          ))}

          {/* Alt başlık ayrı bölüm olarak */}
          {/* {subtitles[0] && (
            <p className="product-info-details">{subtitles[0]}</p>
          )} */}

          {/* Ek bilgiler */}
          {titles.slice(1).map((title, index) => (
            title && (
              <p key={`info-${index}`} className="product-info-info">
                <strong>{title}:</strong> {descriptions[index + 1] || subtitles[index + 1] || ''}
              </p>
            )
          ))}

          {/* Özellikler Listesi */}
          {listItems.length > 0 && listItems.some(item => item) && (
            <div className="product-info-features">
              {listTitles.length > 0 && listTitles.some(title => title) && (
                <div className="list-titles">
                  {listTitles.map((title, index) => (
                    title && (
                      <h4 key={index} className="product-info-subtitle">{title}</h4>
                    )
                  ))}
                </div>
              )}
              <ul>
                {listItems.map((item, index) => (
                  item && (
                    <li key={index}>{item}</li>
                  )
                ))}
              </ul>
            </div>
          )}

          {/* Dökümanlar - documentImages ile URLs eşleştirilerek */}
          {documentImages.length > 0 && (
            <div className="product-info-documents">
          {documentImages.map((file, index) => {
            const isImage = file.contentType?.startsWith('image/') || 
              file.path?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
            
            const imageSrc = file.path;
            
            const relatedUrl = urls[index];
            const linkHref = relatedUrl || imageSrc;                return (
                  <a
                    key={index}
                    href={linkHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={relatedUrl ? `${file.name || `Document ${index + 1}`} - Dökümana Git` : `${file.name || `Document ${index + 1}`} - Görseli Görüntüle`}
                  >
                    <img
                      src={isImage ? imageSrc : `/assets/images/Documents/doc${index + 1}.png`}
                      alt={file.name || `Document ${index + 1}`}
                      loading="lazy"
                    />
                  </a>
                );
              })}
            </div>
          )}

          {/* İletişim metni - orijinal tasarım gibi */}
          <p className="product-info-contact">
            Daha fazla bilgi için{" "}
            <a href="/contact">
              <span>bizimle iletişime geçin</span>
            </a>
          </p>
        </div>
        
        {/* Ana görsel - sağ tarafta */}
        <div className="product-info-image">
          <div className="main-image">
            <img
              src={mainImage}
              alt={titles[0] || name}
            />
          </div>
        </div>
      </div>
      
      {/* Ürün Detay Görselleri Galerisi - Alt Kısım Ayrı Div */}
      {productDetailImages.length > 0 && (
        <div className="product-detail-gallery-section">
          <Gallery images={productDetailImages} title="Görseller" />
        </div>
      )}
    </div>
  );
};

export default ProductInfo;

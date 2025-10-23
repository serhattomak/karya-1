import React from "react";
import Gallery from "../Gallery/Gallery";
import "./ProductInfo.css";

const BASE_URL = "https://localhost:7103/";

const ProductInfo = ({ productData }) => {
  if (!productData) return null;

  const {
    name,
    titles = [],
    descriptions = [],
    listTitles = [],
    listItems = [],
    documentImages: apiDocumentImages = [],
    productImages: apiProductImages = [],
    productDetailImages = [],
    documents = [],
    urls = [],
    files = [],
    productMainImageId = null,
    productMainImage = null,
  } = productData;
  const documentImageIds = productData.documentImageIds || [];

  const mainImage = (() => {
    console.log("ProductInfo - Calculating main image:");
    console.log("- productImage:", productMainImage);
    console.log("- productImageId:", productMainImageId);
    console.log("- files:", files);
    console.log("- apiProductImages:", apiProductImages);
    console.log("- All productData keys:", Object.keys(productData));

    if (productMainImage && productMainImage.path) {
      console.log("Using productMainImage.path:", productMainImage.path);
      return productMainImage.path.startsWith('http') ? productMainImage.path : BASE_URL + productMainImage.path;
    }

    if (productData.productMainImage && productData.productMainImage.path) {
      console.log("Using productData.productMainImage.path:", productData.productMainImage.path);
      return productData.productMainImage.path.startsWith('http') ? productData.productMainImage.path : BASE_URL + productData.productMainImage.path;
    }

    if (productMainImageId && files && files.length > 0) {
      const productMainImageFile = files.find(file => {
        const match = file.id === productMainImageId || 
                     file.id === String(productMainImageId) || 
                     String(file.id) === String(productMainImageId);
        console.log(`Checking file ${file.id} against productMainImageId ${productMainImageId}: ${match}`);
        return match;
      });
      console.log("Found productMainImageFile:", productMainImageFile);

      if (productMainImageFile && productMainImageFile.path) {
        const finalUrl = productMainImageFile.path.startsWith('http') ? productMainImageFile.path : BASE_URL + productMainImageFile.path;
        console.log("Using productMainImageFile:", finalUrl);
        return finalUrl;
      }
    }
    
    if (files && files[0] && files[0].path) {
      console.log("Using first file:", files[0].path);
      return files[0].path.startsWith('http') ? files[0].path : BASE_URL + files[0].path;
    }
  })();

  const documentImages = (() => {
    console.log("ProductInfo - Calculating documentImages:");
    console.log("- documents:", documents);
    console.log("- apiDocumentImages:", apiDocumentImages);
    console.log("- documentImageIds:", documentImageIds);
    
    if (documents && documents.length > 0) {
      console.log("Using documents array, length:", documents.length);
      const processedDocs = documents.map(doc => {
        console.log("Processing document:", doc);
        
        let imagePath = null;
        
        if (doc.previewImageUrl) {
          imagePath = doc.previewImageUrl.startsWith('http') ? doc.previewImageUrl : BASE_URL + doc.previewImageUrl;
        }
        else if (doc.fileUrl) {
          imagePath = doc.fileUrl.startsWith('http') ? doc.fileUrl : BASE_URL + doc.fileUrl;
        }
        else if (doc.path) {
          imagePath = doc.path.startsWith('http') ? doc.path : BASE_URL + doc.path;
        }
        else if (doc.previewImageFile?.path) {
          imagePath = doc.previewImageFile.path.startsWith('http') ? doc.previewImageFile.path : BASE_URL + doc.previewImageFile.path;
        }
        
        console.log("Document image path:", imagePath);
        
        return {
          ...doc,
          path: imagePath,
          contentType: doc.mimeType || doc.contentType || 'application/pdf',
          name: doc.name,
          url: doc.url || null,
          fileUrl: doc.fileUrl || null
        };
      });
      
      console.log("Processed documents:", processedDocs);
      return processedDocs;
    }
    
    if (apiDocumentImages && apiDocumentImages.length > 0) {
      console.log("Using apiDocumentImages fallback, length:", apiDocumentImages.length);
      return apiDocumentImages.map(img => ({
        ...img,
        path: img.path.startsWith('http') ? img.path : BASE_URL + img.path
      }));
    }
    
    if (documentImageIds.length > 0) {
      console.log("Using documentImageIds fallback, length:", documentImageIds.length);
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
    
    console.log("No documents found, returning empty array");
    return [];
  })();

  return (
    <div className="info-product-container">
      <div className="info-product-row">
        {/* Sol: Başlık, açıklama, dökümanlar */}
        <div className="info-product-col info-product-col-left">
          <h2 className="info-product-title">{titles[0] || name}</h2>
          <hr className="line" />
          {descriptions.map((description, index) => (
            description ? (
              <p key={index} className="info-product-description">
                {description}
              </p>
            ) : null
          ))}

          {/* Dökümanlar - documents array veya documentImages ile URLs eşleştirilerek */}
          {documentImages.length > 0 && (
            <div className="info-product-documents">
          {documentImages.map((file, index) => {
            console.log("Rendering document:", file);
            
            const isImage = file.contentType?.startsWith('image/') || 
              file.path?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
            
            const imageSrc = file.path;
            
            const relatedUrl = file.url || file.fileUrl || urls[index];
            const linkHref = relatedUrl || imageSrc;
            
            const documentTitle = file.name || `Document ${index + 1}`;
            const linkTitle = relatedUrl ? `${documentTitle} - Dökümana Git` : `${documentTitle} - Görseli Görüntüle`;
            
            console.log("Document URL info:", {
              name: documentTitle,
              url: file.url,
              fileUrl: file.fileUrl,
              relatedUrl: relatedUrl,
              linkHref: linkHref
            });
            
            const fallbackImage = `/assets/images/Documents/doc${(index % 4) + 1}.png`;
                
                return (
                  <a
                    key={file.id || index}
                    href={linkHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={linkTitle}
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      cursor: 'pointer'
                    }}
                  >
                    {imageSrc ? (
                      <img
                        src={isImage ? imageSrc : fallbackImage}
                        alt={documentTitle}
                        loading="lazy"
                        onError={(e) => {
                          console.log("Image load error, using fallback");
                          e.target.src = fallbackImage;
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100px',
                        height: '100px',
                        background: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '48px'
                      }}>
                        📄
                      </div>
                    )}
                    {/* Harici link varsa görsel ipucu ekle */}
                    {relatedUrl && (
                      <span style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px'
                      }}>
                        🔗
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          )}

          {/* İletişim metni: showContact true ise göster */}
          {productData.showContact && (
            <p className="info-product-contact">
              {productData.name} hakkında daha fazla bilgi almak için {" "}
              <a href="/contact">
                <span>bize ulaşın!</span>
              </a>
            </p>
          )}
        </div>
        {/* Sağ: ListItem varsa uygulama alanları, yoksa mainImage */}
        <div className="info-product-col info-product-col-right">
          {listItems.length > 0 ? (
            <div className="info-product-list">
              {listTitles.length > 0 && <h2 className="p-title">{listTitles[0]}</h2>}
              <hr className="line" />
              <ul>
                {listItems.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ) : (
            !!mainImage && (
              <div className="info-product-main-image">
                <img
                  src={mainImage}
                  alt={titles[0] || name}
                  loading="lazy"
                />
              </div>
            )
          )}
        </div>
      </div>
      {/* Galeri */}
      {productDetailImages.length > 0 && (
        productDetailImages.length > 4 ? (
          <div className="info-product-detail-gallery-section">
            <h2 className="p-title">Görseller</h2>
            <hr className="line" />
            <div className="info-product-gallery-images">
              {productDetailImages.map((imgSrc, idx) => (
                <img
                  key={idx}
                  src={imgSrc}
                  alt={`Detay Görsel ${idx + 1}`}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        ) : (
          <Gallery images={productDetailImages} title="Görseller" />
        )
      )}
    </div>
  );
};

export default ProductInfo;

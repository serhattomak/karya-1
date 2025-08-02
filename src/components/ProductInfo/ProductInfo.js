import React from "react";
import "./ProductInfo.css";

const BASE_URL = "https://localhost:7103/";

const ProductInfo = ({ productData }) => {
  if (!productData) return null;

  const {
    name,
    titles = [],
    subtitles = [],
    descriptions = [],
    listItems = [],
    urls = [],
    files = []
  } = productData;

  // Ana görsel için ilk dosyayı kullan
  const mainImage = files && files[0] 
    ? BASE_URL + files[0].path 
    : "/assets/images/Group 300.webp";

  return (
    <div className="product-info-container">
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
          {subtitles[0] && (
            <p className="product-info-details">{subtitles[0]}</p>
          )}

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
              <h4>Özellikler:</h4>
              <ul>
                {listItems.map((item, index) => (
                  item && (
                    <li key={index}>{item}</li>
                  )
                ))}
              </ul>
            </div>
          )}

          {/* Dökümanlar - İkinci dosyadan itibaren (orijinal tasarım gibi) */}
          {files.length > 1 && (
            <div className="product-info-documents">
              {files.slice(1).map((file, index) => {
                const isImage = file.contentType?.startsWith('image/') || 
                  file.path?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                
                return (
                  <a
                    key={index}
                    href={BASE_URL + file.path}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={isImage ? BASE_URL + file.path : `/assets/images/Documents/doc${index + 1}.png`}
                      alt={file.name || `Document ${index + 1}`}
                      loading="lazy"
                    />
                  </a>
                );
              })}
            </div>
          )}

          {/* URL'ler - mavi butonlar şeklinde */}
          {urls.length > 0 && urls.some(url => url) && (
            <div className="product-info-links">
              {urls.map((url, index) => (
                url && (
                  <a 
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="product-link"
                  >
                    Daha Fazla Bilgi
                  </a>
                )
              ))}
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
          <img
            src={mainImage}
            alt={titles[0] || name}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;

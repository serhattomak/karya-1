import React from "react";
import "./AboutUsInfo.css";

const AboutUsInfo = ({ titles, subtitles, descriptions, image }) => {
  return (
    <div className="info-container">
      <div className="info-content">
        <div className="info-image-container">
          <div className="info-image">
            <img src={image || "/assets/images/hk.jpeg"} alt="Hakkımızda" loading="lazy" />
          </div>
        </div>
        <div className="info-text">
          {titles && titles.length > 0 ? (
            titles.map((title, index) => (
              <p key={`title-${index}`} className="about-title" style={{ marginBottom: '12px' }}>{title}</p>
            ))
          ) : (
            <p className="about-title" style={{ marginBottom: '12px' }}>Karya Yapı</p>
          )}
          
          <hr className="line"></hr>
          <br />
          
          {subtitles && subtitles.length > 0 ? (
            subtitles.map((subtitle, index) => (
              <p key={`subtitle-${index}`} className="about-subtitle" style={{ marginBottom: '16px' }}>{subtitle}</p>
            ))
          ) : (
            <p className="about-subtitle" style={{ marginBottom: '16px' }}>Şirket Profili</p>
          )}
          
          {descriptions && descriptions.length > 0 ? (
            descriptions.map((description, index) => (
              <p key={`description-${index}`} style={{ marginBottom: '16px', lineHeight: '1.6' }}>{description}</p>
            ))
          ) : (
            <p style={{ marginBottom: '16px', lineHeight: '1.6' }}>Şirket bilgileri yükleniyor...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutUsInfo;

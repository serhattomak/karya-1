import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AboutUsInfo.css";

const AboutUsInfo = () => {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5001/api/about")
      .then(response => {
        setAboutData(response.data);
      })
      .catch(error => console.error("Veri çekme hatası: ", error));
  }, []);

  return (
    <div className="info-container">
      {aboutData && (
        <div className="info-content">
          <div className="info-image-container">
            <div className="info-image">
              <img src={aboutData.image || "/assets/images/hk.jpeg"} alt="Hakkımızda" loading="lazy" />
            </div>
          </div>
          <div className="info-text">
            <p className="about-title">{aboutData.title}</p>
            <hr className="line"></hr>
            <p className="about-subtitle">{aboutData.subtitle}</p>
            <p>{aboutData.content}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUsInfo;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AsilNunXInfo.css";

const AsilNunXInfo = () => {
  const [asilNunXData, setAsilNunXData] = useState({
    title: "",
    description: "",
    details: "",
    info: "",
    documents: [],
    image: "",
    text: "",
    linkText: "",
    link: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsilNunXData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/asilnunx");
        console.log("API'den alınan veri:", response.data);
        setAsilNunXData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Veri alınırken hata oluştu: ", error);
        setLoading(false);
      }
    };

    fetchAsilNunXData();
  }, []);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  console.log("asilNunXData:", asilNunXData);

  return (
    <div className="asil-nun-x-container">
      <div className="asil-nun-x-content">
        <div className="asil-nun-x-text">
          <h2 className="asil-nun-x-title">{asilNunXData.title}</h2>
          <p className="asil-nun-x-description">{asilNunXData.description}</p>
          <p className="asil-nun-x-details">{asilNunXData.details}</p>
          <p className="asil-nun-x-info">{asilNunXData.info}</p>
          <div className="asil-nun-x-documents">
            {asilNunXData.documents.map((doc, index) => (
              <a
                key={index}
                href={doc}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`/assets/images/Documents/doc${index + 1}.png`}
                  alt={`Document ${index + 1}`}
                  loading="lazy"
                />
              </a>
            ))}
          </div>
          <p className="asil-nun-x-contact">
            {asilNunXData.text || ""}{" "}
            <a href={asilNunXData.link}>
              <span>{asilNunXData.linkText || ""}</span>
            </a>
          </p>
        </div>
        <div className="asil-nun-x-image">
          <img
            src={asilNunXData.image || "/assets/images/Group 300.webp"}
            alt="Asil Nun X Main"
          />
        </div>
      </div>
    </div>
  );
};

export default AsilNunXInfo;

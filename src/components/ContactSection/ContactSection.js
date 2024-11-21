import React from "react";
import "./ContactSection.css";
import { Link } from "react-router-dom";

const ContactSection = () => {
  return (
    <div className="info-banner">
      <div className="info-banner-content">
        <p>
          Ürün hakkında daha fazla bilgi almak için bizimle iletişime geçin!
        </p>
        <Link to="/contact">
          <button className="info-banner-button">Bilgi Al</button>
        </Link>
      </div>
    </div>
  );
};

export default ContactSection;

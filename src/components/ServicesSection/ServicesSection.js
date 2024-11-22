import React from "react";
import ServiceList from "../ServiceList/ServiceList";
import ImageGallery from "../ImageGallery/ImageGallery";
import "./ServicesSection.css";

const ServicesSection = () => {
  return (
    <div className="services-section">
      <div className="service-content">
      <ServiceList />
      <ImageGallery />
    </div>
    </div>
  );
};

export default ServicesSection;

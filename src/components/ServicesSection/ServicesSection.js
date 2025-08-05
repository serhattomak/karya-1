import React from "react";
import ServiceList from "../ServiceList/ServiceList";
import ImageGallery from "../ImageGallery/ImageGallery";
import "./ServicesSection.css";

const ServicesSection = ({ serviceTitle, listItems, galleryImages }) => {
  console.log("ServicesSection props:", { serviceTitle, listItems, galleryImages });
  
  return (
    <div className="services-section">
      <div className="service-content">
        <ServiceList serviceTitle={serviceTitle} listItems={listItems} />
        <ImageGallery galleryImages={galleryImages} />
      </div>
    </div>
  );
};

export default ServicesSection;

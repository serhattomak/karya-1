import React from "react";
import Navbar from "../../components/Navbar/navbar";
import Banner from "../../components/Banner/Banner";
import AboutUsInfo from "../../components/AboutUsInfo/Aboutusinfo";
import ServiceSection from "../../components/ServicesSection/ServicesSection"; // ServiceSection bileşenini içe aktarın

function AboutPage() {
  return (
    <div>
      <Navbar />
      <Banner />
      <AboutUsInfo />
      <ServiceSection /> 
    </div>
  );
}

export default AboutPage;

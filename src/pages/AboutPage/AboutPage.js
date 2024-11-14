import React from "react";
import Navbar from "../../components/Navbar/navbar";
import Banner from "../../components/Banner/Banner";
import AboutUsInfo from "../../components/AboutUsInfo/Aboutusinfo";
import ServiceSection from "../../components/ServicesSection/ServicesSection"; // ServiceSection bileşenini içe aktarın
import PartnersSlider from "../../components/PartnersSlider/PartnersSlider";
import Footer from "../../components/Footer/Footer";

function AboutPage() {
  return (
    <div>
      <Navbar />
      <Banner />
      <AboutUsInfo />
      <ServiceSection />
      <PartnersSlider></PartnersSlider>
      <br></br>
      <Footer></Footer>
    </div>
  );
}

export default AboutPage;

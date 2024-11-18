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
      <Banner
        imageSrc="/assets/images/aboutbanner.png"
        title="Hakkımızda"
      />{" "}
      <br></br>
      <AboutUsInfo />
      <br></br>
      <ServiceSection />
      <br></br>
      <PartnersSlider></PartnersSlider>
      <br></br>
      <Footer></Footer>
    </div>
  );
}

export default AboutPage;

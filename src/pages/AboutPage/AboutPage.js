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
      {/* Resim ve başlık props olarak geçiliyor */}
      <AboutUsInfo />
      <ServiceSection />
      <PartnersSlider></PartnersSlider>
      <br></br>
      <Footer></Footer>
    </div>
  );
}

export default AboutPage;

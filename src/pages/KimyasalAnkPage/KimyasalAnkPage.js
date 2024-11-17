// ServicesPage.js
import React from "react";
import Navbar from "../../components/Navbar/navbar";
import Banner from "../../components/Banner/Banner";
import KimyasalAnkrajInfo from "../../components/KimyasalAnkrajInfo/KimyasalAnkrajInfo";
import Gallery from "../../components/Gallery/Gallery";
import ContactSection from "../../components/ContactSection/ContactSection";
import Footer from "../../components/Footer/Footer";

function KimyasalAnkraj() {
  return (
    <div>
      <Navbar />
      <Banner
        imageSrc="/assets/images/kimankbanner.png"
        title="Kimyasal Ankraj Filiz Ekim"
      />
      <br />
      <KimyasalAnkrajInfo></KimyasalAnkrajInfo>
      <Gallery></Gallery>
      <ContactSection></ContactSection>
      <br></br>
      <Footer />
    </div>
  );
}

export default KimyasalAnkraj;

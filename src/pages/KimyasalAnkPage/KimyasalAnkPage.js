// KimyasalAnkraj.js
import React from "react";
import Navbar from "../../components/Navbar/navbar";
import Banner from "../../components/Banner/Banner";
import KimyasalAnkrajInfo from "../../components/KimyasalAnkrajInfo/KimyasalAnkrajInfo";
import Gallery from "../../components/Gallery/Gallery";
import ContactSection from "../../components/ContactSection/ContactSection";
import Footer from "../../components/Footer/Footer";

function KimyasalAnkraj() {
  const kimyasalAnkrajImages = [
    { src: "/assets/images/Rectangle 39-2.png", alt: "Kimyasal Ankraj 1" },
    { src: "/assets/images/Rectangle 40-2.png", alt: "Kimyasal Ankraj 2" },
    { src: "/assets/images/Rectangle 41-2.png", alt: "Kimyasal Ankraj 3" },
    { src: "/assets/images/Rectangle 42-2.png", alt: "Kimyasal Ankraj 4" },
  ];

  return (
    <div>
      <Banner
        imageSrc="/assets/images/kbanner.jpg"
        title="Kimyasal Ankraj Filiz Ekim"
      />
      <br />
      <KimyasalAnkrajInfo />
      <Gallery
        images={kimyasalAnkrajImages}
        title="Uygulama Alanlarına ait Görseller"
      />
      <ContactSection />
      <br />
      <Footer />
    </div>
  );
}

export default KimyasalAnkraj;

import React from "react";
import Navbar from "../../components/Navbar/navbar";
import Banner from "../../components/Banner/Banner";
import AsilNunXInfo from "../../components/AsilNunXInfo/AsilNunXInfo";
import Gallery from "../../components/Gallery/Gallery";
import ContactSection from "../../components/ContactSection/ContactSection";
import Footer from "../../components/Footer/Footer";

function AsilNunX() {
  const asilNunXImages = [
    { src: "/assets/images/Rectangle 39.png", alt: "Asil Nun X 1" },
    { src: "/assets/images/Rectangle 40.png ", alt: "Asil Nun X 2" },
    { src: "/assets/images/Rectangle 41.png ", alt: "Asil Nun X 3" },
    { src: "/assets/images/Rectangle 42.png ", alt: "Asil Nun X 4" },
  ];

  return (
    <div>
      <Banner imageSrc="/assets/images/Asilnunxbanner.png" title="Asil Nun X" />
      <br />
      <AsilNunXInfo />
      <Gallery images={asilNunXImages} title="Görseller" />
      <ContactSection />
      <br />
      <Footer />
    </div>
  );
}

export default AsilNunX;

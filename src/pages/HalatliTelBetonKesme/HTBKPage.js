// ServicesPage.js
import React from "react";
import Navbar from "../../components/Navbar/navbar";
import Banner from "../../components/Banner/Banner";
import HtbkInfo from "../../components/HtbkInfo/HtbkInfo";
import Gallery from "../../components/Gallery/Gallery";
import ContactSection from "../../components/ContactSection/ContactSection";
import Footer from "../../components/Footer/Footer";

function HalatliTelBetonKesme() {
  return (
    <div>
      <Navbar />
      <Banner
        imageSrc="/assets/images/htbkbanner.png"
        title="Halatlı Tel Beton Kesme"
      />
      <br />
      <HtbkInfo></HtbkInfo>
      <Gallery></Gallery>
      <ContactSection></ContactSection>
      <br></br>
      <Footer />
    </div>
  );
}

export default HalatliTelBetonKesme;

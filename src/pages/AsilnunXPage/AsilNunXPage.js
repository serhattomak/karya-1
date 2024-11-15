// ServicesPage.js
import React from "react";
import Navbar from "../../components/Navbar/navbar";
import Banner from "../../components/Banner/Banner";
import AsilNunXInfo from "../../components/AsilNunXInfo/AsilNunXInfo";
import Gallery from "../../components/Gallery/Gallery";
import Footer from "../../components/Footer/Footer";

function ServicesPage() {
  return (
    <div>
      <Navbar />
      <Banner imageSrc="/assets/images/Asilnunxbanner.png" title="Asil Nun X" />
      <br />
      <AsilNunXInfo></AsilNunXInfo>
      <Gallery></Gallery>
      <Footer />
    </div>
  );
}

export default ServicesPage;

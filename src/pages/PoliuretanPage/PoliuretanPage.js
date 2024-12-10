import React from "react";
import Navbar from "../../components/Navbar/navbar";
import Banner from "../../components/Banner/Banner";
import PoliuretanInfo from "../../components/PoliuretanInfo/PoliuretanInfo";
import PolGallery from "../../components/PolGallery/PolGallery";
import PolDetails from "../../components/PolDetails/PolDetails";
import ContactSection from "../../components/ContactSection/ContactSection";
import Footer from "../../components/Footer/Footer";

function PoliuretanPage() {
  const images = [
    { src: "/assets/images/1.webp", alt: "Görsel 1" },
    { src: "/assets/images/2.webp", alt: "Görsel 2" },
    { src: "/assets/images/3 (1).webp", alt: "Görsel 3" },
    { src: "/assets/images/4.webp", alt: "Görsel 4" },
    { src: "/assets/images/5.webp", alt: "Görsel 5" },
    { src: "/assets/images/6.webp", alt: "Görsel 6" },
    { src: "/assets/images/7.webp", alt: "Görsel 7" },
    { src: "/assets/images/poliüretan3.webp", alt: "Görsel 8" },
  ];

  return (
    <div>
      <Banner
        imageSrc="/assets/images/poliüretanbanner.webp"
        title="Poliuretan Enjeksiyon"
      />
      <PoliuretanInfo />
      <PolGallery title="Uygulama Alanlarına Ait Görseller" images={images} />
      <PolDetails
        title="Poliüretan Enjeksiyon Detayları"
        description="Türkiye’de bir ilk. Yeni nesil, yarı esnek, CE Belgeli AŞIL NUNX. 
      Uygulama detaylarını videodan izleyebilirsiniz."
        videoSrc="path/to/your/image.png"
        videoAlt="Poliüretan Enjeksiyon Videosu"
      />
      <ContactSection />
      <br />
      <Footer />
    </div>
  );
}

export default PoliuretanPage;

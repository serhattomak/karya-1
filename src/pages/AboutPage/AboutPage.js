import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/navbar";
import Banner from "../../components/Banner/Banner";
import AboutUsInfo from "../../components/AboutUsInfo/Aboutusinfo";
import ServiceSection from "../../components/ServicesSection/ServicesSection"; 
import PartnersSlider from "../../components/PartnersSlider/PartnersSlider";
import Footer from "../../components/Footer/Footer";
import { getPageByName } from "../../api";

const BASE_URL = "https://localhost:7103/";

function AboutPage() {
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPageByName("Hakkımızda");
        console.log("AboutPage API Response:", response);
        
        const data = response?.data?.data || response?.data || response;
        console.log("AboutPage Parsed Data:", data);
        
        setPageData(data);
      } catch (error) {
        console.error("Sayfa verisi çekme hatası:", error);
        setPageData(null);
      }
    };
    fetchData();
  }, []);

  if (!pageData) return <div>Yükleniyor...</div>;

  let galleryImages = [];
  if (pageData.files && Array.isArray(pageData.files)) {
    galleryImages = pageData.files
      .map(f => f.path ? BASE_URL + f.path : "")
      .filter(Boolean);
    if (galleryImages.length > 4) {
      galleryImages = galleryImages.slice(0, 4);
    }
  }

  let mainImageUrl = "/assets/images/hk.jpeg";
  if (pageData.mainImage && pageData.mainImage.path) {
    mainImageUrl = BASE_URL + pageData.mainImage.path;
  }
  return (
    <div>
      <Banner imageSrc={pageData.bannerImageUrl || "/assets/images/aboutbanner.webp"} title={pageData.name || "Hakkımızda"} />
      <br></br>
      <AboutUsInfo 
        titles={pageData.titles ? [pageData.titles[0]] : []}
        subtitles={pageData.subtitles}
        descriptions={pageData.descriptions}
        image={mainImageUrl}
        mainImageId={pageData.mainImageId}
      />
      <br></br>
      <ServiceSection 
        serviceTitle={pageData.listTitles?.[0] || "Hizmetlerimiz"}
        listItems={pageData.listItems || []}
        galleryImages={galleryImages}
      />
      <br></br>
      <PartnersSlider></PartnersSlider>
      <br></br>
      <Footer></Footer>
    </div>
  );
}

export default AboutPage;

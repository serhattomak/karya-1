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
        const data = response?.data?.data || response?.data || response;
        setPageData(data);
      } catch (error) {
        console.error("Sayfa verisi çekme hatası:", error);
        setPageData(null);
      }
    };
    fetchData();
  }, []);

  if (!pageData) return <div>Yükleniyor...</div>;

  const galleryImages = (pageData.files || []).map(f => f.path ? BASE_URL + f.path : "");

  return (
    <div>
      <Banner imageSrc={pageData.bannerImageUrl || "/assets/images/aboutbanner.webp"} title={pageData.name || "Hakkımızda"} />
      <br></br>
      <AboutUsInfo 
        titles={pageData.titles ? [pageData.titles[0]] : []}
        subtitles={pageData.subtitles}
        descriptions={pageData.descriptions}
        image={pageData.files?.[0]?.path ? BASE_URL + pageData.files[0].path : "/assets/images/hk.jpeg"}
      />
      <br></br>
      <ServiceSection 
        serviceTitle={pageData.titles?.[1]}
        listItems={pageData.listItems}
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

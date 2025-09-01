import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Home from "../../pages/Home/Home";
import AsilNunX from "../../pages/AsilNunX/AsilNunX";
import AboutUs from "../../pages/AboutUs/AboutUs";
import KimyasalAnkraj from "../../pages/KimyasalAnkraj/KimyasalAnkraj";
import TelBeton from "../../pages/TelBeton/TelBeton";
import ContactPage from "../../pages/ContactPage/ContactPage";
import Poliuretan from "../../pages/PoliuretanEnjeksiyon/PoliuretanEnjeksiyon";
import Products from "../../pages/Products/Products";
import Documents from "../../pages/Documents/Documents";
import "./AdminLayout.css";

const AdminLayout = ({ setIsAuthenticated }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="admin-layout">
      <Sidebar setIsAuthenticated={setIsAuthenticated} />
      <div className={`content-area ${isMobile ? 'mobile' : 'desktop'}`}>
        <Routes>
          <Route path="home" element={<Home />} />
          <Route path="aboutus" element={<AboutUs />} />
          <Route path="asilnunx" element={<AsilNunX />} />
          <Route path="kimyasalankraj" element={<KimyasalAnkraj />} />
          <Route path="telbeton" element={<TelBeton />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="Poliuretan" element={<Poliuretan />} />
          <Route path="products" element={<Products />} />
          <Route path="documents" element={<Documents />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminLayout;

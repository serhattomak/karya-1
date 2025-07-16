import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import logo from "./KaryaLogo.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Logo" className="sidebar-logo" />
          <h4 className="font-bold text-lg  leading-7">Admin Panel</h4>
        </div>
        <nav>
          <NavLink to="home">Anasayfa</NavLink>
          <NavLink to="AboutUs">Hakkımızda</NavLink>
          {/* <NavLink to="asilnunx">Aşil Nun X</NavLink>
          <NavLink to="Poliuretan">Poliüretan Enjeksiyon</NavLink>
          <NavLink to="telbeton">Halatlı Tel -Beton Kesme</NavLink>
          <NavLink to="kimyasalankraj">Kimyasal Ankraj Filiz Ekim</NavLink> */}
          <NavLink to="Contact">İletişim</NavLink>
        </nav>
      </div>
      <button className="menu-toggle" onClick={toggleSidebar}>
        {isOpen ? "✕" : "☰"}
      </button>
    </>
  );
};

export default Sidebar;

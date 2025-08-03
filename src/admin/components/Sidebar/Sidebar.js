import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import "./Sidebar.css";
import logo from "./KaryaLogo.png";

const Sidebar = ({ setIsAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Çıkış Yap',
      text: 'Çıkış yapmak istediğinizden emin misiniz?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Evet, Çıkış Yap',
      cancelButtonText: 'İptal'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        
        setIsAuthenticated(false);
        
        navigate("/");
        
        Swal.fire({
          title: 'Çıkış Yapıldı!',
          text: 'Başarıyla çıkış yaptınız.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
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
          <NavLink to="products">Ürünler</NavLink>
          {/* <NavLink to="asilnunx">Aşil Nun X</NavLink>
          <NavLink to="Poliuretan">Poliüretan Enjeksiyon</NavLink>
          <NavLink to="telbeton">Halatlı Tel -Beton Kesme</NavLink>
          <NavLink to="kimyasalankraj">Kimyasal Ankraj Filiz Ekim</NavLink> */}
          <NavLink to="Contact">İletişim</NavLink>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            🚪 Çıkış Yap
          </button>
        </div>
      </div>
      <button className="menu-toggle" onClick={toggleSidebar}>
        {isOpen ? "✕" : "☰"}
      </button>
    </>
  );
};

export default Sidebar;

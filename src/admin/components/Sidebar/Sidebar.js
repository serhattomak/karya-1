import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import "./Sidebar.css";
import logo from "./KaryaLogo.png";

const Sidebar = ({ setIsAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
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
      const mobile = window.innerWidth < 992; // Breakpoint'i biraz daha büyük yaptık
      setIsMobile(mobile);
      
      if (!mobile) {
        setIsOpen(true); // Desktop'ta her zaman açık
      } else {
        setIsOpen(false); // Mobile'da başlangıçta kapalı
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mobile'da sidebar açıkken backdrop'a tıklanırsa kapat
  const handleBackdropClick = (e) => {
    if (isMobile && isOpen && e.target.classList.contains('sidebar-backdrop')) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className={`menu-toggle ${isOpen ? 'active' : ''}`} 
        onClick={toggleSidebar}
        aria-label="Toggle Menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Backdrop for mobile */}
      {isMobile && isOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={handleBackdropClick}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""} ${isMobile ? "mobile" : "desktop"}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Karya Logo" className="sidebar-logo" />
          <div className="sidebar-brand">
            <h4>Karya Yapı</h4>
            <span className="brand-subtitle">Admin Panel</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="home" onClick={closeSidebar} className="nav-item">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span className="nav-text">Anasayfa</span>
          </NavLink>
          
          <NavLink to="AboutUs" onClick={closeSidebar} className="nav-item">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="nav-text">Hakkımızda</span>
          </NavLink>
          
          <NavLink to="products" onClick={closeSidebar} className="nav-item">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            <span className="nav-text">Ürünler</span>
          </NavLink>
          
          <NavLink to="documents" onClick={closeSidebar} className="nav-item">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
            <span className="nav-text">Dosyalar</span>
          </NavLink>
          
          <NavLink to="Contact" onClick={closeSidebar} className="nav-item">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4M20,8L12,13L4,8V6L12,11L20,6V8Z"/>
            </svg>
            <span className="nav-text">İletişim</span>
          </NavLink>
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <svg className="logout-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

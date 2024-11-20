import React, { useState, useEffect, useRef } from "react";
import "./navbar.css";
import { IoClose, IoMail } from "react-icons/io5";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null); // Menüye referans oluşturuyoruz.

  const toggleMenu = (event) => {
    event.stopPropagation(); // Menü açma sırasında tıklamayı durdur
    setMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    // Menü dışına tıklamayı dinleyen event
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        // Eğer tıklanan alan menü değilse menüyü kapat
        closeMenu();
      }
    };

    // Event listener ekle
    document.addEventListener("click", handleOutsideClick);

    return () => {
      // Component unmount olduğunda listener'ı kaldır
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <nav className="nav">
      <div className="container">
        <div className="logo">
          <img src="/assets/images/KaryaLogo.png" alt="Logo" />
        </div>
        {/* Desktop Menüsü */}
        <div className="main_list desktop">
          <ul className="navlinks">
            <li>
              <Link to="/">Anasayfa</Link>
            </li>
            <li>
              <Link to="/about">Karya Yapı Hakkında</Link>
            </li>
            <li className="contact-button">
              <Link to="/contact" className="contact-word">
                İletişim
                <IoMail className="contact-icon" />
              </Link>
            </li>
          </ul>
        </div>
        {/* Mobil Menü */}
        <div
          id="mainListDiv"
          ref={menuRef} // Menü elementine referans atandı
          className={`main_list mobile ${isMenuOpen ? "show_list" : ""}`}
          onClick={(e) => e.stopPropagation()} // Menü içi tıklamaları durdur
        >
          <span className="navClose" onClick={closeMenu}>
            <IoClose />
          </span>
          <ul className="navlinks">
            <li>
              <Link to="/" onClick={closeMenu}>
                Anasayfa
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={closeMenu}>
                Karya Yapı Hakkında
              </Link>
            </li>
            <li className="contact-button">
              <Link to="/contact" onClick={closeMenu}>
                İletişim
              </Link>
              <IoMail className="contact-icon" />
            </li>
            <li>
              <a href="#" onClick={closeMenu}>
                Bizi Sosyal Medyada Takip Et!
              </a>
            </li>
          </ul>
        </div>
        {/* Hamburger Menü */}
        <span className="navTrigger" onClick={toggleMenu}>  
          <i></i>
          <i></i>
          <i></i>
        </span>
      </div>
    </nav>
  );
};

export default Navbar;

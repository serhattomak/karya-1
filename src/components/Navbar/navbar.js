import React, { useState, useEffect, useRef } from "react";
import "./navbar.css";
import { IoClose, IoMail, IoLogoInstagram } from "react-icons/io5"; // Instagram ikonu eklendi
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = (event) => {
    event.stopPropagation();
    setMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <nav className="nav">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src="/assets/images/KaryaLogo.png" alt="Logo" loading="lazy" />
          </Link>
        </div>
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
        <div
          id="mainListDiv"
          ref={menuRef}
          className={`main_list mobile ${isMenuOpen ? "show_list" : ""}`}
          onClick={(e) => e.stopPropagation()}
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
              <Link to="/contact" className="contact-word" onClick={closeMenu}>
                İletişim
                <IoMail className="contact-icon" />
              </Link>
            </li>

            <li className="social-media">
              <a href="">
                Bizi Sosyal Medyada <br></br>Takip Et!
              </a>
              <a
                href="https://www.instagram.com/karyayapi?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
              >
                <IoLogoInstagram className="instagram-icon" />
              </a>
            </li>
          </ul>
        </div>
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

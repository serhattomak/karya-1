import React, { useState } from "react";
import "./navbar.css";
import { IoClose, IoMail } from "react-icons/io5";

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="nav">
      <div className="container">
        <div className="logo">
          {/* Public klasöründen resme erişim */}
          <img src="/assets/images/KaryaLogo.png" alt="Logo" />
        </div>
        {/* Desktop Menüsü */}
        <div className="main_list desktop">
          <ul className="navlinks">
            <li>
              <a href="#">Anasayfa</a>
            </li>
            <li>
              <a href="#">Karya Yapı Hakkında</a>
            </li>
            <li className="contact-button">
              <a href="#" className="contact-word">
                İletişim
                <IoMail className="contact-icon" />
              </a>
            </li>
          </ul>
        </div>
        {/* Mobil Menüsü */}
        <div
          id="mainListDiv"
          className={`main_list mobile ${isMenuOpen ? "show_list" : ""}`}
        >
          <span className="navClose" onClick={toggleMenu}>
            <IoClose />
          </span>
          <ul className="navlinks">
            <li>
              <a href="#">Anasayfa</a>
            </li>

            <li>
              <a href="#">Karya Yapı Hakkında</a>
            </li>

            <li className="contact-button">
              <a href="#">İletişim</a>
              <IoMail className="contact-icon" />
            </li>

            <li>
              <a href="#">Bizi Sosyal Medyada Takip Et!</a>
            </li>
          </ul>
        </div>
        {/* Menü Butonu */}
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

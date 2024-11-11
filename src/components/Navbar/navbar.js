import React, { useState } from "react";
import "./navbar.css";
import { IoClose, IoMail } from "react-icons/io5";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="nav">
      <div className="container">
        <div className="logo">
          <img src="/assets/images/KaryaLogo.png" alt="Logo" />
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
          className={`main_list mobile ${isMenuOpen ? "show_list" : ""}`}
        >
          <span className="navClose" onClick={toggleMenu}>
            <IoClose />
          </span>
          <ul className="navlinks">
            <li>
              <Link to="/">Anasayfa</Link>
            </li>
            <li>
              <Link to="/about">Karya Yapı Hakkında</Link>
            </li>
            <li className="contact-button">
              <Link to="/contact">İletişim</Link>
              <IoMail className="contact-icon" />
            </li>
            <li>
              <a href="#">Bizi Sosyal Medyada Takip Et!</a>
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

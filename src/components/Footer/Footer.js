import React from "react";
import "./Footer.css";
import { FaInstagram } from "react-icons/fa"; // Instagram ikonu

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <img
            src="/assets/images/whitelogo.png"
            alt="Karya Logo"
            className="footer-logo"
            loading="lazy"
          />
        </div>
        <div className="footer-center">
          <ul className="footer-links">
            <li>
              <a href="/">Anasayfa</a>
            </li>
            <li>
              <a href="/about">Karya Yapı Hakkında</a>
            </li>
          </ul>
          <ul className="footer-links">
            <li>
              <a href="/AsilNunX">AŞİL NUN X</a>
            </li>
            <li>
              <a href="/PoliuretanEnjeksiyon">Poliüretan Enjeksiyon</a>
            </li>
          </ul>
          <ul className="footer-links">
            <li>
              <a href="/HalatliTelBetonKesme">Halatlı Tel- Beton Kesme</a>
            </li>
            <li>
              <a href="/KimyasalAnkraj">Kimyasal Ankraj Filiz Ekim</a>
            </li>
          </ul>
        </div>
        <div className="footer-right">
          <p>Bizi Sosyal Medyada Takip Et!</p>
          <a
            href="https://www.instagram.com/karyayapi?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="social-icon" />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>www.karyayapi.com © 2007 - 2024 Karya Yapı San. Tic. Ltd. Şti.</p>
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";
import emailjs from "emailjs-com";
import "./ContactForm.css";
// React Icons'tan gerekli ikonları import edin
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaInstagram,
} from "react-icons/fa";

const ContactForm = () => {
  // Form gönderim işlemi
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_ryy5urc", // EmailJS'den aldığınız Service ID
        "template_xgg8bns", // EmailJS'den aldığınız Template ID
        e.target,
        "0kX-HdVgnL6ZzjCJU" // EmailJS hesabınızın Public Key'i
      )
      .then(
        (result) => {
          alert("Mesajınız başarıyla gönderildi!");
        },
        (error) => {
          alert("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
      );

    e.target.reset(); // Form alanlarını temizle
  };

  return (
    <div className="contact-container">
      <div className="contact-section">
        <div className="contact-content">
          <div className="contact-details">
            <ContactDetail
              icon={<FaPhone />}
              title="Telefon"
              content="0216 399 39 91-92"
            />
            <ContactDetail
              icon={<FaEnvelope />}
              title="E-posta adresi"
              content="info@karyayapi.com"
            />
            <ContactDetail
              icon={<FaMapMarkerAlt />}
              title="Lokasyon"
              content="Bağlarbaşı Mah. İhlamur sok. No:24A - Dükkan Maltepe/İstanbul"
            />
            <ContactDetail
              icon={<FaInstagram />}
              title="Instagram"
              content="karyayapi"
            />
          </div>

          <div className="contact-form">
            <div className="message-content">
              <h2>Mesaj Yolla</h2>
              <p>
                Ürün ya da uygulamalar hakkında sormak istediğin soruları
                aşağıda bulunan form üzerinden bize ulaştırabilirsin.
              </p>
            </div>
            <form onSubmit={sendEmail}>
              <div className="form-row">
                <div className="form-item">
                  <label>İsim</label>
                  <input type="text" name="isim" required />
                </div>
                <div className="form-item">
                  <label>Soyisim</label>
                  <input type="text" name="soyisim" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-item">
                  <label>Telefon Numarası</label>
                  <input type="text" name="telefon" required />
                </div>
                <div className="form-item">
                  <label>Sektör</label>
                  <input type="text" name="sektor" required />
                </div>
              </div>
              <div className="form-item-message">
                <label>Mesajınızı Yazın</label>
                <textarea name="mesaj" required></textarea>
              </div>
              <button type="submit">Gönder</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Contact Detail Component
const ContactDetail = ({ icon, title, content }) => (
  <div className="contact-detail">
    <div className="icon">{icon}</div> {/* Dinamik olarak ikon */}
    <div>
      <h4>{title}</h4>
      <p>{content}</p>
    </div>
  </div>
);

export default ContactForm;

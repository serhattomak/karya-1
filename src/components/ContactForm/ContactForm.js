import React from "react";
import "./ContactForm.css";

const ContactForm = () => {
  return (
    <div className="contact-container">
      <div className="contact-section">
        <div className="contact-content">
          <div className="contact-details">
            <ContactDetail
              icon="phone"
              title="Telefon"
              content="0216 399 39 91-92"
            />
            <ContactDetail
              icon="envelope"
              title="E-posta adresi"
              content="info@karyayapicim.com"
            />
            <ContactDetail
              icon="map-marker-alt"
              title="Lokasyon"
              content="Bağlarbaşı Mah. İhlamur sok. No:24A - Dükkan Maltepe/İstanbul"
            />
            <ContactDetail
              icon="instagram"
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
            <form>
              <div className="form-row">
                <div className="form-item">
                  <label>İsim</label>
                  <input type="text" />
                </div>
                <div className="form-item">
                  <label>Soyisim</label>
                  <input type="text" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-item">
                  <label>Telefon Numarası</label>
                  <input type="text" />
                </div>
                <div className="form-item">
                  <label>Sektör</label>
                  <input type="text" />
                </div>
              </div>
              <div className="form-item-message">
                <label>Mesajınızı Yazın </label>
                <textarea></textarea>
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
    <div className="icon">
      <i className={`fas fa-${icon}`}></i> {/* Font Awesome ikonları */}
    </div>
    <div>
      <h4>{title}</h4>
      <p>{content}</p>
    </div>
  </div>
);

export default ContactForm;

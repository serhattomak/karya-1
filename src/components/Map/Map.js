import React from "react";
import "./Map.css";

const Map = () => {
  return (
    <div className="location-section">
      <div className="map-content">
        <div className="map-title">
          <h2>Lokasyonumuz</h2>
          <hr />
        </div>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96391.4082534174!2d28.986256236334658!3d40.97641120741837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac77b58fb2e15%3A0xed16d396fed2dce1!2sKarya%20Yap%C4%B1!5e0!3m2!1str!2str!4v1732201212766!5m2!1str!2str"
            width="100%"
            height="470"
            style={{ border: "0", borderRadius: "10px" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Map;

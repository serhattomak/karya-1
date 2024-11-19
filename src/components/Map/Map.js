import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png"; // Varsayılan işaretçi simgesi
import markerShadow from "leaflet/dist/images/marker-shadow.png"; // İşaretçi gölgesi
import "./Map.css";

// Leaflet varsayılan ikonu düzeltme
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Map = () => {
  const position = [40.9302858, 29.1388598]; // Lokasyon (enlem, boylam)

  return (
    <div className="location-section">
      <div className="map-content">
        <div className="map-title">
          <h2>Lokasyonumuz</h2>
          <hr />
        </div>
        <div className="map-container">
          <MapContainer
            center={position}
            zoom={25}
            style={{ height: "470px", width: "100%", borderRadius: "10px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
              <Popup>Asil Nun X Lokasyonu</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Map;

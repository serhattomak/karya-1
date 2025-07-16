import React from "react";
import "./PolDetails.css";

const PolDetails = ({ title, description }) => {
  return (
    <div className="injection-details-container">
      <div className="injection-details-content">
        <div className="text-section">
          <h2 className="title">
            {title} <span></span>
          </h2>
          <hr className="line"></hr>
          <p className="description">{description}</p>
        </div>

        <div className="video-section">
          <iframe
            className="video-thumbnail"
            width="640"
            height="360"
            src="https://www.youtube.com/embed/_7VKbV_AnA0?si=IYP-qtyWl7r2Uwp6"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default PolDetails;

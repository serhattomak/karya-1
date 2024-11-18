import React from "react";
import "./PartnersSlider.css";

const PartnersSlider = () => {
  // Define your array of image URLs
  const imageUrls = [
    "/assets/images/Partners/Group 175.png",
    "/assets/images/Partners/image 13.png",
    "/assets/images/Partners/image 15.png",
    "/assets/images/Partners/image 16.png",
    "/assets/images/Partners/image 17.png",
    "/assets/images/Partners/image 18.png",
    "/assets/images/Partners/image 19.png",
    "/assets/images/Partners/image 20.png",
    "/assets/images/Partners/image 21.png",
    "/assets/images/Partners/image 22.png",
    "/assets/images/Partners/image 23.png",

    "/assets/images/Partners/image 25.png",
    "/assets/images/Partners/image 26.png",
    "/assets/images/Partners/image 27.png",
    "/assets/images/Partners/image 28.png",
    "/assets/images/Partners/image 29.png",
    "/assets/images/Partners/image 30.png",

    "/assets/images/Partners/image 32.png",
    "/assets/images/Partners/image 33.png",
    // Add more URLs as needed
  ];

  return (
    <div className="PartnersSlider">
      <div className="PartnersSlider-track">
        {/* Duplicate the image set to create a looping effect */}
        {[...Array(2)].map((_, trackIndex) => (
          <React.Fragment key={trackIndex}>
            {imageUrls.map((url, imageIndex) => (
              <div
                key={`${trackIndex}-${imageIndex}`}
                className="PartnersSlider"
              >
                <img src={url} alt="" />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PartnersSlider;

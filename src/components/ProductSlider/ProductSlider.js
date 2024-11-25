import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Yönlendirme için useNavigate eklendi
import "./ProductSlider.css";

const ProductSlider = () => {
  const trackRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const navigate = useNavigate(); // useNavigate kullanarak yönlendirme işlevini çağırıyoruz

  const handlePrevClick = () => {
    if (trackRef.current && nextRef.current) {
      nextRef.current.removeAttribute("disabled");
      trackRef.current.scrollBy({
        left: -trackRef.current.firstElementChild.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const handleNextClick = () => {
    if (trackRef.current && prevRef.current) {
      prevRef.current.removeAttribute("disabled");
      trackRef.current.scrollBy({
        left: trackRef.current.firstElementChild.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || !prevRef.current || !nextRef.current) return;

    const trackScrollWidth = track.scrollWidth;
    const trackOuterWidth = track.clientWidth;

    prevRef.current.removeAttribute("disabled");
    nextRef.current.removeAttribute("disabled");

    if (track.scrollLeft <= 0) {
      prevRef.current.setAttribute("disabled", "");
    }

    if (track.scrollLeft === trackScrollWidth - trackOuterWidth) {
      nextRef.current.setAttribute("disabled", "");
    }

    setIsScrollable(
      track.scrollLeft > 0 &&
        track.scrollLeft < trackScrollWidth - trackOuterWidth
    );
  };

  // Her bir ürün için route path tanımlıyoruz
  const products = [
    {
      image: "/assets/images/asilnun.png",
      title: "AŞİL NUN X Poliüretan Enjeksiyon Reçinesi",
      path: "/AsilNunX", // Yönlendirme yapılacak path
    },
    {
      image: "/assets/images/poliuretanenjeksiyon.png",
      title: "Poliüretan Enjeksiyon",
      path: "/PoliuretanEnjeksiyon", // Yönlendirme yapılacak path
    },
    {
      image: "/assets/images/halatlıtelbetonkesme.png",
      title: "Halatlı Tel - Beton Kesme",
      path: "/HalatliTelBetonKesme", // Yönlendirme yapılacak path
    },
    {
      image: "/assets/images/kimyasalankraj.png",
      title: "Kimyasal Ankraj Filiz Ekim",
      path: "/KimyasalAnkraj", // Yönlendirme yapılacak path
    },
  ];

  useEffect(() => {
    setIsScrollable(false);
  }, []);

  // Ürüne tıklandığında yönlendirme fonksiyonu
  const handleProductClick = (path) => {
    navigate(path);
  };

  return (
    <div className="slider-container">
      <div className="slider-title">Ürün ve Hizmetlerimiz</div>
      <div className="slider">
        <ul className="slider__track" ref={trackRef} onScroll={handleScroll}>
          {products.map((product, index) => (
            <li
              key={index}
              className="slide"
              onClick={() => handleProductClick(product.path)} // Ürün tıklama olayını tanımladık
            >
              <img
                src={product.image}
                alt={product.title}
                className="product-image"
              />
              <h3 className="product-title">{product.title}</h3>
            </li>
          ))}
        </ul>

        {/* <div className="slider__buttons">
          <button
            ref={prevRef}
            className="slider__button"
            onClick={handlePrevClick}
            disabled={!isScrollable}
          >
            Previous
          </button>
          <button
            ref={nextRef}
            className="slider__button"
            onClick={handleNextClick}
            disabled={!isScrollable}
          >
            Next
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ProductSlider;

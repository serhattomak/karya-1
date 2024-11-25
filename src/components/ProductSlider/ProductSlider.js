import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Yönlendirme için useNavigate
import "./ProductSlider.css";

const ProductSlider = () => {
  const trackRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const navigate = useNavigate(); // useNavigate kullanarak yönlendirme işlevi

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;

    const trackScrollWidth = track.scrollWidth;
    const trackOuterWidth = track.clientWidth;

    setIsScrollable(
      track.scrollLeft > 0 &&
        track.scrollLeft < trackScrollWidth - trackOuterWidth
    );
  };

  // Ürünler listesi
  const products = [
    {
      image: "/assets/images/asilnun.png",
      title: "AŞİL NUN X",
      subtitle: "Poliüretan Enjeksiyon Reçinesi", // Bu kartın subtitle'ı var
      path: "/AsilNunX",
    },
    {
      image: "/assets/images/poliuretanenjeksiyon.png",
      title: "Poliüretan Enjeksiyon",
      path: "/PoliuretanEnjeksiyon", // Bu kartın subtitle'ı yok
    },
    {
      image: "/assets/images/halatlıtelbetonkesme.png",
      title: "Halatlı Tel - Beton Kesme",
      path: "/HalatliTelBetonKesme",
    },
    {
      image: "/assets/images/kimyasalankraj.png",
      title: "Kimyasal Ankraj Filiz Ekim",
      path: "/KimyasalAnkraj", // Bu kartın subtitle'ı yok
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
              className={`slide ${product.subtitle ? "with-subtitle" : ""}`} // subtitle varsa ek sınıf
              onClick={() => handleProductClick(product.path)}
            >
              <img src={product.image} className="product-image" />
              <h3 className="product-title">{product.title}</h3>
              {/* subtitle varsa göster */}
              {product.subtitle && (
                <p className="product-subtitle">{product.subtitle}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductSlider;

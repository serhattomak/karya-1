import React from "react";
import "./ServiceList.css";

const ServiceList = () => {
  return (
    <div className="service-list">
      <h2 className="service-title">
        <span>Hizmet Verdiğimiz Konular</span>
      </h2>
      <hr className="line" />
      {/* <ul className="service-items">
        <li>Halatlı-tel beton kesme uygulaması.</li>
        <li>Kimyasal dübelle ankraj uygulamaları.</li>
        <li>Sanayi makinaları montajları.</li>
        <li>Endüstriyel vinç rayları ankrajları ve montajları.</li>
        <li>Karot makineleri ile beton delme uygulamaları.</li>
        <li>Montaj sistemleri.</li>
       
         <li>Hidrolik raylı sistemler ile beton kesme uygulaması.</li>
        
        <li>
          Mevcut betonlara çelik konstrüksiyonların ankrajlar ile montajı.
        </li>
        <li>
          Proje değişikliklerinde mevcut betonların yeniden filizlendirilerek
          güçlendirilmesi.
        </li>
        <li>
          Deprem sonrası hasarlı yapıların, kimyasal ankraj ve filizlendirme ile
          onarılması ve yeniden yapılandırılması.
        </li>
   
      </ul> */}

      <ul className="service-items">
        <li>Poliüretan enjeksiyon reçine satışı.</li>
        <li>
          Her türlü negatif yönden gelen su sızıntılarına karşı Poliüretan
          Enjeksiyon uygulaması.
        </li>
        <li>Epoksi enjeksiyon reçinesi ile yapısal çatlak tamiri</li>
        <li> Epoksi ile demir filiz ekimi.</li>
        <li>Epoksi ile rot montajı. </li>
        <li>Karot makineleri ile beton delme.</li>
        <li>Hidrolik raylı sistemler ile beton kesme.</li>
        <li>Halatlı - tel beton kesme uygulaması.</li>
      </ul>
    </div>
  );
};

export default ServiceList;

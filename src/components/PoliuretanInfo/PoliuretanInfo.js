import React from "react";
import "./PoliuretanInfo.css";

const PoliuretanInfo = () => {
  return (
    <div className="p-container">
      <div className="p-content-container">
        <div className="p-left-content">
          <h1 className="p-title">Poliüretan Enjeksiyon</h1>
          <hr className="line" />
          <p>
            Yeraltı yapılarının su sızıntılarına çözümdür. Hızlı, temiz ve
            gürültüsüzdür. Tek kompenantlı, düşük viskoziteli, su ile reaksiyona
            geçen, yarı esnek olan poliüretan enjeksiyonu uygulaması. Su ile temas
            ettiği zaman hızla genleşen çevre aşındırmalarından fazla etkilenmeyen
            katı, yarı esnek kapalı hücreli poliüretan bir conta şekline dönüşür.
            Yanıcı değildir, solvent içermez.
          </p>
          <p>
            Betonarme içerisinde oluşan boşluklar, çatlaklar, segregasyonlu
            bölgelere enjekte edilen NUN X yüksek dayanıklı yarı esnek bir conta
            oluşturur.
          </p>
        </div>
        <div className="p-right-content">
          <h1 className="p-title">Uygulama Alanları</h1>
          <hr className="line" />
          <ul className="p-list">
            <li>Diyafram duvarları</li>
            <li>Soğuk derzler</li>
            <li>Segregasyon bölgeler</li>
            <li>Asansör kuyuları</li>
            <li>Otoparklar</li>
            <li>Tünel</li>
            <li>Metro</li>
            <li>Su depoları</li>
            <li>
              Arıtma tesisleri gibi yapıların betonarmede her türlü oluşan su
              sızıntılarının durdurulması.
            </li>
            <li>Yüksek basınçlı veya yüksek debili su sızıntıları.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PoliuretanInfo;

import React from "react";
import "./AsilNunXInfo.css";

const AsilNunXInfo = () => {
  return (
    <div className="asil-nun-x-container">
      <div className="asil-nun-x-content">
        <div className="asil-nun-x-text">
          <h2 className="asil-nun-x-title">AŞİL NUN X</h2>
          <p className="asil-nun-x-description">
            Karya yapı on beş seneyi aşkın süredir poliüretan enjeksiyon
            sektöründe faaliyet göstermektedir.
          </p>
          <p className="asil-nun-x-details">
            Uzun yıllar yapılan çalışmaların sonucu, gerek saha tecrübesi, gerek
            malzeme seçme deneyimimizle AŞİL NUN X ile karar kılmıştır.
          </p>
          <p className="asil-nun-x-info">
            <strong>AŞİL NUNX CE Belgesi</strong> taşıyan, solvent içermeyen,
            yarı esnek yeni nesil poliüretan enjeksiyon reçinesi olması ile ön
            plana çıkmıştır. Teknik özellikler aşağıda yer alan dökümanda
            detaylıca paylaşılmıştır. Dökümana tıklayıp indirerek
            inceleyebilirsiniz.
          </p>
          <div className="asil-nun-x-documents">
            <img src="/assets/images/doc1.png" alt="Document 1" />
            <img src="/assets/images/doc2.png" alt="Document 2" />
            <img src="/assets/images/doc3.png" alt="Document 3" />
            <img src="/assets/images/doc4.png" alt="Document 4" />
          </div>
          <p className="asil-nun-x-contact">
            AŞİL NUN X Hakkında Daha Fazla Bilgi Almak İçin{" "}
            <span>Bize Ulaşın!</span>
          </p>
        </div>
        <div className="asil-nun-x-image">
          <img src="/assets/images/Group 300.png" alt="Asil Nun X Main" />
        </div>
      </div>
    </div>
  );
};

export default AsilNunXInfo;

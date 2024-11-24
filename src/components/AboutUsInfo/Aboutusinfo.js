import React from "react";
import "./AboutUsInfo.css";

const AboutUsInfo = () => {
  return (
    <div className="info-container">
      <div className="info-content">
        <div className="info-image-container">
          <div className="info-image">
            {" "}
            <img src="/assets/images/hk.jpeg" />
          </div>
        </div>
        <div className="info-text">
          <p className="about-title">Karya Yapı</p>
          <hr className="line"></hr>
          <p className="about-subtitle">Şirket Profili</p>
          <p>
            1999 yılından itibaren devam etmekte olan çalışmalar, 2004 yılında
            karya yapı olarak inşaat sektöründeki yerini almıştır. 2007 yılına
            kadar şahıs firması olarak faaliyet gösteren karya yapı 2007 yılında
            karya yapı san.tic.ltd.şti olarak şirketleşmiştir.
          </p>
          <br></br>
          <p>
            Şirketimiz, güçlü, araştırmacı, yeni nesil markaların ürünleri,
            tecrübeli ve profesyonel uygulama ekipleri ile hizmet sunmaktadır.
            Kuruluşumuzdan bugüne prensibimiz satış yaptığımız ürünlerle ve
            hizmet verdiğimiz alanlarla ilgili teknik desteği tam olarak
            müşteriye sunmak ve koşulsuz müşteri memnuniyetini sağlamaktır.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsInfo;

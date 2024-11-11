import React from "react";
import "./AboutUsInfo.css";

const AboutUsInfo = () => {
  return (
    <div className="info-container">
      <div className="info-image">
        <img src="/assets/images/info-image.jpg" alt="Karya Yapı" />
      </div>
      <div className="info-text">
        <h2>Karya Yapı</h2>
        <h3>Şirket Profili</h3>
        <p>
          1999 yılından itibaren devam etmekte olan çalışmalar, 2004 yılında
          karya yapı olarak inşaat sektöründeki yerini almıştır. 2007 yılına
          kadar şahıs firması olarak faaliyet gösteren karya yapı 2007 yılında
          karya yapı san.tic.ltd.şti olarak şirketleşmiştir.
        </p>
        <p>
          Şirketimiz, güçlü, araştırmacı, yeni nesil markaların ürünleri,
          tecrübeli ve profesyonel uygulama ekipleri ile hizmet sunmaktadır.
          Kuruluşumuzdan bugüne prensibimiz satış yaptığımız ürünlerle ve hizmet
          verdiğimiz alanlarla ilgili teknik desteği tam olarak müşteriye sunmak
          ve koşulsuz müşteri memnuniyetini sağlamaktır.
        </p>
      </div>
    </div>
  );
};

export default AboutUsInfo;

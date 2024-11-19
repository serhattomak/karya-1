import React from "react";
import Navbar from "../../components/Navbar/navbar";
import Banner from "../../components/Banner/Banner";
import ContactForm from "../../components/ContactForm/ContactForm";
import Map from "../../components/Map/Map";
import Footer from "../../components/Footer/Footer";

function ContactPage() {
  return (
    <div>
      <Navbar />
      <Banner imageSrc="/assets/images/contactbanner.png" title="Asil Nun X" />
      <ContactForm />
      <Map />
      <Footer />
    </div>
  );
}

export default ContactPage;

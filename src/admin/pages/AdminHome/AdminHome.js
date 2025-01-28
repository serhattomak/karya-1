// src/components/Admin/AdminHome/AdminHome.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Home from "../Home/Home";
// import AboutUs from "../AboutUs/AboutUs";
// import AsilNunX from "../AsilNunX/AsilNunX";
// import TelBeton from "../TelBeton/TelBeton";
// import KimyasalAnkraj from "../KimyasalAnkraj/KimyasalAnkraj";

const AdminHome = () => {
  return (
    <div className="admin-home">
      <Sidebar />
      <div className="content-area">
        <Routes>
          <Route path="home" element={<Home />} />
          {/* <Route path="aboutus" element={<AboutUs />} />
          <Route path="asilnunx" element={<AsilNunX />} />
          <Route path="kimyasalankraj" element={<KimyasalAnkraj />} />
          <Route path="telbeton" element={<TelBeton />} />{" "} */}
        </Routes>
      </div>
    </div>
  );
};

export default AdminHome;

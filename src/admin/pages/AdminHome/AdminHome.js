import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Home from "../Home/Home";

const AdminHome = () => {
  return (
    <div className="admin-home">
      <Sidebar />
      <div className="content-area">
        <Routes>
          <Route path="home" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminHome;

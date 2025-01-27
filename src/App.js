import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/navbar";
import HomePage from "./pages/HomePage/HomePage";
import AboutPage from "./pages/AboutPage/AboutPage"; // AboutPage'i içe aktarın
import HalatliTelBetonKesmePage from "./pages/HalatliTelBetonKesme/HTBKPage";
import KimyasalAnkPage from "./pages/KimyasalAnkPage/KimyasalAnkPage";
import PoliuretanPage from "./pages/PoliuretanPage/PoliuretanPage";
import ContactPage from "./pages/ContactPage/ContactPage";
import AslilNunXPage from "./pages/AsilnunXPage/AsilNunXPage";
import "./App.css";
function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/AsilNunX" element={<AslilNunXPage />} />
          <Route path="/PoliuretanEnjeksiyon" element={<PoliuretanPage />} />
          <Route
            path="/HalatliTelBetonKesme"
            element={<HalatliTelBetonKesmePage />}
          />
          <Route path="/KimyasalAnkraj" element={<KimyasalAnkPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;

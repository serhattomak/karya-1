import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar/navbar";
import HomePage from "./pages/HomePage/HomePage";
import AboutPage from "./pages/AboutPage/AboutPage";
import HalatliTelBetonKesmePage from "./pages/HalatliTelBetonKesme/HTBKPage";
import KimyasalAnkPage from "./pages/KimyasalAnkPage/KimyasalAnkPage";
import PoliuretanPage from "./pages/PoliuretanPage/PoliuretanPage";
import ContactPage from "./pages/ContactPage/ContactPage";
import AslilNunXPage from "./pages/AsilnunXPage/AsilNunXPage";
import AdminLayout from "./admin/components/AdminLayout/AdminLayout"; 
import Login from "./admin/pages/Login/Login"; 
import "./App.css";

const PrivateRoute = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const AppContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const location = useLocation(); 

  const hideNavbar =
    location.pathname.startsWith("/admin") || location.pathname === "/login";

  return (
    <div className="App">
      {!hideNavbar && <Navbar />}

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

        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />

        <Route
          path="/admin/*"
          element={
            <PrivateRoute
              element={<AdminLayout />}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

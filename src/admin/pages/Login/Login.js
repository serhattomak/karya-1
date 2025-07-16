import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "./KaryaLogo.png";

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsAuthenticated(true);
    navigate("/admin/Home");
  };

  return (
    <div id="login-page">
      <div className="login">
        <div className="login-header">
          {" "}
          <img src={logo} alt="Logo" className="logo" />
          <h2 className="login-title"> Karya Yapı Admin Panel Giriş</h2>
        </div>

        <form className="form-login" onSubmit={handleLogin}>
          <label htmlFor="email">Kullanıcı Adı</label>
          <div className="input-username">
            <i class="fas fa-envelope icon"></i>
            <input
              type="text"
              value={username}
              placeholder=" Kullanıcı Adını Girin "
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <label htmlFor="password">Şifre</label>
          <div className="input-password">
            <i className="fas fa-lock icon" />
            <input
              type="password"
              name="password"
              placeholder="Şifre Girin"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">
            <i className="fas fa-door-open" /> Giriş Yap
          </button>
        </form>
      </div>
      <div className="background"></div>
    </div>
  );
};

export default Login;

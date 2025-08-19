import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { login } from "../../../api";
import "./Login.css";
import logo from "./KaryaLogo.png";

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await login({
        username: username,
        password: password,
      });

      if (response.data && response.data.data && response.data.data.token) {
        const token = response.data.data.token;
        localStorage.setItem("token", token);
        const expirationTime = Date.now() + (60 * 60 * 1000);
        localStorage.setItem("tokenExpiration", expirationTime.toString());
        setIsAuthenticated(true);
        navigate("/admin/Home");
      } else {
        throw new Error("Token alınamadı");
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "Giriş Başarısız!",
        text: "Kullanıcı adı veya şifre hatalı.",
        confirmButtonText: "Tamam",
        confirmButtonColor: "#dc3545",
      });
    }
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
    </div>
  );
};

export default Login;

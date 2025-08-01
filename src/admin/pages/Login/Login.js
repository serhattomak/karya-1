import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import "./Login.css";
import logo from "./KaryaLogo.png";

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:7103/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login response:", data);
        if (data && data.data && data.data.token) {
          localStorage.setItem("token", data.data.token);
        }
        setIsAuthenticated(true);
        navigate("/admin/Home");
      } else {
        // Hatalı giriş
        Swal.fire({
          icon: 'error',
          title: 'Giriş Başarısız!',
          text: 'Kullanıcı adı veya şifre hatalı.',
          confirmButtonText: 'Tamam',
          confirmButtonColor: '#dc3545'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Bağlantı Hatası!',
        text: 'Sunucuya bağlanılamadı.',
        confirmButtonText: 'Tamam',
        confirmButtonColor: '#dc3545'
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
      <div className="background"></div>
    </div>
  );
};

export default Login;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Artık token doğrulama yapılmayacak. Giriş başarılı sayacağız.
    setIsAuthenticated(true); // Giriş başarılı, durumu güncelle
    navigate("/admin/Home"); // Yönetim paneline yönlendir
  };

  return (
    <div className="login-container">
      <h2>Admin Girişi</h2>
      <form className="form" onSubmit={handleLogin}>
        <div>
          <label className="label">Kullanıcı Adı:</label>
          <input
            className="input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">Şifre:</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Giriş Yap</button>
      </form>
    </div>
  );
};

export default Login;


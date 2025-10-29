import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import Logo from "@assets/logo-buffet.png";
import { API_URL } from "@config/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Login exitoso");
        localStorage.setItem("token", data.token);
        setTimeout(() => navigate("/home"), 1000);
      } else {
        setError(data.message || "Credenciales inválidas");
      }
    } catch (err) {
      console.error("Error fetch:", err.message);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo-container">
          <img src={Logo} alt="Logo buffet UNaB" className="login-logo" />
        </div>

        <h4 className="login-title">Iniciar Sesión</h4>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="ejemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Mensajes */}
          {error && <p className="login-error">{error}</p>}
          {success && <p className="login-success">{success}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="extras">
          <button className="forgot-password" type="button">
            ¿Olvidaste tu contraseña?
          </button>

          <button
            className="create-account"
            type="button"
            onClick={goToRegister}
          >
            Crear cuenta
          </button>
        </div>
      </div>
    </div>
  );
}


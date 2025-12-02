import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import Logo from "@assets/logo-buffet.png";
import { AiOutlineUser, AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { API_URL } from "@config/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        localStorage.setItem("usuario", JSON.stringify(data.user));
        setTimeout(() => {
          if (data.user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/home");
          }
        }, 500);
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

  const goToRegister = () => navigate("/register");

  return (
    <div className="lg-auth-outer">
      <div className="lg-auth-card lg-login-layout">
        {/* PANEL FORM */}
        <div className="lg-panel lg-panel-left">
          <div className="lg-form-wrapper">
            <div className="lg-logo-box">
              <img src={Logo} alt="Logo buffet UNaB" className="lg-buffet-logo" />
            </div>

            <h4 className="lg-form-title">Iniciar Sesión</h4>

            <form onSubmit={handleSubmit} className="lg-auth-form">
              <div className="lg-field">
                <label htmlFor="email">Correo electrónico</label>
                <div className="lg-input-icon">
                  <AiOutlineUser className="lg-icon" />
                  <input
                    type="email"
                    id="email"
                    placeholder="ejemplo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="lg-field">
                <label htmlFor="password">Contraseña</label>
                <div className="lg-input-icon password-wrapper">
                  <AiOutlineLock className="lg-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
                  </button>
                </div>
              </div>

              {error && <p className="login-error">{error}</p>}
              {success && <p className="login-success">{success}</p>}

              <button type="submit" className="lg-primary-btn" disabled={loading}>
                {loading ? "Ingresando..." : "Iniciar Sesión"}
              </button>
            </form>

            <div className="lg-extras">
              <button className="lg-link-btn" type="button">
                ¿Olvidaste tu contraseña?
              </button>
              <button className="lg-create-account" type="button" onClick={goToRegister}>
                Crear cuenta
              </button>
            </div>
          </div>
        </div>

        {/* PANEL WELCOME */}
        <div className="lg-panel lg-panel-right">
          <div className="lg-welcome-box">
            <h3 className="lg-welcome-title">¡BIENVENIDO/A DE NUEVO!</h3>
            <p className="lg-welcome-text">
              Accede a tu cuenta para pedir, ver el menú y gestionar tus órdenes.
              <br />
              Disfruta de descuentos especiales para estudiantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

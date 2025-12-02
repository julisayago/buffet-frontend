import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./registro.css";
import { AiOutlineArrowLeft, AiOutlineUser, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import Logo from "@assets/logo-buffet.png";
import { API_URL } from "@config/api";

function Register() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
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
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Usuario registrado correctamente");
        localStorage.setItem("token", data.token);
        setTimeout(() => navigate("/home"), 1000);
      } else {
        setError(data.message || "Error al registrarse");
      }
    } catch (err) {
      console.error("Error fetch:", err.message);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rg-auth-outer">
      <div className="rg-auth-card rg-register-layout">
        {/* PANEL WELCOME */}
        <div className="rg-panel rg-panel-left rg-welcome-panel">
          <div className="rg-welcome-box">
            <h3 className="rg-welcome-title">¡BIENVENIDO/A!</h3>
            <p className="rg-welcome-text">
              Crea tu cuenta para comenzar a ordenar y aprovechar beneficios para estudiantes.
              <br />
              Es rápido y sencillo.
            </p>
          </div>
        </div>

        {/* PANEL FORM */}
        <div className="rg-panel rg-panel-right rg-form-panel">
          <div className="rg-form-wrapper">
            <button
              className="rg-back-button"
              type="button"
              onClick={() => navigate(-1)}
            >
              <AiOutlineArrowLeft size={20} />
            </button>

            <div className="rg-logo-box">
              <img src={Logo} alt="Logo buffet UNaB" className="rg-buffet-logo" />
            </div>

            <h4 className="rg-form-title">Registrarse</h4>

            <form onSubmit={handleSubmit} className="rg-auth-form">
              <div className="rg-field">
                <label>Nombre</label>
                <div className="rg-input-icon">
                  <AiOutlineUser className="rg-icon" />
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="rg-field">
                <label>Correo electrónico</label>
                <div className="rg-input-icon">
                  <AiOutlineMail className="rg-icon" />
                  <input
                    type="email"
                    placeholder="ejemplo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="rg-field">
                <label>Contraseña</label>
                <div className="rg-input-icon">
                  <AiOutlineLock className="rg-icon" />
                  <input
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Mensajes */}
              {error && <p className="register-error">{error}</p>}
              {success && <p className="register-success">{success}</p>}

              <button type="submit" className="rg-primary-btn" disabled={loading}>
                {loading ? "Registrando..." : "Registrarse"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

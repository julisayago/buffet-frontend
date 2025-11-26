import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./registro.css";
import { AiOutlineArrowLeft, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Logo from "@assets/logo-buffet.png";
import { API_URL } from "@config/api";

function Register() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
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
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Usuario registrado correctamente");
        setTimeout(() => navigate("/"), 1000);
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          const erroresPorCampo = {};
          data.errors.forEach(err => {
            erroresPorCampo[err.field] = err.message;
          });

          const mensajes = Object.entries(erroresPorCampo)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(" | ");

          setError(mensajes);
        } else {
          setError(data.message || "Error al registrarse");
        }
      }
    } catch (err) {
      console.error("Error fetch:", err.message);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <button className="back-button" type="button" onClick={() => navigate(-1)}>
          <AiOutlineArrowLeft size={20} />
        </button>

        <div className="register-logo-container">
          <img src={Logo} alt="Logo buffet UNaB" className="register-logo" />
        </div>

        <h4 className="register-title">Registrarse</h4>

        <form onSubmit={handleSubmit}>
          
          <div className="register-input-group">
            <label>Nombre</label>
            <input
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="register-input-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="register-input-group">
            <label>Contraseña</label>

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
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
                {showPassword ? (
                  <AiOutlineEyeInvisible size={22} />
                ) : (
                  <AiOutlineEye size={22} />
                )}
              </button>
            </div>
          </div>

          {error && <p className="register-error">{error}</p>}
          {success && <p className="register-success">{success}</p>}

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Register;

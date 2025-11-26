import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import Logo from "@assets/logo-buffet.png";
import { API_URL } from "@config/api";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const mensajes = data.errors
            .map((err) => `${err.field}: ${err.message}`)
            .join(" | ");
          setError(mensajes);
        } else {
          setError(data.message || "Error al iniciar sesión");
        }
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.user));

      setSuccess("Login exitoso");

      setTimeout(() => {
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }, 500);
    } catch (error) {
      console.error("Error:", error);
      setError("No se pudo conectar con el servidor");
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
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="********"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {error && <p className="login-error">{error}</p>}
          {success && <p className="login-success">{success}</p>}

          <button type="submit" className="login-btn">
            Ingresar
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

export default Login;

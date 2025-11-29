import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "@config/api";
import "./perfil.css";
import { AiOutlineArrowLeft, AiOutlineUser, AiOutlineMail, AiOutlinePhone, AiOutlineHome } from "react-icons/ai";

function Perfil() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: ""
  });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await fetch(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Error al obtener perfil");

        setPerfil(data.user);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPerfil();
  }, []);

  const handleChange = (e) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: perfil.nombre,
          telefono: perfil.telefono,
          direccion: perfil.direccion
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al actualizar perfil");

      setMensaje("Perfil actualizado exitosamente");
      setTimeout(() => setMensaje(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="perfil-container">
        <div className="perfil-header">
          <button className="perfil-back" onClick={() => navigate(-1)}>
            <AiOutlineArrowLeft size={20} />
          </button>
          <h2 className="perfil-titulo">Mi Cuenta</h2>
        </div>
        <div className="perfil-card">
          <h3 className="perfil-subtitulo">Editar perfil</h3>
          
        <div className="perfil-bienvenida">
          <h3>¡Hola!</h3>
          <p>Desde aquí podés editar tu información personal y mantener tu cuenta actualizada.</p>
        </div>

        {error && <p className="error">{error}</p>}
        {mensaje && <p className="success">{mensaje}</p>}

        <div className="perfil-info">
          <div className="perfil-input-card">
            <label>Nombre</label>
            <div className="perfil-input-wrapper">
              <AiOutlineUser className="perfil-icon" />
              <input
                type="text"
                name="nombre"
                value={perfil.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="perfil-input"
              />
            </div>
          </div>

          <div className="perfil-input-card">
            <label>Correo electrónico</label>
            <div className="perfil-input-wrapper">
              <AiOutlineMail className="perfil-icon" />
              <input
                type="email"
                name="email"
                value={perfil.email}
                disabled
                placeholder="correo@ejemplo.com"
                className="perfil-input"
              />
            </div>
          </div>

          <div className="perfil-input-card">
            <label>Teléfono</label>
            <div className="perfil-input-wrapper">
              <AiOutlinePhone className="perfil-icon" />
              <input
                type="text"
                name="telefono"
                value={perfil.telefono || ""}
                onChange={handleChange}
                placeholder="Ej: 1123456789"
                className="perfil-input"
              />
            </div>
          </div>

          <div className="perfil-input-card">
            <label>Dirección</label>
            <div className="perfil-input-wrapper">
              <AiOutlineHome className="perfil-icon" />
              <input
                type="text"
                name="direccion"
                value={perfil.direccion || ""}
                onChange={handleChange}
                placeholder="Ej: Av. Siempre Viva 123"
                className="perfil-input"
              />
            </div>
          </div>
        </div>

        <div className="perfil-actions">
          <button className="perfil-boton guardar" onClick={handleGuardar}>
            Guardar
          </button>
          <button className="perfil-boton cancelar" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Perfil;

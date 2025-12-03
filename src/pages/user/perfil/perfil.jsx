import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "@config/api";
import "./perfil.css";
import {
  AiOutlineArrowLeft,
  AiOutlineEdit,
  AiOutlineUser,
  AiOutlineMail,
  AiOutlinePhone,
} from "react-icons/ai";
import Loader from "@components/loader/loader";

function Perfil() {
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState({
    nombre: "",
    email: "",
    telefono: "",
    current_password: "",
    new_password: "",
  });

  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPerfil = async () => {
      if (!token) {
        setMensaje("No hay token. Iniciá sesión nuevamente.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Error al obtener perfil");

        const usuario = data.user || {};
        setPerfil({
          nombre: usuario.nombre || "",
          email: usuario.email || "",
          telefono: usuario.telefono || "",
          current_password: "",
          new_password: "",
        });
      } catch (err) {
        setMensaje(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [token]);

  const handleChange = (e) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    try {
      const body = {
        nombre: perfil.nombre,
        telefono: perfil.telefono,
      };

      // Si el usuario quiere cambiar la contraseña
      if (perfil.new_password) {
        body.current_password = perfil.current_password;
        body.new_password = perfil.new_password;
      }

      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Error al actualizar perfil");

      setMensaje(
        perfil.new_password
          ? "Perfil y contraseña actualizados exitosamente"
          : "Perfil actualizado exitosamente"
      );
      setEditando(false);
      setPerfil({ ...perfil, current_password: "", new_password: "" });

      setTimeout(() => setMensaje(""), 3000);
    } catch (err) {
      setMensaje(err.message);
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  const handleCancelar = () => {
    setEditando(false);
    setLoading(true);

    fetch(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const usuario = data.user || {};
        setPerfil({
          nombre: usuario.nombre || "",
          email: usuario.email || "",
          telefono: usuario.telefono || "",
          current_password: "",
          new_password: "",
        });
      })
      .catch((err) => {
        setMensaje(err.message);
        setTimeout(() => setMensaje(""), 3500);
      })
      .finally(() => setLoading(false));
  };

  if (loading) return <Loader text="Cargando perfil..." />;

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <button className="perfil-back" onClick={() => navigate(-1)}>
          <AiOutlineArrowLeft size={20} />
        </button>
        <h2 className="perfil-titulo">Mi Cuenta</h2>
      </div>

      <div className="perfil-card">
        {editando && <h3 className="perfil-subtitulo">Editar perfil</h3>}

        <div className="perfil-bienvenida">
          <h3>¡Hola!</h3>
          <p>
            Desde aquí podés editar tu información personal y mantener tu cuenta
            actualizada.
          </p>
        </div>

        <div className="perfil-info">
          {/* Nombre */}
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
                disabled={!editando}
              />
            </div>
          </div>

          {/* Correo */}
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

          {/* Teléfono */}
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
                disabled={!editando}
              />
            </div>
          </div>

          {/* Contraseña */}
          {editando && (
            <>
              <div className="perfil-input-card">
                <label>Contraseña actual</label>
                <div className="perfil-input-wrapper">
                  <input
                    type="password"
                    name="current_password"
                    value={perfil.current_password || ""}
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña actual"
                  />
                </div>
              </div>

              <div className="perfil-input-card">
                <label>Nueva contraseña</label>
                <div className="perfil-input-wrapper">
                  <input
                    type="password"
                    name="new_password"
                    value={perfil.new_password || ""}
                    onChange={handleChange}
                    placeholder="Dejar vacío si no quieres cambiarla"
                    className="perfil-input"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Acciones */}
        <div className="perfil-actions">
          {!editando && (
            <button
              className="perfil-boton guardar"
              onClick={() => setEditando(true)}
            >
              <AiOutlineEdit style={{ marginRight: "5px" }} />
              Editar
            </button>
          )}
          {editando && (
            <>
              <button className="perfil-boton guardar" onClick={handleGuardar}>
                Guardar
              </button>
              <button
                className="perfil-boton cancelar"
                onClick={handleCancelar}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      {mensaje && <div className="mensaje-perfil">{mensaje}</div>}
    </div>
  );
}

export default Perfil;

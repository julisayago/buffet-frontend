import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "@config/api";
import "./perfil.css";
import { AiOutlineArrowLeft, AiOutlineEdit } from "react-icons/ai";
import Loader from "@components/loader/loader";

function Perfil() {
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: ""
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
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Error al obtener perfil");

        const usuario = data.user || {};
        setPerfil({
          nombre: usuario.nombre || "",
          email: usuario.email || "",
          telefono: usuario.telefono || "",
          direccion: usuario.direccion || ""
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
      const res = await fetch(`${API_URL}/users/profile`, {
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
      setEditando(false);

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
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        const usuario = data.user || {};
        setPerfil({
          nombre: usuario.nombre || "",
          email: usuario.email || "",
          telefono: usuario.telefono || "",
          direccion: usuario.direccion || ""
        });
      })
      .catch((err) => {
        setMensaje(err.message);
        setTimeout(() => setMensaje(""), 3500);
      })
      .finally(() => setLoading(false));
  };

  if (loading) {
    return <Loader text="Cargando perfil..." />;
  }

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <button className="perfil-back" onClick={() => navigate(-1)}>
          <AiOutlineArrowLeft size={20} />
        </button>
        <h2 className="perfil-titulo">Mi Cuenta</h2>
      </div>

      <div className="perfil-card">
        {/* Título solo si se está editando */}
        {editando && <h3 className="perfil-subtitulo">Editar perfil</h3>}

        <div className="perfil-bienvenida">
          <h3>¡Hola!</h3>
          <p>Desde aquí podés editar tu información personal y mantener tu cuenta actualizada.</p>
        </div>

        <div className="perfil-info">
          <div className="perfil-input-card">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={perfil.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              disabled={!editando}
            />
          </div>

          <div className="perfil-input-card">
            <label>Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={perfil.email}
              disabled
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="perfil-input-card">
            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={perfil.telefono || ""}
              onChange={handleChange}
              placeholder="Ej: 1123456789"
              disabled={!editando}
            />
          </div>

          <div className="perfil-input-card">
            <label>Dirección</label>
            <input
              type="text"
              name="direccion"
              value={perfil.direccion || ""}
              onChange={handleChange}
              placeholder="Ej: Av. Siempre Viva 123"
              disabled={!editando}
            />
          </div>
        </div>

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
              <button className="perfil-boton cancelar" onClick={handleCancelar}>
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

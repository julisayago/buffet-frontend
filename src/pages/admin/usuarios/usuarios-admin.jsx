import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loader from "@components/loader/loader";
import { toast } from "react-toastify"; 
import "./usuario-admin.css";
import { API_URL } from "@config/api";

export default function UsuariosAdmin() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No estás autenticado");
      setCargando(false);
      return;
    }

    fetch(`${API_URL}/users?limit=50`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsuarios(data.data.users);
        } else {
          setError(data.message || "Error cargando usuarios");
        }
      })
      .catch(err => {
        console.error(err);
        setError("Error conectando con el servidor");
      })
      .finally(() => setCargando(false));
  }, []);

  const confirmarEliminacion = async () => {
    if (!usuarioAEliminar) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/users/${usuarioAEliminar.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setUsuarios(prev => prev.filter(u => u.id !== usuarioAEliminar.id));
        toast.success(`Usuario ${usuarioAEliminar.nombre} eliminado correctamente`); 
        setUsuarioAEliminar(null);
      } else {
        toast.error(data.message || "No se pudo eliminar el usuario"); 
      }
    } catch (err) {
      console.error(err);
      toast.error("Error conectando con el servidor");
    }
  };

  const cancelarEliminacion = () => setUsuarioAEliminar(null);

  if (cargando) return <Loader text="Cargando usuarios..." />;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="admin-usuarios-container">
      <div className="admin-usuarios-header">
        <h1 className="admin-usuarios-titulo">Usuarios</h1>
        <button
          className="admin-usuarios-agregar"
          onClick={() => navigate("/admin/usuarios/agregar")}
        >
          <FaPlus /> Agregar usuario
        </button>
      </div>

      <div className="admin-usuarios-tabla-wrapper">
        {usuarios.length === 0 ? (
          <p className="sin-usuarios">No hay usuarios registrados.</p>
        ) : (
          <table className="admin-usuarios-tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(usuario => (
                <tr key={usuario.id}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.telefono}</td>
                  <td>{usuario.role}</td>
                  <td>
                    <button
                      className="admin-usuarios-boton editar"
                      onClick={() =>
                        navigate(`/admin/usuarios/editar/${usuario.id}`)
                      }
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="admin-usuarios-boton eliminar"
                      onClick={() => setUsuarioAEliminar(usuario)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {usuarioAEliminar && (
        <div className="admin-popup-overlay">
          <div className="admin-popup">
            <p>
              ¿Deseás eliminar a <strong>{usuarioAEliminar.nombre}</strong>?
            </p>
            <div className="admin-popup-acciones">
              <button className="confirmar" onClick={confirmarEliminacion}>
                Eliminar
              </button>
              <button className="cancelar" onClick={cancelarEliminacion}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

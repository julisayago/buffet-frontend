import { useState, useEffect } from "react";
import { API_URL } from "@config/api";
import "./categorias-admin.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Loader from "@components/loader/loader";

export default function CategoriasAdmin() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [categoriaEdit, setCategoriaEdit] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
  });

  useEffect(() => {
    cargarCategorias();
  }, []);
  const cargarCategorias = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setCategorias(data.categories || data.data || data || []);
      }
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirModal = (categoria = null) => {
    if (categoria) {
      setCategoriaEdit(categoria);
      setFormData({
        nombre: categoria.nombre,
      });
    } else {
      setCategoriaEdit(null);
      setFormData({ nombre: ""});
    }
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setCategoriaEdit(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    if (!formData.nombre.trim()) {
      toast.error("El nombre es requerido");
      return;
    }

    // Generar slug automáticamente según el nombre
    const slug = formData.nombre.trim().toLowerCase().replace(/\s+/g, "-");

    try {
      const token = localStorage.getItem("token");

      const url = categoriaEdit
        ? `${API_URL}/categories/${categoriaEdit.id}`
        : `${API_URL}/categories`;

      const method = categoriaEdit ? "PUT" : "POST";

      const bodyToSend = {
        ...formData,
        slug,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyToSend),
      });

      if (response.ok) {
        toast.success(
          categoriaEdit
            ? "Categoría actualizada exitosamente"
            : "Categoría creada exitosamente"
        );
        handleCerrarModal();
        cargarCategorias();
      } else {
        const data = await response.json();
        toast.error("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al guardar la categoría");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás segura de eliminar esta categoría?")) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("Categoría eliminada exitosamente");
        cargarCategorias();
      } else {
        toast.error("Error al eliminar la categoría");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar la categoría");
    }
  };

  if (loading) return <Loader text="Cargando categorías..." />;

  return (
    <div className="categorias-admin-container">
      <div className="categorias-header">
        <h1>Categorías</h1>
        <button
          className="btn-nueva-categoria"
          onClick={() => handleAbrirModal()}
        >
          + Nueva Categoría
        </button>
      </div>

      <div className="categorias-tabla-container">
        <table className="categorias-tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.nombre}</td>
                <td>
                  <span
                    className={`estado-badge ${
                      cat.activa ? "activo" : "inactivo"
                    }`}
                  >
                    {cat.activa ? "Activa" : "Inactiva"}
                  </span>
                </td>

                <td className="acciones-columna">
                  <button
                    className="btn-editar"
                    title="Editar"
                    onClick={() => handleAbrirModal(cat)}
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="btn-eliminar"
                    title="Eliminar"
                    onClick={() => handleEliminar(cat.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mostrarModal && (
        <div className="modal-overlay" onClick={handleCerrarModal}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <h2>{categoriaEdit ? "Editar Categoría" : "Nueva Categoría"}</h2>

            <label>
              Nombre:
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
              />
            </label>
            <div className="modal-acciones">
              <button className="btn-guardar" onClick={handleGuardar}>
                Guardar
              </button>
              <button className="btn-cancelar" onClick={handleCerrarModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

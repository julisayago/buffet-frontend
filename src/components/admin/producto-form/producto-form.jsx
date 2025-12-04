import { useState, useEffect } from "react";
import { API_URL } from "@config/api";
import "./producto-form.css";

export default function ProductoForm({
  producto,
  setProducto,
  onSubmit,
  title,
}) {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al traer categorías");
        const data = await res.json();

        const categoriasBack = data.categories.map((cat) => ({
          id: cat.id,
          nombre: cat.nombre.charAt(0).toUpperCase() + cat.nombre.slice(1),
        }));

        setCategorias(categoriasBack);
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    const val =
      type === "file" ? files[0] : type === "checkbox" ? checked : value;

    setProducto((prev) => {
      const nuevoProducto = { ...prev, [name]: val };

      if (name === "promocion" && !val) {
        nuevoProducto.precio_promocion = 0;
      }

      return nuevoProducto;
    });
  };

  return (
    <div className="admin-productos-form-container">
      <form
        onSubmit={(e) => onSubmit(e, categorias)}
        className="admin-productos-form"
      >
        <h2>{title}</h2>

        <label>
          Nombre:
          <input
            name="nombre"
            value={producto.nombre || ""}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Descripción:
          <textarea
            name="descripcion"
            value={producto.descripcion || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Precio:
          <input
            name="precio"
            type="number"
            step="0.01"
            value={producto.precio || ""}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Categoría:
          <select
            name="category_id"
            value={producto.category_id || ""}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </label>
        <label>
          Stock:
          <input
            name="stock"
            type="number"
            step="1"
            value={producto.stock || ""}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Disponible:
          <input
            type="checkbox"
            name="disponible"
            checked={producto.disponible || false}
            onChange={handleChange}
          />
        </label>

        <label>
          Promoción:
          <input
            type="checkbox"
            name="promocion"
            checked={producto.promocion || false}
            onChange={handleChange}
          />
        </label>

        <label>
          Precio promoción:
          <input
            name="precio_promocion"
            type="number"
            step="0.01"
            value={producto.precio_promocion || ""}
            onChange={handleChange}
            disabled={!producto.promocion}
          />
        </label>

        <label>
          Imagen:
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
        </label>

        {producto.imagenUrl && !producto.image && (
          <div className="preview-imagen">
            <img
              src={`${API_URL.replace("/api", "")}${producto.imagenUrl}`}
              alt="Imagen actual"
              style={{ width: "150px", marginBottom: "10px" }}
            />
            <p>Imagen actual</p>
          </div>
        )}

        {producto.image && (
          <div className="preview-imagen-nueva">
            <img
              src={URL.createObjectURL(producto.image)}
              alt="Nueva imagen seleccionada"
              style={{ width: "150px", marginBottom: "10px" }}
            />
            <p>Nueva imagen seleccionada</p>
          </div>
        )}

        <div className="admin-productos-form-acciones">
          <button type="submit">Guardar</button>
          <button type="button" onClick={() => window.history.back()}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

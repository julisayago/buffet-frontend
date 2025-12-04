import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./productos-admin.css";
import Loader from "@components/loader/loader";
import { API_URL } from "@config/api";

export default function ProductosAdmin() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("all");
  const [filtros, setFiltros] = useState({
    stockBajo: false,
    promociones: false,
  });

  const [categorias, setCategorias] = useState([]);

  // Fetch productos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Traer categorías
        const resCats = await fetch(`${API_URL}/categories`);
        const dataCats = await resCats.json();
        const categoriasData = dataCats.categories || [];
        setCategorias(categoriasData);

        // Traer productos
        const resProds = await fetch(`${API_URL}/products`, {
          credentials: "include",
        });
        const dataProds = await resProds.json();

        if (!resProds.ok)
          throw new Error(dataProds.message || "Error al cargar productos");

        // Mapear categoria_id a nombre
        const productosConCategoria = dataProds.products.map((p) => {
          const cat = categoriasData.find((c) => c.id === p.category_id);
          return {
            ...p,
            categoria: cat
              ? cat.nombre.charAt(0).toUpperCase() + cat.nombre.slice(1)
              : "Sin categoría",
          };
        });

        setProductos(productosConCategoria);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError(err.message);
        toast.error("Error al cargar datos: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Eliminar producto
  const confirmarEliminacion = async () => {
    if (!productoAEliminar) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/products/${productoAEliminar.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "No se pudo eliminar");

      setProductos((prev) => prev.filter((p) => p.id !== productoAEliminar.id));
      toast.success(
        `Producto "${productoAEliminar.nombre}" eliminado correctamente`
      );
      setProductoAEliminar(null);
    } catch (err) {
      console.error(err);
      toast.error("Error eliminando producto: " + err.message);
    }
  };

  const cancelarEliminacion = () => setProductoAEliminar(null);

  if (loading) return <Loader text="Cargando productos..." />;
  if (error)
    return (
      <div className="admin-productos-error">
        <p>Error: {error}</p>
      </div>
    );

  const productosFiltrados = productos
    .filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .filter((p) =>
      categoriaFiltro === "all"
        ? true
        : p.categoria.toLowerCase() ===
          categorias.find((c) => c.id == categoriaFiltro)?.nombre?.toLowerCase()
    )
    .filter((p) => (filtros.stockBajo ? p.stock < 10 : true))
    .filter((p) => (filtros.promociones ? p.promocion === true : true)); 

  return (
    <div className="admin-productos-container">
      <div className="admin-productos-header">
        <h1 className="admin-productos-titulo">Productos</h1>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="admin-productos-agregar"
            onClick={() => navigate("/admin/productos/agregar")}
          >
            <FaPlus /> Agregar producto
          </button>

          <button
            className="admin-productos-agregar"
            onClick={() => navigate("/admin/categorias")}
          >
            Categorías
          </button>
        </div>
      </div>

      <div className="admin-filtros">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
        >
          <option value="all">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre.charAt(0).toUpperCase() + cat.nombre.slice(1)}
            </option>
          ))}
        </select>
        <label>
          <input
            type="checkbox"
            checked={filtros.stockBajo}
            onChange={(e) =>
              setFiltros((prev) => ({ ...prev, stockBajo: e.target.checked }))
            }
          />
          Stock bajo
        </label>
        <label>
          <input
            type="checkbox"
            checked={filtros.promociones}
            onChange={(e) =>
              setFiltros((prev) => ({ ...prev, promociones: e.target.checked }))
            }
          />
          Promociones
        </label>
      </div>

      <div className="admin-productos-tabla-wrapper">
        <table className="admin-productos-tabla">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((producto) => (
                <tr key={producto.id}>
                  <td>
                    <img
                      src={
                        producto.imagen
                          ? `${API_URL.replace("/api", "")}${producto.imagen}`
                          : "/placeholder.png"
                      }
                      alt={producto.nombre}
                      className="admin-productos-imagen"
                    />
                  </td>
                  <td>{producto.nombre}</td>
                  <td>
                    {producto.promocion && producto.precio_promocion ? (
                      <div className="precio-con-promo">
                        <div className="precio-promocion">
                          ${producto.precio_promocion.toFixed(2)}
                        </div>
                        <div className="precio-original">
                          ${producto.precio.toFixed(2)}
                        </div>
                      </div>
                    ) : (
                      <div className="precio-normal">
                        ${producto.precio.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td>{producto.categoria}</td>
                  <td>{producto.stock}</td>
                  <td>
                    <button
                      className="admin-productos-boton editar"
                      onClick={() =>
                        navigate(`/admin/productos/editar/${producto.id}`)
                      }
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="admin-productos-boton eliminar"
                      onClick={() => setProductoAEliminar(producto)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No hay productos que coincidan con la búsqueda o filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {productoAEliminar && (
        <div className="admin-popup-overlay">
          <div className="admin-popup">
            <p>
              ¿Deseás eliminar <strong>{productoAEliminar.nombre}</strong>?
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

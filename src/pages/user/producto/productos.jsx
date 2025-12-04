import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductCard from "@usercomponents/product-card/product-card";
import "./productos.css";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { API_URL } from "@config/api";
import Loader from "@components/loader/loader";
import { handleAddToCart } from "@userpages/carrito/carrito";

function Productos() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const search = params.get("search") || "";
  const categoriaParam = params.get("categoria") || "all";

  const [categorias, setCategorias] = useState([{ id: "all", nombre: "Todo" }]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState(categoriaParam);

  const [productosData, setProductosData] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [loading, setLoading] = useState(true);

  const [filtros, setFiltros] = useState({
    promociones: false,
    maxPrecio: 20000,
  });

  const handleFiltroChange = (e) => {
    const { id, checked } = e.target;
    setFiltros((prev) => ({ ...prev, [id]: checked }));
  };

  const handlePrecioChange = (e) => {
    setFiltros((prev) => ({ ...prev, maxPrecio: Number(e.target.value) }));
  };

  // Traer productos
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        if (data.products) {
          setProductosData(data.products);
        } else {
          console.error("Formato inesperado:", data);
        }
      } catch (error) {
        console.error("Error al traer productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // Traer categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        if (!res.ok) throw new Error("Error al traer categorías");

        const data = await res.json();

        const categoriasBack = data.categories.map((cat) => ({
          id: String(cat.id),
          nombre: cat.nombre.charAt(0).toUpperCase() + cat.nombre.slice(1),
        }));

        setCategorias([{ id: "all", nombre: "Todo" }, ...categoriasBack]);
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

  if (loading) {
    return <Loader text="Cargando productos..." />;
  }

  // Filtrar productos
  const productosFiltrados = productosData
    .filter((p) =>
      categoriaSeleccionada === "all"
        ? true
        : String(p.category_id) === categoriaSeleccionada
    )
    .filter((p) => p.precio <= filtros.maxPrecio)
    .filter((p) => {
      if (filtros.promociones && !p.promocion) return false;
      return true;
    })
    .filter((p) => p.nombre.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="productos-layout">
        {/* Columna izquierda */}
        <aside className="productos-sidebar left desktop-banner">
          <button
            className="btn-toggle-filtros"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            {mostrarFiltros ? "Cerrar Filtros ▲" : "Mostrar Filtros ▼"}
          </button>

          {mostrarFiltros && (
            <div className="sidebar-card filtros-card">
              <h3>Filtros</h3>
              <ul>
                <li>
                  <input
                    type="checkbox"
                    id="promociones"
                    checked={filtros.promociones}
                    onChange={handleFiltroChange}
                  />
                  <label htmlFor="promociones">Promociones</label>
                </li>
              </ul>
              <h4>Rango de precio</h4>
              <p>$1000 Hasta ${filtros.maxPrecio}</p>
              <input
                type="range"
                min="1000"
                max="20000"
                step="100"
                value={filtros.maxPrecio}
                onChange={handlePrecioChange}
              />
            </div>
          )}

          {/* Banner Promocional */}
          <div className="banner-promocional">
            <img
              src="/banner-productos.png"
              alt="Banner Buffet"
              className="banner-promocional-img"
            />
            <div className="banner-contenido">
              <h4>Buffet Universitario</h4>
              <h2>Disfrutá lo mejor del día</h2>
              <p>Pedí tus combos favoritos y obtené beneficios exclusivos.</p>
            </div>
          </div>
        </aside>

        {/* Centro */}
        <div className="productos-wrapper">
          <div className="productos-header">
            <button
              className="detalle-back"
              type="button"
              onClick={() => navigate(-1)}
            >
              <AiOutlineArrowLeft size={20} />
            </button>
            <h2 className="productos-titulo">Productos</h2>
          </div>

          {mensaje && <div className="mensaje-carrito">{mensaje}</div>}

          <div className="productos-categorias">
            {categorias.map((cat) => (
              <div
                key={cat.id}
                className={`categoria-card ${
                  categoriaSeleccionada === cat.id ? "activa" : ""
                }`}
                onClick={() =>
                  setCategoriaSeleccionada(
                    cat.id === "all" ? "all" : String(cat.id)
                  )
                }
              >
                {cat.nombre}
              </div>
            ))}
          </div>

          <section>
            <div className="productos-grid">
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    producto={prod}
                    onAddToCart={() => handleAddToCart(prod, setMensaje)}
                  />
                ))
              ) : (
                <p className="sin-resultados">
                  No hay productos que coincidan con los filtros o búsqueda.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Columna derecha */}
        <aside className="productos-sidebar right">
          <div className="sidebar-card">
            <h3>★ Top Ventas</h3>
            <p>Hamburguesa + papas — $3500</p>
            <p>Café + 2 medialunas — $2000</p>
          </div>

          <div className="sidebar-card">
            <h3>Horarios de Atención</h3>
            <p>Lun a Vie: 08:00 – 22:00</p>
            <p>Sábados: 09:00 – 14:00</p>
          </div>

          <div className="sidebar-card">
            <h3>Oferta Relámpago</h3>
            <p>Brownie — 20% OFF</p>
            <small>Hasta las 18:00</small>
          </div>

          <div className="sidebar-card">
            <h3>Te recomendamos</h3>
            <p>
              Si pediste <b>Hamburguesa</b>, añadí <b>Papas grandes</b>
            </p>
            <p>
              Si pediste <b>Café con medialuna</b>, probá <b>Brownie</b>
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

export default Productos;

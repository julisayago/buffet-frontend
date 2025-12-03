import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "@config/api";
import "./producto-detalle.css";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Loader from "@components/loader/loader";
import { handleAddToCart } from "@userpages/carrito/carrito";

function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchProducto = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        if (!res.ok) throw new Error("Producto no encontrado");
        const data = await res.json();

        setProducto(data.product);
        setError("");
      } catch (err) {
        setError("No se pudo cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  const actualizarCantidad = (operacion) => {
    setCantidad((prev) => Math.max(prev + operacion, 1));
  };

  const agregarAlCarrito = () => {
    if (!producto) return;
    handleAddToCart({ ...producto, cantidad }, setMensaje);
  };

  if (loading) return <Loader text="Cargando producto..." />;
  if (error || !producto) return <p>{error || "Producto no encontrado"}</p>;

  return (
    <div className="detalle-wrapper">
      {mensaje && <div className="mensaje-carrito">{mensaje}</div>}

      <div className="detalle-card">
        <div className="detalle-header">
          <button className="detalle-back" onClick={() => navigate(-1)}>
            <AiOutlineArrowLeft size={20} />
          </button>
        </div>

        <img
          src={producto.img || "https://via.placeholder.com/300"}
          alt={producto.nombre}
          className="detalle-img"
        />

        <div className="detalle-info">
          <h2 className="detalle-nombre">{producto.nombre}</h2>
          <p className="detalle-descripcion">{producto.descripcion}</p>
          <div className="detalle-precio">
            {producto.promocion && producto.precio_promocion ? (
              <>
                <span className="precio-original">
                  ${producto.precio.toLocaleString()}
                </span>
                <span className="precio-promocion">
                  ${producto.precio_promocion.toLocaleString()}
                </span>
              </>
            ) : (
              <span>${producto.precio.toLocaleString()}</span>
            )}
          </div>
        </div>

        <div className="detalle-actions">
          <div className="detalle-cantidad">
            <button onClick={() => actualizarCantidad(-1)}>-</button>
            <span>{cantidad}</span>
            <button onClick={() => actualizarCantidad(1)}>+</button>
          </div>

          <button className="detalle-btn-add" onClick={agregarAlCarrito}>
            + Añadir
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;

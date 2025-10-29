import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "@config/api";
import "./producto-detalle.css";
import { AiOutlineArrowLeft } from "react-icons/ai";

function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducto = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        if (!res.ok) throw new Error("Producto no encontrado");
        const data = await res.json();
        setProducto(data);
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
    setCantidad((prev) => {
      const nueva = prev + operacion;
      return nueva > 0 ? nueva : 1;
    });
  };

  const handleAddToCart = () => {
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    const existe = carritoActual.find((p) => p._id === producto._id);

    if (existe) {
      existe.cantidad += cantidad;
    } else {
      carritoActual.push({ ...producto, cantidad });
    }

    localStorage.setItem("carrito", JSON.stringify(carritoActual));
    navigate("/carrito");
  };

  if (loading) return <p>Cargando producto...</p>;
  if (error || !producto) return <p>{error || "Producto no encontrado"}</p>;

  return (
    <div className="detalle-wrapper">
      <div className="detalle-card">
        <div className="detalle-header">
          <button
            className="detalle-back"
            type="button"
            onClick={() => navigate(-1)}
          >
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
          <p className="detalle-precio">${producto.precio}</p>
        </div>

        <div className="detalle-actions">
          <div className="detalle-cantidad">
            <button onClick={() => actualizarCantidad(-1)}>-</button>
            <span>{cantidad}</span>
            <button onClick={() => actualizarCantidad(1)}>+</button>
          </div>
          <button className="detalle-btn-add" onClick={handleAddToCart}>
            + Añadir
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;

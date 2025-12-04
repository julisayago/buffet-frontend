import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./detalle-pedido.css";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Loader from "@components/loader/loader";
import { API_URL } from "@config/api";

const Detalle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/orders/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error al cargar el pedido");

        const data = await response.json();
        setPedido(data.order);
      } catch (error) {
        console.error("Error fetching pedido:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedido();
  }, [id]);

  if (loading) return <Loader text="Cargando detalle..." />;

  if (!pedido) return <p>No se encontró el pedido.</p>;

  const total = pedido.items.reduce((acc, item) => acc + item.subtotal, 0);

  return (
    <div className="pedidoDetalle-container">
      <div className="pedidoDetalle-card">
        <div className="pedidoDetalle-header">
          <button
            className="back-button"
            type="button"
            onClick={() => navigate(-1)}
          >
            <AiOutlineArrowLeft size={20} />
          </button>
          <h2 className="pedidoDetalle-title">
            Detalle pedido {pedido.numero_pedido || `#${pedido.id}`}
          </h2>
        </div>

        {pedido.items.map((item) => (
          <div className="pedidoDetalle-item" key={item.id}>
            <img
              src={
                item.product?.imagen
                  ? `${API_URL.replace("/api", "")}${item.product.imagen}`
                  : "https://via.placeholder.com/80"
              }
              alt={item.product?.nombre}
            />

            <div className="pedidoDetalle-info">
              <p className="pedidoDetalle-nombre">{item.product.nombre}</p>
              <p className="pedidoDetalle-precio">
                $
                {item.precio.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="pedidoDetalle-cantidad">
                Cantidad: {item.cantidad}
              </p>
              <p className="pedidoDetalle-precio">
                Total: $
                {(item.precio * item.cantidad).toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        ))}

        <div className="pedidoDetalle-total">
          <p>Total:</p>
          <p className="pedidoDetalle-total-precio">
            ${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="pedidoDetalle-info-extra">
          <p>
            <strong>Método de pago:</strong>{" "}
            {pedido.metodo_pago || "No especificado"}
          </p>

          {pedido.notas && (
            <p>
              <strong>Notas:</strong> {pedido.notas}
            </p>
          )}
        </div>

        <button className="btn-qr" onClick={() => navigate(`/qr/${pedido.id}`)}>
          Ver QR
        </button>
      </div>
    </div>
  );
};

export default Detalle;

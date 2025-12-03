import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./pedidos.css";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Loader from "@components/loader/loader";
import { API_URL } from "@config/api";

const Pedidos = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/orders/my-orders`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error al cargar pedidos");

        const data = await response.json();
        setPedidos(data.orders);
      } catch (error) {
        console.error("Error fetching pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  if (loading) return <Loader text="Cargando pedidos..." />;

  return (
    <div className="pedidos-container">
      <div className="pedidos-card">
        <div className="pedidos-header">
          <button
            className="detalle-back"
            type="button"
            onClick={() => navigate(-1)}
          >
            <AiOutlineArrowLeft size={20} />
          </button>
          <h2 className="pedidos-title">Mis pedidos</h2>
        </div>

        {pedidos.length === 0 ? (
          <p>No tenés pedidos aún.</p>
        ) : (
          pedidos.map((pedido) => (
            <div className="pedido-item" key={pedido.id}>
              <div className="pedido-info">
                <p className="pedido-numero">
                  Pedido: {pedido.numero_pedido || `#${pedido.id}`}
                </p>
                <p className="pedido-total">
                  Total: $
                  {pedido.total.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="pedido-right">
                <span
                  className={`pedido-estado ${pedido.estado.toLowerCase()}`}
                >
                  {pedido.estado}
                </span>
                <button
                  className="btn-detalle"
                  onClick={() => navigate(`/detalle/${pedido.id}`)}
                >
                  Ver detalle →
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Pedidos;

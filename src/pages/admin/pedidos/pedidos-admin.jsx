import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaBan, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./pedidos-admin.css";
import Loader from "@components/loader/loader";
import { API_URL } from "@config/api";

export default function PedidosAdmin() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pedidoACancelar, setPedidoACancelar] = useState(null);
  const [pedidoDetalle, setPedidoDetalle] = useState(null);

  // Estados para búsqueda y filtros
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/orders`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Error al cargar pedidos");
        setPedidos(data.orders || []);
      } catch (err) {
        console.error("Error al obtener pedidos:", err);
        setError(err.message);
        toast.error("Error al cargar pedidos: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const confirmarCancelacion = async () => {
    if (!pedidoACancelar) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${API_URL}/orders/${pedidoACancelar.id}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al cancelar pedido");

      setPedidos((prev) =>
        prev.map((p) =>
          p.id === pedidoACancelar.id ? { ...p, estado: "Cancelado" } : p
        )
      );
      toast.success(
        `Pedido #${pedidoACancelar.numero_pedido} cancelado correctamente`
      );
      setPedidoACancelar(null);
    } catch (err) {
      console.error("Error al cancelar pedido:", err);
      setError(err.message);
      toast.error("Error al cancelar pedido: " + err.message);
    }
  };

  const cerrarPopup = () => setPedidoACancelar(null);
  const cerrarDetalle = () => setPedidoDetalle(null);

  const actualizarEstadoPedido = async (id, nuevoEstado) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Error al actualizar estado");

      // Actualizar en pantalla
      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
      );

      toast.success(`Estado actualizado a "${nuevoEstado}"`);
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      toast.error("Error al cambiar estado: " + err.message);
    }
  };

  const mostrarDetalle = async (pedido) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/orders/${pedido.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al cargar detalle");
      setPedidoDetalle(data.order);
    } catch (err) {
      console.error("Error al obtener detalle:", err);
      toast.error("Error al cargar detalle: " + err.message);
    }
  };

  if (loading) return <Loader text="Cargando pedidos..." />;
  if (error)
    return (
      <div className="admin-pedidos-error">
        <p>Error: {error}</p>
      </div>
    );

  // Aplicar búsqueda y filtros
  const pedidosFiltrados = pedidos
    .filter(
      (p) =>
        p.numero_pedido.toString().includes(busqueda) ||
        (p.user?.nombre || "").toLowerCase().includes(busqueda.toLowerCase())
    )
    .filter((p) =>
      estadoFiltro === "all"
        ? true
        : p.estado?.toLowerCase() === estadoFiltro.toLowerCase()
    );

  return (
    <div className="admin-pedidos-container">
      <div className="admin-pedidos-header">
        <h1 className="admin-pedidos-titulo">Pedidos</h1>
        <button
          className="admin-pedidos-agregar"
          onClick={() => navigate("/admin/pedidos/agregar")}
        >
          <FaPlus /> Agregar pedido
        </button>
      </div>
      {/* Barra de búsqueda y filtros */}
      <div className="admin-filtros">
        <input
          type="text"
          placeholder="Buscar por N° pedido o cliente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
        >
          <option value="all">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Listo">Listo</option>
          <option value="Cancelado">Cancelado</option>
          <option value="Entregado">Entregado</option>
        </select>
      </div>
      {/* Tabla de pedidos */}
      <div className="admin-pedidos-tabla-wrapper">
        <table className="admin-pedidos-tabla">
          <thead>
            <tr>
              <th>Número</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.length > 0 ? (
              pedidosFiltrados.map((pedido) => (
                <tr key={pedido.id}>
                  <td>{pedido.numero_pedido}</td>
                  <td>{pedido.user?.nombre || "Sin nombre"}</td>
                  <td>
                    $
                    {pedido.total.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td>
                    <select
                      value={pedido.estado}
                      onChange={(e) =>
                        actualizarEstadoPedido(pedido.id, e.target.value)
                      }
                      className={`admin-select-estado estado-${pedido.estado.toLowerCase()}`}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="listo">Listo</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </td>

                  <td>
                    {pedido.createdAt
                      ? new Date(pedido.createdAt).toLocaleDateString("es-AR")
                      : "-"}
                  </td>
                  <td>
                    <button
                      className="admin-pedidos-boton detalle"
                      onClick={() => mostrarDetalle(pedido)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="admin-pedidos-boton cancelar"
                      onClick={() => setPedidoACancelar(pedido)}
                    >
                      <FaBan />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No hay pedidos que coincidan con la búsqueda o filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Popup cancelar pedido */}
      {pedidoACancelar && (
        <div className="admin-popup-overlay">
          <div className="admin-popup">
            <p>
              ¿Deseás cancelar el pedido
              <strong>#{pedidoACancelar.numero_pedido}</strong>?
            </p>
            <div className="admin-popup-acciones">
              <button className="confirmar" onClick={confirmarCancelacion}>
                Cancelar pedido
              </button>
              <button className="cancelar" onClick={cerrarPopup}>
                Volver
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal detalle pedido */}
      {pedidoDetalle && (
        <div className="admin-popup-overlay">
          <div className="admin-popup detalle">
            <h2>Detalle Pedido #{pedidoDetalle.numero_pedido}</h2>
            <p>
              <strong>Cliente:</strong> {pedidoDetalle.user?.nombre}
            </p>
            <p>
              <strong>Email:</strong> {pedidoDetalle.user?.email}
            </p>
            <p>
              <strong>Teléfono:</strong> {pedidoDetalle.user?.telefono}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              {pedidoDetalle.estado.charAt(0).toUpperCase() +
                pedidoDetalle.estado.slice(1).toLowerCase()}
            </p>
            <p>
              <strong>Total:</strong> $
              {pedidoDetalle.total.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </p>
            <p>
              <strong>Productos:</strong>
            </p>
            <ul className="detalle-productos">
              {pedidoDetalle.items?.map((item) => (
                <li key={item.id} className="detalle-producto-item">
                  <img
                    src={
                      item.product?.imagen
                        ? `${API_URL.replace("/api", "")}${item.product.imagen}`
                        : "/placeholder.png"
                    }
                    alt={item.product?.nombre}
                    className="detalle-producto-imagen"
                  />
                  <div>
                    <span>{item.product?.nombre}</span> Cantidad:{" "}
                    {item.cantidad} - $
                    {item.subtotal.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </li>
              ))}
            </ul>
            <button className="cancelar" onClick={cerrarDetalle}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

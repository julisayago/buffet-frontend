import { useEffect, useState } from "react";
import "./dashboard.css";
import Loader from "@components/loader/loader";
import { API_URL } from "@config/api";

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const est = data.data.estadisticas;

          setStats({
            totalOrders: est.total_pedidos,
            totalProducts: est.total_productos,
            totalUsers: est.total_usuarios,
          });

          setOrdersByStatus([
            { nombre: "Pendientes", count: est.pedidos_pendientes },
            { nombre: "Entregados", count: est.pedidos_entregados },
          ]);

          setRecentOrders(
            data.data.pedidos_recientes.map((o) => ({
              id: o.id,
              total: o.total,
              estado: o.estado,
              fecha: o.fecha,
              usuario: o.usuario || { nombre: "Cliente", email: "N/A" },
            }))
          );
        }
      })
      .catch((err) => console.error("Error al cargar dashboard:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Cargando panel..." />;

  const COLORS = ["#01538D", "#4cbcd0ff"];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Panel de administración</h1>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Pedidos totales</h3>
          <p>{stats.totalOrders}</p>
        </div>

        <div className="stat-card">
          <h3>Productos</h3>
          <p>{stats.totalProducts}</p>
        </div>

        <div className="stat-card">
          <h3>Usuarios</h3>
          <p>{stats.totalUsers}</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-left">
          <div className="dashboard-section">
            <h2>Pedidos por estado</h2>

            <div className="chart-container">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={ordersByStatus}
                    dataKey="count"
                    nameKey="nombre"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    stroke="#fff"
                    strokeWidth={2}
                    label
                  >
                    {ordersByStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index]}
                        style={{
                          filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.15))",
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Últimos pedidos</h2>
          <table className="recent-orders-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.usuario.nombre}</td>
                  <td>{order.usuario.email}</td>
                  <td>{new Date(order.fecha).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

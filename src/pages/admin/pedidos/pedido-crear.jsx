import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PedidoForm from "@admincomponents/pedido-form/pedido-form";
import { API_URL } from "@config/api";
import { toast } from "react-toastify";

export default function PedidoCrear() {
  const navigate = useNavigate();
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar productos y usuarios
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [productosRes, usuariosRes] = await Promise.all([
          fetch(`${API_URL}/products`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const productosData = await productosRes.json();
        const usuariosData = await usuariosRes.json();

        setProductosDisponibles(productosData.products || []);
        setUsuariosDisponibles(usuariosData.data?.users || []); 
      } catch (err) {
        console.error("Error al cargar datos:", err);
        toast.error("Error al cargar productos o usuarios");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (payload) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al crear pedido");

      toast.success("Pedido creado correctamente");
      navigate("/admin/pedidos");
    } catch (err) {
      console.error("Error al crear pedido:", err);
      toast.error("Error al crear pedido: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PedidoForm
      onSubmit={handleSubmit}
      title="Crear Pedido"
      productosDisponibles={productosDisponibles}
      usuariosDisponibles={usuariosDisponibles}
      loading={loading}
    />
  );
}

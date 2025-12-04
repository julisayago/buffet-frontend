import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductoForm from "@admincomponents/producto-form/producto-form";
import { API_URL } from "@config/api";
import { toast } from "react-toastify"; 

export default function ProductoCrear() {
  const navigate = useNavigate();
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    category_id: "",
    stock: "",
    disponible: true,
    destacado: false,
    promocion: false,
    precio_promocion: "",
    image: null,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e, categorias) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      for (const key in producto) {
        let value = producto[key];

        // Imagen
        if (key === "image" && value instanceof File) {
          formData.append("image", value);
          continue;
        }

        // Convertir precio a número
        if (key === "precio" || key === "precio_promocion") {
          if (value !== "") {
            value = parseFloat(value);
          }
        }

        // Convertir booleanos
        if (
          key === "disponible" ||
          key === "destacado" ||
          key === "promocion"
        ) {
          value = value ? "true" : "false"; 
        }

        // Agregar si no está vacío
        if (value !== "" && value !== null) {
          formData.append(key, value);
        }
      }

      // Normalizar categoría
      formData.set("category_id", producto.category_id);

      const token = localStorage.getItem("token");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, 
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al crear producto");

      toast.success("Producto creado correctamente");
      navigate("/admin/productos");
    } catch (err) {
      console.error("Error al crear producto:", err);
      toast.error("Error al crear producto: " + err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductoForm
      producto={producto}
      setProducto={setProducto}
      onSubmit={handleSubmit}
      title="Crear Producto"
      error={error}
      loading={loading}
    />
  );
}

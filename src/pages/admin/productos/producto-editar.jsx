import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductoForm from "@admincomponents/producto-form/producto-form";
import Loader from "@components/loader/loader";
import { API_URL } from "@config/api";
import { toast } from "react-toastify";

export default function ProductoEditar() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [producto, setProducto] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Traer producto
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Producto no encontrado");
        setProducto({
          ...data.product,
          category_id: data.product.category_id?.toString() || "",
          promocion: Boolean(data.product.promocion),
          disponible: Boolean(data.product.disponible),
          imagenUrl: data.product.imagen,
          image: null,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  // Traer categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const categoriasBack = data.categories.map((cat) => ({
          id: cat.id,
          nombre: cat.nombre.charAt(0).toUpperCase() + cat.nombre.slice(1),
        }));
        setCategorias(categoriasBack);
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    };
    fetchCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      for (const key in producto) {
        let value = producto[key];

        if (key === "image" || key === "imagenUrl") continue;

        // Números
        if (["precio", "precio_promocion", "stock"].includes(key)) {
          if (value !== "" && value !== null) {
            formData.set(key, parseFloat(value));
          }
          continue;
        }

        // Booleanos
        if (["disponible", "destacado", "promocion"].includes(key)) {
          formData.set(key, value ? "true" : "false");
          continue;
        }

        // Otros campos (nombre, descripcion, category_id, etc.)
        if (value !== "" && value !== null && value !== undefined) {
          formData.set(key, value);
        }
      }

      if (producto.image instanceof File) {
        formData.append("image", producto.image);
      }

      if (producto.category_id) {
        formData.set("category_id", producto.category_id);
      }

      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Error al actualizar producto");

      toast.success("Producto actualizado correctamente");
      navigate("/admin/productos");
    } catch (err) {
      console.error("Error al actualizar producto:", err);
      toast.error("Error al actualizar producto: " + err.message);
      setError(err.message);
    }
  };

  if (loading) return <Loader text="Cargando producto..." />;
  if (error) return <p className="error">{error}</p>;
  if (!producto) return <p>No se encontró el producto</p>;

  return (
    <ProductoForm
      producto={producto}
      setProducto={setProducto}
      onSubmit={handleSubmit}
      title="Editar Producto"
    />
  );
}

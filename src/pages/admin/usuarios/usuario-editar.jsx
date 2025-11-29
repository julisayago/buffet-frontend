import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UsuarioForm from "@admincomponents/usuario-form/usuario-form";
import Loader from "@components/loader/loader";
import { API_URL } from "@config/api";
import { toast } from "react-toastify";

export default function UsuarioEditar() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Traer usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/users/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setUsuario(data.user);
      } catch (error) {
        console.error("Error al cargar usuario:", error);
        toast.error("Error al cargar usuario"); 
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const body = {
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono,
        role: usuario.role,
      };

      const res = await fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al actualizar usuario");

      toast.success("Usuario actualizado correctamente");
      navigate("/admin/usuarios");
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      toast.error("Error al actualizar usuario: " + error.message); 
    }
  };

  if (loading) return <Loader text="Cargando usuario..." />;
  if (!usuario) return <p>No se encontró el usuario</p>;

  return (
    <UsuarioForm
      usuario={usuario}
      setUsuario={setUsuario}
      onSubmit={handleSubmit}
      title="Editar Usuario"
    />
  );
}

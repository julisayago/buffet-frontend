import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UsuarioForm from "@admincomponents/usuario-form/usuario-form";
import Loader from "@components/loader/loader";
import { API_URL } from "@config/api";

export default function UsuarioEditar() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

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

      await fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      navigate("/admin/usuarios");
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
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

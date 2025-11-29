import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UsuarioForm from "@admincomponents/usuario-form/usuario-form";
import { API_URL } from "@config/api";
import { toast } from "react-toastify"; 

export default function UsuarioCrear() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({
    nombre: "",
    email: "",
    telefono: "",
    role: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!usuario.password || usuario.password.length < 6) {
        toast.error("La contraseña debe tener al menos 6 caracteres."); 
        return;
      }

      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(usuario),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al crear usuario");

      toast.success("Usuario creado correctamente"); 
      navigate("/admin/usuarios");
    } catch (error) {
      console.error("Error al crear usuario:", error);
      toast.error("Ocurrió un error al crear el usuario: " + error.message); 
    }
  };

  return (
    <UsuarioForm
      usuario={usuario}
      setUsuario={setUsuario}
      onSubmit={handleSubmit}
      title="Crear Usuario"
      isCrear={true} 
    />
  );
}

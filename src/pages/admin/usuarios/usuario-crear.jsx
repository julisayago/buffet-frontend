import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UsuarioForm from "@admincomponents/usuario-form/usuario-form";
import { API_URL } from "@config/api";

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
        alert("La contraseña debe tener al menos 6 caracteres.");
        return;
      }

      await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(usuario),
      });

      navigate("/admin/usuarios");
    } catch (error) {
      console.error("Error al crear usuario:", error);
      alert("Ocurrió un error al crear el usuario.");
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

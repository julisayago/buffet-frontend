import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Si no hay usuario logueado, redirige al login
  if (!usuario) return <Navigate to="/login" />;

  // Si se requiere un rol específico y el usuario no lo tiene, redirige al login
  if (requiredRole && usuario.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  // Si todo está bien, renderiza el contenido protegido
  return children;
}

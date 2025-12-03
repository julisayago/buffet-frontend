import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "./layout/admin-layout";
import UserLayout from "./layout/user-layout";
import AdminRoutes from "./routes/admin-routes";
import UserRoutes from "./routes/user-routes";
import Login from "@pages/login";
import Register from "@pages/user/registro/registro";
import ProtectedRoute from "@components/protected-route";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas de usuario protegidas */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <UserLayout>
                <UserRoutes />
              </UserLayout>
            </ProtectedRoute>
          }
        />

        {/* Rutas de admin protegidas */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <AdminRoutes />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;

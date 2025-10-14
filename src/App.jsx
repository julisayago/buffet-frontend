import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "@pages/login";
import Home from "@pages/user/home";
import Register from "@pages/user/register";
import Contacto from "@pages/user/contacto";
import Productos from "@pages/user/productos";
import ProductoDetalle from "@pages/user/producto-detalle";
import Carrito from "@pages/user/carrito";
import Pedidos from "@pages/user/pedidos";
import Detalle from "@pages/user/detalle";
import QRPage from "@pages/user/qr-page";
import Perfil from "@pages/user/perfil";
import './app.css';
import Navbar from '@components/navbar/navbar.jsx';
import Footer from '@components/footer/footer.jsx';

function AppLayout() {
  const location = useLocation();

  const hideNavFooter = location.pathname === "/" || location.pathname === "/register";

  return (
    <>
      {!hideNavFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/detalle/:id" element={<Detalle />} />
        <Route path="/qr/:id" element={<QRPage />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
      {!hideNavFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;



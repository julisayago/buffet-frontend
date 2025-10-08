import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "@pages/login";
import Home from "@pages/home";
import Register from "@pages/register";
import Contacto from "@pages/contacto";
import Productos from "@pages/productos";
import ProductoDetalle from "@pages/producto-detalle";
import Carrito from "@pages/carrito";
import Pedidos from "@pages/pedidos";
import Detalle from "@pages/detalle";
import QRPage from "@pages/qr-page";
import Perfil from "@pages/perfil";
import './app.css';
import Navbar from '@components/navbar.jsx';
import Footer from '@components/footer.jsx';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
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
      <Footer />
    </BrowserRouter>
  );
}

export default App;


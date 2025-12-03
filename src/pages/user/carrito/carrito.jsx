import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@usercomponents/navbar/navbar";
import { AiOutlineClose, AiOutlineArrowLeft } from "react-icons/ai";
import "./carrito.css";
import { API_URL } from "@config/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const normalizeCart = (cart) => {
  const normalized = {};
  cart.forEach((item) => {
    const producto = item.producto ?? item.id;
    if (!producto) return;
    if (normalized[producto]) {
      normalized[producto].cantidad += item.cantidad;
    } else {
      normalized[producto] = {
        producto: Number(producto),
        cantidad: item.cantidad,
      };
    }
  });
  return Object.values(normalized);
};

const handleAddToCart = async (producto, setMensaje) => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return;
  }
  const userId = localStorage.getItem("user_id");
  try {
    const res = await fetch(`${API_URL}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify({
        producto_id: producto.id,
        cantidad: producto.cantidad || 1,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Error agregando al carrito");
    }

    setMensaje(`${producto.nombre} añadido al carrito`);

    const localCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
    const updatedCart = normalizeCart([
      ...localCart,
      { producto: producto.id, cantidad: producto.cantidad || 1 },
    ]);

    localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
    window.dispatchEvent(
      new CustomEvent("cartUpdated", { detail: { producto: producto.id } })
    );
    setTimeout(() => setMensaje(""), 2000);
  } catch (error) {
    console.error("Error agregando al carrito:", error);
    setMensaje("Error al agregar al carrito");
    setTimeout(() => setMensaje(""), 2000);
  }
};

const fetchCartItems = async (items) => {
  const res = await fetch(`${API_URL}/cart/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify({ items }),
  });
  return res.json();
};

const updateCartItem = async (producto_id, cantidad) => {
  const res = await fetch(`${API_URL}/cart/update`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify({ producto_id, cantidad }),
  });
  return res.json();
};

const removeFromCart = async (producto_id) => {
  const res = await fetch(`${API_URL}/cart/remove`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify({ producto_id }),
  });
  return res.json();
};

const createOrder = async (items, metodo_pago = "efectivo", notas = "") => {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify({ items, metodo_pago, notas }),
  });
  return res.json();
};

function Carrito({ onClose }) {
  const navigate = useNavigate();
  const [step, setStep] = useState("carrito");
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [notas, setNotas] = useState("");

  const loadCart = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("user_id");
      const localCart =
        JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
      if (localCart.length === 0) {
        setCarrito([]);
        return;
      }
      const response = await fetchCartItems(localCart);
      setCarrito(response.items || []);
    } catch (error) {
      console.error("Error cargando carrito:", error);
      setCarrito([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const actualizarCantidad = async (productoId, operacion) => {
    const item = carrito.find((i) => i.producto === productoId);
    if (!item) return;
    const nuevaCantidad = item.cantidad + operacion;
    if (nuevaCantidad < 0) return;

    try {
      const res = await updateCartItem(productoId, nuevaCantidad);
      if (res.success) {
        const nuevoCarrito =
          res.action === "removed"
            ? carrito.filter((i) => i.producto !== productoId)
            : carrito.map((i) =>
                i.producto === productoId
                  ? { ...i, cantidad: nuevaCantidad }
                  : i
              );
        setCarrito(nuevoCarrito);
        const userId = localStorage.getItem("user_id");
        localStorage.setItem(`cart_${userId}`, JSON.stringify(nuevoCarrito));

        window.dispatchEvent(new CustomEvent("cartUpdated"));
      } else alert(res.message);
    } catch (error) {
      console.error("Error actualizando cantidad:", error);
    }
  };

  const eliminarProducto = async (productoId) => {
    try {
      const res = await removeFromCart(productoId);
      if (res.success) {
        const nuevoCarrito = carrito.filter((i) => i.producto !== productoId);
        setCarrito(nuevoCarrito);
        const userId = localStorage.getItem("user_id");
        localStorage.setItem(`cart_${userId}`, JSON.stringify(nuevoCarrito));
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      } else alert(res.message);
    } catch (error) {
      console.error("Error eliminando producto:", error);
    }
  };

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const confirmarPedido = async () => {
  try {
    const items = carrito.map((item) => ({
      producto: item.producto,
      cantidad: item.cantidad,
    }));
    const res = await createOrder(items, metodoPago, notas);
    if (res.success) {
      setStep("gracias");
      const userId = localStorage.getItem("user_id");
      localStorage.removeItem(`cart_${userId}`);
      setCarrito([]);
    } else alert(res.message);
  } catch (error) {
    console.error("Error creando pedido:", error);
  }
};


  if (loading) return <p>Cargando carrito...</p>;

  return (
    <>
      <div className="mobile-only">
        <Navbar />
      </div>
      <div className="carrito-container">
        <div className="carrito-card">
          <button className="carrito-close-desktop" onClick={onClose}>
            <AiOutlineClose size={22} />
          </button>

          {/* Paso Carrito */}
          {step === "carrito" && (
            <>
              <div className="carrito-header">
                <button
                  className="carrito-back"
                  type="button"
                  onClick={() => navigate(-1)}
                >
                  <AiOutlineArrowLeft size={20} />
                </button>
                <h2 className="carrito-titulo">Carrito</h2>
              </div>

              {carrito.length === 0 ? (
                <div className="carrito-vacio-wrapper">
                  <div className="carrito-vacio-content">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="carrito-vacio-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <p className="carrito-vacio-texto">Tu carrito está vacío</p>
                  </div>
                  <button
                    className="btn-checkout vacio-boton"
                    onClick={() => navigate("/productos")}
                  >
                    Ver productos
                  </button>
                </div>
              ) : (
                <>
                  {carrito.map((item) => (
                    <div className="carrito-item" key={item.producto}>
                      <button
                        className="btn-remove"
                        onClick={() => eliminarProducto(item.producto)}
                      >
                        ✕
                      </button>
                      <img src={item.img} alt={item.nombre} />
                      <div className="carrito-info">
                        <p className="carrito-nombre">{item.nombre}</p>
                        <div className="carrito-precio-cantidad">
                          <p className="carrito-precio">
                            $
                            {(item.precio * item.cantidad).toLocaleString(
                              "es-AR",
                              { minimumFractionDigits: 2 }
                            )}
                          </p>
                          <div className="carrito-cantidad">
                            <button
                              onClick={() =>
                                actualizarCantidad(item.producto, -1)
                              }
                            >
                              -
                            </button>
                            <span>{item.cantidad}</span>
                            <button
                              onClick={() =>
                                actualizarCantidad(item.producto, 1)
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="carrito-total-container">
                    <p className="carrito-total-texto">Total:</p>
                    <p className="carrito-total-precio">
                      $
                      {total.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                  <div className="carrito-botones">
                    <button
                      className="btn-checkout"
                      onClick={() => setStep("confirmar")}
                    >
                      Finalizar Compra
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {/* Paso Confirmar */}
          {step === "confirmar" && (
            <>
              <div className="carrito-header">
                <button
                  className="carrito-back"
                  onClick={() => setStep("carrito")}
                >
                  <AiOutlineArrowLeft size={20} />
                </button>
                <button
                  className="carrito-back-desktop"
                  onClick={() => setStep("carrito")}
                >
                  <AiOutlineArrowLeft size={20} />
                </button>
                <h2 className="carrito-titulo">Confirmar Compra</h2>
              </div>

              <p className="confirmar-texto">
                Revisa tu pedido antes de finalizar la compra.
              </p>

              <div className="confirmar-items">
                {carrito.map((item) => (
                  <div className="confirmar-card" key={item.id}>
                    <span>{item.nombre}</span>
                    <span>
                      $
                      {item.precio.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}
                      x {item.cantidad} = $
                      {(item.precio * item.cantidad).toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                    <button
                      className="btn-remove"
                      onClick={() => eliminarProducto(item.producto)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className="confirmar-metodo-pago">
                <label>Método de pago:</label>
                <select
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="qr">QR</option>
                </select>
              </div>

              <div className="confirmar-notas">
                <label>Notas adicionales:</label>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Escribe aquí alguna indicación sobre tu pedido..."
                />
              </div>

              <div className="confirmar-total">
                <p>Total a pagar:</p>
                <p>
                  ${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </p>
              </div>

              <button className="btn-checkout" onClick={confirmarPedido}>
                Confirmar Pedido
              </button>
            </>
          )}

          {/* Paso Gracias */}
          {step === "gracias" && (
            <div className="gracias-content-nuevo">
              <h2 className="gracias-titulo">¡Gracias por tu compra!</h2>
              <p className="gracias-texto">
                Tu pedido está siendo procesado. Te avisaremos cuando esté
                listo.
              </p>
              <div className="gracias-botones">
                <button
                  className="btn-checkout"
                  onClick={() => navigate("/home")}
                >
                  Volver a inicio
                </button>
                <button
                  className="btn-checkout"
                  onClick={() => navigate("/pedidos")}
                >
                  Ver pedidos
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export { handleAddToCart };
export default Carrito;

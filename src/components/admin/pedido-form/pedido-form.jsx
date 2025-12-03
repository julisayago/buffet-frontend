import { useState } from "react";
import Select from "react-select"; 
import "./pedido-form.css";

export default function PedidoForm({
  onSubmit,
  title,
  productosDisponibles,
  usuariosDisponibles,
}) {
  const [items, setItems] = useState([{ producto: "", cantidad: 1 }]);
  const [usuario, setUsuario] = useState(null); 
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [notas, setNotas] = useState("");

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const agregarProducto = () =>
    setItems([...items, { producto: "", cantidad: 1 }]);
  const eliminarProducto = (index) =>
    setItems(items.filter((_, i) => i !== index));

  const getPrecioProducto = (id) => {
    const prod = productosDisponibles.find((p) => p.id === id);
    if (!prod) return 0;
    return prod.precio_promocion && prod.precio_promocion > 0
      ? prod.precio_promocion
      : prod.precio;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validItems = items.filter(
      (i) => i.producto && Number(i.cantidad) > 0
    );
    if (!usuario) return alert("Seleccioná un cliente");
    if (validItems.length === 0) return alert("Agregá al menos un producto");

    const payload = {
      user_id: Number(usuario.value), 
      metodo_pago: metodoPago,
      notas,
      items: validItems.map((i) => ({
        producto: i.producto,
        cantidad: Number(i.cantidad),
      })),
    };

    onSubmit(payload);
  };

  const usuarioOptions = usuariosDisponibles.map((u) => ({
    value: u.id,
    label: `${u.nombre} (${u.email})`,
  }));

  const productoOptions = productosDisponibles.map((p) => ({
    value: p.id,
    label: `${p.nombre} ($${
      p.precio_promocion && p.precio_promocion > 0
        ? p.precio_promocion
        : p.precio
    })`,
  }));

  const total = items.reduce(
    (acc, item) =>
      acc +
      (item.producto
        ? getPrecioProducto(item.producto) * Number(item.cantidad)
        : 0),
    0
  );

  return (
    <div className="admin-pedidos-form-container">
      <form onSubmit={handleSubmit} className="admin-pedidos-form">
        <h2>{title}</h2>

        <label>
          Cliente:
          <div className="select-wrapper">
            <Select
              options={usuarioOptions}
              value={usuario}
              onChange={setUsuario}
              placeholder="Seleccionar cliente..."
            />
          </div>
        </label>

        <label>
          Método de pago:
          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            required
          >
            <option value="">Seleccionar</option>
            <option value="efectivo">Efectivo</option>
            <option value="qr">QR</option>
            <option value="tarjeta">Tarjeta</option>
          </select>
        </label>

        <label>
          Notas:
          <textarea value={notas} onChange={(e) => setNotas(e.target.value)} />
        </label>

        <h3 className="titulo-productos">Productos</h3>
        {items.map((item, index) => (
          <div key={index} className="admin-pedidos-item">
            <div className="select-wrapper">
              <Select
                options={productoOptions}
                value={
                  productoOptions.find((p) => p.value === item.producto) || null
                }
                onChange={(p) => handleItemChange(index, "producto", p.value)}
                placeholder="Seleccionar producto..."
              />
            </div>

            <input
              type="number"
              min="1"
              value={item.cantidad}
              onChange={(e) =>
                handleItemChange(index, "cantidad", e.target.value)
              }
              required
              id="cantidad"
            />

            <span className="subtotal">
              Subtotal: $
              {item.producto
                ? (
                    getPrecioProducto(item.producto) * Number(item.cantidad)
                  ).toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : (0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            </span>

            {items.length > 1 && (
              <button
                className="eliminar-producto"
                type="button"
                onClick={() => eliminarProducto(index)}
              >
                ❌
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className="agregar-producto"
          onClick={agregarProducto}
        >
          + Agregar producto
        </button>

        <h3>
          Total: $
          {total.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </h3>

        <div className="admin-pedidos-form-acciones">
          <button type="submit">Guardar</button>
          <button type="button" onClick={() => window.history.back()}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

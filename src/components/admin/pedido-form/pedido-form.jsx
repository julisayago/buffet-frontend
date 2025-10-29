import "./pedido-form.css";

export default function PedidoForm({
  onSubmit,
  title,
  productosDisponibles,
  usuariosDisponibles,
}) {
  return (
    <div className="admin-pedidos-form-container">
      <form onSubmit={onSubmit} className="admin-pedidos-form">
        <h2>{title}</h2>

        <label>
          Cliente:
          <select name="usuario" required>
            <option value="">Seleccionar</option>
            {usuariosDisponibles.map((u) => (
              <option key={u._id} value={u._id}>
                {u.nombre} ({u.email})
              </option>
            ))}
          </select>
        </label>

        <label>
          Método de pago:
          <select name="metodoPago" required>
            <option value="">Seleccionar</option>
            <option value="efectivo">Efectivo</option>
            <option value="qr">Billetera virtual</option>
          </select>
        </label>

        <label>
          Estado:
          <select name="estado" required>
            <option value="">Seleccionar</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmado">Confirmado</option>
            <option value="preparando">Preparando</option>
            <option value="listo">Listo</option>
            <option value="entregado">Entregado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </label>

        <label>
          Notas:
          <textarea name="notas" />
        </label>

        <h3>Productos</h3>
        <div className="admin-pedidos-item">
          <select name="producto" required>
            <option value="">Seleccionar producto</option>
            {productosDisponibles.map((p) => (
              <option key={p._id} value={p._id}>
                {p.nombre}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="cantidad"
            min="1"
            defaultValue="1"
            required
          />
        </div>

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


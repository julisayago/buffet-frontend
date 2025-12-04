import React, { useState } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import { FiCheck } from "react-icons/fi";
import { ToastContainer } from "react-toastify";
import "./notificaciones.css";

const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [open, setOpen] = useState(false);

  const notificacionesNoLeidas = notificaciones.filter((n) => !n.leida).length;

  const marcarComoLeida = (id) => {
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
  };

  const marcarTodasComoLeidas = () => {
    notificaciones.forEach((n) => marcarComoLeida(n.id));
  };

  const eliminarNotificacion = (id) => {
    setNotificaciones((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="notificaciones-container">
      <div className="icono-campana" onClick={() => setOpen(!open)}>
        <FaBell className="nav-icon" />
        {notificacionesNoLeidas > 0 && (
          <span className="contador">{notificacionesNoLeidas}</span>
        )}
      </div>

      {open && (
        <div className="lista-notificaciones">
          <div className="notificaciones-header">
            <h4>Notificaciones</h4>
            <FiCheck
              className="icono-marcar-todo"
              title="Marcar todas como leídas"
              onClick={marcarTodasComoLeidas}
            />
          </div>

          {notificaciones.length === 0 ? (
            <p className="sin-notificaciones">No hay notificaciones nuevas</p>
          ) : (
            notificaciones.map((n) => (
              <div
                key={n.id}
                className={`notificacion-item ${n.leida ? "leida" : ""}`}
                onClick={() => marcarComoLeida(n.id)}
              >
                <span>{n.mensaje}</span>
                <FaTimes
                  className="icono-eliminar"
                  title="Eliminar notificación"
                  onClick={(e) => {
                    e.stopPropagation();
                    eliminarNotificacion(n.id);
                  }}
                />
              </div>
            ))
          )}
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Notificaciones;

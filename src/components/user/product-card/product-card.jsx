import React from "react";
import { useNavigate } from "react-router-dom";
import "./product-card.css";

function ProductCard({ producto, onAddToCart }) {
  const navigate = useNavigate();

  // Evita que el clic del botón dispare el clic de la tarjeta
  const handleCardClick = (e) => {
    if (e.target.closest(".btn-add")) return;
    navigate(`/producto/${producto.id}`);
  };

  return (
    <div className="producto-card" onClick={handleCardClick}>
      <img src={producto.img} alt={producto.nombre} />
      <h3>{producto.nombre}</h3>

      <div className="producto-precio">
        {producto.promocion && producto.precio_promocion ? (
          <>
            <span className="precio-original">
              $
              {producto.precio.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </span>
            <span className="precio-promocion">
              $
              {producto.precio_promocion.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </span>
          </>
        ) : (
          <span>
            $
            {producto.precio.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
            })}
          </span>
        )}
      </div>

      {onAddToCart && (
        <button className="btn-add" onClick={() => onAddToCart(producto)}>
          + Añadir
        </button>
      )}
    </div>
  );
}

export default ProductCard;

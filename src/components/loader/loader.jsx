import React from "react";
import "./loader.css";

function Loader({ text = "Cargando..." }) {
  return (
    <div className="loader-container">
      <div className="loader-spinner"></div>
      <span className="loader-text">{text}</span>
    </div>
  );
}

export default Loader;

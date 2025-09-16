import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

import { AiFillHome } from "react-icons/ai";
import { FaBoxOpen } from "react-icons/fa";
import { FiShoppingBag, FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { MdLocalGroceryStore } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const [showNav, setShowNav] = useState(false);

  const toggleNav = () => setShowNav((prev) => !prev);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* LOGO */}
        <div className="logo">
          <img src="src/assets/Logo-buffet.png" alt="Logo buffet UNaB" />
        </div>

        {/* BUSCADOR */}
        <div className="search-box">
          <input type="text" placeholder=" Buscar..." />
        </div>

        {/* HAMBURGER */}
        <div className="menu-icon" onClick={toggleNav}>
          {showNav ? (
            <AiOutlineClose size={24} />
          ) : (
            <GiHamburgerMenu size={24} />
          )}
        </div>

        {/* CARRITO */}
        <div className="cart-icon">
          <MdLocalGroceryStore className="nav-icon-cart" />
        </div>

        {/* NAV LINKS */}
        <div className={`nav-elements ${showNav ? "active" : ""}`}>
          <ul>
            <li>
              <NavLink
                to="/"
                exact="true"
                activeclassname="active"
                onClick={() => setShowNav(false)}
              >
                <AiFillHome className="nav-icon" /> Inicio
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/"
                activeclassname="active"
                onClick={() => setShowNav(false)}
              >
                <FaBoxOpen className="nav-icon" /> Productos
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/"
                activeclassname="active"
                onClick={() => setShowNav(false)}
              >
                <FiShoppingBag className="nav-icon" /> Mis pedidos
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/"
                activeclassname="active"
                onClick={() => setShowNav(false)}
              >
                <FaUserCircle className="nav-icon" /> Mi cuenta
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/"
                activeclassname="active"
                onClick={() => setShowNav(false)}
              >
                <FiLogOut className="nav-icon" /> Cerrar Sesión
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

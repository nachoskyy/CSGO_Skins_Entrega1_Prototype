// src/components/Navbar.jsx
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Store } from "../data/store";

export default function Navbar() {

  // estado interno del contador del carrito
  const [cartCount, setCartCount] = useState(0);

  // función para recalcular total de unidades en carrito
  const recomputeCart = () => {
    try {
      const items = Store.getCart();
      const total = items.reduce((sum, it) => sum + Number(it.qty || 0), 0);
      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    // primera carga
    recomputeCart();

    // suscribirse SOLO a cambios del carrito
    const un = Store.subscribeCart(() => {
      recomputeCart();
    });

    return () => un();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-glass fixed-top">
      <div className="container">

        {/* LOGO */}
        <Link className="navbar-brand fw-bold" to="/">
          CSGO Skins
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div id="nav" className="collapse navbar-collapse">
          
          {/* Links izquierda */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink className="nav-link" to="/">Inicio</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/productos">Productos</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/nosotros">Nosotros</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/blog">Blog</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/contacto">Contáctanos</NavLink></li>
          </ul>

          {/* derecha */}
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><NavLink className="nav-link" to="/Auth">Login / Registro</NavLink></li>
            <li className="nav-item position-relative">
              <NavLink className="nav-link" to="/carrito">
                🛒 Carrito
                {cartCount > 0 && (
                  <span className="badge bg-success rounded-pill cart-badge ms-1">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            </li>
          </ul>

        </div>

      </div>
    </nav>
  );
}

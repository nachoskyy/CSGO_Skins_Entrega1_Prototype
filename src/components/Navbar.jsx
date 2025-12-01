// src/components/Navbar.jsx
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Store } from "../data/store";
import axios from "axios";

export default function Navbar() {

  const [cartCount, setCartCount] = useState(0);
  const [usuario, setUsuario] = useState(null);
  const [dolar, setDolar] = useState(null);

  // ================================
  // Cargar sesión usuario
  // ================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const nombre = localStorage.getItem("nombre");
    const email = localStorage.getItem("email");

    if (token && role && nombre) {
      setUsuario({ token, role, nombre, email });
    }
  }, []);

  function logout() {
    localStorage.clear();
    setUsuario(null);
    window.location.href = "/Auth";
  }

  // ================================
  // Carrito
  // ================================
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
    recomputeCart();
    const un = Store.subscribeCart(() => {
      recomputeCart();
    });
    return () => un();
  }, []);

  // ================================
  // Obtener precio del dólar
  // ================================
  // ================================
  // Obtener precio del dólar
  // ================================
  useEffect(() => {
    async function fetchDolar() {
      try {
        const res = await axios.get("http://localhost:8080/api/external/dolar");
        setDolar(res.data?.valor ?? null);
      } catch (err) {
        console.log("No se pudo obtener el dólar:", err);
      }
    }

    fetchDolar();
  }, []);


  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-glass fixed-top">
      <div className="container d-flex align-items-center justify-content-between">

        {/* LOGO */}
        <Link className="navbar-brand fw-bold" to="/">
          K&N Skins
        </Link>

        {/* BOTÓN HAMBURGUESA */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* CONTENIDO DEL NAVBAR */}
        <div id="nav" className="collapse navbar-collapse">

          {/* IZQUIERDA */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink className="nav-link" to="/">Inicio</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/productos">Productos</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/nosotros">Nosotros</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/blog">Blog</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/contacto">Contáctanos</NavLink></li>
          </ul>

          {/* DERECHA */}
          <ul className="navbar-nav ms-auto d-flex align-items-center">

            {dolar && (
              <span className="text-success fw-bold me-1">
                💵 1 USD = ${dolar}
              </span>
            )}

            {/* Usuario no logueado */}
            {!usuario && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/Auth">
                  Login / Registro
                </NavLink>
              </li>
            )}

            {/* Usuario logueado */}
            {usuario && (
              <>
                {usuario.role === "ADMIN" && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/dashboard">⚙ Panel Admin</NavLink>
                  </li>
                )}

                <li className="nav-item d-flex align-items-center mx-2 text-light">
                  <div
                    className="rounded-circle bg-success d-flex justify-content-center align-items-center me-2"
                    style={{ width: 32, height: 32, fontWeight: "bold" }}
                  >
                    {usuario.nombre.charAt(0).toUpperCase()}
                  </div>
                  <span>
                    Hola, {usuario.nombre.split(" ")[0]}
                    <small className="text-secondary"> ({usuario.role})</small>
                  </span>
                </li>

                <li className="nav-item d-flex align-items-center mx-2">
                  <button className="btn btn-sm btn-outline-danger" onClick={logout}>
                    Cerrar sesión
                  </button>
                </li>
              </>
            )}

            {/* Carrito */}
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

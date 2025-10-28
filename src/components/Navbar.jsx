import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Store, subscribe } from "../data/store";

export default function Navbar() {
  const [count, setCount] = useState(Store.getCartCount());

  useEffect(() => {
    setCount(Store.getCartCount());
    const un = subscribe(() => setCount(Store.getCartCount()));
    return un;
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom sticky-top shadow-sm" style={{zIndex: 1030}}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src="/img/logo.svg" alt="logo" height="20" onError={(e)=>{e.currentTarget.style.display='none';}}/>
          <span className="fw-bold">K&N Skins</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink className="nav-link" to="/">Inicio</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/categorias">Productos</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/blog">Blogs</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/nosotros">Nosotros</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/contacto">Contacto</NavLink></li>
          </ul>

          <div className="d-flex gap-2">
            <Link className="btn btn-outline-primary" to="/auth">Login / Registro</Link>
            <Link className="btn btn-outline-primary position-relative" to="/carrito">
              Carrito
              {count > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                  style={{ backgroundColor: "var(--brand)", color: "#061016" }}
                >
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Store, subscribe } from "../data/store";

export default function Navbar(){
  const [count, setCount] = useState(0);

  useEffect(()=>{
    const recalc = () => {
      try{
        const cart = Store.getCart();
        const c = Array.isArray(cart) ? cart.reduce((s,x)=> s + Number(x.qty||1), 0) : 0;
        setCount(Number.isFinite(c) ? c : 0);
      }catch{ setCount(0); }
    };
    recalc();
    const un = subscribe(recalc);
    return () => { try{ un && un(); }catch{} };
  },[]);

  const linkClass = ({ isActive }) => "nav-link px-3" + (isActive ? " active" : "");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top navbar-glass">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <span className="text-success">K&N</span> Skins
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div id="mainNav" className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink className={linkClass} to="/">Inicio</NavLink></li>
            <li className="nav-item"><NavLink className={linkClass} to="/productos">Productos</NavLink></li>
            <li className="nav-item"><NavLink className={linkClass} to="/blog">Blogs</NavLink></li>
            <li className="nav-item"><NavLink className={linkClass} to="/nosotros">Nosotros</NavLink></li>
            <li className="nav-item"><NavLink className={linkClass} to="/contacto">Contacto</NavLink></li>
          </ul>

          <div className="d-flex gap-2">
            <Link className="btn btn-outline-light btn-sm btn-soft" to="/auth">Login / Registro</Link>
            <Link className="btn btn-outline-light btn-sm btn-soft position-relative" to="/carrito">
              Carrito
              {count > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success cart-badge">
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

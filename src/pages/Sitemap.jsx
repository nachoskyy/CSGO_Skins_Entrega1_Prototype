//pagina del mapa del sitio
import { Link } from "react-router-dom";
import { Store } from "../data/store";

export default function SiteMap() {
  return (
    <div className="container mt-3">
      <h2 className="section-title">Mapa del sitio</h2>
      <section className="card p-3 mb-3">
        <h5 className="text-brand mb-2">Navegación</h5>
        <ul className="mb-0">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/productos">Productos</Link></li>
          <li><Link to="/blog">Blogs</Link></li>
          <li><Link to="/nosotros">Nosotros (¿Cómo funciona?)</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
          <li><Link to="/auth">Login / Registro</Link></li>
          <li><Link to="/carrito">Carrito</Link></li>
          <li><Link to="/checkout">Checkout</Link></li>
          <li><Link to="/admin">Admin</Link></li>
          <li><Link to="/admin/productos">Admin · Productos</Link></li>
          <li><Link to="/admin/ordenes">Admin · Órdenes</Link></li>
        </ul>
      </section>
    </div>
  );
}

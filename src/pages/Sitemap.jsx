import { Link } from "react-router-dom";
import { Store } from "../data/store";

export default function SiteMap() {
  // 1) Leemos productos de forma segura (sin romper la página si Store falla)
  let products = [];
  try {
    const data = typeof Store?.list === "function" ? Store.list() : [];
    // normalizamos por si el esquema cambia
    products = Array.isArray(data) ? data.map(p => ({
      id: p.id ?? crypto.randomUUID(),
      name: p.name ?? p.titulo ?? p.nombre ?? "Producto",
      price: Number(p.price ?? p.precio ?? 0),
      category: p.category ?? p.categoria ?? "Sin categoría",
    })) : [];
  } catch (_) {
    products = [];
  }

  // 2) Categorías únicas y ordenadas
  const categorias = [...new Set(products.map(p => p.category))].filter(Boolean).sort();

  // 3) Algunos “accesos rápidos” 
  const accesos = products.slice(0, 8);

  return (
    <div className="container mt-3">
      <h2 className="section-title">Mapa del sitio</h2>
      <section className="card p-3 mb-3">
        <h5 className="text-brand mb-2">Navegación</h5>
        <ul className="mb-0">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/categorias">Productos / Categorías</Link></li>
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

// ======================================================
// Página de Productos (con control de stock real)
// ======================================================
import { useEffect, useMemo, useState } from "react";
import { ProductsAPI, CategoriesAPI } from "../api";
import { Store } from "../data/store";

const uniq = arr => Array.from(new Set(arr));

export default function Products() {

  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todas");

  // Cargar productos al iniciar
  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      const productosBD = await ProductsAPI.getProducts();
      const categoriasBD = await CategoriesAPI.getCategories();

      // Mapeo para que coincida con tu UI
      const list = productosBD.map(p => ({
        id: p.id,
        name: p.nombre,
        price: p.precio,
        category: p.categoriaNombre,
        img: p.imagenUrl,
        stock: Number(p.stock ?? 0),
        destacado: p.destacado
      }));

      setItems(list);
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  }

  // Categorías únicas
  const cats = useMemo(
    () => ["Todas", ...uniq(items.map(p => p.category))],
    [items]
  );

  // Filtro por búsqueda
  const view = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items
      .filter(p => (cat === "Todas") ? true : p.category === cat)
      .filter(p =>
        p.name.toLowerCase().includes(needle) ||
        String(p.price).includes(needle) ||
        p.category.toLowerCase().includes(needle)
      );
  }, [items, q, cat]);

  // -------------------------------------------------------
  // CONTROLAR STOCK EN EL CARRITO
  // -------------------------------------------------------
  function addToCart(id) {
    const producto = items.find(p => p.id === id);
    if (!producto) return;

    const enCarrito = Store.getCart().find(it => Number(it.productId) === id);
    const cantidadActual = enCarrito ? Number(enCarrito.qty) : 0;

    // Si ya no queda stock disponible
    if (cantidadActual >= producto.stock) {
      alert(`Solo tenemos ${producto.stock} unidades disponibles`);
      return;
    }

    try {
      Store.addToCart(id, 1);
    } catch {}

    //alert("Producto agregado al carrito");
  }

  const money = n => `$${Number(n).toLocaleString()}`;

  return (
    <div className="container mt-3">
      <h2 className="section-title">Productos</h2>

      {/* Barra de filtros */}
      <div className="card p-3 bg-dark text-light border-secondary mb-3">
        <div className="row g-3 align-items-end">
          
          <div className="col-12 col-sm-6">
            <label className="form-label">Buscar</label>
            <input
              className="form-control bg-dark text-light border-secondary"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="AK-47, Karambit, Desert Eagle..."
            />
          </div>

          <div className="col-12 col-sm-4">
            <label className="form-label">Categoría</label>
            <select
              className="form-select bg-dark text-light border-secondary"
              value={cat}
              onChange={e => setCat(e.target.value)}
            >
              {cats.map(c => (<option key={c}>{c}</option>))}
            </select>
          </div>

        </div>
      </div>

      {/* Listado de productos */}
      <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-lg-4">
        {view.map(p => (
          <div className="col" key={p.id}>
            <div className="card product-card bg-dark text-light border-secondary h-100">

              <div className="img-box">
                <img
                  src={p.img}
                  alt={p.name}
                  onError={(e) => { e.currentTarget.src = "/img/skins/AK-BLOODSPORT.png"; }}
                />
              </div>

              <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-1">{p.name}</h5>
                <div className="text-secondary small">Categoría: {p.category}</div>

                <div className="small text-secondary mt-1">
                  Stock disponible: <b>{p.stock}</b>
                </div>

                <div className="mt-auto d-flex align-items-center gap-2">
                  <span className="fw-bold me-auto">{money(p.price)}</span>

                  <button
                    className="btn btn-success btn-add-mobile"
                    onClick={() => addToCart(p.id)}
                    disabled={p.stock <= 0}
                  >
                    {p.stock > 0 ? "Añadir" : "Sin stock"}
                  </button>
                </div>

              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

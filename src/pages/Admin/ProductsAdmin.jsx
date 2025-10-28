import { useEffect, useMemo, useState } from "react";
import { Store, subscribe } from "../../data/store";

const CATEGORIAS = ["Rifles", "Pistolas", "Cuchillos", "Guantes", "Stickers"];

function formatPrice(n) {
  const v = Number(n ?? 0);
  return `$${v.toLocaleString()}`;
}

export default function ProductsAdmin() {
  const [items, setItems] = useState(Store.list());
  const [q, setQ] = useState("");

  // formulario crear
  const [f, setF] = useState({
    name: "",
    price: "",
    category: "",
    stock: 0,
    offer: false,
    img: "" // opcional
  });

  useEffect(() => {
    setItems(Store.list());
    const un = subscribe(() => setItems(Store.list()));
    return un;
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setF((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const canCreate =
    f.name.trim().length >= 3 &&
    Number(f.price) > 0 &&
    f.category &&
    Number(f.stock) >= 0;

  const create = () => {
    if (!canCreate) return;
    const id = crypto.randomUUID();
    Store.create({
      id,
      name: f.name.trim(),
      price: Number(f.price),
      category: f.category,
      stock: Number(f.stock),
      offer: !!f.offer,
      img: f.img || undefined,
    });
    setF({ name: "", price: "", category: "", stock: 0, offer: false, img: "" });
  };

  const remove = (id) => {
    if (!confirm("¿Eliminar producto?")) return;
    Store.remove(id);
  };

  // filtro por búsqueda
  const view = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term)
    );
  }, [items, q]);

  return (
    <div className="container mt-3">
      <h2 className="section-title">Administrar Productos</h2>

      {/* Creador */}
      <div className="card admin-card p-3 mb-3">
        <div className="row g-2 align-items-end">
          <div className="col-12 col-md-4">
            <label className="form-label">Nombre</label>
            <input
              className="form-control bg-dark text-light border-secondary"
              name="name"
              value={f.name}
              onChange={onChange}
              placeholder="AK-47 | Redline"
            />
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label">Precio</label>
            <input
              type="number"
              min="0"
              className="form-control bg-dark text-light border-secondary"
              name="price"
              value={f.price}
              onChange={onChange}
              placeholder="45000"
            />
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label">Stock</label>
            <input
              type="number"
              min="0"
              className="form-control bg-dark text-light border-secondary"
              name="stock"
              value={f.stock}
              onChange={onChange}
            />
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label">Categoría</label>
            <select
              className="form-select bg-dark text-light border-secondary"
              name="category"
              value={f.category}
              onChange={onChange}
            >
              <option value="">Seleccione…</option>
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-1 d-flex gap-2">
            <div className="form-check align-self-center">
              <input
                id="offer"
                className="form-check-input"
                type="checkbox"
                name="offer"
                checked={f.offer}
                onChange={onChange}
              />
              <label className="form-check-label" htmlFor="offer">
                Oferta
              </label>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Imagen (opcional)</label>
            <input
              className="form-control bg-dark text-light border-secondary"
              name="img"
              value={f.img}
              onChange={onChange}
              placeholder="/img/skins/AK-BLOODSPORT.png"
            />
          </div>
          <div className="col-12 col-md-6 text-md-end">
            <button
              className="btn btn-brand mt-2"
              disabled={!canCreate}
              onClick={create}
            >
              Crear
            </button>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="d-flex justify-content-between align-items-center mb-2 gap-2">
        <input
          className="form-control bg-dark text-light border-secondary"
          placeholder="Buscar por nombre o categoría…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <span className="text-secondary small">
          {view.length} resultado{view.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Lista */}
      <div className="list-group admin-list">
        {view.map((p) => (
          <div
            key={p.id}
            className="list-group-item d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2"
          >
            <div className="d-flex align-items-center gap-3">
              <div className="admin-thumb">
                <img
                  src={p.img || `/img/skins/${(p?.imgName ?? "").trim()}` || "/img/skins/AK-BLOODSPORT.png"}
                  alt={p.name}
                  onError={(e) => {
                    e.currentTarget.src = "/img/skins/AK-BLOODSPORT.png";
                  }}
                />
              </div>
              <div>
                <div className="fw-semibold">{p.name}</div>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge badge-soft">{p.category}</span>
                  <span className="badge badge-soft">
                    {formatPrice(p.price)}
                  </span>
                  <span className="badge badge-soft">Stock {p.stock ?? 0}</span>
                  {p.offer && (
                    <span className="badge badge-offer">Oferta</span>
                  )}
                </div>
              </div>
            </div>

            <div className="d-flex gap-2">
              {/* Botón eliminar */}
              <button className="btn btn-outline-danger btn-sm" onClick={() => remove(p.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}

        {view.length === 0 && (
          <div className="list-group-item text-secondary">
            No hay productos que coincidan con tu búsqueda.
          </div>
        )}
      </div>
    </div>
  );
}

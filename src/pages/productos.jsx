// src/pages/Products.jsx  — Catálogo responsive
import { useEffect, useMemo, useState } from "react";
import { Store, subscribe } from "../data/store";

const uniq = (xs) => Array.from(new Set(xs));

export default function Products(){
  const [items, setItems] = useState(() => {
    try { return Store.list(); } catch { return []; }
  });
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todas");

  useEffect(()=>{
    let un = null;
    try { un = subscribe(()=> setItems(Store.list())); } catch {}
    try {
      const now = Store.list();
      if (!now || now.length === 0) {
        if (typeof Store.reseed === "function") Store.reseed();
        setItems(Store.list());
      }
    } catch {}
    return () => { try{ un && un(); }catch{} };
  },[]);

  const cats = useMemo(() => ["Todas", ...uniq((items||[]).map(p=>p.category).filter(Boolean))], [items]);

  const view = useMemo(()=>{
    const needle = q.trim().toLowerCase();
    return (items||[])
      .filter(p => cat === "Todas" ? true : p.category === cat)
      .filter(p => {
        if (!needle) return true;
        return (
          (p.name||"").toLowerCase().includes(needle) ||
          String(p.price||"").includes(needle) ||
          (p.category||"").toLowerCase().includes(needle)
        );
      });
  }, [items, q, cat]);

  const add = (id) => {
    try { Store.addToCart(id, 1); } catch {}
  };

  const money = (n) => `$${Number(n ?? 0).toLocaleString()}`;

  return (
    <div className="container mt-3">
      <h2 className="section-title">Productos</h2>

      <div className="card p-3 bg-dark text-light border-secondary mb-3">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-sm-6">
            <label className="form-label">Buscar</label>
            <input
              className="form-control bg-dark text-light border-secondary"
              placeholder="AK-47, Karambit, Desert Eagle..."
              value={q}
              onChange={e=> setQ(e.target.value)}
            />
          </div>
          <div className="col-12 col-sm-4">
            <label className="form-label">Categoría</label>
            <select
              className="form-select bg-dark text-light border-secondary"
              value={cat}
              onChange={e=> setCat(e.target.value)}
            >
              {cats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Grid responsive sin cortes en móvil */}
      <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-lg-4">
        {view.map(p => (
          <div className="col" key={p.id}>
            <div className="card product-card bg-dark text-light border-secondary h-100">
              <div className="img-box">
                <img
                  src={p.img}
                  alt={p.name}
                  onError={(e)=>{ e.currentTarget.src="/img/skins/AK-BLOODSPORT.png"; }}
                />
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-1">{p.name}</h5>
                <div className="text-secondary small mb-2">Categoría: {p.category}</div>
                <div className="mt-auto d-flex flex-wrap gap-2 align-items-center">
                  <div className="fw-bold me-auto">{money(p.price)}</div>
                  <button className="btn btn-success btn-add-mobile" onClick={()=> add(p.id)}>Añadir</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {view.length === 0 && (
          <div className="text-secondary">No hay productos que coincidan con tu búsqueda.</div>
        )}
      </div>
    </div>
  );
}

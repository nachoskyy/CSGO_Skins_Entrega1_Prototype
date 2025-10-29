// src/pages/Products.jsx  — Catálogo de productos
import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { Store, subscribe } from "../data/store";

const uniq = (xs) => Array.from(new Set(xs));

export default function Products(){
  const [items, setItems] = useState(() => {
    try { return Store.list(); } catch { return []; }
  });
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todas");

  useEffect(()=>{
    // Mantener en vivo si cambian productos
    let un = null;
    try { un = subscribe(()=> setItems(Store.list())); } catch {}
    // Semilla/fallback si lista viene vacía
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

  return (
    <div className="container mt-3">
      <h2 className="section-title">Productos</h2>

      <div className="card p-3 bg-dark text-light border-secondary mb-3">
        <div className="row g-3 align-items-end">
          <div className="col-md-6">
            <label className="form-label">Buscar</label>
            <input
              className="form-control bg-dark text-light border-secondary"
              placeholder="AK-47, Karambit, Desert Eagle..."
              value={q}
              onChange={e=> setQ(e.target.value)}
            />
          </div>
          <div className="col-md-4">
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

      <div className="row g-3">
        {view.map(p => (
          <div className="col-6 col-md-4 col-lg-3" key={p.id}>
            <ProductCard product={p} />
          </div>
        ))}
        {view.length === 0 && (
          <div className="text-secondary">No hay productos que coincidan con tu búsqueda.</div>
        )}
      </div>
    </div>
  );
}

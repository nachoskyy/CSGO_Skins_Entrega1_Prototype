// src/pages/Cart.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store, subscribe } from "../data/store";

const money = (n) => `$${Number(n ?? 0).toLocaleString()}`;

function readCartHydrated(){
  let base = [];
  try { base = Store.getCart(); } catch {}
  if (!Array.isArray(base) || base.length === 0) {
    try {
      const ls = JSON.parse(localStorage.getItem("tienda-react-cart") || "[]");
      if (Array.isArray(ls)) {
        base = ls.map(r => ({
          productId: Number(r.productId ?? r.id),
          qty: Math.max(1, Number(r.qty ?? r.cantidad ?? 1))
        }));
      }
    } catch {}
  }
  return (base||[]).map(r => {
    const id = Number(r.productId);
    const qty = Math.max(1, Number(r.qty||1));
    let prod = null;
    try { prod = Store.getById(id); } catch {}
    return {
      id,
      qty,
      name: prod?.name ?? "Producto",
      price: Number(prod?.price ?? 0),
      img: prod?.img ?? "/img/skins/AK-BLOODSPORT.png",
      category: prod?.category ?? "Sin categoría",
    };
  }).filter(x => x.id > 0);
}

export default function Cart(){
  const nav = useNavigate();
  const [items, setItems] = useState(readCartHydrated());

  useEffect(()=>{
    let un = null;
    try { un = subscribe(()=> setItems(readCartHydrated())); } catch {}
    setItems(readCartHydrated());
    return () => { try{ un && un(); }catch{} };
  },[]);

  const updateQty = (id, qty) => {
    const q = Math.max(1, Number(qty||1));
    try{
      if (typeof Store?.updateQty === "function"){
        Store.updateQty(id, q);
        setItems(readCartHydrated());
        return;
      }
    }catch{}
    const cur = readCartHydrated().map(it => it.id === id ? {...it, qty:q} : it);
    try { localStorage.setItem("tienda-react-cart", JSON.stringify(cur.map(({id, qty})=>({productId:id, qty})))) } catch {}
    setItems(cur);
  };

  const remove = (id) => {
    try{
      if (typeof Store?.removeFromCart === "function"){ Store.removeFromCart(id); setItems(readCartHydrated()); return; }
    }catch{}
    const cur = readCartHydrated().filter(it => it.id !== id);
    try { localStorage.setItem("tienda-react-cart", JSON.stringify(cur.map(({id, qty})=>({productId:id, qty})))) } catch {}
    setItems(cur);
  };

  const clear = () => {
    if (!confirm("Vaciar carrito?")) return;
    try{
      if (typeof Store?.clearCart === "function"){ Store.clearCart(); setItems([]); return; }
    }catch{}
    try { localStorage.removeItem("tienda-react-cart"); } catch {}
    setItems([]);
  };

  const subtotal = useMemo(
    () => items.reduce((s,it) => s + Number(it.price||0) * Number(it.qty||1), 0),
    [items]
  );

  return (
    <div className="container mt-3">
      <h2 className="section-title">Carrito</h2>

      <div className="card p-3 bg-dark text-light border-secondary">
        {items.length === 0 ? (
          <div className="text-secondary">
            Tu carrito está vacío. <Link to="/productos">Ver productos</Link>
          </div>
        ) : (
          <>
            <div className="list-group">
              {items.map(it => (
                <div
                  key={it.id}
                  className="list-group-item d-flex gap-3 align-items-center bg-dark text-light border-secondary"
                  style={{borderColor: "rgba(255,255,255,0.12)"}}
                >
                  <div style={{
                    width:72, height:72, borderRadius:12,
                    background:"rgba(255,255,255,0.03)",
                    display:"grid", placeItems:"center", overflow:"hidden"
                  }}>
                    <img
                      src={it.img}
                      alt={it.name}
                      style={{maxWidth:"100%", maxHeight:"100%", objectFit:"contain"}}
                      onError={(e)=>{ e.currentTarget.src="/img/skins/AK-BLOODSPORT.png"; }}
                    />
                  </div>

                  <div style={{flex:1}}>
                    <div className="fw-semibold">{it.name}</div>
                    <div className="text-secondary small">{it.category}</div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <div className="input-group input-group-sm" style={{width:110}}>
                      <button className="btn btn-outline-secondary" onClick={()=> updateQty(it.id, it.qty-1)}>-</button>
                      <input
                        type="number"
                        min={1}
                        className="form-control bg-dark text-light border-secondary text-center"
                        value={it.qty}
                        onChange={(e)=> updateQty(it.id, e.target.value)}
                      />
                      <button className="btn btn-outline-secondary" onClick={()=> updateQty(it.id, it.qty+1)}>+</button>
                    </div>
                    <div className="fw-semibold">{money(it.price * it.qty)}</div>
                    <button className="btn btn-sm btn-outline-danger" onClick={()=> remove(it.id)}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 d-flex justify-content-between align-items-center">
              <button className="btn btn-outline-secondary" onClick={clear}>Vaciar carrito</button>
              <div className="text-end">
                <div className="small text-secondary">Subtotal</div>
                <div className="h5">{money(subtotal)}</div>
                <div className="mt-2 d-flex gap-2 justify-content-end">
                  <Link to="/productos" className="btn btn-outline-secondary">Seguir comprando</Link>
                  <Link to="/checkout" className="btn btn-brand">Ir a pagar</Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// src/pages/Cart.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store, subscribe } from "../data/store";

function formatPrice(n){ return `$${Number(n ?? 0).toLocaleString()}`; }

/** Escaneo robusto del carrito: Store -> varias rutas -> localStorage inteligente */
function readCartSmart(){
  try{
    if (typeof Store?.getCart === "function") return Store.getCart();
    if (Array.isArray(Store?.cart)) return Store.cart;
    if (Array.isArray(Store?.state?.cart)) return Store.state.cart;
    if (typeof Store?.getState === "function" && Array.isArray(Store.getState()?.cart)) {
      return Store.getState().cart;
    }
    if (Array.isArray(Store?._state?.cart)) return Store._state.cart;
  }catch(_){}

  // Fallback: buscar en localStorage una clave que parezca carrito
  try{
    let best = [];
    for (let i = 0; i < localStorage.length; i++){
      const k = localStorage.key(i);
      if (!k) continue;
      try{
        const raw = localStorage.getItem(k);
        const val = JSON.parse(raw);
        if (Array.isArray(val) && val.some(x => typeof x === "object" && ("qty" in x || "cantidad" in x))){
          // preferir el más largo
          if (val.length > best.length) best = val;
        }
      }catch(_){}
    }
    if (best.length) return best;
    // claves típicas
    for (const k of ["cart","kn_cart","cart_items","knskins_cart"]){
      const raw = localStorage.getItem(k);
      if (raw){
        try{
          const val = JSON.parse(raw);
          if (Array.isArray(val)) return val;
        }catch(_){}
      }
    }
  }catch(_){}

  return [];
}

export default function Cart(){
  const nav = useNavigate();
  const [items, setItems] = useState(readCartSmart());

  useEffect(()=>{
    setItems(readCartSmart());
    let un = () => {};
    try{
      if (typeof subscribe === "function") {
        un = subscribe(() => setItems(readCartSmart()));
      }
    }catch(_){}
    return () => { try{ un(); }catch(_){ } };
  },[]);

  const updateQty = (id, qty) => {
    if (qty < 1) qty = 1;
    try{
      if (typeof Store?.updateQty === "function"){
        Store.updateQty(id, qty);
        setItems(readCartSmart());
        return;
      }
    }catch(_){}
    // fallback: localStorage
    const cur = readCartSmart().map(it => it.id === id ? {...it, qty} : it);
    try{ localStorage.setItem("cart", JSON.stringify(cur)); }catch(_){}
    setItems(cur);
  };

  const remove = (id) => {
    if (!confirm("Eliminar este producto del carrito?")) return;
    try{
      if (typeof Store?.removeFromCart === "function"){
        Store.removeFromCart(id);
        setItems(readCartSmart());
        return;
      }
    }catch(_){}
    const cur = readCartSmart().filter(it => it.id !== id);
    try{ localStorage.setItem("cart", JSON.stringify(cur)); }catch(_){}
    setItems(cur);
  };

  const clearAll = () => {
    if (!confirm("Vaciar carrito?")) return;
    try{
      if (typeof Store?.clearCart === "function"){ Store.clearCart(); setItems([]); return; }
      if (typeof Store?.emptyCart === "function"){ Store.emptyCart(); setItems([]); return; }
    }catch(_){}
    // limpiar todas las claves que parezcan carrito
    try{
      for (let i = localStorage.length - 1; i >= 0; i--){
        const k = localStorage.key(i);
        if (!k) continue;
        try{
          const val = JSON.parse(localStorage.getItem(k) || "null");
          if (Array.isArray(val) && val.some(x => typeof x === "object" && ("qty" in x || "cantidad" in x))){
            localStorage.removeItem(k);
          }
        }catch(_){}
      }
    }catch(_){}
    setItems([]);
  };

  const subtotal = items.reduce((s,it) => s + (Number(it.price ?? 0) * Number(it.qty ?? it.cantidad ?? 1)), 0);

  return (
    <div className="container mt-3">
      <h2 className="section-title">Carrito</h2>

      <div className="card p-3 bg-dark text-light border-secondary">
        {items.length === 0 ? (
          <div className="text-secondary">
            Tu carrito está vacío. <Link to="/categorias">Ver productos</Link>
          </div>
        ) : (
          <>
            <div className="list-group">
              {items.map(it => (
                <div key={it.id} className="list-group-item d-flex gap-3 align-items-center">
                  <div style={{width:72, height:72, borderRadius:8, overflow:"hidden", background:"rgba(255,255,255,0.03)", display:"grid", placeItems:"center"}}>
                    <img
                      src={it.img || `/img/skins/${(it.imgName||"").trim()}` || "/img/skins/AK-BLOODSPORT.png"}
                      alt={it.name}
                      style={{maxWidth:"100%", maxHeight:"100%", objectFit:"contain"}}
                      onError={(e)=> e.currentTarget.src = "/img/skins/AK-BLOODSPORT.png"}
                    />
                  </div>

                  <div style={{flex:1}}>
                    <div className="fw-semibold">{it.name}</div>
                    <div className="text-secondary small">{it.category ?? it.categoria ?? "Sin categoría"}</div>

                    <div className="d-flex gap-2 align-items-center mt-2">
                      <div className="input-group" style={{width:140}}>
                        <button className="btn btn-sm btn-outline-secondary" type="button"
                          onClick={()=> updateQty(it.id, Number(it.qty ?? it.cantidad ?? 1) - 1)}>-</button>
                        <input className="form-control form-control-sm text-center bg-dark text-light border-secondary"
                          value={Number(it.qty ?? it.cantidad ?? 1)}
                          onChange={(e)=>{
                            const v = Number(e.target.value || 0);
                            if (!Number.isFinite(v) || v < 1) return;
                            updateQty(it.id, v);
                          }} />
                        <button className="btn btn-sm btn-outline-secondary" type="button"
                          onClick={()=> updateQty(it.id, Number(it.qty ?? it.cantidad ?? 1) + 1)}>+</button>
                      </div>

                      <div className="ms-3 fw-semibold">
                        {formatPrice(Number(it.price ?? 0) * Number(it.qty ?? it.cantidad ?? 1))}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-column align-items-end gap-2">
                    <button className="btn btn-outline-danger btn-sm" onClick={()=> remove(it.id)}>Eliminar</button>
                    <div className="text-secondary small">Precio: {formatPrice(it.price)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <div>
                <button className="btn btn-outline-danger btn-sm" onClick={clearAll}>Vaciar carrito</button>
              </div>
              <div className="text-end">
                <div className="small text-secondary">Subtotal</div>
                <div className="h5">{formatPrice(subtotal)}</div>
                <div className="mt-2 d-flex gap-2 justify-content-end">
                  <button className="btn btn-outline-secondary" onClick={()=> nav(-1)}>Seguir comprando</button>
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

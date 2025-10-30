//carrito de compras
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Store, subscribe } from "../data/store";

const money = (n) => `$${Number(n ?? 0).toLocaleString()}`;
// Hidrata el carrito para mostrar detalle correcto
// incluye nombre, precio, imagen y categoría del producto
function readCartHydrated(){
  let base = [];
  try { base = Store.getCart(); } catch {}
  if (!Array.isArray(base)) base = [];
  return base.map(r => {
    const id = Number(r.productId ?? r.id);
    const qty = Math.max(1, Number(r.qty ?? r.cantidad ?? 1));
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
// Componente principal del carrito
export default function Cart(){
  const [items, setItems] = useState(readCartHydrated());

  useEffect(()=>{
    let un = null;
    try { un = subscribe(()=> setItems(readCartHydrated())); } catch {}
    setItems(readCartHydrated());
    return () => { try{ un && un(); }catch{} };
  },[]);
// Actualizar cantidad de un ítem
  const updateQty = (id, qty) => {
    const q = Math.max(1, Number(qty||1));
    try{ Store.updateQty(id, q); } catch {}
    setItems(readCartHydrated());
  };
// Remover un ítem del carrito
  const remove = (id) => {
    try{ Store.removeFromCart(id); } catch {}
    setItems(readCartHydrated());
  };
// Vaciar el carrito
  const clear = () => {
    if (!confirm("Vaciar carrito?")) return;
    try{ Store.clearCart(); } catch {}
    setItems([]);
  };
// Calcular subtotal
  const subtotal = useMemo(
    () => items.reduce((s,it) => s + Number(it.price||0) * Number(it.qty||1), 0),
    [items]
  );

  return (
    <div className="container mt-3">
      <h2 className="section-title">Carrito</h2>

      <div className="card p-3 bg-dark text-light border-secondary cart-card">
        {items.length === 0 ? (
          <div className="text-secondary">
            Tu carrito está vacío. <Link to="/productos">Ver productos</Link>
          </div>
        ) : (
          <>
            <div className="list-group cart-list">
              {items.map(it => (
                <div key={it.id} className="list-group-item bg-dark text-light">
                  <div className="d-flex flex-column flex-sm-row gap-3 align-items-start align-items-sm-center cart-item">
                    {/* Imagen */}
                    <div className="thumb-box">
                      <img
                        src={it.img}
                        alt={it.name}
                        onError={(e)=>{ e.currentTarget.src="/img/skins/AK-BLOODSPORT.png"; }}
                      />
                    </div>

                    {/* Detalle */}
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{it.name}</div>
                      <div className="text-secondary small">{it.category}</div>
                    </div>

                    {/* Controles a la derecha (sin cambiar look) */}
                    <div className="right">
                      <div className="input-group input-group-sm qty-group">
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

                      <div className="fw-semibold text-nowrap price">
                        {money(it.price * it.qty)}
                      </div>

                      <button className="btn btn-outline-danger btn-sm btn-delete" onClick={()=> remove(it.id)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 d-flex flex-column flex-sm-row justify-content-between align-items-stretch align-items-sm-center gap-3">
              <button className="btn btn-outline-secondary" onClick={clear}>Vaciar carrito</button>

              <div className="text-end ms-sm-auto">
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

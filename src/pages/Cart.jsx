// src/pages/Cart.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Store } from "../data/store";


const money = (n) => `$${Number(n ?? 0).toLocaleString()}`;

/* =====================================================
   FUNCIONES AUXILIARES — hidrata carrito con productos
   ===================================================== */
function readCartHydrated() {
  let base = [];

  try {
    base = Store.getCart();
  } catch {
    base = [];
  }

  if (!Array.isArray(base)) base = [];

  return base
    .map(r => {
      const rawId = r.productId ?? r.id;
      const id = Number(rawId);

      if (!id || isNaN(id)) return null;

      const qty = Math.max(1, Number(r.qty ?? r.cantidad ?? 1));

      const prod = Store.getById(id);

      if (!prod) return null;

      return {
        id,
        qty,
        name: prod.name,
        price: prod.price,
        img: prod.img,
        category: prod.category,
        stock: prod.stock,
      };
    })
    .filter(Boolean);
}


/* =====================================================
   COMPONENTE PRINCIPAL DEL CARRITO
   ===================================================== */
export default function Cart(){

  // Estado interno del carrito
  const [items, setItems] = useState(readCartHydrated());

  // Suscripción REAL al carrito (no a los productos)
  useEffect(() => {
    const un = Store.subscribeCart(() => {
      setItems(readCartHydrated());
    });

    // primera carga
    setItems(readCartHydrated());

    return () => un();
  }, []);

  /* ---------------- ACCIONES ---------------- */

  const updateQty = (id, qty) => {
    try {
      Store.updateQty(id, Number(qty));
      setItems(readCartHydrated());
    } catch {}
  };

  const remove = (id) => {
    try {
      Store.removeFromCart(id);
      setItems(readCartHydrated());
    } catch {}
  };

  const clear = () => {
    if (!confirm("Vaciar carrito?")) return;
    try {
      Store.clearCart();
      setItems([]);
    } catch {}
  };

  // cálculo de subtotal
  const subtotal = useMemo(
    () => items.reduce((s, it) => s + Number(it.price||0) * Number(it.qty||1), 0),
    [items]
  );

  /* =====================================================
     RENDER
     ===================================================== */
  return (
    <div className="container mt-3">
      <h2 className="section-title">Carrito</h2>

      <div className="card p-3 bg-dark text-light border-secondary cart-card">
        
        {/* Carrito vacío */}
        {items.length === 0 ? (
          <div className="text-secondary">
            Tu carrito está vacío. <Link to="/productos">Ver productos</Link>
          </div>
        ) : (
          <>
            {/* LISTADO DE ITEMS */}
            <div className="list-group cart-list">
              {items.map(it => (
                <div key={it.id} className="list-group-item bg-dark text-light">

                  <div className="d-flex flex-column flex-sm-row gap-3 align-items-start align-items-sm-center cart-item">

                    {/* IMG */}
                    <div className="thumb-box">
                      <img
                        src={it.img}
                        alt={it.name}
                        onError={(e)=>{ e.currentTarget.src="/img/skins/AK-BLOODSPORT.png"; }}
                      />
                    </div>

                    {/* DETALLE */}
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{it.name}</div>
                      <div className="text-secondary small">{it.category}</div>
                      <div className="text-secondary small">Stock disponible: {it.stock}</div>
                    </div>

                    {/* CONTROLES */}
                    <div className="right">
                      <div className="input-group input-group-sm qty-group">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => updateQty(it.id, it.qty - 1)}
                        >
                          -
                        </button>

                        <input
                          type="number"
                          min={1}
                          max={it.stock}
                          className="form-control bg-dark text-light border-secondary text-center"
                          value={it.qty > it.stock ? it.stock : it.qty}
                          onChange={(e)=> updateQty(it.id, e.target.value)}
                        />

                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => updateQty(it.id, it.qty + 1)}
                        >
                          +
                        </button>
                      </div>

                      <div className="fw-semibold text-nowrap price">
                        {money(it.price * it.qty)}
                      </div>

                      <button
                        className="btn btn-outline-danger btn-sm btn-delete"
                        onClick={() => remove(it.id)}
                      >
                        Eliminar
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* SUBTOTAL + ACCIONES */}
            <div className="mt-3 d-flex flex-column flex-sm-row justify-content-between align-items-stretch align-items-sm-center gap-3">
              
              <button className="btn btn-outline-secondary" onClick={clear}>
                Vaciar carrito
              </button>

              <div className="text-end ms-sm-auto">
                <div className="small text-secondary">Subtotal</div>
                <div className="h5">{money(subtotal)}</div>

                <div className="mt-2 d-flex gap-2 justify-content-end">
                  <Link to="/productos" className="btn btn-outline-secondary">
                    Seguir comprando
                  </Link>
                  <Link to="/checkout" className="btn btn-brand">
                    Ir a pagar
                  </Link>
                </div>
              </div>

            </div>

          </>
        )}
      </div>
    </div>
  );
}

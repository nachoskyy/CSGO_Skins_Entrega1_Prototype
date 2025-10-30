// pagina de checkout y pago
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
// validadores reutilizables
import {
  luhnCheck,
  normalizeCardNumber,
  validateCVV,
  validateExpiry,
  validateEmail,
  normalizeExpiry,
  digitsOnly,
} from "../utils/validators";
import { Store } from "../data/store";

const money = (n) => `$${Number(n ?? 0).toLocaleString()}`;

// Hidrata el carrito para mostrar detalle correcto
// incluye nombre, precio e imagen del producto
function readCartHydrated(){
  let base = []; 
  try { base = Store.getCart(); } catch {} 
  if (!Array.isArray(base)) base = [];
  return base.map(r => { 
    const id = Number(r.productId ?? r.id); 
    const qty = Math.max(1, Number(r.qty ?? r.cantidad ?? 1)); 
    let p = null;
    try { p = Store.getById(id); } catch {}
    // devolver detalle completo
    return { 
      id,
      qty,
      name: p?.name ?? "Producto",
      price: Number(p?.price ?? 0),
      img: p?.img ?? "/img/skins/AK-BLOODSPORT.png",
    };
  }).filter(x => x.id > 0);
}
// Componente principal de checkout
export default function Checkout(){
  const nav = useNavigate();
// estado del formulario
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    direccion: "",
    card: "",
    exp: "",
    cvv: ""
  });
  // errores de validación
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  // ítems del carrito
  const items = readCartHydrated();
  const subtotal = useMemo(()=> items.reduce((s, it) => s + Number(it.price||0) * Number(it.qty||1), 0), [items]);
  const total = subtotal;
  // manejar cambios en el formulario
  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === "card") {
      const next = normalizeCardNumber(value);     // #### #### #### ####
      return setForm(f => ({...f, card: next}));
    }
    if (name === "exp") {
      const next = normalizeExpiry(value).slice(0, 5); // MM/YY
      return setForm(f => ({...f, exp: next}));
    }
    if (name === "cvv") {
      const next = digitsOnly(value).slice(0, 3);       // 3 dígitos
      return setForm(f => ({...f, cvv: next}));
    }
    setForm(f => ({...f, [name]: value}));
  };
  // manejar envío del formulario
  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = {};

    if (!form.nombre.trim()) errs.nombre = "Nombre requerido";
    if (!validateEmail(form.email)) errs.email = "Email inválido o dominio no permitido";
    if (!form.direccion.trim()) errs.direccion = "Dirección requerida";

    if (!luhnCheck(form.card)) errs.card = "Tarjeta inválida (revisa los 16 dígitos)";
    if (!validateExpiry(form.exp)) errs.exp = "Expiración inválida (usa MM/YY y que no esté vencida)";
    if (!validateCVV(form.cvv)) errs.cvv = "CVV inválido (3 dígitos)";

    setErrors(errs);
    if (Object.keys(errs).length) return;

    setProcessing(true);
    try{
      // DEMO: tarjeta termina en 0 => rechazada
      const endsWith0 = /0$/.test(digitsOnly(form.card));
      await new Promise(r => setTimeout(r, 800));
      if (endsWith0) {
        nav("/compra-fallida");
      } else {
        try{ Store.clearCart(); }catch{}
        nav("/compra-exitosa");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container mt-3">
      <h2 className="section-title">Checkout</h2>

      <div className="row g-4">
        <div className="col-lg-7">
          <form className="card p-3 bg-dark text-light border-secondary" onSubmit={onSubmit}>
            <h5>Datos de facturación</h5>

            <div className="mb-3">
              <label className="form-label">Nombre completo</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={onChange}
                className="form-control bg-dark text-light border-secondary"
                placeholder="Ej: Juan Pérez"
              />
              {errors.nombre && <div className="text-danger mt-1">{errors.nombre}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={onChange}
                className="form-control bg-dark text-light border-secondary"
                placeholder="usuario@duocuc.cl"
              />
              {errors.email && <div className="text-danger mt-1">{errors.email}</div>}
              <div className="form-text text-secondary">Permitidos: duocuc.cl, outlook.com, gmail.com</div>
            </div>

            <div className="mb-3">
              <label className="form-label">Dirección de facturación</label>
              <input
                name="direccion"
                value={form.direccion}
                onChange={onChange}
                className="form-control bg-dark text-light border-secondary"
                placeholder="Calle 123, Comuna, Ciudad"
              />
              {errors.direccion && <div className="text-danger mt-1">{errors.direccion}</div>}
            </div>

            {/* Pago con tarjeta */}
            <h5 className="mt-2">Pago con tarjeta</h5>

            <div className="mb-3">
              <label className="form-label">Número de tarjeta</label>
              <input
                name="card"
                value={form.card}
                onChange={onChange}
                className="form-control bg-dark text-light border-secondary"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              {errors.card && <div className="text-danger mt-1">{errors.card}</div>}
              <div className="form-text text-secondary">Ingresa 16 dígitos. Se agrupan automático en 4.</div>
            </div>
            <div className="row g-3 form-row-eq">
              <div className="col-12 col-sm-6">
                <div className="form-group-eq">
                  <label className="form-label">Expiración (MM/YY)</label>
                  <input
                    name="exp"
                    value={form.exp}
                    onChange={onChange}
                    className="form-control bg-dark text-light border-secondary"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  {errors.exp && <div className="text-danger mt-1">{errors.exp}</div>}
                  <div className="form-text text-secondary">Ej: 03/28 (marzo de 2028)</div>
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="form-group-eq">
                  <label className="form-label">CVV</label>
                  <input
                    name="cvv"
                    value={form.cvv}
                    onChange={onChange}
                    className="form-control bg-dark text-light border-secondary"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    maxLength={3}
                  />
                  {errors.cvv && <div className="text-danger mt-1">{errors.cvv}</div>}
                  <div className="form-text invisible">placeholder</div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end align-items-center gap-3 mt-3">
              <div className="text-secondary">Total: <span className="fw-semibold text-light">{money(total)}</span></div>
              <button className="btn btn-brand" disabled={processing}>
                {processing ? "Procesando..." : "Pagar ahora"}
              </button>
            </div>
          </form>
        </div>

        <div className="col-lg-5">
          <div className="card p-3 bg-dark text-light border-secondary">
            <h5>Resumen del pedido</h5>
            {items.length === 0 ? (
              <div className="text-secondary">Tu carrito está vacío.</div>
            ) : (
              <div className="list-group">
                {items.map((it, idx)=>(
                  <div key={it.id ?? idx} className="d-flex align-items-center gap-3 py-2 border-bottom">
                    <div style={{width:56,height:56,display:"grid",placeItems:"center",overflow:"hidden",borderRadius:8,background:"rgba(255,255,255,0.03)"}}>
                      <img
                        src={it.img}
                        alt={it.name}
                        style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}}
                        onError={(e)=> e.currentTarget.src="/img/skins/AK-BLOODSPORT.png"}
                      />
                    </div>
                    <div style={{flex:1}}>
                      <div className="fw-semibold">{it.name}</div>
                      <div className="text-secondary small">
                        {Number(it.qty)} × {money(it.price)}
                      </div>
                    </div>
                    <div className="fw-semibold">
                      {money(Number(it.price)*Number(it.qty))}
                    </div>
                  </div>
                ))}
                <div className="d-flex justify-content-between pt-2">
                  <div className="fw-semibold">Total</div>
                  <div className="fw-semibold">{money(total)}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// src/pages/Checkout.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  luhnCheck,
  normalizeCardNumber,
  validateCVV,
  validateExpiry,
  validateEmail,
} from "../utils/validators";
import { Store } from "../data/store";

function formatPrice(n){ return `$${Number(n ?? 0).toLocaleString()}`; }

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
  try{
    let best = [];
    for (let i = 0; i < localStorage.length; i++){
      const k = localStorage.key(i); if (!k) continue;
      try{
        const val = JSON.parse(localStorage.getItem(k) || "null");
        if (Array.isArray(val) && val.some(x => typeof x === "object" && ("qty" in x || "cantidad" in x))){
          if (val.length > best.length) best = val;
        }
      }catch(_){}
    }
    if (best.length) return best;
    for (const k of ["cart","kn_cart","cart_items","knskins_cart"]){
      const raw = localStorage.getItem(k);
      if (raw){
        try{ const val = JSON.parse(raw); if (Array.isArray(val)) return val; }catch(_){}
      }
    }
  }catch(_){}
  return [];
}

export default function Checkout(){
  const nav = useNavigate();
  const cart = readCartSmart();
  const total = cart.reduce((s,it) => s + (Number(it.price ?? 0) * Number(it.qty ?? it.cantidad ?? 1)), 0);

  const [form, setForm] = useState({ nombre:"", email:"", address:"", cardNumber:"", expiry:"", cvv:"" });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const change = (e)=> {
    const { name, value } = e.target;
    if (name === "expiry"){
      let v = value.replace(/[^\d\/]/g,'');
      if (v.length === 2 && !v.includes("/")) v = v + "/";
      if (v.length > 5) v = v.slice(0,5);
      setForm(s => ({...s, expiry: v}));
      setErrors(s => ({...s, expiry: null}));
      return;
    }
    setForm(s => ({...s, [name]: value}));
    setErrors(s => ({...s, [name]: null}));
  };

  function validateCardLength(num){ return num.length >= 13 && num.length <= 19; }

  function validateAll(){
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Ingresa nombre del titular";
    if (!validateEmail(form.email)) e.email = "Email inválido (duocuc/outlook/gmail)";
    if (!form.address.trim()) e.address = "Ingresa dirección";

    const raw = normalizeCardNumber(form.cardNumber);
    if (!raw) e.cardNumber = "Ingresa número de tarjeta";
    else if (!/^\d+$/.test(raw)) e.cardNumber = "Solo dígitos";
    else if (!validateCardLength(raw)) e.cardNumber = "Número inválido (13-19 dígitos)";
    else if (!luhnCheck(raw)) e.cardNumber = "Número inválido (no pasa Luhn)";

    if (!validateExpiry(form.expiry)) e.expiry = "Fecha inválida o vencida (MM/YY)";
    if (!validateCVV(form.cvv)) e.cvv = "CVV inválido (3 dígitos)";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function clearCartSafe(){
    try{
      if (typeof Store?.clearCart === "function") Store.clearCart();
      else if (typeof Store?.emptyCart === "function") Store.emptyCart();
      else {
        // borrar claves que parezcan carrito
        for (let i = localStorage.length - 1; i >= 0; i--){
          const k = localStorage.key(i);
          try{
            const val = JSON.parse(localStorage.getItem(k) || "null");
            if (Array.isArray(val) && val.some(x => typeof x === "object" && ("qty" in x || "cantidad" in x))){
              localStorage.removeItem(k);
            }
          }catch(_){}
        }
      }
    }catch(_){}
  }

  const onSubmit = (e)=>{
    e.preventDefault();
    if (processing) return;
    if (!validateAll()) return;
    setProcessing(true);
    setTimeout(()=>{
      const raw = normalizeCardNumber(form.cardNumber);
      const rejected = raw.slice(-1) === "0"; // regla de prueba
      setProcessing(false);
      if (rejected) nav("/compra-fallida", { replace:true });
      else { clearCartSafe(); nav("/compra-exitosa", { replace:true }); }
    },1000);
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
              <input name="nombre" value={form.nombre} onChange={change} className="form-control bg-dark text-light border-secondary"/>
              {errors.nombre && <div className="text-danger mt-1">{errors.nombre}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input name="email" value={form.email} onChange={change} className="form-control bg-dark text-light border-secondary"/>
              {errors.email && <div className="text-danger mt-1">{errors.email}</div>}
              {!errors.email && <div className="form-text text-secondary">Permitidos: duocuc.cl, outlook.com, gmail.com</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Dirección de facturación</label>
              <input name="address" value={form.address} onChange={change} className="form-control bg-dark text-light border-secondary"/>
              {errors.address && <div className="text-danger mt-1">{errors.address}</div>}
            </div>

            <hr className="my-3" />
            <h5>Pago con tarjeta</h5>

            <div className="mb-3">
              <label className="form-label">Número de tarjeta</label>
              <input name="cardNumber" inputMode="numeric" value={form.cardNumber} onChange={change} placeholder="1234 5678 9012 3456" className="form-control bg-dark text-light border-secondary"/>
              {errors.cardNumber && <div className="text-danger mt-1">{errors.cardNumber}</div>}
            </div>

            <div className="row g-2">
              <div className="col-6 col-md-4">
                <label className="form-label">Expiración (MM/YY)</label>
                <input name="expiry" value={form.expiry} onChange={change} placeholder="04/26" className="form-control bg-dark text-light border-secondary" maxLength={5}/>
                {errors.expiry && <div className="text-danger mt-1">{errors.expiry}</div>}
              </div>
              <div className="col-6 col-md-4">
                <label className="form-label">CVV</label>
                <input name="cvv" inputMode="numeric" value={form.cvv} onChange={change} placeholder="123" className="form-control bg-dark text-light border-secondary" maxLength={3}/>
                {errors.cvv && <div className="text-danger mt-1">{errors.cvv}</div>}
              </div>
              <div className="col-12 col-md-4 align-self-end text-md-end">
                <div className="small text-secondary">Total:</div>
                <div className="h5">{formatPrice(total)}</div>
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-end">
              <button className="btn btn-brand" disabled={processing}>{processing ? "Procesando..." : "Pagar ahora"}</button>
            </div>
          </form>
        </div>

        <div className="col-lg-5">
          <div className="card p-3 bg-dark text-light border-secondary">
            <h5>Resumen del pedido</h5>
            {cart.length === 0 ? (
              <div className="text-secondary">Tu carrito está vacío.</div>
            ) : (
              <div className="list-group">
                {cart.map((it, idx)=>(
                  <div key={it.id ?? idx} className="d-flex align-items-center gap-3 py-2 border-bottom">
                    <div style={{width:56,height:56,display:"grid",placeItems:"center",overflow:"hidden",borderRadius:8,background:"rgba(255,255,255,0.03)"}}>
                      <img
                        src={it.img || `/img/skins/${(it.imgName||"").trim()}` || "/img/skins/AK-BLOODSPORT.png"}
                        alt={it.name}
                        style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}}
                        onError={(e)=> e.currentTarget.src="/img/skins/AK-BLOODSPORT.png"}
                      />
                    </div>
                    <div style={{flex:1}}>
                      <div className="fw-semibold">{it.name}</div>
                      <div className="text-secondary small">
                        {Number(it.qty ?? it.cantidad ?? 1)} × ${Number(it.price ?? 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="fw-semibold">
                      ${ (Number(it.price ?? 0) * Number(it.qty ?? it.cantidad ?? 1)).toLocaleString() }
                    </div>
                  </div>
                ))}
                <div className="d-flex justify-content-between mt-3">
                  <div className="fw-semibold">Total</div>
                  <div className="fw-semibold">{formatPrice(total)}</div>
                </div>
              </div>
            )}
            <div className="form-text text-secondary mt-3">
              Demo: si la tarjeta termina en <code>0</code> simulamos un rechazo y verás <em>compra-fallida</em>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

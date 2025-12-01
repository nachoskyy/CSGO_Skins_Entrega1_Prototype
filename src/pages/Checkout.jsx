// src/pages/Checkout.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

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
import { OrdersAPI } from "../api";

const money = (n) => `$${Number(n ?? 0).toLocaleString()}`;

// --- Hidratar carrito ---
function readCartHydrated() {
  let base = [];
  try { base = Store.getCart(); } catch {}
  if (!Array.isArray(base)) base = [];

  return base
    .map(r => {
      const id = Number(r.productId ?? r.id);
      const qty = Math.max(1, Number(r.qty ?? 1));
      let prod = null;
      try { prod = Store.getById(id); } catch {}

      return {
        id,
        qty,
        name: prod?.name ?? "Producto",
        category: prod?.category ?? "Sin categoría",
        price: Number(prod?.price ?? 0),
        stock: Number(prod?.stock ?? 0),
        img: prod?.img ?? "/img/skins/AK-BLOODSPORT.png",
      };
    })
    .filter(x => x.id > 0);
}

export default function Checkout() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    direccion: "",
    comuna: "",
    region: "",
    card: "",
    exp: "",
    cvv: ""
  });

  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const items = readCartHydrated();

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.price * it.qty, 0),
    [items]
  );

  const total = subtotal;

  // ----- Manejadores -----
  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === "card") {
      return setForm(f => ({ ...f, card: normalizeCardNumber(value) }));
    }
    if (name === "exp") {
      return setForm(f => ({ ...f, exp: normalizeExpiry(value).slice(0, 5) }));
    }
    if (name === "cvv") {
      return setForm(f => ({ ...f, cvv: digitsOnly(value).slice(0, 3) }));
    }

    setForm(f => ({ ...f, [name]: value }));
  };

  // ----- Enviar formulario -----
  const onSubmit = async (e) => {
    e.preventDefault();

    const errs = {};

    if (!form.nombre.trim()) errs.nombre = "Nombre requerido";
    if (!validateEmail(form.email)) errs.email = "Email inválido o dominio no permitido";
    if (!form.direccion.trim()) errs.direccion = "Dirección requerida";
    if (!form.comuna.trim()) errs.comuna = "Comuna requerida";
    if (!form.region.trim()) errs.region = "Región requerida";

    if (!luhnCheck(form.card)) errs.card = "Tarjeta inválida (16 dígitos)";
    if (!validateExpiry(form.exp)) errs.exp = "Expiración inválida";
    if (!validateCVV(form.cvv)) errs.cvv = "CVV inválido";

    setErrors(errs);
    if (Object.keys(errs).length) return;

    setProcessing(true);

    try {
      // == ARMAR ORDEN PARA BACKEND ==
      const payload = {
        clienteNombre: form.nombre,
        clienteEmail: form.email,
        direccionEnvio: `${form.direccion}, ${form.comuna}, ${form.region}`,
        total,
        items: items.map(it => ({
          productId: it.id,
          cantidad: it.qty,
          precioUnitario: it.price
        }))
      };

      // llamada real al backend
      await OrdersAPI.createOrder(payload);

      // regla de tarjeta rechazada
      const rejected = /0$/.test(digitsOnly(form.card));
      await new Promise(r => setTimeout(r, 700));

      if (rejected) {
        nav("/compra-fallida");
      } else {
        Store.clearCart();
        nav("/compra-exitosa");
      }
    } catch (err) {
      console.error("Error creando orden:", err);
      alert("Error al procesar la compra.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container mt-3">
      <h2 className="section-title">Checkout</h2>

      <div className="row g-4">
        {/* --- FORMULARIO --- */}
        <div className="col-lg-7">
          <form className="card p-3 bg-dark text-light border-secondary" onSubmit={onSubmit}>

            <h5>Datos de facturación</h5>

            {/* Nombre */}
            <div className="mb-3">
              <label className="form-label">Nombre completo</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={onChange}
                placeholder="Ej: Juan Pérez"
                className="form-control bg-dark text-light border-secondary"
              />
              {errors.nombre && <div className="text-danger">{errors.nombre}</div>}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="usuario@duocuc.cl"
                className="form-control bg-dark text-light border-secondary"
              />
              {errors.email && <div className="text-danger">{errors.email}</div>}
            </div>

            {/* Dirección */}
            <div className="mb-3">
              <label className="form-label">Dirección</label>
              <input
                name="direccion"
                value={form.direccion}
                onChange={onChange}
                placeholder="Calle 123"
                className="form-control bg-dark text-light border-secondary"
              />
              {errors.direccion && <div className="text-danger">{errors.direccion}</div>}
            </div>

            {/* Comuna */}
            <div className="mb-3">
              <label className="form-label">Comuna</label>
              <input
                name="comuna"
                value={form.comuna}
                onChange={onChange}
                placeholder="Santiago Centro"
                className="form-control bg-dark text-light border-secondary"
              />
              {errors.comuna && <div className="text-danger">{errors.comuna}</div>}
            </div>

            {/* Región */}
            <div className="mb-3">
              <label className="form-label">Región</label>
              <input
                name="region"
                value={form.region}
                onChange={onChange}
                placeholder="Región Metropolitana"
                className="form-control bg-dark text-light border-secondary"
              />
              {errors.region && <div className="text-danger">{errors.region}</div>}
            </div>

            <h5 className="mt-3">Pago con tarjeta</h5>

            {/* Número */}
            <div className="mb-3">
              <label className="form-label">Número de tarjeta</label>
              <input
                name="card"
                value={form.card}
                onChange={onChange}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="form-control bg-dark text-light border-secondary"
              />
              {errors.card && <div className="text-danger">{errors.card}</div>}
            </div>

            {/* Exp & CVV */}
            <div className="row g-3">
              <div className="col-sm-6">
                <label className="form-label">Expiración (MM/YY)</label>
                <input
                  name="exp"
                  value={form.exp}
                  onChange={onChange}
                  placeholder="MM/YY"
                  className="form-control bg-dark text-light border-secondary"
                  maxLength={5}
                />
                {errors.exp && <div className="text-danger">{errors.exp}</div>}
              </div>

              <div className="col-sm-6">
                <label className="form-label">CVV</label>
                <input
                  name="cvv"
                  value={form.cvv}
                  onChange={onChange}
                  placeholder="123"
                  className="form-control bg-dark text-light border-secondary"
                  maxLength={3}
                />
                {errors.cvv && <div className="text-danger">{errors.cvv}</div>}
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-3">
              <div>Total: <strong>{money(total)}</strong></div>
              <button className="btn btn-brand" disabled={processing}>
                {processing ? "Procesando..." : "Pagar ahora"}
              </button>
            </div>

          </form>
        </div>

        {/* --- RESUMEN --- */}
        <div className="col-lg-5">
          <div className="card p-3 bg-dark text-light border-secondary">
            <h5>Resumen del pedido</h5>

            {items.length === 0 ? (
              <div className="text-secondary">Tu carrito está vacío.</div>
            ) : (
              <div className="list-group">
                {items.map(it => (
                  <div key={it.id} className="d-flex align-items-center gap-3 py-2 border-bottom">
                    {/* Imagen */}
                    <div style={{
                      width: 56,
                      height: 56,
                      display: "grid",
                      placeItems: "center",
                      overflow: "hidden",
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.03)"
                    }}>
                      <img
                        src={it.img}
                        alt={it.name}
                        style={{ maxWidth: "100%", maxHeight: "100%" }}
                        onError={(e) => {
                          e.currentTarget.src = "/img/skins/AK-BLOODSPORT.png";
                        }}
                      />
                    </div>

                    {/* Nombre y detalle */}
                    <div style={{ flex: 1 }}>
                      <div className="fw-semibold">{it.name}</div>
                      <div className="text-secondary small">
                        {it.qty} × {money(it.price)}
                      </div>
                    </div>

                    {/* Total por ítem */}
                    <strong>{money(it.qty * it.price)}</strong>
                  </div>
                ))}

                <div className="d-flex justify-content-between mt-3">
                  <span className="fw-semibold">Total</span>
                  <span className="fw-semibold">{money(total)}</span>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

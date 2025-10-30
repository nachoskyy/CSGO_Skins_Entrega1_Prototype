//  Formulario de contacto
import { useState } from "react";
import { validateEmail } from "../utils/validators";
// Componente principal de contacto
export default function Contacto(){
  const [f, setF] = useState({ nombre:"", email:"", mensaje:"" });
  const [sent, setSent] = useState(false);
  const [emailErr, setEmailErr] = useState("");
  // Manejar cambios en el formulario
  const onChange = e => {
    const { name, value } = e.target;
    setF(s => ({ ...s, [name]: value }));
    if (name === "email") {
      setEmailErr(validateEmail(value) ? "" : "Correo inválido (usa @duocuc.cl, @outlook.com o @gmail.com)");
    }
  };
  // Manejar envío del formulario
  const enviar = (e) => {
    e.preventDefault();
    if (!validateEmail(f.email)) {
      setEmailErr("Correo inválido (usa @duocuc.cl, @outlook.com o @gmail.com)");
      return;
    }
    setSent(true);
    setTimeout(()=> setSent(false), 3000);
    setF({ nombre:"", email:"", mensaje:"" });
  };
  
  const disabled = !f.nombre.trim() || !f.mensaje.trim() || !!emailErr || !validateEmail(f.email);
  // Render
  return (
    <div className="container mt-3">
      <h2 className="section-title">Contacto</h2>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <form className="card p-3 bg-dark text-light border-secondary" onSubmit={enviar}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input className="form-control bg-dark text-light border-secondary" name="nombre" value={f.nombre} onChange={onChange} required/>
            </div>
            <div className="mb-2">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-control bg-dark text-light border-secondary ${emailErr ? "is-invalid" : ""}`}
                name="email"
                value={f.email}
                onChange={onChange}
                required
              />
              {emailErr && <div className="invalid-feedback">{emailErr}</div>}
              {!emailErr && <div className="form-text text-secondary">Se permiten: duocuc.cl, outlook.com, gmail.com</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Mensaje</label>
              <textarea rows="4" className="form-control bg-dark text-light border-secondary" name="mensaje" value={f.mensaje} onChange={onChange} required/>
            </div>
            <div className="d-flex justify-content-end">
              <button className="btn btn-brand" disabled={disabled}>Enviar</button>
            </div>
            {sent && <div className="alert alert-success mt-3">¡Mensaje enviado (simulado)!</div>}
          </form>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card p-3 bg-dark text-light border-secondary">
            <h6 className="mb-2 text-brand">Información</h6>
            <p className="mb-1">K&N Skins</p>
            <p className="mb-1 text-secondary">Av. Antonio Varas 5513, Santiago, Chile</p>
            <p className="mb-3 text-secondary">Tel: +569 55122419 · Mail: contacto@KNSkins.gg</p>
            <div className="d-flex gap-3">
              <a href="https://x.com" target="_blank" rel="noreferrer">X</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://t.me" target="_blank" rel="noreferrer">Telegram</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

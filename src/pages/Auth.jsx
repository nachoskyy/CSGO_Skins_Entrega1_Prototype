// pagina de autenticacion (login y registro)
import { useEffect, useMemo, useState } from "react";
import { validateEmail, validateStrongPassword, validateRUT, validateDate, sha256 } from "../utils/validators";

// Regiones y comunas (ampliado)
const REGIONES = [
  { name: "Arica y Parinacota", comunas: ["Arica", "Camarones", "Putre", "General Lagos"] },
  { name: "Tarapacá", comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte"] },
  { name: "Antofagasta", comunas: ["Antofagasta", "Calama", "Mejillones", "Taltal", "Tocopilla"] },
  { name: "Atacama", comunas: ["Copiapó", "Vallenar", "Caldera", "Chañaral"] },
  { name: "Coquimbo", comunas: ["La Serena", "Coquimbo", "Ovalle", "Illapel", "Vicuña"] },
  { name: "Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio"] },
  { name: "Metropolitana", comunas: ["Santiago", "Providencia", "Las Condes", "Ñuñoa", "Maipú", "Puente Alto", "La Florida"] },
  { name: "O'Higgins", comunas: ["Rancagua", "Machalí", "San Fernando"] },
  { name: "Maule", comunas: ["Talca", "Curicó", "Linares", "Cauquenes"] },
  { name: "Ñuble", comunas: ["Chillán", "San Carlos", "Bulnes"] },
  { name: "Biobío", comunas: ["Concepción", "Talcahuano", "Coronel", "Los Ángeles"] },
  { name: "La Araucanía", comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Angol"] },
  { name: "Los Ríos", comunas: ["Valdivia", "La Unión", "Río Bueno"] },
  { name: "Los Lagos", comunas: ["Puerto Montt", "Puerto Varas", "Osorno", "Castro"] },
  { name: "Aysén", comunas: ["Coyhaique", "Puerto Aysén"] },
  { name: "Magallanes", comunas: ["Punta Arenas", "Puerto Natales"] },
];
// Claves para almacenamiento local
const USERS_KEY = "tienda-react-users";
const SESSION_KEY = "tienda-react-session";
// Funciones de lectura y escritura
function readUsers(){ try { return JSON.parse(localStorage.getItem(USERS_KEY)) ?? []; } catch { return []; } }
function writeUsers(list){ localStorage.setItem(USERS_KEY, JSON.stringify(list)); }
function saveSession(email){ localStorage.setItem(SESSION_KEY, JSON.stringify({ email, at: Date.now() })); }
function clearSession(){ localStorage.removeItem(SESSION_KEY); }
// Componente principal de autenticación
export default function Auth(){
  const [tab, setTab] = useState("login"); // "login" | "register"
  const [users, setUsers] = useState(readUsers());

  // ===== LOGIN =====
  const [login, setLogin] = useState({ email:"", password:"" });
  const [loginErr, setLoginErr] = useState("");

  // ===== REGISTER =====
  const [f, setF] = useState({
    run:"", nombres:"", apellidos:"", email:"", fecha:"", region:"", comuna:"", direccion:"", password:""
  });
  const [errors, setErrors] = useState({});
  const comunas = useMemo(() => (REGIONES.find(r => r.name === f.region)?.comunas ?? []), [f.region]);
// Actualizar lista de usuarios al montar
  useEffect(()=>{ setUsers(readUsers()); }, []);
// Manejar cambios en formularios
  const changeLogin = e => setLogin(s => ({...s, [e.target.name]: e.target.value}));
  const change = e => setF(s => ({...s, [e.target.name]: e.target.value}));

  // ===== VALIDACIÓN REGISTRO =====
  const validateRegister = () => {
    const e = {};
    if (!validateRUT(f.run)) e.run = "RUN inválido. Ej: 19.011.022-K o 19011022K";
    if (!f.nombres.trim()) e.nombres = "Ingresa tus nombres.";
    if (!f.apellidos.trim()) e.apellidos = "Ingresa tus apellidos.";
    if (!validateEmail(f.email)) e.email = "Correo inválido (solo @duocuc.cl, @outlook.com, @gmail.com).";
    if (!validateDate(f.fecha)) e.fecha = "Fecha inválida.";
    if (!f.region) e.region = "Selecciona una región.";
    if (!f.comuna) e.comuna = "Selecciona una comuna.";
    if (!f.direccion.trim()) e.direccion = "Ingresa una dirección.";
    if (!validateStrongPassword(f.password)) e.password = "Contraseña insegura (≥6, mayúscula, minúscula, número y símbolo).";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ===== SUBMITS =====
  const onRegister = async (ev) => {
    ev.preventDefault();
    if (!validateRegister()) return;

    const exists = users.some(u => u.email.toLowerCase() === f.email.toLowerCase());
    if (exists) { setErrors({ email: "Ya existe una cuenta con este correo." }); return; }

    const hashed = await sha256(f.password);
    const newUser = { ...f, email: f.email.toLowerCase(), password: hashed, createdAt: Date.now() };
    const next = [...users, newUser];
    writeUsers(next); setUsers(next);

    // auto-login
    saveSession(newUser.email);
    setTab("login");
    setLogin({ email: newUser.email, password: "" });
    alert("Cuenta creada. Ahora puedes iniciar sesión.");
  };
  // Manejar login
  const onLogin = async (ev) => {
    ev.preventDefault();
    setLoginErr("");
    // Validar campos
    if (!validateEmail(login.email)) { setLoginErr("Correo inválido o dominio no permitido."); return; }
    if (!login.password) { setLoginErr("Ingresa tu contraseña."); return; }
    // Verificar credenciales
    const hashed = await sha256(login.password);
    const u = users.find(x => x.email.toLowerCase() === login.email.toLowerCase());
    if (!u || u.password !== hashed) { setLoginErr("Credenciales incorrectas."); return; }
    // Guardar sesión
    saveSession(u.email);
    alert("Inicio de sesión correcto.");
  };
  // Manejar logout (demo)
  const logout = () => { clearSession(); alert("Sesión cerrada."); };
  // Render
  return (
    <div className="container mt-3">
      <h2 className="section-title">Acceso</h2>

      {/* Tabs */}
      <div className="d-flex gap-2 mb-3">
        <button className={`btn btn-${tab==='login'?'brand':'outline-primary'}`} onClick={()=>setTab("login")}>Login</button>
        <button className={`btn btn-${tab==='register'?'brand':'outline-primary'}`} onClick={()=>setTab("register")}>Registro</button>
      </div>

      {/* ==== LOGIN ==== */}
      {tab === "login" && (
        <div className="card p-3 bg-dark text-light border-secondary">
          <h5 className="mb-3">Inicio de sesión</h5>
          <form onSubmit={onLogin} className="row g-3">
            <div className="col-12">
              <label className="form-label">Correo (solo @duocuc.cl, @outlook.com, @gmail.com)</label>
              <input className="form-control bg-dark text-light border-secondary" name="email" value={login.email} onChange={changeLogin} required />
            </div>
            <div className="col-12">
              <label className="form-label">Contraseña</label>
              <input type="password" className="form-control bg-dark text-light border-secondary" name="password" value={login.password} onChange={changeLogin} required />
            </div>
            {loginErr && <div className="text-danger">{loginErr}</div>}
            <div className="col-12 d-flex justify-content-between">
              <button className="btn btn-brand" type="submit">Ingresar</button>
              <button className="btn btn-outline-primary" type="button" onClick={()=>setTab("register")}>¿No tienes cuenta? Registrarse</button>
            </div>
            <div className="col-12">
              <button className="btn btn-outline-primary btn-sm" type="button" onClick={logout}>Cerrar sesión (demo)</button>
            </div>
          </form>
        </div>
      )}

      {/* ==== REGISTRO ==== */}
      {tab === "register" && (
        <div className="card p-3 bg-dark text-light border-secondary">
          <h5 className="mb-3">Registro</h5>
          <form onSubmit={onRegister} className="row g-3">
            <div className="col-md-4">
              <label className="form-label">RUN (20.388.360-9 o 20388360-9)</label>
              <input className="form-control bg-dark text-light border-secondary" name="run" value={f.run} onChange={change} required />
              {errors.run && <div className="text-danger">{errors.run}</div>}
            </div>
            <div className="col-md-4">
              <label className="form-label">Nombres</label>
              <input className="form-control bg-dark text-light border-secondary" name="nombres" value={f.nombres} onChange={change} required />
              {errors.nombres && <div className="text-danger">{errors.nombres}</div>}
            </div>
            <div className="col-md-4">
              <label className="form-label">Apellidos</label>
              <input className="form-control bg-dark text-light border-secondary" name="apellidos" value={f.apellidos} onChange={change} required />
              {errors.apellidos && <div className="text-danger">{errors.apellidos}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Correo (solo @duocuc.cl, @outlook.com, @gmail.com)</label>
              <input type="email" className="form-control bg-dark text-light border-secondary" name="email" value={f.email} onChange={change} required />
              {errors.email && <div className="text-danger">{errors.email}</div>}
            </div>
            <div className="col-md-3">
              <label className="form-label">Fecha de nacimiento</label>
              <input type="date" className="form-control bg-dark text-light border-secondary" name="fecha" value={f.fecha} onChange={change} />
              {errors.fecha && <div className="text-danger">{errors.fecha}</div>}
            </div>

            <div className="col-md-3">
              <label className="form-label">Región</label>
              <select className="form-select bg-dark text-light border-secondary" name="region" value={f.region} onChange={change} required>
                <option value="">Seleccione…</option>
                {REGIONES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
              </select>
              {errors.region && <div className="text-danger">{errors.region}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label">Comuna</label>
              <select className="form-select bg-dark text-light border-secondary" name="comuna" value={f.comuna} onChange={change} required disabled={!f.region}>
                <option value="">{f.region ? "Seleccione…" : "Seleccione región primero"}</option>
                {comunas.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.comuna && <div className="text-danger">{errors.comuna}</div>}
            </div>

            <div className="col-12">
              <label className="form-label">Dirección</label>
              <input className="form-control bg-dark text-light border-secondary" name="direccion" value={f.direccion} onChange={change} required />
              {errors.direccion && <div className="text-danger">{errors.direccion}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Contraseña (≥6, may/min/número/símbolo)</label>
              <input type="password" className="form-control bg-dark text-light border-secondary" name="password" value={f.password} onChange={change} required />
              {errors.password && <div className="text-danger">{errors.password}</div>}
            </div>

            <div className="col-12 d-flex justify-content-between">
              <button className="btn btn-outline-primary" type="button" onClick={()=>setTab("login")}>Ya tengo cuenta</button>
              <button className="btn btn-brand" type="submit">Crear cuenta</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

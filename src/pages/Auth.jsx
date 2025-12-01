// pagina de autenticacion (login y registro)
import { useMemo, useState } from "react";
import {
  validateEmail,
  validateStrongPassword,
  validateRUT,
  validateDate
} from "../utils/validators";
import axios from "axios";

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

// ================================
// MANEJO DE SESIÓN
// ================================
const SESSION_KEY = "tienda-react-session";

function saveSession(user) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
      at: Date.now()
    })
  );
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export default function Auth() {

  const [tab, setTab] = useState("login");

  // =============================
  // LOGIN
  // =============================
  const [login, setLogin] = useState({ email: "", password: "" });
  const [loginErr, setLoginErr] = useState("");

  const changeLogin = (e) => {
    const { name, value } = e.target;
    setLogin(s => ({ ...s, [name]: value }));
  };

  const onLogin = async (ev) => {
    ev.preventDefault();
    setLoginErr("");

    if (!validateEmail(login.email)) {
      setLoginErr("Correo inválido.");
      return;
    }
    if (!login.password) {
      setLoginErr("Ingresa tu contraseña.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/usuarios/login", {
        email: login.email,
        password: login.password
      });

      if (res.data.status !== "OK") {
        setLoginErr(res.data.message);
        return;
      }

      // Guardar usuario
      localStorage.setItem("user", JSON.stringify(res.data));

      // ⭐ MENSAJE NUEVO LOGIN EXITOSO
      alert("Inicio de sesión exitoso. ¡Bienvenido!");

      // Redirección según rol
      if (res.data.role === "ADMIN") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/";
      }

    } catch (err) {
      console.error(err);
      setLoginErr("Error inesperado de servidor.");
    }
  };


  // =============================
  // REGISTRO
  // =============================
  const [f, setF] = useState({
    run: "", nombres: "", apellidos: "", email: "",
    fecha: "", region: "", comuna: "", direccion: "", password: ""
  });

  const [errors, setErrors] = useState({});

  const comunas = useMemo(
    () => (REGIONES.find(r => r.name === f.region)?.comunas ?? []),
    [f.region]
  );

  // Validación por campo
  const validateField = (name, value) => {
    let msg = "";

    switch (name) {
      case "run":
        if (!validateRUT(value)) msg = "RUN inválido.";
        break;
      case "nombres":
        if (!value.trim()) msg = "Ingresa tus nombres.";
        break;
      case "apellidos":
        if (!value.trim()) msg = "Ingresa tus apellidos.";
        break;
      case "email":
        if (!validateEmail(value)) msg = "Correo inválido.";
        break;
      case "fecha":
        if (!validateDate(value)) msg = "Fecha inválida.";
        break;
      case "region":
        if (!value.trim()) msg = "Selecciona una región.";
        break;
      case "comuna":
        if (!value.trim()) msg = "Selecciona una comuna.";
        break;
      case "direccion":
        if (!value.trim()) msg = "Ingresa una dirección.";
        break;
      case "password":
        if (!validateStrongPassword(value))
          msg = "Debe tener ≥6 caracteres, mayúscula, minúscula, número y símbolo.";
        break;
    }

    setErrors(e => ({ ...e, [name]: msg }));
  };

  // Cambio general
  const change = (e) => {
    const { name, value } = e.target;
    setF(s => ({ ...s, [name]: value }));
    validateField(name, value);
  };

  // Handler para RUN
  const handleRunChange = (e) => {
    let v = e.target.value.toUpperCase();
    v = v.replace(/[^0-9K\-]/g, "");
    const parts = v.split("-");
    if (parts.length > 2) v = parts[0] + "-" + parts[1];
    if (v.length > 10) v = v.slice(0, 10);
    setF(s => ({ ...s, run: v }));
    validateField("run", v);
  };

  // Validación final
  const validateRegister = () => {
    const e = {};

    if (!validateRUT(f.run)) e.run = "RUN inválido.";
    if (!f.nombres.trim()) e.nombres = "Ingresa tus nombres.";
    if (!f.apellidos.trim()) e.apellidos = "Ingresa tus apellidos.";
    if (!validateEmail(f.email)) e.email = "Correo inválido.";
    if (!validateDate(f.fecha)) e.fecha = "Fecha inválida.";
    if (!f.region) e.region = "Selecciona una región.";
    if (!f.comuna) e.comuna = "Selecciona una comuna.";
    if (!f.direccion.trim()) e.direccion = "Ingresa una dirección.";
    if (!validateStrongPassword(f.password))
      e.password = "Debe tener ≥6 caracteres, mayúscula, minúscula, número y símbolo.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onRegister = async (ev) => {
    ev.preventDefault();
    if (!validateRegister()) return;

    try {
      const res = await axios.post("http://localhost:8080/api/usuarios/registro", {
        nombre: f.nombres + " " + f.apellidos,
        email: f.email,
        password: f.password
      });

      // ⭐ MENSAJE NUEVO EN REGISTRO (SIN [object Object])
      alert("Cuenta creada con éxito. Ahora puedes iniciar sesión.");

      setTab("login");
      setLogin({ email: f.email, password: "" });

    } catch (error) {
      if (error.response) alert(error.response.data);
      else alert("Error al conectar con el servidor.");
    }
  };

  // Logout
  const logout = () => {
    clearSession();
    alert("Sesión cerrada.");
  };

  // =============================
  // RENDER
  // =============================
  return (
    <div className="container mt-3">

      <h2 className="section-title">Acceso</h2>

      <div className="d-flex gap-2 mb-3">
        <button
          className={`btn btn-${tab === "login" ? "brand" : "outline-primary"}`}
          onClick={() => setTab("login")}
        >
          Login
        </button>

        <button
          className={`btn btn-${tab === "register" ? "brand" : "outline-primary"}`}
          onClick={() => setTab("register")}
        >
          Registro
        </button>
      </div>

      {/* LOGIN */}
      {tab === "login" && (
        <div className="card p-3 bg-dark text-light border-secondary">
          <h5 className="mb-3">Inicio de sesión</h5>

          <form onSubmit={onLogin} className="row g-3">
            <div className="col-12">
              <label className="form-label">Correo</label>
              <input
                className="form-control bg-dark text-light border-secondary"
                name="email"
                value={login.email}
                onChange={changeLogin}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control bg-dark text-light border-secondary"
                name="password"
                value={login.password}
                onChange={changeLogin}
                required
              />
            </div>

            {loginErr && <div className="text-danger">{loginErr}</div>}

            <div className="col-12 d-flex justify-content-between">
              <button className="btn btn-brand" type="submit">Ingresar</button>
              <button className="btn btn-outline-primary" type="button"
                onClick={() => setTab("register")}>
                Crear cuenta
              </button>
            </div>

            <div className="col-12">
              <button className="btn btn-outline-primary btn-sm"
                type="button" onClick={logout}>Cerrar sesión</button>
            </div>

          </form>
        </div>
      )}

      {/* REGISTRO */}
      {tab === "register" && (
        <div className="card p-3 bg-dark text-light border-secondary">
          <h5 className="mb-3">Registro</h5>

          <form onSubmit={onRegister} className="row g-3">

            <div className="col-md-4">
              <label className="form-label">
                RUN <small className="text-secondary">(20.388.360-9)</small>
              </label>
              <input
                className="form-control bg-dark text-light border-secondary"
                name="run"
                value={f.run}
                onChange={handleRunChange}
                required
              />
              {errors.run && <div className="text-danger">{errors.run}</div>}
            </div>

            <div className="col-md-4">
              <label className="form-label">Nombres</label>
              <input
                className="form-control bg-dark text-light border-secondary"
                name="nombres"
                value={f.nombres}
                onChange={change}
                required
              />
              {errors.nombres && <div className="text-danger">{errors.nombres}</div>}
            </div>

            <div className="col-md-4">
              <label className="form-label">Apellidos</label>
              <input
                className="form-control bg-dark text-light border-secondary"
                name="apellidos"
                value={f.apellidos}
                onChange={change}
                required
              />
              {errors.apellidos && <div className="text-danger">{errors.apellidos}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Correo</label>
              <input
                type="email"
                className="form-control bg-dark text-light border-secondary"
                name="email"
                value={f.email}
                onChange={change}
                required
              />
              {errors.email && <div className="text-danger">{errors.email}</div>}
            </div>

            <div className="col-md-3">
              <label className="form-label">Fecha nacimiento</label>
              <input
                type="date"
                className="form-control bg-dark text-light border-secondary"
                name="fecha"
                value={f.fecha}
                onChange={change}
              />
              {errors.fecha && <div className="text-danger">{errors.fecha}</div>}
            </div>

            <div className="col-md-3">
              <label className="form-label">Región</label>
              <select
                className="form-select bg-dark text-light border-secondary"
                name="region"
                value={f.region}
                onChange={change}
                required
              >
                <option value="">Seleccione…</option>
                {REGIONES.map(r => (
                  <option key={r.name} value={r.name}>{r.name}</option>
                ))}
              </select>
              {errors.region && <div className="text-danger">{errors.region}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Comuna</label>
              <select
                className="form-select bg-dark text-light border-secondary"
                name="comuna"
                value={f.comuna}
                onChange={change}
                required
                disabled={!f.region}
              >
                <option value="">
                  {f.region ? "Seleccione…" : "Seleccione región primero"}
                </option>
                {comunas.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.comuna && <div className="text-danger">{errors.comuna}</div>}
            </div>

            <div className="col-12">
              <label className="form-label">Dirección</label>
              <input
                className="form-control bg-dark text-light border-secondary"
                name="direccion"
                value={f.direccion}
                onChange={change}
                required
              />
              {errors.direccion && <div className="text-danger">{errors.direccion}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">
                Contraseña <small>(≥6, may/min/número/símbolo)</small>
              </label>
              <input
                type="password"
                className="form-control bg-dark text-light border-secondary"
                name="password"
                value={f.password}
                onChange={change}
                required
              />
              {errors.password && <div className="text-danger">{errors.password}</div>}
            </div>

            <div className="col-12 d-flex justify-content-between">
              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={() => setTab("login")}
              >
                Ya tengo cuenta
              </button>

              <button className="btn btn-brand" type="submit">
                Crear cuenta
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}

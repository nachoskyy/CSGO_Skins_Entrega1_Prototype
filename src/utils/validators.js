// Colección de validadores y normalizadores usados en toda la app.

// Correos permitidos
const ALLOWED_DOMAINS = ["duocuc.cl", "outlook.com", "gmail.com"];

/** Valida email con formato básico y dominios permitidos */
export function validateEmail(email) {
  if (!email) return false;
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!ok) return false;
  const domain = email.split("@")[1].toLowerCase();
  return ALLOWED_DOMAINS.includes(domain);
}
/** Valida contraseña fuerte: min 6 letras, mayuscula, minuscula, numero y simbolo */
export function validateStrongPassword(pwd) {
  if (!pwd || pwd.length < 6) return false;
  return (
    /[a-z]/.test(pwd) &&
    /[A-Z]/.test(pwd) &&
    /[0-9]/.test(pwd) &&
    /[^A-Za-z0-9]/.test(pwd)
  );
}

/** Devuelve solo los dígitos de un string */
export function digitsOnly(str = "") {
  return (str || "").replace(/\D/g, "");
}

/** Valida número de tarjeta */
export function luhnCheck(value) {
  const num = digitsOnly(value);
  if (num.length < 12) return false;
  let sum = 0, dbl = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = Number(num[i]);
    if (dbl) { d *= 2; if (d > 9) d -= 9; }
    sum += d; dbl = !dbl;
  }
  return sum % 10 === 0;
}

/** agrupa cada 4  numeros y limita a 16 dígitos para el num de la tarjeta*/
export function normalizeCardNumber(input) {
  const raw = digitsOnly(input).slice(0, 16);
  return raw.replace(/(.{4})/g, "$1 ").trim();
}

/** CVV de 3 dígitos */
export function validateCVV(value) {
  return /^\d{3}$/.test(String(value || "").trim());
}

//  Expiración Tarjeta 
/** Normaliza a MM/YY con autoinserción de "/" y máx 5 caracteres */
export function normalizeExpiry(input) {
  const raw = digitsOnly(input).slice(0, 4); // MMYY
  if (raw.length <= 2) return raw;
  return `${raw.slice(0, 2)}/${raw.slice(2)}`;
}

/** Valida que MM/YY sea correcto y no esté vencido (válido hasta fin de mes) */
export function validateExpiry(value) {
  if (!value) return false;
  const v = String(value).trim();
  if (!/^\d{2}\/\d{2}$/.test(v)) return false;

  const [mmStr, yyStr] = v.split("/");
  const mm = Number(mmStr);
  const yy = Number(yyStr);
  if (mm < 1 || mm > 12) return false;

  const year = 2000 + yy;
  // Primer día del mes siguiente (si es > now, la tarjeta sigue válida)
  const firstOfNextMonth = new Date(year, mm, 1);
  const now = new Date();
  return firstOfNextMonth > now;
}

/** Valida fecha en formatos ISO (YYYY-MM-DD) o LATAM (DD/MM/YYYY), años 1900-2099 */
export function validateDate(value) {
  if (!value) return false;
  const v = String(value).trim();

  let y, m, d;
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/;
  const latam = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  if (iso.test(v)) {
    const [, yy, mm, dd] = v.match(iso);
    y = Number(yy); m = Number(mm); d = Number(dd);
  } else if (latam.test(v)) {
    const [, dd, mm, yy] = v.match(latam);
    y = Number(yy); m = Number(mm); d = Number(dd);
  } else {
    return false;
  }

  if (y < 1900 || y > 2099) return false;
  if (m < 1 || m > 12) return false;

  const daysInMonth = new Date(y, m, 0).getDate();
  if (d < 1 || d > daysInMonth) return false;

  return true;
}

// RUT Chileno
/** Normaliza RUT a formato "12345678-5" */ 
export function normalizeRUT(input) {
  if (input == null) return "";
  const s = String(input).toUpperCase().replace(/[^0-9Kk]/g, "");
  // si tiene DV al final, separar
  const body = s.slice(0, -1);
  const dv = s.slice(-1);
  if (!body) return "";
  return `${Number(body)}-${dv}`;
}

/** Calcula dígito verificador a partir del cuerpo numérico */
export function computeRUTDv(body) {
  const clean = String(body).replace(/\D/g, "");
  let sum = 0, mul = 2;
  for (let i = clean.length - 1; i >= 0; i--) {
    sum += Number(clean[i]) * mul;
    mul = (mul === 7) ? 2 : mul + 1;
  }
  const res = 11 - (sum % 11);
  if (res === 11) return "0";
  if (res === 10) return "K";
  return String(res);
}

/** Valida RUT (cuerpo + DV) en formatos: "12345678-5", "12.345.678-5", "123456785" */
export function validateRUT(rut) {
  if (!rut) return false;
  const s = String(rut).toUpperCase().replace(/[^0-9K]/g, "");
  if (s.length < 2) return false;
  const body = s.slice(0, -1);
  const dv = s.slice(-1);
  if (!/^\d+$/.test(body)) return false;
  const expected = computeRUTDv(body);
  return dv === expected;
}

// Hash (para Auth.jsx, etc.)
export async function sha256(text) {
  const enc = new TextEncoder().encode(String(text ?? ""));
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

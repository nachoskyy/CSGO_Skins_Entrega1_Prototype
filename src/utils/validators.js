// Colección de validadores y normalizadores usados en toda la app.

// ========================= Email =========================
const ALLOWED_DOMAINS = ["duocuc.cl", "outlook.com", "gmail.com"];

// Valida formato básico y dominio permitido
export function validateEmail(email) {
  if (!email) return false;
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // formato básico
  if (!ok) return false; // fallo rápido
  const domain = email.split("@")[1].toLowerCase(); // dominio
  return ALLOWED_DOMAINS.includes(domain); // dominio permitido
}
// ======================== Password =========================
// Mínimo 6 caracteres, al menos una mayuscula, una minuscula, un numero y un simbolo
export function validateStrongPassword(pwd) {
  if (!pwd || pwd.length < 6) return false; // longitud mínima
  return (
    /[a-z]/.test(pwd) && // al menos una minúscula
    /[A-Z]/.test(pwd) && // al menos una mayúscula
    /[0-9]/.test(pwd) && // al menos un número
    /[^A-Za-z0-9]/.test(pwd) // al menos un símbolo
  );
}

// ========================= Util genéricas =========================
export function digitsOnly(str = "") {
  return (str || "").replace(/\D/g, ""); // elimina todo menos dígitos
}

// ========================= Tarjeta =========================
/** Valida número de tarjeta */
export function luhnCheck(value) {
  const num = digitsOnly(value); 
  if (num.length < 12) return false; // mínimo 12 dígitos
  let sum = 0, dbl = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = Number(num[i]);
    if (dbl) { d *= 2; if (d > 9) d -= 9; }
    sum += d; dbl = !dbl;
  }
  return sum % 10 === 0;
}

/** 1234 5678 9012 3456 – agrupa cada 4 y limita a 16 dígitos */
export function normalizeCardNumber(input) {
  const raw = digitsOnly(input).slice(0, 16); // máximo 16 dígitos
  return raw.replace(/(.{4})/g, "$1 ").trim(); // agrupa de 4 en 4
}

/** CVV de 3 dígitos */
export function validateCVV(value) {
  return /^\d{3}$/.test(String(value || "").trim());
}

// ========================= Expiración (MM/YY) =========================
/** Normaliza a MM/YY con autoinserción de "/" y máx 5 caracteres */
export function normalizeExpiry(input) {
  const raw = digitsOnly(input).slice(0, 4); // MMYY
  if (raw.length <= 2) return raw; // hasta 2 dígitos, sin "/"
  return `${raw.slice(0, 2)}/${raw.slice(2)}`; // inserta "/"
}

/** Valida que MM/YY sea correcto y no esté vencido (válido hasta fin de mes) */
export function validateExpiry(value) {
  if (!value) return false; 
  const v = String(value).trim(); // formato MM/YY
  if (!/^\d{2}\/\d{2}$/.test(v)) return false;

  const [mmStr, yyStr] = v.split("/"); // extrae MM y YY
  const mm = Number(mmStr); 
  const yy = Number(yyStr);
  if (mm < 1 || mm > 12) return false; // mes inválido

  const year = 2000 + yy;
  // Primer día del mes siguiente (si es > now, la tarjeta sigue válida)
  const firstOfNextMonth = new Date(year, mm, 1);
  const now = new Date();
  return firstOfNextMonth > now;
}

// ========================= Fechas =========================
/**
 * Valida una fecha en formato "YYYY-MM-DD" o "DD/MM/YYYY".
 * - día y mes coherentes */
export function validateDate(value) { 
  if (!value) return false;
  const v = String(value).trim(); 

  let y, m, d; 
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/; // YYYY-MM-DD
  const latam = /^(\d{2})\/(\d{2})\/(\d{4})$/; // DD/MM/YYYY

  if (iso.test(v)) {  
    const [, yy, mm, dd] = v.match(iso); 
    y = Number(yy); m = Number(mm); d = Number(dd); 
  } else if (latam.test(v)) { 
    const [, dd, mm, yy] = v.match(latam); 
    y = Number(yy); m = Number(mm); d = Number(dd); 
  } else {
    return false;
  }
  // Validar rangos básicos
  if (y < 1900 || y > 2099) return false;
  if (m < 1 || m > 12) return false; // mes inválido
  // Validar día
  const daysInMonth = new Date(y, m, 0).getDate();
  if (d < 1 || d > daysInMonth) return false;

  return true;
}

// ========================= RUT Chileno =========================
/** Limpia a "XXXXXXXX-D" (sin puntos, guión opcional) */
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

// ========================= Hashing =========================
/** Calcula SHA-256 y devuelve en hexadecimal */
export async function sha256(text) {
  const enc = new TextEncoder().encode(String(text ?? ""));
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// Dominios permitidos
const ALLOWED_DOMAINS = ["duocuc.cl", "outlook.com", "gmail.com"];

// Email válido y dominio permitido
export function validateEmail(email) {
  if (!email) return false;
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!ok) return false;
  const domain = email.split("@")[1].toLowerCase();
  return ALLOWED_DOMAINS.includes(domain);
}

// Password fuerte (demo)
export function validateStrongPassword(pwd) {
  if (!pwd || pwd.length < 6) return false;
  return /[a-z]/.test(pwd) && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd);
}

// RUT/RUN chileno: admite puntos/guion y DV k/K
export function validateRUT(value) {
  if (!value) return false;
  const clean = value.toString().replace(/[^0-9kK]/g, "").toUpperCase();
  if (clean.length < 2) return false;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  if (!/^\d+$/.test(body)) return false;

  let sum = 0, mult = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * mult;
    mult = mult === 7 ? 2 : mult + 1;
  }
  const rest = 11 - (sum % 11);
  const dvCalc = rest === 11 ? "0" : rest === 10 ? "K" : String(rest);
  return dvCalc === dv;
}

// Fecha válida (no futura y >= 1900)
export function validateDate(isoStr) {
  if (!isoStr) return true;
  const d = new Date(isoStr);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  if (d > now) return false;
  if (d.getFullYear() < 1900) return false;
  return true;
}

// SHA-256 (demo)
export async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hashBuffer)].map(b => b.toString(16).padStart(2, "0")).join("");
}

/* ===========================
   Validación de tarjeta
   =========================== */

// Normaliza número: elimina espacios y guiones
export function normalizeCardNumber(num) {
  if (!num) return "";
  return num.toString().replace(/\s+/g, "").replace(/-/g, "");
}

// Algoritmo Luhn (verifica número de tarjeta)
export function luhnCheck(cardNumber) {
  const s = normalizeCardNumber(cardNumber);
  if (!/^\d+$/.test(s)) return false;
  let sum = 0;
  let alt = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let n = parseInt(s[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

// Validación mínima de longitud por tipo (opcional) — aceptamos 13..19 dígitos comúnmente
export function validateCardLength(cardNumber) {
  const s = normalizeCardNumber(cardNumber);
  return s.length >= 13 && s.length <= 19;
}

// CVV: exactamente 3 dígitos (tarjetas comunes). Si quieres AMEX usar 4.
export function validateCVV(cvv) {
  if (!cvv) return false;
  return /^[0-9]{3}$/.test(cvv);
}

// validateExpiry para formato MM/YY (solo números)
// acepta "MM/YY" (ej. "04/26"). Comprueba que no esté vencida.
export function validateExpiry(value){
  if(!value) return false;
  const v = value.trim();
  if(!/^\d{2}\/\d{2}$/.test(v)) return false;
  const [mmStr, yyStr] = v.split("/");
  const mm = Number(mmStr);
  const yy = Number(yyStr);
  if(mm < 1 || mm > 12) return false;
  // año = 2000 + yy (dos dígitos)
  const year = 2000 + yy;
  // Fecha de expiración: último día del mes => comprobamos primer día del mes siguiente
  const exp = new Date(year, mm, 1); // mes indexado 0 => mm -> month+1 => usamos mm
  const now = new Date();
  // Si exp debe ser strictly greater than now (aún válido si mes actual no pasó)
  return exp > now;
}
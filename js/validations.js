
// Email domains allowed
const ALLOWED_DOMAINS = ["duocuc.cl","outlook.com","gmail.com"];

function validEmailDomain(email){
  const m = String(email).toLowerCase().match(/@([^@]+)$/);
  if(!m) return false;
  return ALLOWED_DOMAINS.includes(m[1]);
}

// Validar RUN chileno (sin puntos ni guion). Basado en módulo 11.
function validarRUN(run){
  const clean = String(run).toUpperCase().replace(/[^0-9K]/g,"");
  if(clean.length < 7 || clean.length > 9) return false;
  const cuerpo = clean.slice(0,-1);
  const dv = clean.slice(-1);
  let suma=0, multiplo=2;
  for(let i = cuerpo.length-1; i>=0; i--){
    suma += parseInt(cuerpo[i],10)*multiplo;
    multiplo = multiplo===7 ? 2 : multiplo+1;
  }
  const dvEsperado = 11 - (suma % 11);
  const dvCalc = dvEsperado===11 ? "0" : (dvEsperado===10 ? "K" : String(dvEsperado));
  return dv === dvCalc;
}

// Hash de contraseña usando SubtleCrypto (SHA-256)
async function hashPassword(plain){
  const enc = new TextEncoder().encode(plain);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  const arr = Array.from(new Uint8Array(digest));
  return arr.map(b=>b.toString(16).padStart(2,"0")).join("");
}

// Mensajes de error helper
function setError(form, name, msg){ const el = form.querySelector(`[data-error="${name}"]`); if(el) el.textContent = msg || ""; }

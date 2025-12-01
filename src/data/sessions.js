const KEY = "tienda-react-session";

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
}

export function isAdmin() {
  const s = getSession();
  return s && s.rol === "ADMIN";
}

export function logout() {
  localStorage.removeItem(KEY);
}

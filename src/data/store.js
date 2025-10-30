// store.js: Gestión simple de datos usando LocalStorage como "base de datos".
const DB_VERSION = 2;
const VER_KEY   = "tienda-react-version";
const KEY       = "tienda-react-products";
const CART_KEY  = "tienda-react-cart";

// Productos semilla
const seed = [
  { id: 1, name: "AK-47 | Bloodsport",    price: 45000,  category: "Rifles",    offer:false, stock: 8, img:"/img/skins/AK-BLOODSPORT.png" },
  { id: 2, name: "AWP | Dragon",          price: 300000, category: "Rifles",    offer:false, stock: 1, img:"/img/skins/AWP-DRAGON.png" },
  { id: 3, name: "M4A4 | Desolate Space", price: 80000,  category: "Rifles",    offer:true,  stock: 4, img:"/img/skins/M4A4-DESOLATE.png" },
  { id: 4, name: "Karambit | Fade",       price: 500000, category: "Cuchillos", offer:true,  stock: 2, img:"/img/skins/KARAMBIT-FADE.png" },
  { id: 5, name: "Bayonet | Urban Masked",price: 120000, category: "Cuchillos", offer:false, stock: 3, img:"/img/skins/BAYONET-URBAN.png" },
  { id: 6, name: "Glock-18 | Water Elemental", price: 12000, category: "Pistolas", offer:true,  stock:12, img:"/img/skins/GLOCK-WATERELEMENTAL.png" },
  { id: 7, name: "Desert Eagle | Red",    price: 20000,  category: "Pistolas",   offer:false, stock: 6, img:"/img/skins/DesertEagle-Red.png" },
  { id: 8, name: "Specialist Gloves",     price: 220000, category: "Guantes",    offer:false, stock: 2, img:"/img/skins/Gloves-Specialist.png" },
];
// Helpers de lectura y escritura en LocalStorage
function readLS(key, fb){
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fb;
    return JSON.parse(raw);
  } catch { return fb; }
}// Escritura segura
function writeLS(key, value){
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// Pub/Sub simple
const listeners = new Set();
function emit(){ listeners.forEach(fn => { try{ fn(); }catch{} }); }
export function subscribe(fn){ listeners.add(fn); return () => listeners.delete(fn); }

// Init de datos y carrito
(function init(){
  const v = Number(readLS(VER_KEY, 0));
  const data = readLS(KEY, null);
  if (!Array.isArray(data) || v !== DB_VERSION){
    writeLS(KEY, seed);
    writeLS(VER_KEY, DB_VERSION);
  }
  if (!Array.isArray(readLS(CART_KEY, null))){
    writeLS(CART_KEY, []);
  }
})();
// Store público
export const Store = {
  list(){ return readLS(KEY, []); },
  getById(id){
    const d = readLS(KEY, []);
    return d.find(p => p.id === Number(id)) ?? null;
  },
  // CRUD mínimo
  upsert(id, patch){
    const data = readLS(KEY, []);
    const i = data.findIndex(p=>p.id===Number(id));
    if (i<0) return null;
    data[i] = { ...data[i], ...patch };
    writeLS(KEY, data); emit();
    return data[i];
  },
  // Crear producto
  create(p){
    const data = readLS(KEY, []);
    const id = data.length ? Math.max(...data.map(x=>x.id))+1 : 1;
    const row = { id, stock:0, offer:false, ...p };
    data.push(row); writeLS(KEY, data); emit();
    return row;
  },
  // Eliminar producto
  remove(id){
    const data = readLS(KEY, []).filter(p=>p.id!==Number(id));
    writeLS(KEY, data); emit();
  },

  // Carrito
  getCart(){
    const raw = readLS(CART_KEY, []);
    if (!Array.isArray(raw)) return [];
    return raw.map(r => ({
      productId: Number(r.productId ?? r.id),
      qty: Math.max(1, Number(r.qty ?? r.cantidad ?? 1))
    })).filter(r => r.productId>0 && r.qty>0);
  },
  // Añadir al carrito
  addToCart(productId, qty=1){
    const cart = Store.getCart();
    const i = cart.findIndex(c=>c.productId===Number(productId));
    if (i<0) cart.push({ productId:Number(productId), qty:Number(qty)||1 });
    else cart[i].qty += (Number(qty)||1);
    writeLS(CART_KEY, cart); emit();
  },
  // Actualizar cantidad en el carrito
  updateQty(productId, qty){
    const q = Math.max(1, Number(qty)||1);
    const cart = Store.getCart().map(c => c.productId===Number(productId) ? ({...c, qty:q}) : c);
    writeLS(CART_KEY, cart); emit();
  },
  // Remover del carrito
  removeFromCart(productId){
    writeLS(CART_KEY, Store.getCart().filter(c=>c.productId!==Number(productId))); emit();
  },
  // Vaciar carrito
  clearCart(){
    writeLS(CART_KEY, []); emit();
  },
  // Reestablecer datos de productos
  reseed(){ writeLS(KEY, seed); writeLS(VER_KEY, DB_VERSION); emit(); }
};

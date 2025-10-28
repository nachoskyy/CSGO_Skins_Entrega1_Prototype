// ---- versión de "BD" para resembrar cuando cambiamos los productos/imagenes
const DB_VERSION = 2;
const VER_KEY   = "tienda-react-version";
const KEY       = "tienda-react-products";
const CART_KEY  = "tienda-react-cart";

// ====== Productos con rutas EXACTAS (coinciden con /public/img/skins/) ======
const seed = [
  // RIFLES
  { id: 1,  name: "AK-47 | Bloodsport",   price: 45000,  category: "Rifles",   offer: false, stock: 8,  img: "/img/skins/AK-BLOODSPORT.png" },
  { id: 2,  name: "AWP | Dragon",         price: 300000, category: "Rifles",   offer: false, stock: 1,  img: "/img/skins/AWP-DRAGON.png" },
  { id: 3,  name: "M4A4 | Desolate Space",price: 80000,  category: "Rifles",   offer: true,  stock: 4,  img: "/img/skins/M4A4-DESOLATE.png" },

  // CUCHILLOS
  { id: 4,  name: "Karambit | Fade",      price: 500000, category: "Cuchillos",offer: true,  stock: 2,  img: "/img/skins/KARAMBIT-FADE.png" },
  { id: 5,  name: "Bayonet | Urban Masked",price: 120000,category: "Cuchillos",offer: false, stock: 3,  img: "/img/skins/BAYONET-URBAN.png" },

  // PISTOLAS
  { id: 6,  name: "Glock-18 | Water Elemental", price: 12000, category: "Pistolas", offer: true, stock: 12, img: "/img/skins/GLOCK-WATERELEMENTAL.png" },
  { id: 7,  name: "Desert Eagle | Red",         price: 20000, category: "Pistolas", offer: false, stock: 6,  img: "/img/skins/DesertEagle-Red.png" },

  // GUANTES
  { id: 8,  name: "Specialist Gloves",    price: 220000, category: "Guantes",  offer: false, stock: 2,  img: "/img/skins/Gloves-Specialist.png" },
];

// ====== Helpers localStorage ======
function readLS(key, fb){ try { return JSON.parse(localStorage.getItem(key)) ?? fb; } catch { return fb; } }
function writeLS(key, value){ localStorage.setItem(key, JSON.stringify(value)); }

// ====== Pub/Sub simple (para actualizar Navbar/carrito en tiempo real) ======
const listeners = new Set();
function emit(){ listeners.forEach(fn => { try{ fn(); }catch{} }); }
export function subscribe(fn){ listeners.add(fn); return () => listeners.delete(fn); }

// ====== Init con versionado (si cambia DB_VERSION, se resembran datos) ======
(function init(){
  const current = readLS(VER_KEY, 0);
  if(current !== DB_VERSION){
    writeLS(KEY, seed);
    writeLS(CART_KEY, []);              // resetea carrito cuando cambiamos catálogo
    writeLS(VER_KEY, DB_VERSION);
  }else{
    if(!localStorage.getItem(KEY))      writeLS(KEY, seed);
    if(!localStorage.getItem(CART_KEY)) writeLS(CART_KEY, []);
  }
})();

// ====== API ======
export const Store = {
  // Productos (CRUD)
  list(){ return readLS(KEY, []); },
  get(id){ return this.list().find(p => p.id === Number(id)); },
  create(product){
    const data = this.list();
    const id = data.length ? Math.max(...data.map(p=>p.id))+1 : 1;
    const newP = { id, ...product };
    writeLS(KEY, [...data, newP]); emit();
    return newP;
  },
  update(id, patch){
    const data = this.list();
    const i = data.findIndex(p=>p.id===Number(id));
    if(i<0) return null;
    data[i] = { ...data[i], ...patch };
    writeLS(KEY, data); emit();
    return data[i];
  },
  remove(id){
    writeLS(KEY, this.list().filter(p=>p.id!==Number(id))); emit();
  },

  // Carrito
  cart(){ return readLS(CART_KEY, []); },
  getCartCount(){
    return readLS(CART_KEY, []).reduce((acc, it) => acc + (it?.qty||0), 0);
  },
  addToCart(productId, qty=1){
    const cart = readLS(CART_KEY, []);
    const i = cart.findIndex(c=>c.productId===Number(productId));
    if(i<0) cart.push({ productId: Number(productId), qty });
    else cart[i].qty += qty;
    writeLS(CART_KEY, cart); emit();
  },
  updateCart(productId, qty){
    const cart = readLS(CART_KEY, []).map(c => c.productId===Number(productId) ? ({...c, qty}) : c);
    writeLS(CART_KEY, cart); emit();
  },
  removeFromCart(productId){
    writeLS(CART_KEY, readLS(CART_KEY, []).filter(c=>c.productId!==Number(productId))); emit();
  },
  clearCart(){ writeLS(CART_KEY, []); emit(); }
};

// src/data/store.js
import { ProductsAPI } from "../api";

/* =====================================================
   MEMORIA LOCAL DEL STORE
   ===================================================== */
let _products = [];         // productos desde backend
let _cart = [];             // carrito [{productId, qty}]
let _subCart = [];          // subscriptores del carrito
let _subProducts = [];      // subscriptores de productos

/* =====================================================
   UTILIDADES INTERNAS
   ===================================================== */
function notifyCart() {
  for (const fn of _subCart) try { fn(); } catch {}
}

function notifyProducts() {
  for (const fn of _subProducts) try { fn(); } catch {}
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(_cart));
}

function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem("cart") || "[]");
    if (Array.isArray(raw)) _cart = raw;
  } catch {
    _cart = [];
  }
}

/* =====================================================
   STORE PRINCIPAL
   ===================================================== */
export const Store = {

  /* ---------------- PRODUCTOS ---------------- */

  getProducts() {
    return _products;
  },

  setProducts(arr) {
    _products = Array.isArray(arr) ? arr : [];
    notifyProducts(); // 🔥 Ahora SOLO avisa a los listeners de productos
  },

  getById(id) {
    return _products.find(p => p.id === Number(id)) || null;
  },

  /* ---------------- CARRITO ---------------- */

  getCart() {
    return _cart;
  },

  addToCart(productId, qty = 1) {
    productId = Number(productId);
    qty = Number(qty);

    const prod = this.getById(productId);
    if (!prod) throw new Error("Producto no encontrado");

    const current = _cart.find(i => i.productId === productId);
    const currentQty = current?.qty ?? 0;

    if (currentQty + qty > prod.stock) {
      throw new Error("Stock insuficiente");
    }

    if (current) current.qty += qty;
    else _cart.push({ productId, qty });

    saveCart();
    notifyCart(); // 🔥 ahora solo actualiza el carrito
  },

  updateQty(productId, qty) {
    productId = Number(productId);
    qty = Number(qty);

    const prod = this.getById(productId);
    if (!prod) return;

    if (qty > prod.stock) return;

    const item = _cart.find(i => i.productId === productId);
    if (!item) return;

    item.qty = Math.max(1, qty);
    saveCart();
    notifyCart();
  },

  removeFromCart(productId) {
    productId = Number(productId);
    _cart = _cart.filter(i => i.productId !== productId);
    saveCart();
    notifyCart();
  },

  clearCart() {
    _cart = [];
    saveCart();
    notifyCart();
  },

  /* ---------------- SUBSCRIBE ---------------- */

  subscribeCart(fn) {
    _subCart.push(fn);
    return () => { _subCart = _subCart.filter(f => f !== fn); };
  },

  subscribeProducts(fn) {
    _subProducts.push(fn);
    return () => { _subProducts = _subProducts.filter(f => f !== fn); };
  }
};

/* =====================================================
   INICIALIZACIÓN
   ===================================================== */
loadCart();

async function syncProductsFromBackend() {
  try {
    const productos = await ProductsAPI.getProducts();

    const normalizados = productos.map(p => ({
      id: p.id,
      name: p.nombre,
      price: p.precio,
      category: p.categoriaNombre,
      img: p.imagenUrl,
      stock: p.stock,
    }));

    Store.setProducts(normalizados);

  } catch (err) {
    console.error("Error sincronizando productos:", err);
  }
}

syncProductsFromBackend();

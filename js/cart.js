
const CART_KEY = "skins4u_cart";

function getCart(){
  try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; }catch(e){ return []; }
}
function saveCart(cart){ 
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCartMini();
  renderCartPage();
  updateCartBadge();
}

function addToCart(productId, qty=1){
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item){item.qty += qty;}
  else{cart.push({id: productId, qty}); }
  saveCart(cart);
}

function renderCartPage(){
  const cartPage = document.getElementById("cart-page");
  if (!cartPage) return;
  const cart = getCart();
  if(cart.length === 0){
    cartPage.innerHTML = "<p>Carrito Vacio</p>";
    return;
  }

  cartPage.innerHTML = cart.map(i=>{
    const p = PRODUCTS.find(p=>p.id===i.id);
    return `<div class="card row" style="justify-content:space-between">
      <div>${p?.nombre || "Prod"} — $${p?.precio} x ${i.qty}</div>
      <button class="btn" onclick="removeFromCart(${i.id})">Quitar</button>
    </div>`;
  }).join("") + `<hr><div><strong>Total: $${cartTotal()}</strong></div>`;
}

function removeFromCart(productId){
  let cart = getCart().filter(i => i.id!==productId);
  saveCart(cart);
}
function clearCart(){ saveCart([]); }

function cartTotal(){
  const cart = getCart();
  let total = 0;
  cart.forEach(i => {
    const p = PRODUCTS.find(p => p.id===i.id);
    if(p){ total += p.precio * i.qty; }
  });
  return total;
}

function cartItemCount(){
  return getCart().reduce((sum, i) => sum + (i.qty || 0), 0);
}

function ensureCartFab(){
  if(document.getElementById("cart-badge")) return;
  const a = document.createElement("a");
  a.id - "cart-fab";
  a.className = "cart-fab";
  a.href = "cart.html";
  a.setAttribute("aria-label", "Abrir Carrito");
  a.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M7 4H5L4 6h2l3.6 7.59-1.35 2.44A2 2 0 0 0 10 18h9v-2h-8.42c-.14 0-.25-.11-.25-.25l.03-.12L11.1 14h5.45a2 2 0 0 0 1.79-1.11l3.58-6.49A1 1 0 0 0 21 5H7zM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
    </svg>
    <span id="cart-badge" class="cart-badge"></span>`;
  document.body.appendChild(a);
}

function updateCartBadge(){
  const link = document.getElementById("nav-cart");
  const badge = document.getElementById("cart-badge");
  if(!link || !badge) return;
  const n = cartItemCount();
  if(n > 0){
    badge.textContent = n > 99 ? "99+" : String(n);
    link.classList.add("has-items");
  }else{
    badge.textContent = "";
    link.classList.remove("has-items");
  }
}

function renderCartMini(){
  const el = document.getElementById("cart-items");
  if(!el) return;
  const cart = getCart();
  if(cart.length===0){ el.innerHTML = "<p>Carrito vacío</p>"; return; }
  el.innerHTML = cart.map(i=>{
    const p = PRODUCTS.find(p=>p.id===i.id);
    return `<div class="row" style="justify-content:space-between">
      <div>${p?.nombre || "Prod"} x ${i.qty}</div>
      <button class="btn" onclick="removeFromCart(${i.id})">X</button>
    </div>`
  }).join("") + `<hr><div><strong>Total: $${cartTotal()}</strong></div>`;
}

document.addEventListener("DOMContentLoaded", ()=>{
  document.getElementById("clear-cart")?.addEventListener("click", clearCart);
  document.getElementById("cart-clear")?.addEventListener("click", clearCart);
  renderCartMini();
  renderCartPage();
  updateCartBadge();

  // Cart page render
  const cartPage = document.getElementById("cart-page");
  if(cartPage){
    const cart = getCart();
    if(cart.length===0){ cartPage.innerHTML = "<p>Carrito vacío</p>"; return; }
    cartPage.innerHTML = cart.map(i=>{
      const p = PRODUCTS.find(p=>p.id===i.id);
      return `<div class="card row" style="justify-content:space-between">
        <div>${p?.nombre || "Prod"} — $${p?.precio} x ${i.qty}</div>
        <button class="btn" onclick="removeFromCart(${i.id})">Quitar</button>
      </div>`
    }).join("") + `<hr><div><strong>Total: $${cartTotal()}</strong></div>`;
  }
});


const CART_KEY = "skins4u_cart";

function getCart(){
  try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; }catch(e){ return []; }
}
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); renderCartMini(); }
function addToCart(productId, qty=1){
  const cart = getCart();
  const item = cart.find(i => i.id===productId);
  if(item){ item.qty += qty; } else { cart.push({id:productId, qty}); }
  saveCart(cart);
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

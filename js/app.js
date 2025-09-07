
document.addEventListener("DOMContentLoaded", ()=>{
  // Home featured
  const featuredTrack = document.getElementById("featured-track");
  if (featuredTrack){
  const destacados = PRODUCTS.filter(p => (p.featured ?? true) === true);
  featuredTrack.innerHTML = destacados.map(p => cardProduct(p)).join("");
  const prev = document.getElementById("feat-prev");
  const next = document.getElementById("feat-next");
  const step = () => Math.max(featuredTrack.clientWidth * 0.9, 280);
  prev?.addEventListener("click", () => {
    featuredTrack.scrollBy({ left: -step(), behavior: "smooth"});
  });
  next?.addEventListener("click", () => {
    featuredTrack.scrollBy({ left: step(), behavior: "smooth"});
  });
  }
  // Products grid
  const grid   = document.getElementById("product-list");
  const catSel = document.getElementById("filter-category");
  const catBox = document.getElementById("cat-list");

function renderProducts(list){
    if(!grid) return;
    grid.innerHTML = list.length
    ? list.map(p => cardProduct(p)).join("")
    : '<p class="form-hint">No hay productos para esta categoría.</p>';
  }
  function uniqueCats(){
    return [...new Set(PRODUCTS.map(p => p.categoria))].sort();
  }
  function buildUI(){
    const cats = uniqueCats();
    if (catBox){
    catBox.innerHTML = [''].concat(cats)
      .map(c => `<button class="filter-item" data-cat="${c}">${c || 'Todas'}</button>`)
      .join("");
    }
    if (catSel){
    catSel.innerHTML = '<option value="">Todas</option>' +
      cats.map(c => `<option>${c}</option>`).join("");
    }
  }
  function markActive(cat){
    if (catBox){
    [...catBox.querySelectorAll(".filter-item")].forEach(btn => btn.classList.toggle("active", btn.dataset.cat === (cat || "")));}
    if (catSel){ catSel.value = cat || ""; }}
  function applyFilter(cat){
    const chosen = cat || "";
    const list   = chosen ? PRODUCTS.filter(p => p.categoria === chosen) : PRODUCTS;renderProducts(list);markActive(chosen);const url = chosen ? `?cat=${encodeURIComponent(chosen)}` : location.pathname;
    history.replaceState(null, "", url);}
  if (grid){
    buildUI();
    catBox?.addEventListener("click", e => {
    const btn = e.target.closest("button.filter-item");if (!btn) return;applyFilter(btn.dataset.cat);});
    catSel?.addEventListener("change", e => applyFilter(e.target.value));
    const params = new URLSearchParams(location.search);
    applyFilter(params.get("cat") || "");}
  // Product detail
  const pd = document.getElementById("product-detail");
  if(pd){
    const params = new URLSearchParams(location.search);
    const id = Number(params.get("id") || 1);
    const p = PRODUCTS.find(x=>x.id===id) || PRODUCTS[0];
    document.getElementById("p-img").src = p.img;
    document.getElementById("p-name").textContent = p.nombre;
    document.getElementById("p-price").textContent = "$"+p.precio;
    document.getElementById("p-desc").textContent = p.desc;
    document.getElementById("p-stock").textContent = p.stock <= (p.stockCritico||0) ? "Stock crítico" : "Stock: "+p.stock;
    document.getElementById("add-to-cart").addEventListener("click", ()=> addToCart(p.id));
  }

  // Regions / comunas linkage (register + admin user)
  const regionSel = document.getElementById("region");
  const comunaSel = document.getElementById("comuna");
  const aRegionSel = document.getElementById("a-region");
  const aComunaSel = document.getElementById("a-comuna");
  function fillRegions(select){
    if(!select) return;
    select.innerHTML = '<option value="">Seleccione…</option>' + REGIONES.map(r=>`<option>${r.nombre}</option>`).join("");
  }
  function fillComunas(select, regionName){
    if(!select) return;
    const reg = REGIONES.find(r=>r.nombre===regionName);
    select.innerHTML = '<option value="">Seleccione…</option>' + (reg? reg.comunas.map(c=>`<option>${c}</option>`).join(""):"");
  }
  fillRegions(regionSel); fillRegions(aRegionSel);
  regionSel?.addEventListener("change", e=>fillComunas(comunaSel, e.target.value));
  aRegionSel?.addEventListener("change", e=>fillComunas(aComunaSel, e.target.value));

  // Forms
  const loginForm = document.getElementById("login-form");
  if(loginForm){
    loginForm.addEventListener("submit", async (e)=>{
      e.preventDefault();
      const fd = new FormData(loginForm);
      const email = fd.get("email"); const pass = fd.get("password");
      let ok = true;
      setError(loginForm,"email",""); setError(loginForm,"password","");
      if(!validEmailDomain(email)){ setError(loginForm,"email","Dominio no permitido"); ok=false; }
      if(String(pass).length <4 || String(pass).length>10){ setError(loginForm,"password","Longitud inválida"); ok=false; }
      if(!ok) return;
      const hashed = await hashPassword(pass);
      localStorage.setItem("last_login", JSON.stringify({email, passHash: hashed, at: Date.now()}));
      alert("Login demo OK (hash guardado local).");
      location.href = "index.html";
    });
  }

  const contactForm = document.getElementById("contact-form");
  if(contactForm){
    contactForm.addEventListener("submit", (e)=>{
      e.preventDefault();
      const fd = new FormData(contactForm);
      const nombre = fd.get("nombre");
      const email = fd.get("email");
      const comentario = fd.get("comentario");
      let ok = true;
      setError(contactForm,"nombre",""); setError(contactForm,"email",""); setError(contactForm,"comentario","");
      if(!nombre || nombre.length>100){ setError(contactForm,"nombre","Requerido, máx 100"); ok=false; }
      if(email && !validEmailDomain(email)){ setError(contactForm,"email","Dominio no permitido"); ok=false; }
      if(!comentario || comentario.length>500){ setError(contactForm,"comentario","Requerido, máx 500"); ok=false; }
      if(!ok) return;
      alert("Mensaje enviado (demo)."); contactForm.reset();
    });
  }

  const regForm = document.getElementById("register-form");
  if(regForm){
    regForm.addEventListener("submit", async (e)=>{
      e.preventDefault();
      const fd = new FormData(regForm);
      const run = fd.get("run"); const nombres = fd.get("nombres"); const apellidos = fd.get("apellidos");
      const email = fd.get("email"); const fecha = fd.get("fecha"); const tipo = fd.get("tipo");
      const region = fd.get("region"); const comuna = fd.get("comuna"); const direccion = fd.get("direccion");
      const password = fd.get("password");
      let ok = true;
      ["run","nombres","apellidos","email","fecha","tipo","region","comuna","direccion","password"].forEach(n=>setError(regForm,n,""));
      if(!validarRUN(run)) { setError(regForm,"run","RUN inválido"); ok=false; }
      if(!nombres){ setError(regForm,"nombres","Requerido"); ok=false; }
      if(!apellidos){ setError(regForm,"apellidos","Requerido"); ok=false; }
      if(!validEmailDomain(email)){ setError(regForm,"email","Dominio no permitido"); ok=false; }
      if(!tipo){ setError(regForm,"tipo","Seleccione un tipo"); ok=false; }
      if(!region){ setError(regForm,"region","Seleccione región"); ok=false; }
      if(!comuna){ setError(regForm,"comuna","Seleccione comuna"); ok=false; }
      if(!direccion){ setError(regForm,"direccion","Requerido"); ok=false; }
      if(String(password).length<4 || String(password).length>10){ setError(regForm,"password","4 a 10 caracteres"); ok=false; }
      if(!ok) return;
      const passHash = await hashPassword(password);
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      users.push({run,nombres,apellidos,email,fecha,tipo,region,comuna,direccion, passHash});
      localStorage.setItem("users", JSON.stringify(users));
      alert("Usuario registrado (demo).");
      location.href = "login.html";
    });
  }
});


function cardProduct(p){
  return `<a class="card" href="product.html?id=${p.id}">
    <img src="${p.img}" alt="${p.nombre}" style="width:100%;height:160px;border-radius:10px;border:1px solid #2a2b2f;object-fit:cover">
    <h3>${p.nombre}</h3>
    <div class="price">$${p.precio}</div>
    <button class="btn" type="button" onclick="event.preventDefault(); addToCart(${p.id});">Añadir</button>
  </a>`;
}

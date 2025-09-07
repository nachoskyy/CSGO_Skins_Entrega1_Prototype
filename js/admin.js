
document.addEventListener("DOMContentLoaded", ()=>{
  // Listado productos
  const pt = document.getElementById("admin-product-table")?.querySelector("tbody");
  if(pt){
    pt.innerHTML = PRODUCTS.map(p=>`<tr><td>${p.codigo}</td><td>${p.nombre}</td><td>$${p.precio}</td><td>${p.stock}</td><td><span class="badge">Editar</span></td></tr>`).join("");
  }
  // Listado usuarios
  const ut = document.getElementById("admin-user-table")?.querySelector("tbody");
  if(ut){
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    ut.innerHTML = users.map(u=>`<tr><td>${u.run}</td><td>${u.nombres} ${u.apellidos}</td><td>${u.email}</td><td>${u.tipo}</td><td><span class="badge">Ver</span></td></tr>`).join("");
  }
  // Nuevo producto
  const pf = document.getElementById("product-form");
  if(pf){
    pf.addEventListener("submit",(e)=>{
      e.preventDefault();
      const fd = new FormData(pf);
      let ok = true;
      ["codigo","nombre","descripcion","precio","stock","stockCritico","categoria"].forEach(n=>setError(pf,n,""));
      const codigo = fd.get("codigo"); const nombre = fd.get("nombre"); const desc = fd.get("descripcion");
      const precio = Number(fd.get("precio")); const stock = Number(fd.get("stock")); const stockCritico = fd.get("stockCritico") ? Number(fd.get("stockCritico")) : null;
      const categoria = fd.get("categoria");
      if(!codigo || codigo.length<3){ setError(pf,"codigo","Mínimo 3"); ok=false; }
      if(!nombre || nombre.length>100){ setError(pf,"nombre","Requerido, máx 100"); ok=false; }
      if(desc && desc.length>500){ setError(pf,"descripcion","Máx 500"); ok=false; }
      if(!(precio>=0)){ setError(pf,"precio",">= 0"); ok=false; }
      if(!(Number.isInteger(stock) && stock>=0)){ setError(pf,"stock","Entero >= 0"); ok=false; }
      if(stockCritico!==null && !(Number.isInteger(stockCritico) && stockCritico>=0)){ setError(pf,"stockCritico","Entero >= 0"); ok=false; }
      if(!categoria){ setError(pf,"categoria","Seleccione"); ok=false; }
      if(!ok) return;
      alert("Producto guardado (demo)."); pf.reset();
    });
  }
  // Nuevo usuario (admin)
  const auf = document.getElementById("admin-user-form");
  if(auf){
    // fill selects are handled in app.js on DOMContentLoaded (a-region/a-comuna)
    auf.addEventListener("submit",(e)=>{
      e.preventDefault();
      const fd = new FormData(auf);
      let ok = true;
      ["run","nombre","apellidos","email","fecha","tipo","region","comuna","direccion"].forEach(n=>setError(auf,n,""));
      const run = fd.get("run"); const nombre = fd.get("nombre"); const apellidos = fd.get("apellidos");
      const email = fd.get("email"); const fecha = fd.get("fecha"); const tipo = fd.get("tipo");
      const region = fd.get("region"); const comuna = fd.get("comuna"); const direccion = fd.get("direccion");
      if(!validarRUN(run)) { setError(auf,"run","RUN inválido"); ok=false; }
      if(!nombre){ setError(auf,"nombre","Requerido"); ok=false; }
      if(!apellidos){ setError(auf,"apellidos","Requerido"); ok=false; }
      if(!validEmailDomain(email)){ setError(auf,"email","Dominio no permitido"); ok=false; }
      if(!tipo){ setError(auf,"tipo","Seleccione"); ok=false; }
      if(!region){ setError(auf,"region","Seleccione"); ok=false; }
      if(!comuna){ setError(auf,"comuna","Seleccione"); ok=false; }
      if(!direccion){ setError(auf,"direccion","Requerido"); ok=false; }
      if(!ok) return;
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      users.push({run, nombres:nombre, apellidos, email, fecha, tipo, region, comuna, direccion, passHash:null});
      localStorage.setItem("users", JSON.stringify(users));
      alert("Usuario guardado (demo)."); auf.reset();
    });
  }
});

// src/pages/ProductsAdmin.jsx
import { useEffect, useState } from "react";
import { ProductsAPI, CategoriesAPI } from "../../api";   
import { Store } from "../../data/store";       
import AdminBackButton from "../../components/AdminBackButton";


export default function ProductsAdmin() {

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [form, setForm] = useState({
    id: null,
    name: "",
    price: "",
    sku: "",
    stock: "",
    destacado: false,
    categoriaId: "",
    imagenUrl: ""
  });

  const [editing, setEditing] = useState(false);

  // ===========================
  // CARGA INICIAL
  // ===========================
  useEffect(() => {
    cargarTodo();

    // ACTUALIZA LA LISTA CUANDO STORE CAMBIE
    let un = null;
    try {
      un = Store.subscribe(() => cargarTodo());
    } catch {}

    return () => {
      try { un && un(); } catch {}
    };
  }, []);

  async function cargarTodo() {
    try {
      const prodsBD = await ProductsAPI.getProducts();
      const catsBD = await CategoriesAPI.getCategories();

      setCategorias(catsBD);

      setProductos(
        prodsBD.map(p => ({
          id: p.id,
          name: p.nombre,
          price: p.precio,
          sku: p.sku,
          stock: p.stock,
          destacado: p.destacado,
          categoriaId: p.categoriaId,
          categoriaNombre: p.categoriaNombre,
          imagenUrl: p.imagenUrl
        }))
      );

      // Actualizamos el STORE local
      Store.setProducts(
        prodsBD.map(p => ({
          id: p.id,
          name: p.nombre,
          price: p.precio,
          img: p.imagenUrl,
          category: p.categoriaNombre,
          stock: p.stock
        }))
      );

    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  }

  // ===========================
  // MANEJO DE FORMULARIO
  // ===========================
  const onChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const resetForm = () => {
    setEditing(false);
    setForm({
      id: null,
      name: "",
      price: "",
      sku: "",
      stock: "",
      destacado: false,
      categoriaId: "",
      imagenUrl: ""
    });
  };

  // ===========================
  // EDITAR PRODUCTO
  // ===========================
  const edit = (p) => {
    setEditing(true);
    setForm({
      id: p.id,
      name: p.name,
      price: p.price,
      sku: p.sku,
      stock: p.stock,
      destacado: p.destacado,
      categoriaId: p.categoriaId,
      imagenUrl: p.imagenUrl
    });
  };

  // ===========================
  // GUARDAR PRODUCTO
  // ===========================
  const save = async () => {
    try {
      const payload = {
        nombre: form.name,
        precio: Number(form.price),
        stock: Number(form.stock),
        sku: form.sku,
        destacado: form.destacado,
        categoriaId: Number(form.categoriaId),
        imagenUrl: form.imagenUrl
      };

      if (editing) {
        await ProductsAPI.updateProduct(form.id, payload);
      } else {
        await ProductsAPI.createProduct(payload);
      }

      resetForm();
      cargarTodo();

    } catch (err) {
      console.error("Error guardando producto:", err);
      alert("Error al guardar producto");
    }
  };

  // ===========================
  // ELIMINAR PRODUCTO
  // ===========================
  const remove = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;

    try {
      await ProductsAPI.deleteProduct(id);
      cargarTodo();
    } catch (err) {
      console.error("Error eliminando producto:", err);
      alert("No se pudo eliminar.");
    }
  };

  return (
    <div className="container mt-3">
      <AdminBackButton />
      <h2 className="section-title">Administrar Productos</h2>

      <div className="row g-3 mt-2">

        {/* LISTADO */}
        <div className="col-lg-7">
          <div className="admin-list">
            {productos.map(p => (
              <div key={p.id} className="list-group-item d-flex gap-3 align-items-center">

                <div className="admin-thumb">
                  <img src={p.imagenUrl} onError={(e)=>(e.currentTarget.src="/img/skins/AK-BLOODSPORT.png")} />
                </div>

                <div className="flex-grow-1">
                  <div className="fw-semibold">{p.name}</div>
                  <div className="text-secondary small">
                    {p.categoriaNombre} — Stock: {p.stock}
                  </div>
                </div>

                <button className="btn btn-sm btn-outline-primary" onClick={() => edit(p)}>Editar</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => remove(p.id)}>Eliminar</button>

              </div>
            ))}
          </div>
        </div>

        {/* FORMULARIO */}
        <div className="col-lg-5">
          <div className="card p-3 admin-card">

            <h5>{editing ? "Editar producto" : "Nuevo producto"}</h5>

            <div className="mb-2">
              <label className="form-label">Nombre</label>
              <input className="form-control" name="name" value={form.name} onChange={onChange} />
            </div>

            <div className="row g-2">
              <div className="col">
                <label className="form-label">Precio</label>
                <input className="form-control" name="price" value={form.price} onChange={onChange} />
              </div>
              <div className="col">
                <label className="form-label">SKU</label>
                <input className="form-control" name="sku" value={form.sku} onChange={onChange} />
              </div>
            </div>

            <div className="row g-2 mt-2">
              <div className="col">
                <label className="form-label">Stock</label>
                <input className="form-control" name="stock" value={form.stock} onChange={onChange} />
              </div>

              <div className="col">
                <label className="form-label">Categoría</label>
                <select className="form-select" name="categoriaId" value={form.categoriaId} onChange={onChange}>
                  <option value="">Seleccione...</option>
                  {categorias.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-2">
              <label className="form-label">URL Imagen</label>
              <input className="form-control" name="imagenUrl" value={form.imagenUrl} onChange={onChange} />
            </div>

            <div className="mt-2 form-check">
              <input type="checkbox" className="form-check-input" name="destacado"
                checked={form.destacado} onChange={onChange} />
              <label className="form-check-label">Destacado</label>
            </div>

            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-brand" onClick={save}>Guardar</button>
              {editing && (
                <button className="btn btn-outline-secondary" onClick={resetForm}>Cancelar</button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

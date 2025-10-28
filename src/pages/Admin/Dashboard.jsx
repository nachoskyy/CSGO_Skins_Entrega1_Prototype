// src/pages/Admin/Dashboard.jsx
import { Link } from "react-router-dom";

export default function Dashboard(){
  return (
    <div className="container mt-3">
      <h2 className="section-title">Panel de administración</h2>
      <div className="d-flex gap-3">
        <Link to="/admin/productos" className="btn btn-outline-primary">Productos</Link>
        <Link to="/admin/ordenes" className="btn btn-outline-primary">Órdenes</Link>
      </div>
    </div>
  );
}

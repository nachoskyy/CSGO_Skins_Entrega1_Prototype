import { NavLink } from "react-router-dom";

export default function Dashboard() {
  return (
    
    <div className="container mt-4">
      <h2 className="section-title">Panel de Administración</h2>

      <div className="row g-3 mt-3">

        <div className="col-md-4">
          <NavLink to="/admin/products" className="btn btn-brand w-100 p-4">
            Administrar Productos
          </NavLink>
        </div>

        <div className="col-md-4">
          <NavLink to="/admin/users" className="btn btn-brand w-100 p-4">
            Usuarios
          </NavLink>
        </div>

      </div>
    </div>
  );
}

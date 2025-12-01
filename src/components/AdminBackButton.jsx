import { NavLink } from "react-router-dom";

export default function AdminBackButton() {
  return (
    <div className="mb-3">
      <NavLink to="/admin/dashboard" className="btn btn-brand w-25 p-2">
        ← Volver al Panel de Administración
      </NavLink>
    </div>
  );
}

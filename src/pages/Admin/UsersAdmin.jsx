import { useEffect, useState } from "react";
import AdminBackButton from "../../components/AdminBackButton";
import axios from "axios";

export default function UsersAdmin() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    try {
      const res = await axios.get("http://localhost:8080/api/usuarios");
      setUsers(res.data);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
    }
  }

  async function hacerAdmin(id) {
    await axios.post(`http://localhost:8080/api/usuarios/${id}/make-admin`);
    cargarUsuarios();
  }

  return (
    <div className="container mt-4">
      <AdminBackButton />

      <h2 className="section-title mb-4">Usuarios registrados</h2>

      <div className="admin-card p-3">
        {users.map(u => (
          <div 
            key={u.id} 
            className="d-flex justify-content-between align-items-center border-bottom py-3"
          >
            
            <div>
              <div className="fw-bold fs-5">{u.nombre}</div>
              <div className="text-secondary">{u.email}</div>
              <div className="badge mt-1 bg-dark text-light">
                Rol: {u.role}
              </div>
            </div>

            <div>
              {u.role !== "ADMIN" && (
                <button 
                  className="btn btn-sm btn-outline-success"
                  onClick={() => hacerAdmin(u.id)}
                >
                  Hacer Admin
                </button>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import AdminBackButton from "../../components/AdminBackButton";
import axios from "axios";

export default function UsersAdmin() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    validarAdmin();
    cargarUsuarios();
  }, []);

  // ===========================
  // VALIDAR QUE SEA ADMIN
  // ===========================
  function validarAdmin() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "ADMIN") {
      window.location.href = "/Auth";
    }
  }

  // ===========================
  // CARGAR USUARIOS (con token)
  // ===========================
  async function cargarUsuarios() {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8080/api/usuarios",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUsers(res.data);

    } catch (err) {
      console.error("Error cargando usuarios:", err);

      if (err.response && err.response.status === 403) {
        alert("Sesión expirada. Por favor inicia sesión nuevamente.");
        localStorage.clear();
        window.location.href = "/Auth";
      }
    }
  }

  // ===========================
  // HACER ADMIN
  // ===========================
  async function hacerAdmin(id) {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:8080/api/usuarios/${id}/make-admin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      cargarUsuarios();

    } catch (err) {
      console.error("Error al hacer admin:", err);
      alert("No tienes permisos para esta acción.");
    }
  }

  // ===========================
  // RENDER
  // ===========================
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

              {/* FECHA DE CREACIÓN */}
              <div className="text-secondary small mt-1">
                Creado el:{" "}
                {u.fechaCreacion
                  ? new Date(u.fechaCreacion).toLocaleString("es-CL", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })
                  : "Fecha no disponible"}
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

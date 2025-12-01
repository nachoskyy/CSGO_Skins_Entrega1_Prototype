import { useEffect, useState } from "react";
import axios from "axios";

export default function UsersAdmin() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/usuarios")
      .then(r => setUsers(r.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-3">
      <h2 className="section-title">Usuarios Registrados</h2>

      <div className="list-group mt-3">
        {users.map(u => (
          <div className="list-group-item bg-dark text-light border-secondary" key={u.id}>
            <div className="fw-bold">{u.nombre}</div>
            <div>{u.email}</div>
            <div className="text-secondary small">{u.rol}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

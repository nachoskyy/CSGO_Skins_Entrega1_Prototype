export default function Dashboard() {
  return (
    <div className="container mt-4">
      <h2 className="section-title">Panel de Administración</h2>

      <div className="row g-3 mt-3">
        <div className="col-md-4">
          <a href="/Admin/Productos" className="btn btn-brand w-100 p-4">
            Administrar Productos
          </a>
        </div>

        <div className="col-md-4">
          <a href="/Admin/Ordenes" className="btn btn-outline-primary w-100 p-4">
            Órdenes
          </a>
        </div>

        <div className="col-md-4">
          <a href="/Admin/Usuarios" className="btn btn-outline-secondary w-100 p-4">
            Usuarios
          </a>
        </div>
      </div>
    </div>
  );
}

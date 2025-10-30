// src/pages/PurchaseSuccess.jsx
import { Link } from "react-router-dom";

export default function PurchaseSuccess(){
  return (
    <div className="container mt-4">
      <div className="card bg-dark text-light border-success">
        <div className="card-body">
          <h3 className="text-success">¡Compra exitosa!</h3>
          <p className="text-secondary mb-4">"Te enviamos un correo con el resumen de tu pedido".</p>
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-secondary" to="/">Volver al inicio</Link>
            <Link className="btn btn-brand" to="/productos">Seguir comprando</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

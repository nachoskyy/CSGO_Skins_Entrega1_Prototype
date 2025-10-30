// src/pages/PurchaseFail.jsx
import { Link } from "react-router-dom";

export default function PurchaseFail(){
  return (
    <div className="container mt-4">
      <div className="card bg-dark text-light border-danger">
        <div className="card-body">
          <h3 className="text-danger">Pago rechazado</h3>
          <p className="text-secondary mb-4">Intenta nuevamente con otro medio de pago.</p>
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-secondary" to="/checkout">Volver al checkout</Link>
            <Link className="btn btn-brand" to="/productos">Seguir comprando</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

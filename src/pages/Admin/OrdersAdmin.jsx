import { useEffect, useState } from "react";
import { OrdersAPI } from "../../api";

export default function OrdersAdmin() {

  const [ordenes, setOrdenes] = useState([]);

  useEffect(() => {
    OrdersAPI.getMyOrders().then(setOrdenes);
  }, []);

  return (
    <div className="container mt-3">
      <h2 className="section-title">Órdenes</h2>

      <div className="list-group mt-3">
        {ordenes.map(o => (
          <div className="list-group-item bg-dark text-light border-secondary" key={o.id}>
            <div className="fw-bold">Orden #{o.id}</div>
            <div>Total: ${o.total}</div>
            <div>Cliente: {o.clienteNombre}</div>
            <div className="small text-secondary">
              {o.items?.length} items
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

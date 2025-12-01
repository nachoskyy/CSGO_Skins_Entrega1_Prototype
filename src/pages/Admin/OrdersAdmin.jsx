import { useEffect, useState } from "react";
import { OrdersAPI } from "../../api/OrdersAPI";
import AdminBackButton from "../../components/AdminBackButton";

export default function OrdersAdmin() {

  const [ordenes, setOrdenes] = useState([]);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    try {
      const res = await OrdersAPI.getOrders();
      setOrdenes(res);
    } catch (err) {
      console.error("Error cargando órdenes:", err);
    }
  }

  return (
    <div className="container mt-4">
      <AdminBackButton />
      <h2 className="section-title">Órdenes registradas</h2>

      {ordenes.length === 0 ? (
        <p className="text-secondary mt-3">No hay órdenes registradas.</p>
      ) : (
        <div className="admin-card p-3 mt-3">
          {ordenes.map(o => (
            <div key={o.id} className="border-bottom py-3">

              <div className="fw-bold fs-5">
                Orden #{o.id}
              </div>

              <div className="text-secondary small">
                Cliente: {o.clienteNombre} — {o.clienteEmail}
              </div>

              <div className="text-secondary small">
                Dirección: {o.direccionEnvio}
              </div>

              <div className="text-light mt-2">
                <strong>Total: ${o.total.toLocaleString()}</strong>
              </div>

              <div className="mt-2 ms-3">
                {o.items.map(it => (
                  <div key={it.id} className="text-secondary small">
                    • Producto ID {it.productId} — {it.cantidad} × ${it.precioUnitario}
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

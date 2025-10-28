export default function PurchaseFail(){
  return (
    <div className="container text-center mt-5">
      <h2 className="text-danger fw-bold mb-3">Pago rechazado</h2>
      <p>Hubo un problema con el pago. Intenta nuevamente.</p>
      <a className="btn btn-outline-primary mt-2" href="/checkout">Volver al checkout</a>
    </div>
  );
}

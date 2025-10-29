/** Página de nosotros */
export default function Nosotros(){
  return (
    <div className="container mt-3">
      <h2 className="section-title">Nosotros</h2>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="card p-3 bg-dark text-light border-secondary">
            <h5 className="mb-2 text-brand">¿Cómo funciona K&N Skins?</h5>
            <p className="text-light-emphasis">
              K&N Skins es una tienda virtual en donde se venden y comprar skins de CSGO 2.
              </p>
            <p className="text-light-emphasis">
              Misión: Facilitar la transaccion de skins, otorgando seguridad y confianza a nuestros clientes.
              Visión: Ser el marketplace de skins más confiable y rápido de Chile, donde cualquier jugador compra y vende en segundos con total seguridad y precios justos.
            </p>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card p-3 bg-dark text-light border-secondary">
            <h6 className="mb-2 text-brand">Equipo</h6>
            <ul className="text-light-emphasis mb-0">
              <li>Víctor Hurtado.</li>
              <li>Ignacio García.</li>
              <p className="text-light-emphasis"> Roles: Admin/Dev, QA</p>
            </ul>
          </div>
        </div>
      </div>

      <div className="card p-3 mt-4 bg-dark text-light border-secondary">
        <h5 className="mb-2 text-brand">Proyecto</h5>
        <p className="text-light-emphasis">
          Trabajo para la evaluacion 2 de fullstack.
        </p>
      </div>
    </div>
  );
}

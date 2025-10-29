// Componente Footer
export default function Footer(){
  return (
    <>
      <footer className="footer">
        <div className="container d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <div className="fw-semibold">K&N Skins</div>
            <div className="text-secondary">
              Av. Antonio Varas 5513, Santiago, Chile · contacto@KNSkins.gg
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <a href="/mapa-del-sitio" className="btn btn-outline-primary btn-sm">Mapa del sitio</a>
            <a href="https://x.com" target="_blank" rel="noreferrer">X</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://t.me" target="_blank" rel="noreferrer">Telegram</a>
          </div>
        </div>
      </footer>
      <a href="/contacto" className="help-fab" aria-label="Necesitas ayuda">
        ¿Necesitas ayuda?
      </a>
    </>
  );
}

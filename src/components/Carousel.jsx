//componente del carrusel
import { useRef } from "react";
// Componente Carousel
export default function Carousel({ children }) {
  const trackRef = useRef(null);
  // Función para desplazar el carrusel
  const scrollBy = (dir) => {
    const el = trackRef.current;
    if(!el) return;
    const amount = el.clientWidth * 0.9 * (dir === "left" ? -1 : 1);
    el.scrollBy({ left: amount, behavior: "smooth" });
  };
  // Renderizar carrusel
  return (
    <div className="carousel-box"> {/* contenedor del carrusel */}
      <button className="carousel-btn left" onClick={()=>scrollBy("left")} aria-label="Anterior">‹</button> {/* botón izquierdo */}
      <div className="carousel-track" ref={trackRef}> {/* pista del carrusel */}
        {children} {/* elementos del carrusel */}
      </div>
      <button className="carousel-btn right" onClick={()=>scrollBy("right")} aria-label="Siguiente">›</button> {/* botón derecho */}
    </div>
  );
}

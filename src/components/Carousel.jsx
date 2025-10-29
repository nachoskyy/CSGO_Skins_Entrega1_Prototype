// Componente Carrusel
import { useRef } from "react";

export default function Carousel({ children }) {
  const trackRef = useRef(null); // referencia al contenedor desplazable
  // Función para desplazar carrusel
  const scrollBy = (dir) => {
    const el = trackRef.current; // obtener elemento
    if(!el) return; // si no existe, salir
    const amount = el.clientWidth * 0.9 * (dir === "left" ? -1 : 1); // calcular desplazamiento
    el.scrollBy({ left: amount, behavior: "smooth" }); // desplazar suavemente
  };
  // Render
  return (
    // Estructura del carrusel
    <div className="carousel-box">
      {/* Botones de navegación */}
      <button className="carousel-btn left" onClick={()=>scrollBy("left")} aria-label="Anterior">‹</button>
      <div className="carousel-track" ref={trackRef}> {/* contenedor desplazable */}
        {children} {/* elementos del carrusel */}
      </div>
      {/* Botón siguiente */}
      <button className="carousel-btn right" onClick={()=>scrollBy("right")} aria-label="Siguiente">›</button>
    </div>
  );
}

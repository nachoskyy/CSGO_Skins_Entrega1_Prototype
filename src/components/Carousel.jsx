import { useRef } from "react";

export default function Carousel({ children }) {
  const trackRef = useRef(null);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if(!el) return;
    const amount = el.clientWidth * 0.9 * (dir === "left" ? -1 : 1);
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="carousel-box">
      <button className="carousel-btn left" onClick={()=>scrollBy("left")} aria-label="Anterior">‹</button>
      <div className="carousel-track" ref={trackRef}>
        {children}
      </div>
      <button className="carousel-btn right" onClick={()=>scrollBy("right")} aria-label="Siguiente">›</button>
    </div>
  );
}

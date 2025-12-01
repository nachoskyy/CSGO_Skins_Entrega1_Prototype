// Página de inicio usando productos reales del backend
import { useEffect, useState } from "react";
import { ProductsAPI } from "../api";               // API real
import Carousel from "../components/Carousel";
import ProductCard from "../components/ProductCard";

export default function Home() {
  
  // Estado para productos destacados
  const [destacados, setDestacados] = useState([]);

  // Cargar datos al montar
  useEffect(() => {
    cargarDestacados();
  }, []);

  async function cargarDestacados() {
    try {
      // Pedimos todos los productos al backend
      const productos = await ProductsAPI.getProducts();

      // Filtramos SOLO los destacados
      const filtrados = productos
        .filter(p => p.destacado === true)
        .map(p => ({
          id: p.id,
          name: p.nombre,
          price: p.precio,
          category: p.categoriaNombre,
          img: p.imagenUrl
        }));

      setDestacados(filtrados);

    } catch (err) {
      console.error("Error cargando productos destacados:", err);
    }
  }

  return (
    <>
      {/* Hero principal */}
      <section className="hero mt-3">
        <div className="hero__bg" />
        <div className="container">
          <div className="row g-3 align-items-center">
            
            <div className="col-12 col-lg-7">
              <span className="hero__pill mb-2">Marketplace para evaluación 2</span>
              <h1 className="fw-bold mt-2 mb-2">
                Compra y vende skins de CS2
              </h1>
              <p className="text-secondary mb-3">
                Explora, compara y vende tus skins de forma rápida y segura.
              </p>
              
              <div className="d-flex gap-2 flex-wrap">
                <a href="/productos" className="btn btn-brand">Ver skins</a>
                <a href="/nosotros" className="btn btn-outline-primary">¿Cómo funciona?</a>
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <div className="card" style={{ overflow: "hidden" }}>
                <img
                  src="/img/banner.png"
                  alt="banner"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* DESTACADOS DESDE EL BACKEND */}
      <div className="container">
        <h2 className="section-title">Destacados</h2>

        {destacados.length > 0 ? (
          <Carousel>
            {destacados.map(p => (
              <div key={p.id} className="col">
                <ProductCard product={p} />
              </div>
            ))}
          </Carousel>
        ) : (
          <div className="text-secondary">Cargando destacados...</div>
        )}
      </div>
    </>
  );
}

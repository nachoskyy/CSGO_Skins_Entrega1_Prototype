import ProductCard from "../components/ProductCard";
import { Store } from "../data/store";
import Carousel from "../components/Carousel";

export default function Home(){
  const destacados = Store.list();

  return (
    <>
      <section className="hero mt-3">
        <div className="hero__bg" />
        <div className="container">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-lg-7">
              <span className="hero__pill mb-2">Marketplace para evaluación 2</span>
              <h1 className="fw-bold mt-2 mb-2">Compra y vende skins de CS2</h1>
              <p className="text-secondary mb-3">Explora, compara y vende tus skins de forma rápida y segura.</p>
              <div className="d-flex gap-2 flex-wrap">
                <a href="/productos" className="btn btn-brand">Ver skins</a>
                <a href="/nosotros" className="btn btn-outline-primary">¿Cómo funciona?</a>
              </div>
            </div>
            <div className="col-12 col-lg-5">
              <div className="card" style={{overflow:"hidden"}}>
                <img src="/img/banner.png" alt="banner" onError={(e)=>{e.currentTarget.style.display='none';}}/>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <h2 className="section-title">Destacados</h2>
        <Carousel>
          {destacados.map(p => (
            <div key={p.id} className="col">
              <ProductCard product={p}/>
            </div>
          ))}
        </Carousel>
      </div>
    </>
  );
}

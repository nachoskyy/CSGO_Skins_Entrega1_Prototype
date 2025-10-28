import { Store } from "../data/store";
import ProductCard from "../components/ProductCard";

export default function Offers(){
  const offers = Store.list().filter(p=>p.offer);
  return (
    <>
      <h2 className="mt-3">Ofertas</h2>
      <div className="row g-3">
        {offers.map(p=>(
          <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <ProductCard product={p}/>
          </div>
        ))}
      </div>
    </>
  );
}

//componente para mostrar la tarjeta de un producto
import { Store } from "../data/store";

export default function ProductCard({ product }){
  const add = () => Store.addToCart(product.id, 1);
// Renderizar tarjeta
  return (
    <div className="card h-100">
      <div className="product-img">
        {product.img && (
          <img
            src={product.img}
            alt={product.name}
            onError={(e)=>{ e.currentTarget.style.display='none'; }}
          />
        )}
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text mb-1">Categoría: {product.category}</p>
        {product.offer && <span className="badge mb-2">Oferta</span>}
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="fw-bold">${product.price.toLocaleString()}</span>
          <button onClick={add} className="btn btn-brand btn-sm">Añadir</button>
        </div>
      </div>
    </div>
  );
}

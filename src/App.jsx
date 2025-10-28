import { Routes, Route } from "react-router-dom";

// Componentes
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Páginas
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Offers from "./pages/Offers";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import PurchaseFail from "./pages/PurchaseFail";
import Dashboard from "./pages/Admin/Dashboard";
import ProductsAdmin from "./pages/Admin/ProductsAdmin";
import OrdersAdmin from "./pages/Admin/OrdersAdmin";
import Blog from "./pages/Blog";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Auth from "./pages/Auth";
import SiteMap from "./pages/sitemap";   

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container py-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categorias" element={<Categories />} />
          <Route path="/ofertas" element={<Offers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/compra-exitosa" element={<PurchaseSuccess />} />
          <Route path="/compra-fallida" element={<PurchaseFail />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/productos" element={<ProductsAdmin />} />
          <Route path="/admin/ordenes" element={<OrdersAdmin />} />
          <Route path="/mapa-del-sitio" element={<SiteMap />} />   {/* <— RUTA */}
        </Routes>
      </div>
      <Footer />
    </>
  );
}

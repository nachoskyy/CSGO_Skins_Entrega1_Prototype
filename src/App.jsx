// pagina de rutas unificadas y actualizadas
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Páginas públicas
import Home from "./pages/Home";
import Products from "./pages/productos";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import PurchaseFail from "./pages/PurchaseFail";
import SiteMap from "./pages/Sitemap";
import Blog from "./pages/Blog";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Auth from "./pages/Auth";

// Admin
import Dashboard from "./pages/Admin/Dashboard";
import ProductsAdmin from "./pages/Admin/ProductsAdmin";
import OrdersAdmin from "./pages/Admin/OrdersAdmin";
import UsersAdmin from "./pages/Admin/UsersAdmin";

import ProtectedAdmin from "./components/ProtectedAdmin";

export default function App() {
  return (
    <>
      <Navbar />

      <div className="content">
        <Routes>

          {/* ============================
               PÁGINAS PÚBLICAS
          ============================ */}
          <Route path="/" element={<Home />} />

          <Route path="/productos" element={<Products />} />

          {/* Flujo de compra */}
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/compra-exitosa" element={<PurchaseSuccess />} />
          <Route path="/compra-fallida" element={<PurchaseFail />} />

          {/* Contenido general */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/mapa-del-sitio" element={<SiteMap />} />

          {/* ============================
               PANEL ADMIN (PROTEGIDO)
          ============================ */}
          <Route
            path="/admin"
            element={
              <ProtectedAdmin>
                <Dashboard />
              </ProtectedAdmin>
            }
          />

          <Route
            path="/admin/productos"
            element={
              <ProtectedAdmin>
                <ProductsAdmin />
              </ProtectedAdmin>
            }
          />

          <Route
            path="/admin/ordenes"
            element={
              <ProtectedAdmin>
                <OrdersAdmin />
              </ProtectedAdmin>
            }
          />

          <Route
            path="/admin/usuarios"
            element={
              <ProtectedAdmin>
                <UsersAdmin />
              </ProtectedAdmin>
            }
          />

        </Routes>
      </div>

      <Footer />
    </>
  );
}

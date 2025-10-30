// src/App.jsx
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/productos";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import PurchaseFail from "./pages/PurchaseFail";

// Mantener estas
import SiteMap from "./pages/Sitemap";
import Dashboard from "./pages/Admin/Dashboard";
import ProductsAdmin from "./pages/Admin/ProductsAdmin";
import OrdersAdmin from "./pages/Admin/OrdersAdmin";

import Blog from "./pages/Blog";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Auth from "./pages/Auth";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Catálogo unificado en /productos */}
          <Route path="/productos" element={<Products />} />

          {/* Flujo de compra */}
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/compra-exitosa" element={<PurchaseSuccess />} />
          <Route path="/compra-fallida" element={<PurchaseFail />} />

          {/* Contenido */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/auth" element={<Auth />} />

          {/* Mantener Sitemap y Admin */}
          <Route path="/mapa-del-sitio" element={<SiteMap />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/productos" element={<ProductsAdmin />} />
          <Route path="/admin/ordenes" element={<OrdersAdmin />} />

          {/* 404 opcional
          <Route path="*" element={<Home />} />
          */}
        </Routes>
      </div>
      <Footer />
    </>
  );
}

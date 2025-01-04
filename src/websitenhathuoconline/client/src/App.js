import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminLayout from "./pages/AdminLayout";
import EditProfile from "./pages/EditProfile";
import ProductDetail from "./pages/ProductDetail";
import { CartProvider } from "./pages/CartContext";

function App() {
  const isAdminPage = window.location.pathname.includes("admin");

  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          {!isAdminPage && <Header />}
          <div className="flex-grow">
            <Routes>
              {/* Các trang không phải admin */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/product/:id" element={<ProductDetail />} />

              {/* Các trang admin sử dụng AdminLayout */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} /> {/* Trang admin chính */}
                <Route path="/admin/products" element={<AdminProducts />} /> {/* Quản lý sản phẩm */}
                {/* Thêm các route admin khác tại đây */}
              </Route>
            </Routes>
          </div>
          {!isAdminPage && <Footer />}
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;

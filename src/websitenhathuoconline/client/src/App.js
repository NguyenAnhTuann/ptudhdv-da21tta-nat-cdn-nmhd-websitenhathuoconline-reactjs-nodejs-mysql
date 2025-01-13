import React from "react";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./pages/AdminLayout";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import Cart from "./pages/Cart";
import EditProfile from "./pages/EditProfile";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import Register from "./pages/Register";
import UserOrders from "./pages/UserOrders";
import AdminUsers from "./pages/AdminUsers";
import FallingFlowers from "./pages/FallingFlowers";
import AdminCategories from "./pages/AdminCategories";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import BackgroundMusic from "./pages/BackgroundMusic";


function App() {
  const isAdminPage = window.location.pathname.includes("admin");

  const FallingFlowersWrapper = () => {
    const location = useLocation();
    return location.pathname === '/' ? <FallingFlowers /> : null;
  };

  return (
    <Router>
      <BackgroundMusic />
      <div className="flex flex-col min-h-screen">
        {!isAdminPage && <Header />}
        <div className="flex-grow">
          <div id="falling-flowers" className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
            <FallingFlowersWrapper />
          </div>
          <Routes>
            {/* Các trang không phải admin */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/gio-hang" element={<Cart />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/don-hang-cua-ban" element={<UserOrders />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />


            {/* Các trang admin sử dụng AdminLayout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              {/* Thêm các route admin khác tại đây */}
            </Route>
          </Routes>
        </div>
        {!isAdminPage && <Footer />}
      </div>
    </Router>
  );
}

export default App;

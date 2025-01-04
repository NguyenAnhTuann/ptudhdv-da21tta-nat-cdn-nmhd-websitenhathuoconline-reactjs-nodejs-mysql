import React from "react";
import { Outlet } from "react-router-dom";
import logo from "../images/logo.png";

const AdminLayout = () => {
  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("user"); // Xóa thông tin đăng nhập
    window.location.href = "/login"; // Điều hướng về trang đăng nhập
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Logo" className="h-12" />
            <h1 className="text-xl font-bold">Trang quản trị - Website Nhà Thuốc Online</h1>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-lg text-white font-medium hover:bg-red-600 transition duration-300"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Nội dung chính */}
      <main className="flex-grow container mx-auto py-10">
        <Outlet /> {/* Hiển thị nội dung của từng trang con */}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Website Nhà Thuốc Online. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Kiểm tra trạng thái đăng nhập từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Xóa thông tin người dùng khỏi localStorage và state
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); // Điều hướng về trang chủ
  };

  return (
    <header className="bg-blue-500 text-white py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo và Tên */}
        <div
          className="flex items-center space-x-3 mr-6 cursor-pointer transform transition duration-300 hover:scale-110"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Logo" className="h-20" />
        </div>

        {/* Thanh tìm kiếm */}
        <div className="flex-grow mx-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm tên thuốc, bệnh lý, thực phẩm chức năng..."
              className="w-full px-5 py-3 rounded-full text-gray-700 focus:outline-none shadow-lg"
            />
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-300 text-blue-600 px-3 py-2 rounded-full hover:bg-blue-700 hover:text-white transition duration-300"
            >
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        {/* Điều hướng */}
        <div className="flex items-center space-x-6 ml-6">
          {user ? (
            <>
              {/* Hiển thị "Xin chào, [Tên]" */}
              <span className="text-white font-semibold">
                Xin chào, {user.name}
              </span>

              {/* Nút chỉnh sửa thông tin người dùng */}
              <button
                onClick={() => navigate("/edit-profile")}
                className="bg-blue-700 flex items-center justify-center px-4 py-2 rounded-full text-white hover:bg-blue-800 transition duration-300 font-semibold"
              >
                <i className="fas fa-user-edit text-xl"></i>
              </button>

              {/* Nút Giỏ hàng */}
              <a
                href="/cart"
                className="bg-blue-700 flex items-center justify-center space-x-2 px-6 py-3 rounded-full text-white hover:bg-blue-800 transition duration-300 font-semibold"
              >
                <i className="fas fa-shopping-cart text-xl"></i>
                <span>Giỏ hàng</span>
              </a>

              {/* Nút Đăng xuất */}
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded-full hover:bg-red-600 transition duration-300 font-semibold"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              {/* Nút Đăng nhập */}
              <a
                href="/login"
                className="flex items-center space-x-2 text-white hover:text-gray-200 font-semibold"
              >
                <i className="fas fa-user text-xl"></i>
                <span>Đăng nhập</span>
              </a>

              {/* Nút Đăng ký */}
              <a
                href="/register"
                className="flex items-center space-x-2 text-white hover:text-gray-200 font-semibold"
              >
                <i className="fas fa-user-plus text-xl"></i>
                <span>Đăng ký</span>
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

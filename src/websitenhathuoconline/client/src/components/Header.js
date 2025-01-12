import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import { ImBullhorn } from "react-icons/im";


const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <header
      className="text-white"
      style={{
        backgroundImage: "url('https://res.cloudinary.com/duk8odqun/image/upload/v1736653947/Frame_1_4_uu2i8v.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "150px",
      }}
    >
      <div className="container mx-auto">
        {/* Dòng thông tin bổ sung */}
        <div className="flex justify-between py-2 text-sm">
          <div>
            <span className="mr-4 flex items-center">
              <ImBullhorn className="mr-2 text-lg text-white" />
              <span className="md:text-body2 text-caption2 font-semibold text-white">
                Trung tâm tiêm chủng NGUYEN ANH TUAN
              </span>
              <a href="/detail" className="underline ml-1">Xem chi tiết</a>
            </span>

          </div>
          <div className="flex space-x-4">
            <span>
              <i className="fas fa-mobile-alt"></i> Tải ứng dụng
            </span>
            <span>
              <i className="fas fa-phone-alt"></i> Tư vấn ngay: <strong>0869094929</strong>
            </span>
          </div>
        </div>

        {/* Phần chính của header */}
        <div className="flex items-center justify-between py-3">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên thuốc, bệnh lý, thực phẩm chức năng..."
                className="w-full px-5 py-3 rounded-full text-gray-700 focus:outline-none shadow-lg"
              />
              <button
                onClick={() => {
                  if (searchQuery.trim()) {
                    navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
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
                  href="/gio-hang"
                  className="bg-blue-700 flex items-center justify-center space-x-2 px-6 py-3 rounded-full text-white hover:bg-blue-800 transition duration-300 font-semibold"
                >
                  <i className="fas fa-shopping-cart text-xl"></i>
                  <span>Giỏ hàng</span>
                </a>

                {/* Nút Đơn hàng của bạn */}
                <a
                  href="/don-hang-cua-ban"
                  className="bg-blue-700 flex items-center justify-center space-x-2 px-6 py-3 rounded-full text-white hover:bg-blue-800 transition duration-300 font-semibold"
                >
                  <i className="fas fa-box text-xl"></i>
                  <span>Đơn hàng của bạn</span>
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
      </div>
    </header>

  );
};

export default Header;

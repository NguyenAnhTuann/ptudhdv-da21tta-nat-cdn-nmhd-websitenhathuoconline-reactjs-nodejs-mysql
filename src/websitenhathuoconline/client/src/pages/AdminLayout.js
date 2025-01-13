import React from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header
        className="text-white"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/duk8odqun/image/upload/v1736653947/Frame_1_4_uu2i8v.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          minHeight: "150px",
        }}
      >
        <div
          className="container mx-auto flex justify-between items-center h-full"
          style={{
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        >
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer hover:scale-110"
            onClick={() => navigate("/admin")}
            style={{ marginLeft: "40px" }} // Đẩy logo sang phải
          >
            <img
              src="https://res.cloudinary.com/duk8odqun/image/upload/v1736754301/logo_rhovwe.png"
              alt="Logo"
              className="h-20 w-auto"
            />
          </div>

          {/* Tiêu đề */}
          <h1
            className="text-5xl font-bold text-center text-white"
            style={{
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
              letterSpacing: "1.5px",
              lineHeight: "1.2",
            }}
          >
            Trang quản trị <br /> Nhà thuốc NGUYEN ANH TUAN
          </h1>

          {/* Nút Đăng xuất */}
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-full text-white font-semibold hover:bg-red-600 transition duration-300"
            style={{ marginRight: "40px" }} // Đẩy nút đăng xuất sang trái
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

import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Hàm điều hướng đến trang quản lý sản phẩm
  const handleManageProducts = () => {
    navigate("/admin/products"); // Điều hướng đến /admin/products
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      {/* Nội dung chính */}
      <main className="flex-grow container mx-auto py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý hệ thống</h2>

        {/* Các nút chức năng */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <button
            onClick={handleManageProducts}
            className="bg-blue-600 text-white px-4 py-6 rounded-lg hover:bg-blue-700 transition duration-300 text-center"
          >
            Quản lý sản phẩm
          </button>
          {/* Bạn có thể thêm thêm các nút khác cho các mục quản lý khác ở đây */}
          <button
            onClick={() => navigate("/admin/orders")}
            className="bg-green-600 text-white px-4 py-6 rounded-lg hover:bg-green-700 transition duration-300 text-center"
          >
            Quản lý đơn hàng
          </button>
          <button
            onClick={() => navigate("/admin/users")}
            className="bg-purple-600 text-white px-4 py-6 rounded-lg hover:bg-purple-700 transition duration-300 text-center"
          >
            Quản lý người dùng
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

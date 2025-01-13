import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Quản lý thuốc",
      icon: "https://res.cloudinary.com/duk8odqun/image/upload/v1736757253/drugs_1_eak1xc.png",
      action: () => navigate("/admin/products"),
    },
    {
      title: "Quản lý loại thuốc",
      icon: "https://res.cloudinary.com/duk8odqun/image/upload/v1736757028/medicine_kuncu7.png",
      action: () => navigate("/admin/categories"),
    },
    {
      title: "Quản lý người dùng",
      icon: "https://res.cloudinary.com/duk8odqun/image/upload/v1736757517/youth_kjxivn.png",
      action: () => navigate("/admin/users"),
    },
    {
      title: "Quản lý đơn hàng",
      icon: "https://res.cloudinary.com/duk8odqun/image/upload/v1736757209/prescription_sd1qlg.png",
      action: () => navigate("/admin/orders"),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow container mx-auto py-10">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-12 text-center whitespace-nowrap">
          PHẢI XEM XÉT KĨ CÀNG TRƯỚC KHI THỰC HIỆN THAY ĐỔI DỮ LIỆU TRONG HỆ THỐNG!
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map((section, index) => (
            <div
              key={index}
              onClick={section.action}
              className="cursor-pointer border-2 border-black text-black rounded-xl shadow-md p-8 flex flex-col items-center justify-center transition duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <img
                src={section.icon}
                alt={section.title}
                className="w-24 h-24 mb-4 object-contain"
              />
              <h3 className="text-3xl font-semibold uppercase mt-4 whitespace-nowrap">{section.title}</h3>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

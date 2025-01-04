import React, { useState } from "react";
import axios from "axios";

const Login = () => {
    const [formData, setFormData] = useState({
        emailOrPhone: "",
        password: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
          const response = await axios.post("http://localhost:5000/api/users/login", formData);
          setMessage(response.data.message);
      
          const user = response.data.user;
      
          // Lưu thông tin người dùng vào localStorage
          localStorage.setItem("user", JSON.stringify(user));
      
          // Điều hướng theo vai trò
          if (user.isAdmin) {
            window.location.href = "/admin"; // Chuyển đến trang admin
          } else {
            window.location.href = "/"; // Chuyển đến trang người dùng
          }
        } catch (error) {
          setMessage(error.response?.data?.message || "Đã xảy ra lỗi!");
        }
      };
      


    return (
        <div className="bg-blue-50 min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <img src="/images/logo.png" alt="Nhà Thuốc" className="h-16" />
                </div>
                <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
                    Đăng nhập vào Nhà Thuốc Online
                </h1>
                <p className="text-center text-gray-500 mb-8">
                    Chào mừng bạn! Vui lòng đăng nhập để tiếp tục.
                </p>
                {message && <p className="text-center text-red-500 mb-4">{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="emailOrPhone" className="block text-gray-700 font-medium mb-2">
                            Email hoặc Số điện thoại
                        </label>
                        <input
                            type="text"
                            id="emailOrPhone"
                            value={formData.emailOrPhone}
                            onChange={handleChange}
                            placeholder="Nhập email hoặc số điện thoại"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Đăng nhập
                    </button>
                </form>
                <div className="flex justify-between items-center mt-6">
                    <a href="#forgot-password" className="text-blue-500 text-sm hover:underline">
                        Quên mật khẩu?
                    </a>
                    <a href="/register" className="text-blue-500 text-sm hover:underline">
                        Đăng ký tài khoản mới
                    </a>
                </div>
                <div className="mt-8 flex justify-center">
                    <img
                        src="/images/medicine-banner.png"
                        alt="Hình minh họa thuốc"
                        className="w-40"
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;

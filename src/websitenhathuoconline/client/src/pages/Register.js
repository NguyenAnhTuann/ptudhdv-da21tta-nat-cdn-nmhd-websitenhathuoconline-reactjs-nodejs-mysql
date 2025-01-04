import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
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
      const response = await axios.post("http://localhost:5000/api/users/register", formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Đã xảy ra lỗi!");
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">Đăng ký tài khoản</h1>
        <p className="text-center text-gray-500 mb-8">Vui lòng điền đầy đủ thông tin để tạo tài khoản mới.</p>
        {message && <p className="text-center text-red-500 mb-4">{message}</p>}
        <form onSubmit={handleSubmit}>
          {["name", "email", "phone", "address", "password"].map((field) => (
            <div className="mb-4" key={field}>
              <label htmlFor={field} className="block text-gray-700 font-medium mb-2">
                {field === "name"
                  ? "Họ và tên"
                  : field === "email"
                  ? "Địa chỉ Email"
                  : field === "phone"
                  ? "Số điện thoại"
                  : field === "address"
                  ? "Địa chỉ"
                  : "Mật khẩu"}
              </label>
              <input
                type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                id={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Nhập ${field === "name"
                  ? "họ và tên"
                  : field === "email"
                  ? "email"
                  : field === "phone"
                  ? "số điện thoại"
                  : field === "address"
                  ? "địa chỉ"
                  : "mật khẩu"}`}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Đăng ký
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-500">
            Đã có tài khoản?{" "}
            <a href="/login" className="text-blue-500 font-medium hover:underline">
              Đăng nhập
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

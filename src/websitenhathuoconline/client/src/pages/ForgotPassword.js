import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Thêm useNavigate

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);  // Thêm state cho loading
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);  // Bắt đầu loading

    try {
      await axios.post("http://localhost:5000/api/users/forgot-password", { email });
      setIsLoading(false);  // Tắt loading
        navigate("/reset-password");
    } catch (error) {
      setIsLoading(false);  // Tắt loading
      console.error("Đã xảy ra lỗi:", error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/duk8odqun/image/upload/v1736768573/A4_-_1_2_1_h9ymd2.png')`, // Đặt ảnh nền giống trang login
        backgroundSize: "cover", // Đảm bảo ảnh nền bao phủ toàn bộ
        backgroundPosition: "center",
      }}
    >
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex flex-col items-center justify-center z-50">
          {/* Loading spinner */}
          <div className="animate-spin rounded-full h-[150px] w-[150px] border-t-8 border-blue-500"></div>
          {/* Loading text */}
          <p className="text-white text-2xl font-bold mt-6">
            Đang gửi mã OTP tới email của bạn.. hãy xem hộp thư mail!
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row rounded-3xl shadow-lg overflow-hidden max-w-5xl w-full bg-white/20 backdrop-blur-lg">
        {/* Hình ảnh bên cạnh */}
        <div
          className="hidden md:block w-1/2 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/duk8odqun/image/upload/v1736766302/Logotimdothatlac_23_wggzmq.png')`,
          }}
        ></div>

        {/* Form quên mật khẩu */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex justify-center mb-6">
            <img
              src="https://res.cloudinary.com/duk8odqun/image/upload/v1736754301/logo_rhovwe.png"
              alt="Logo Nhà Thuốc"
              className="h-[100px]"
            />
          </div>
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Quên mật khẩu</h2>
          <p className="text-center text-gray-600 mb-8">Nhập email để nhận mã OTP đặt lại mật khẩu.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                  📧
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                  className="w-full px-12 py-3 border border-gray-500 rounded-3xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/40 backdrop-blur-md"
                  required
                />
              </div>
            </div>

            {/* Nút gửi mã OTP */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
            >
              Gửi mã OTP
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

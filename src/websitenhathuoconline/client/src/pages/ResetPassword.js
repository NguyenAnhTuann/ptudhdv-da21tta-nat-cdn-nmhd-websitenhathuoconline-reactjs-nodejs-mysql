import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Thêm useNavigate

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);  // Thêm state cho loading
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    setIsLoading(true);  // Bắt đầu loading

    try {
      // Giả lập thời gian chờ (loading lâu hơn) bằng cách delay 2 giây trước khi gửi yêu cầu
      setTimeout(async () => {
        try {
          await axios.post("http://localhost:5000/api/users/reset-password", formData); // Xóa response nếu không cần thiết
          setIsLoading(false);  // Tắt loading

          setTimeout(() => {
            navigate("/login");  // Điều hướng đến trang login
          }, 2000); // Chờ 2 giây để người dùng thấy thông báo thành công

        } catch (error) {
          setIsLoading(false);  // Tắt loading
          setErrorMessage(error.response?.data?.message || "Đã xảy ra lỗi!");
        }
      }, 3000);  // Chờ 2 giây để tạo hiệu ứng loading lâu hơn

    } catch (error) {
      setIsLoading(false);  // Tắt loading
      setErrorMessage(error.response?.data?.message || "Đã xảy ra lỗi!");
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
            Đang cập nhật mật khẩu... Vui lòng chờ!
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

        {/* Form đặt lại mật khẩu */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex justify-center mb-6">
            <img
              src="https://res.cloudinary.com/duk8odqun/image/upload/v1736754301/logo_rhovwe.png"
              alt="Logo Nhà Thuốc"
              className="h-[100px]"
            />
          </div>
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Đặt lại mật khẩu</h2>
          <p className="text-center text-gray-600 mb-8">Nhập OTP và mật khẩu mới để đặt lại mật khẩu.</p>

          {/* Hiển thị thông báo lỗi */}
          {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {["email", "otp", "newPassword", "confirmPassword"].map((field) => (
              <div className="mb-4 relative" key={field}>
                <label className="block text-gray-700 font-medium mb-1">
                  {field === "email"
                    ? "Email"
                    : field === "otp"
                      ? "Mã OTP"
                      : field === "newPassword"
                        ? "Mật khẩu mới"
                        : "Xác nhận mật khẩu"}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                    {field === "email" ? "📧" : field === "otp" ? "🔑" : field === "newPassword" ? "🔒" : "🔒"}
                  </span>
                  <input
                    type={field.includes("Password") ? "password" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={`Nhập ${field === "email" ? "email" : field}`}
                    className="w-full px-12 py-3 border border-gray-500 rounded-3xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/40 backdrop-blur-md"
                    required
                  />
                </div>
              </div>
            ))}

            {/* Nút đặt lại mật khẩu */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
            >
              Đặt lại mật khẩu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Dừng nếu có lỗi
    setIsLoading(true); // Bắt đầu loading

    setTimeout(async () => {
        try {
            await axios.post("http://localhost:5000/api/users/register", formData);
            // Sau khi đăng ký thành công, chuyển hướng đến trang đăng nhập
            window.location.href = "/login";
        } catch (error) {
            if (error.response?.data?.message === "Số điện thoại này đã được sử dụng!") {
                setErrorMessage("Số điện thoại này đã được sử dụng!");
            } else {
                setErrorMessage(error.response?.data?.message || "Đã xảy ra lỗi!");
            }
        } finally {
            setIsLoading(false); // Tắt loading
        }
    }, 3000); // Tăng thời gian xử lý toàn bộ công việc lên 3 giây
};





  const validateForm = () => {
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage("Địa chỉ email không hợp lệ!");
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setErrorMessage("Số điện thoại phải gồm 10 chữ số!");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Mật khẩu và xác nhận mật khẩu không khớp!");
      return false;
    }
    setErrorMessage("");
    return true;
  };


  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/duk8odqun/image/upload/v1736768573/A4_-_1_2_1_h9ymd2.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
          <div className="animate-spin rounded-full h-[150px] w-[150px] border-t-8 border-blue-500"></div>
          <p className="text-white text-2xl font-bold mt-6">
            Đang tạo tài khoản... Vui lòng chờ!
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

        {/* Form đăng ký */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex justify-center mb-6">
            <img
              src="https://res.cloudinary.com/duk8odqun/image/upload/v1736754301/logo_rhovwe.png"
              alt="Logo Nhà Thuốc"
              className="h-[100px]"
            />
          </div>
          <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
            ĐĂNG KÝ
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Vui lòng điền đầy đủ thông tin để tạo tài khoản mới.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Các trường input */}
            {["name", "email", "phone", "address", "password"].map((field) => (
              <div className="relative" key={field}>
                <label
                  htmlFor={field}
                  className="block text-gray-700 font-medium mb-1"
                >
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
                <div className="relative">
                  {/* Icon tương ứng cho từng trường */}
                  <span
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10`}
                  >
                    {field === "email"
                      ? "📧"
                      : field === "phone"
                        ? "📱"
                        : field === "password"
                          ? "🔒"
                          : field === "address"
                            ? "🏠" // Icon cho ô "Địa chỉ"
                            : "👤"}
                  </span>
                  <input
                    id={field}
                    type={
                      field === "password" ? "password" : field === "email" ? "email" : "text"
                    }
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
                            : "mật khẩu"
                      }`}
                    className="w-full px-12 py-3 border border-gray-500 rounded-3xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/40 backdrop-blur-md"
                    required
                  />
                </div>
              </div>
            ))}

            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">
                Nhập lại mật khẩu
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">🔒</span>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-12 py-3 border border-gray-500 rounded-3xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/40 backdrop-blur-md"
                  required
                />
              </div>
            </div>


            {/* Nút đăng ký */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
            >
              🚀 Đăng ký
            </button>
          </form>

          {errorMessage && (
            <p className="text-red-500 text-center mt-4 animate-blink">
              {errorMessage}
            </p>
          )}



          {/* Đăng nhập */}
          <div className="mt-6 text-center text-gray-600">
            <p>
              Đã có tài khoản?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Đăng nhập
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Register;

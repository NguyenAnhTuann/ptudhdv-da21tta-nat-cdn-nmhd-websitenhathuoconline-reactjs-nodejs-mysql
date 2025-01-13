import React, { useState } from "react";
import axios from "axios";

const Login = () => {
    const [formData, setFormData] = useState({
        emailOrPhone: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value, // Sử dụng name thay vì id
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Bắt đầu loading

        setTimeout(async () => {
            try {
                const response = await axios.post("http://localhost:5000/api/users/login", formData);
                const user = response.data.user;

                localStorage.setItem("user", JSON.stringify(user));
                setIsLoading(false); // Tắt loading

                if (user.isAdmin) {
                    window.location.href = "/admin";
                } else {
                    window.location.href = "/";
                }
            } catch (error) {
                setIsLoading(false); // Tắt loading
                setErrorMessage(error.response?.data?.message || "Đã xảy ra lỗi!");
            }
        }, 3000); // Tăng thời gian xử lý toàn bộ công việc lên 3 giây
    };


    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{
                backgroundImage: `url('https://res.cloudinary.com/duk8odqun/image/upload/v1736768573/A4_-_1_2_1_h9ymd2.png')`,
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
                        Đang xác thực tài khoản... Vui lòng chờ!
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

                {/* Form đăng nhập */}
                <div className="w-full md:w-1/2 p-8">
                    <div className="flex justify-center mb-6">
                        <img
                            src="https://res.cloudinary.com/duk8odqun/image/upload/v1736754301/logo_rhovwe.png"
                            alt="Logo Nhà Thuốc"
                            className="h-[100px]"
                        />
                    </div>
                    <p className="text-center text-gray-600 mb-8">
                        Chào mừng bạn! Vui lòng đăng nhập để tiếp tục.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email hoặc số điện thoại */}
                        <div className="relative">
                            <label
                                htmlFor="emailOrPhone"
                                className="block text-gray-700 font-medium mb-1"
                            >
                                Email hoặc số điện thoại
                            </label>
                            <div className="relative">
                                <span
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"
                                >
                                    📧
                                </span>
                                <input
                                    id="emailOrPhone"
                                    type="text"
                                    name="emailOrPhone"
                                    placeholder="Nhập email hoặc số điện thoại"
                                    value={formData.emailOrPhone}
                                    onChange={handleChange}
                                    className="w-full px-12 py-3 border border-gray-500 rounded-3xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/40 backdrop-blur-md"
                                    required
                                />
                            </div>
                        </div>

                        {/* Mật khẩu */}
                        <div className="relative">
                            <label
                                htmlFor="password"
                                className="block text-gray-700 font-medium mb-1"
                            >
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <span
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"
                                >
                                    🔒
                                </span>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Nhập mật khẩu"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-12 py-3 border border-gray-500 rounded-3xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/40 backdrop-blur-md"
                                    required
                                />
                                <span
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer z-10"
                                    onMouseEnter={() => setShowPassword(true)}
                                    onMouseLeave={() => setShowPassword(false)}
                                >
                                    👁️
                                </span>
                            </div>
                        </div>

                        {/* Nút đăng nhập */}
                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                        >
                            🚀 Đăng nhập
                        </button>

                        {/* Hiển thị thông báo lỗi */}
                        {errorMessage && (
                            <p className="text-red-500 text-center mt-4 animate-blink">
                                {errorMessage}
                            </p>
                        )}
                    </form>




                    {/* Đăng ký & Quên mật khẩu */}
                    <div className="mt-6 text-center text-gray-600">
                        <p>
                            Chưa có tài khoản?{" "}
                            <a
                                href="/register"
                                className="text-blue-600 hover:underline font-medium"
                            >
                                Đăng ký ngay
                            </a>
                        </p>
                        <p className="mt-2">
                            <a
                                href="/forgot-password"
                                className="text-blue-600 hover:underline font-medium"
                            >
                                Quên mật khẩu?
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Login;

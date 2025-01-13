import React, { useState, useEffect } from "react";
import axios from "axios";

const EditProfile = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });
    const [notification, setNotification] = useState({ show: false, type: "", message: "" });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Tên không được để trống.";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email không được để trống.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email không đúng định dạng.";
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Số điện thoại không được để trống.";
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = "Số điện thoại phải có 10 số.";
        }
        if (!formData.address.trim()) {
            newErrors.address = "Địa chỉ không được để trống.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
    };


    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
        setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
    };


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address || "",
            });
        }
    }, []);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return; // Dừng xử lý nếu có lỗi
        }

        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const response = await axios.put(
                `http://localhost:5000/api/users/${user.id}`,
                formData
            );
            console.log("Cập nhật thành công:", response.data);

            localStorage.setItem(
                "user",
                JSON.stringify({ ...user, ...formData })
            );

            showNotification("success", "Cập nhật thông tin thành công!");
        } catch (error) {
            console.error("Lỗi cập nhật thông tin:", error);
            showNotification("error", "Đã xảy ra lỗi!");
        }
    };



    return (
        <div
            className="min-h-screen bg-cover bg-center px-8 py-8"
            style={{
                backgroundImage: `url('https://res.cloudinary.com/duk8odqun/image/upload/v1736765219/Pngtree_assorted_pharmaceutical_medicine_pills_tablets_15452869_jtguu6.jpg')`,
            }}
        >

            {notification.show && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-lg w-[500px] h-[300px] text-center">
                        <div className="flex justify-center items-center mb-6">
                            {notification.type === "success" ? (
                                <img
                                    src="https://res.cloudinary.com/duk8odqun/image/upload/v1736747798/checked_hwtuz6.png"
                                    alt="Success Icon"
                                    className="w-20 h-20"
                                />
                            ) : (
                                <img
                                    src="https://res.cloudinary.com/duk8odqun/image/upload/v1736747751/cancel_uscjm0.png"
                                    alt="Error Icon"
                                    className="w-20 h-20"
                                />
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            {notification.type === "success" ? "Thành công!" : "Lỗi!"}
                        </h2>
                        <p className="text-gray-600 mb-6 text-xl">{notification.message}</p>
                        <div className="flex justify-center">
                            <button
                                onClick={() => setNotification({ show: false })}
                                className="px-4 py-2 border-2 text-black rounded-2xl hover:bg-gray-300 transition-all"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
                <h2
                    className="text-4xl font-extrabold mb-8 text-center text-gray-800 relative uppercase whitespace-nowrap"
                >
                    <span
                        className="inline-block px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-2xl shadow-lg"
                    >
                        Chỉnh sửa thông tin
                    </span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <div>
                        <label className="block text-gray-600 font-semibold mb-2">
                            <span className="mr-2">📛</span>Tên
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-xl shadow-sm">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nhập tên của bạn"
                                className={`w-full px-3 py-2 focus:outline-none text-gray-700 rounded-xl ${errors.name ? "border-red-500" : ""
                                    }`}
                            />
                        </div>
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-gray-600 font-semibold mb-2">
                            <span className="mr-2">📧</span>Email
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-xl shadow-sm">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Nhập email của bạn"
                                className={`w-full px-3 py-2 focus:outline-none text-gray-700 rounded-xl ${errors.email ? "border-red-500" : ""
                                    }`}
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Phone Field */}
                    <div>
                        <label className="block text-gray-600 font-semibold mb-2">
                            <span className="mr-2">📞</span>Số điện thoại
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-xl shadow-sm">
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Nhập số điện thoại của bạn"
                                className={`w-full px-3 py-2 focus:outline-none text-gray-700 rounded-xl ${errors.phone ? "border-red-500" : ""
                                    }`}
                            />
                        </div>
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    {/* Address Field */}
                    <div>
                        <label className="block text-gray-600 font-semibold mb-2">
                            <span className="mr-2">🏠</span>Địa chỉ
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-xl shadow-sm">
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Nhập địa chỉ của bạn"
                                className={`w-full px-3 py-2 focus:outline-none text-gray-700 rounded-xl ${errors.address ? "border-red-500" : ""
                                    }`}
                            />
                        </div>
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>
                </div>


                <div className="mt-8 flex justify-center">
                    <button
                        type="submit"
                        className="px-8 py-3 border-2 border-gray-400 text-black rounded-3xl font-semibold hover:bg-gray-300 transition duration-300"
                    >
                        Cập nhật
                    </button>
                </div>

            </form>
        </div>

    );
};

export default EditProfile;

import React, { useState, useEffect } from "react";
import axios from "axios";

const EditProfile = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address || "", // Thêm giá trị mặc định nếu không có địa chỉ
            });
        }
    }, []);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const response = await axios.put(
                `http://localhost:5000/api/users/${user.id}`,
                formData
            );
            console.log("Cập nhật thành công:", response.data);


            // Cập nhật thông tin người dùng trong localStorage
            localStorage.setItem(
                "user",
                JSON.stringify({ ...user, ...formData })
            );

            setMessage("Cập nhật thông tin thành công!");
        } catch (error) {
            console.error("Lỗi cập nhật thông tin:", error);
            setMessage("Đã xảy ra lỗi!");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md w-96"
            >
                <h2 className="text-2xl font-bold mb-4">Chỉnh sửa thông tin</h2>
                {message && <p className="text-red-500 mb-4">{message}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Tên</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Số điện thoại</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Địa chỉ</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
                >
                    Cập nhật thông tin
                </button>
            </form>
        </div>
    );
};

export default EditProfile;

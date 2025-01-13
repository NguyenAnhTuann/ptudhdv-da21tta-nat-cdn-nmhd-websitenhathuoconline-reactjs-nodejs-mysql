import React, { useEffect, useState } from "react";
import { faEdit, faPlus, faSync, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userForm, setUserForm] = useState({
        id: null,
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
    });
    const [notification, setNotification] = useState({ show: false, type: "", message: "" });
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        show: false,
        userId: null,
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/admin/users");
                const data = await response.json();
                if (data.success) {
                    setUsers(data.users);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (userForm.id) {
            try {
                const response = await fetch(`http://localhost:5000/api/admin/users/${userForm.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userForm),
                });
                const data = await response.json();
                if (data.success) {
                    showNotification("success", "Thông tin người dùng đã được cập nhật!");
                    setUsers((prevUsers) =>
                        prevUsers.map((user) =>
                            user.id === userForm.id ? { ...user, ...userForm } : user
                        )
                    );
                    resetForm();
                } else {
                    showNotification("error", data.message);
                }
            } catch (error) {
                showNotification("error", "Lỗi khi cập nhật thông tin.");
            }
        } else {
            try {
                const response = await fetch("http://localhost:5000/api/admin/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userForm),
                });
                const data = await response.json();
                if (data.success) {
                    showNotification("success", "Người dùng đã được thêm thành công!");
                    setUsers((prevUsers) => [...prevUsers, { ...userForm, id: data.user.id }]);
                    resetForm();
                } else {
                    showNotification("error", data.message);
                }
            } catch (error) {
                showNotification("error", "Lỗi khi thêm người dùng.");
            }
        }
    };



    const handleDeleteUser = async () => {
        if (deleteConfirmation.userId) {
            try {
                const response = await fetch(`http://localhost:5000/api/admin/users/${deleteConfirmation.userId}`, {
                    method: "DELETE",
                });
                const data = await response.json();
                if (data.success) {
                    showNotification("success", "Người dùng đã được xóa thành công!");
                    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== deleteConfirmation.userId));
                } else {
                    showNotification("error", data.message);
                }
            } catch (error) {
                showNotification("error", "Lỗi khi xóa người dùng.");
            } finally {
                setDeleteConfirmation({ show: false, userId: null });
            }
        }
    };



    const resetForm = () => {
        setUserForm({
            id: null,
            name: "",
            email: "",
            phone: "",
            address: "",
            password: "",
        });
    };

    const handleEditClick = (user) => {
        setUserForm({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            password: "",
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    if (loading) return <p>Loading...</p>;


    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
        setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
    };


    return (
        <div className="container mx-auto my-8">
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

            {deleteConfirmation.show && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-lg w-[610px] h-[400px] text-center">
                        <div className="flex justify-center items-center mb-6">
                            <img
                                src="https://res.cloudinary.com/duk8odqun/image/upload/v1736750368/problem_lpgjnt.png"
                                alt="Confirmation Icon"
                                className="w-[200px] h-[200px]"
                            />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2 whitespace-nowrap">
                            Bạn có chắc chắn muốn xóa người dùng này không?
                        </h2>
                        <div className="flex justify-center space-x-4 mt-6">
                            <button
                                onClick={() => setDeleteConfirmation({ show: false, userId: null })}
                                className="px-6 py-3 border-2 text-black rounded-full hover:bg-gray-300 transition-all"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDeleteUser}
                                className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-700 transition-all"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center mb-4">
                <button
                    onClick={() => window.location.href = "/admin"}
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-all"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-8 h-8"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-2xl ml-2">Quay lại</span>
                </button>
            </div>

            <form
                onSubmit={handleFormSubmit}
                className="bg-white p-8 rounded-xl shadow-xl border border-gray-300 max-w-3xl mx-auto"
            >
                {/* Form Header */}
                <h2 className="text-4xl font-extrabold text-black mb-10 text-center tracking-wide uppercase relative">
                    {userForm.id ? (
                        <>
                            <span className="text-blue-600 mr-2">🛠️</span> Chỉnh sửa người dùng
                        </>
                    ) : (
                        <>
                            <span className="text-green-600 mr-2">✨</span> Thêm người dùng mới
                        </>
                    )}
                </h2>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Name */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            <span className="mr-2">📛</span> Tên người dùng
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={userForm.name}
                            onChange={handleInputChange}
                            placeholder="Nhập tên người dùng"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring focus:ring-blue-400"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            <span className="mr-2">📧</span> Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={userForm.email}
                            onChange={handleInputChange}
                            placeholder="Nhập email"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring focus:ring-blue-400"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            <span className="mr-2">📞</span> Số điện thoại
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={userForm.phone}
                            onChange={handleInputChange}
                            placeholder="Nhập số điện thoại"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring focus:ring-blue-400"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            <span className="mr-2">🏠</span> Địa chỉ
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={userForm.address}
                            onChange={handleInputChange}
                            placeholder="Nhập địa chỉ"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring focus:ring-blue-400"
                        />
                    </div>

                    {/* Password */}
                    {!userForm.id && (
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                <span className="mr-2">🔒</span> Mật khẩu
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={userForm.password}
                                onChange={handleInputChange}
                                placeholder="Nhập mật khẩu"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring focus:ring-blue-400"
                            />
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={resetForm}
                        className="flex items-center space-x-2 border-2 hover:bg-gray-500 text-black px-6 py-3 rounded-full font-semibold transition duration-300"
                    >
                        <FontAwesomeIcon icon={faSync} />
                        <span>{userForm.id ? "Hủy" : "Reset"}</span>
                    </button>
                    <button
                        type="submit"
                        className="flex items-center space-x-2 border-2 hover:bg-gray-500 text-black px-6 py-3 rounded-full font-semibold transition duration-300"
                    >
                        <FontAwesomeIcon icon={userForm.id ? faEdit : faPlus} />
                        <span>{userForm.id ? "Lưu thay đổi" : "Thêm người dùng"}</span>
                    </button>
                </div>

            </form>

            {/* Danh sách người dùng */}
            <div className="mt-10 bg-white p-6 rounded-lg shadow-lg border border-gray-300">
                {users.length === 0 ? (
                    <p className="text-gray-600 text-center">Không có người dùng nào.</p>
                ) : (
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-4 px-6 border border-gray-300 text-center">ID</th>
                                <th className="py-4 px-6 border border-gray-300 text-center">Tên</th>
                                <th className="py-4 px-6 border border-gray-300 text-center">Email</th>
                                <th className="py-4 px-6 border border-gray-300 text-center">Số điện thoại</th>
                                <th className="py-4 px-6 border border-gray-300 text-center">Địa chỉ</th>
                                <th className="py-4 px-6 border border-gray-300 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr
                                    key={user.id}
                                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white hover:bg-gray-100"}
                                >
                                    <td className="py-4 px-6 border border-gray-300 text-center">{user.id}</td>
                                    <td className="py-4 px-6 border border-gray-300 text-center">{user.name}</td>
                                    <td className="py-4 px-6 border border-gray-300 text-center">{user.email}</td>
                                    <td className="py-4 px-6 border border-gray-300 text-center">{user.phone}</td>
                                    <td className="py-4 px-6 border border-gray-300 text-center">{user.address}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        <div className="flex flex-col items-center space-y-2">
                                            {/* Nút chỉnh sửa */}
                                            <button
                                                type="button"
                                                onClick={() => handleEditClick(user)}
                                                className="flex items-center space-x-2 border-2 hover:bg-gray-300 text-black px-4 py-2 rounded-full font-semibold transition duration-300"
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                                <span>Chỉnh sửa</span>
                                            </button>

                                            {/* Nút xóa */}
                                            <button
                                                type="button"
                                                onClick={() => setDeleteConfirmation({ show: true, userId: user.id })}
                                                className="flex items-center space-x-2 border-2 bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-full font-semibold transition duration-300"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                                <span>Xóa</span>
                                            </button>

                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    );
};

export default AdminUsers;

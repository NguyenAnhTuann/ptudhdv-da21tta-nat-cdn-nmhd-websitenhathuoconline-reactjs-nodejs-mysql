import React, { useEffect, useState } from "react";

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
    }); // Lưu thông tin người dùng đang thêm mới hoặc chỉnh sửa

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
          // Cập nhật người dùng
          try {
            const response = await fetch(`http://localhost:5000/api/admin/users/${userForm.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userForm),
            });
            const data = await response.json();
      
            if (data.success) {
              alert("Thông tin người dùng đã được cập nhật!");
              setUsers((prevUsers) =>
                prevUsers.map((user) =>
                  user.id === userForm.id ? { ...user, ...userForm } : user
                )
              );
              resetForm(); // Reset form sau khi cập nhật
            } else {
              alert(data.message);
            }
          } catch (error) {
            console.error("Error updating user:", error);
            alert("Lỗi khi cập nhật thông tin.");
          }
        } else {
          // Thêm mới người dùng
          try {
            const response = await fetch("http://localhost:5000/api/admin/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userForm),
            });
      
            const data = await response.json();
      
            if (data.success) {
              alert("Người dùng đã được thêm thành công!");
              // Thêm người dùng mới vào danh sách với ID trả về từ API
              setUsers((prevUsers) => [
                ...prevUsers,
                { ...userForm, id: data.user.id }, // Sử dụng `data.user.id` trả về từ API
              ]);
              resetForm(); // Reset form sau khi thêm
            } else {
              alert(data.message);
            }
          } catch (error) {
            console.error("Error adding user:", error);
            alert("Lỗi khi thêm người dùng.");
          }
        }
      };
      

    const handleDeleteUser = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
            try {
                const response = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
                    method: "DELETE",
                });
                const data = await response.json();
                if (data.success) {
                    alert("Người dùng đã được xóa thành công!");
                    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Lỗi khi xóa người dùng.");
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
            password: "", // Không hiển thị mật khẩu cũ trong form chỉnh sửa
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

    return (
        <div className="container mx-auto my-8">
            <h1 className="text-2xl font-bold mb-4">Quản lý người dùng</h1>

            {/* Form thêm mới/chỉnh sửa người dùng */}
            <form className="mb-6" onSubmit={handleFormSubmit}>
                <h2 className="text-xl font-semibold mb-4">
                    {userForm.id ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="name"
                        value={userForm.name}
                        onChange={handleInputChange}
                        placeholder="Tên"
                        required
                        className="border px-4 py-2 rounded"
                    />
                    <input
                        type="email"
                        name="email"
                        value={userForm.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        required
                        className="border px-4 py-2 rounded"
                    />
                    <input
                        type="text"
                        name="phone"
                        value={userForm.phone}
                        onChange={handleInputChange}
                        placeholder="Số điện thoại"
                        required
                        className="border px-4 py-2 rounded"
                    />
                    <input
                        type="text"
                        name="address"
                        value={userForm.address}
                        onChange={handleInputChange}
                        placeholder="Địa chỉ"
                        required
                        className="border px-4 py-2 rounded"
                    />
                    {!userForm.id && (
                        <input
                            type="password"
                            name="password"
                            value={userForm.password}
                            onChange={handleInputChange}
                            placeholder="Mật khẩu"
                            required
                            className="border px-4 py-2 rounded"
                        />
                    )}
                </div>
                <button
                    type="submit"
                    className={`mt-4 ${userForm.id ? "bg-green-500" : "bg-blue-500"} text-white px-4 py-2 rounded hover:bg-opacity-90`}
                >
                    {userForm.id ? "Lưu thay đổi" : "Thêm người dùng"}
                </button>
                {userForm.id && (
                    <button
                        type="button"
                        onClick={resetForm}
                        className="mt-4 ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Hủy
                    </button>
                )}
            </form>

            {/* Danh sách người dùng */}
            {users.length === 0 ? (
                <p>Không có người dùng nào.</p>
            ) : (
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-4 px-6 border-b text-center">ID</th>
                            <th className="py-4 px-6 border-b text-center">Tên</th>
                            <th className="py-4 px-6 border-b text-center">Email</th>
                            <th className="py-4 px-6 border-b text-center">Số điện thoại</th>
                            <th className="py-4 px-6 border-b text-center">Địa chỉ</th>
                            <th className="py-4 px-6 border-b text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="py-4 px-6 border-b text-center">{user.id}</td>
                                <td className="py-4 px-6 border-b text-center">{user.name}</td>
                                <td className="py-4 px-6 border-b text-center">{user.email}</td>
                                <td className="py-4 px-6 border-b text-center">{user.phone}</td>
                                <td className="py-4 px-6 border-b text-center">{user.address}</td>
                                <td className="py-4 px-6 border-b text-center">
                                    <button
                                        onClick={() => handleEditClick(user)}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                    >
                                        Chỉnh sửa
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminUsers;

import React, { useState, useEffect } from "react";
import { faEdit, faPlus, faSync, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryForm, setCategoryForm] = useState({
    id: null,
    name: "",
  });
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    categoryId: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/categories");
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (categoryForm.id) {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/admin/categories/${categoryForm.id}`,
          { name: categoryForm.name }
        );
        if (response.data.success) {
          showNotification("success", "Danh mục đã được cập nhật!");
          setCategories((prevCategories) =>
            prevCategories.map((category) =>
              category.id === categoryForm.id ? { ...category, name: categoryForm.name } : category
            )
          );
          resetForm();
        }
      } catch (error) {
        showNotification("error", "Lỗi khi cập nhật danh mục.");
      }
    } else {
      try {
        const response = await axios.post("http://localhost:5000/api/admin/categories", {
          name: categoryForm.name,
        });
        if (response.data.success) {
          showNotification("success", "Danh mục đã được thêm thành công!");
          setCategories((prevCategories) => [...prevCategories, { id: response.data.category.id, ...categoryForm }]);
          resetForm();
        }
      } catch (error) {
        showNotification("error", "Lỗi khi thêm danh mục.");
      }
    }
  };

  const handleDeleteCategory = async () => {
    if (deleteConfirmation.categoryId) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/admin/categories/${deleteConfirmation.categoryId}`
        );
        if (response.data.success) {
          showNotification("success", "Danh mục đã được xóa thành công!");
          setCategories((prevCategories) =>
            prevCategories.filter((category) => category.id !== deleteConfirmation.categoryId)
          );
        }
      } catch (error) {
        showNotification("error", "Lỗi khi xóa danh mục.");
      } finally {
        setDeleteConfirmation({ show: false, categoryId: null });
      }
    }
  };

  const resetForm = () => {
    setCategoryForm({ id: null, name: "" });
  };

  const handleEditClick = (category) => {
    setCategoryForm({ id: category.id, name: category.name });
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setCategoryForm((prev) => ({ ...prev, name: value }));
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
  };

  if (loading) return <p>Đang tải...</p>;

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
            <h2 className="text-2xl font-semibold mb-6">Bạn có chắc chắn muốn xóa danh mục này không?</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteConfirmation({ show: false, categoryId: null })}
                className="px-6 py-3 bg-gray-500 text-white rounded-full"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteCategory}
                className="px-6 py-3 bg-red-500 text-white rounded-full"
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
        className="bg-white p-8 rounded-xl shadow-xl border border-gray-300 max-w-3xl mx-auto mb-10"
      >
        {/* Form Header */}
        <h2 className="text-4xl font-extrabold text-black mb-10 text-center tracking-wide uppercase relative">
          {categoryForm.id ? (
            <>
              <span className="text-blue-600 mr-2">🛠️</span> Chỉnh sửa danh mục
            </>
          ) : (
            <>
              <span className="text-green-600 mr-2">✨</span> Thêm danh mục mới
            </>
          )}
        </h2>

        {/* Form Fields */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              <span className="mr-2">📛</span> Tên danh mục
            </label>
            <input
              type="text"
              name="name"
              value={categoryForm.name}
              onChange={handleInputChange}
              placeholder="Nhập tên danh mục"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={resetForm}
            className="flex items-center space-x-2 border-2 hover:bg-gray-500 text-black px-6 py-3 rounded-full font-semibold transition duration-300"
          >
            <FontAwesomeIcon icon={faSync} />
            <span>{categoryForm.id ? "Hủy" : "Reset"}</span>
          </button>
          <button
            type="submit"
            className="flex items-center space-x-2 border-2 hover:bg-gray-500 text-black px-6 py-3 rounded-full font-semibold transition duration-300"
          >
            <FontAwesomeIcon icon={categoryForm.id ? faEdit : faPlus} />
            <span>{categoryForm.id ? "Lưu thay đổi" : "Thêm danh mục"}</span>
          </button>
        </div>
      </form>


      <div className="bg-white p-6 rounded-lg shadow-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-4 px-6 border">ID</th>
              <th className="py-4 px-6 border">Tên danh mục</th>
              <th className="py-4 px-6 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="py-4 px-6 border text-center">{category.id}</td>
                <td className="py-4 px-6 border">{category.name}</td>
                <td className="py-4 px-6 border text-center">
                  <div className="flex justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleEditClick(category)}
                      className="flex items-center border-2 hover:bg-gray-300 text-black px-4 py-2 rounded-full font-semibold transition duration-300"
                    >
                      <span className="mr-2">
                        <FontAwesomeIcon icon={faEdit} />
                      </span>
                      <span>Chỉnh sửa</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmation({ show: true, categoryId: category.id })}
                      className="flex items-center border-2 bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-full font-semibold transition duration-300"
                    >
                      <span className="mr-2">
                        <FontAwesomeIcon icon={faTrash} />
                      </span>
                      <span>Xóa</span>
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategories;

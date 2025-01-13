import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { faEdit, faPlus, faSync, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AdminProducts = () => {
  const [formData, setFormData] = useState({
    name: "",
    unit: "Hộp",
    category_id: "",
    manufacturer: "",
    ingredients: "",
    description: "",
    price: "",
    quantity: "",
  });
  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef()
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    productId: null,
  });
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [productsPerPage] = useState(10); // Số sản phẩm mỗi trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sản phẩm:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách danh mục:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/products"),
          axios.get("http://localhost:5000/api/products/categories"),
        ]);
        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchData();
  }, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("unit", formData.unit);
    data.append("category_id", formData.category_id);
    data.append("manufacturer", formData.manufacturer);
    data.append("ingredients", formData.ingredients);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("quantity", formData.quantity);

    Array.from(images).forEach((image) => {
      data.append("images", image);
    });

    try {
      if (editingProductId) {
        await axios.put(`http://localhost:5000/api/products/update/${editingProductId}`, data);
        setNotification({ show: true, type: "success", message: "Sản phẩm đã được cập nhật!" });
      } else {
        await axios.post("http://localhost:5000/api/products/add", data);
        setNotification({ show: true, type: "success", message: "Sản phẩm đã được thêm!" });
      }

      fetchProducts();
      resetForm();
    } catch (error) {
      setNotification({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Đã xảy ra lỗi!",
      });
    } finally {
      setLoading(false);
    }
  };


  // Đặt lại form
  const resetForm = () => {
    setFormData({
      name: "",
      unit: "Hộp",
      category_id: "",
      manufacturer: "",
      ingredients: "",
      description: "",
      price: "",
      quantity: "",
    });
    setImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setEditingProductId(null);
  };


  const confirmDeleteProduct = async () => {
    if (deleteConfirmation.productId) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${deleteConfirmation.productId}`);
        setNotification({ show: true, type: "success", message: "Sản phẩm đã được xóa thành công!" });
        fetchProducts(); // Cập nhật danh sách sản phẩm
      } catch (error) {
        setNotification({
          show: true,
          type: "error",
          message: error.response?.data?.message || "Xóa sản phẩm thất bại!",
        });
      } finally {
        setDeleteConfirmation({ show: false, productId: null });
      }
    }
  };

  const handleDelete = (id) => {
    setDeleteConfirmation({ show: true, productId: id });
  };



  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      unit: product.unit,
      category_id: product.category_id,
      manufacturer: product.manufacturer,
      ingredients: product.ingredients,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
    });
    setImages(JSON.parse(product.images));
    setEditingProductId(product.id);
  };



  return (
    <div className="min-h-screen bg-gray-100 p-10">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
          <style>
            {`
        .loader {
          border-top-color: #3498db;
          animation: spinner 1.5s linear infinite;
        }
        @keyframes spinner {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}
          </style>
        </div>
      )}
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Bạn có chắc chắn muốn xóa sản phẩm này không?
            </h2>
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={() => setDeleteConfirmation({ show: false, productId: null })}
                className="px-6 py-3 border-2 text-black rounded-full hover:bg-gray-300 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={confirmDeleteProduct}
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
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-xl border border-gray-300 max-w-3xl mx-auto"
      >
        {/* Form Header */}
        <h2 className="text-4xl font-extrabold text-black mb-10 text-center tracking-wide uppercase relative">
          {editingProductId ? (
            <>
              <span className="text-blue-600 mr-2">🛠️</span> Cập Nhật Sản Phẩm
            </>
          ) : (
            <>
              <span className="text-green-600 mr-2">✨</span> Thêm Sản Phẩm
            </>
          )}
        </h2>

        {/* Product Name */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            <span className="mr-2">📌</span> Tên sản phẩm
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring focus:ring-blue-400"
            placeholder="Nhập tên sản phẩm"
          />
        </div>

        {/* Unit and Category in One Row */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Unit Selection */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              <span className="mr-2">⚖️</span> Đơn vị
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring focus:ring-blue-400"
            >
              <option value="Hộp">Hộp</option>
              <option value="Vỉ">Vỉ</option>
              <option value="Viên">Viên</option>
            </select>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              <span className="mr-2">📂</span> Danh mục
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring focus:ring-blue-400"
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Manufacturer */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            <span className="mr-2">🏭</span> Nhà sản xuất
          </label>
          <input
            type="text"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring focus:ring-blue-400"
            placeholder="Nhập tên nhà sản xuất"
          />
        </div>

        {/* Ingredients and Description */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            <span className="mr-2">🌿</span> Thành phần
          </label>
          <textarea
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring focus:ring-blue-400"
            placeholder="Nhập thành phần sản phẩm"
          ></textarea>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            <span className="mr-2">📝</span> Mô tả
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring focus:ring-blue-400"
            placeholder="Nhập mô tả sản phẩm"
          ></textarea>
        </div>

        {/* Price and Quantity */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              <span className="mr-2">💵</span> Giá
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring focus:ring-blue-400"
              placeholder="Nhập giá sản phẩm"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              <span className="mr-2">📦</span> Số lượng
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring focus:ring-blue-400"
              placeholder="Nhập số lượng"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            <span className="mr-2">📸</span> Hình ảnh (tối đa 10 ảnh)
          </label>
          <input
            type="file"
            multiple
            ref={fileInputRef} // Sử dụng ref để quản lý input file
            onChange={handleImageChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={resetForm}
            className="flex items-center space-x-2 border-2 hover:bg-gray-500 text-black px-6 py-3 rounded-full font-semibold transition duration-300"
          >
            <FontAwesomeIcon icon={faSync} />
            <span>Reset</span>
          </button>
          <button
            type="submit"
            className="flex items-center space-x-2 border-2 hover:bg-gray-500 text-black px-6 py-3 rounded-full font-semibold transition duration-300"
          >
            <FontAwesomeIcon icon={editingProductId ? faEdit : faPlus} />
            <span>{editingProductId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}</span>
          </button>
        </div>
      </form>




      {/* Danh sách sản phẩm */}
      <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
        <table className="w-full border-collapse border border-gray-300 text-base">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-6 py-4">ID</th>
              <th className="border border-gray-300 px-6 py-4">Hình ảnh</th>
              <th className="border border-gray-300 px-6 py-4">Tên sản phẩm</th>
              <th className="border border-gray-300 px-6 py-4">Danh mục</th>
              <th className="border border-gray-300 px-6 py-4">Đơn vị</th>
              <th className="border border-gray-300 px-6 py-4">Nhà sản xuất</th>
              <th className="border border-gray-300 px-6 py-4">Thành phần</th>
              <th className="border border-gray-300 px-6 py-4">Mô tả</th>
              <th className="border border-gray-300 px-6 py-4">Giá</th>
              <th className="border border-gray-300 px-6 py-4">Số lượng</th>
              <th className="border border-gray-300 px-6 py-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-6 py-4 text-center">{product.id}</td>
                <td className="border border-gray-300 px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      try {
                        const images = JSON.parse(product.images);
                        if (Array.isArray(images)) {
                          return images.slice(0, 6).map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={product.name}
                              className="h-12 w-12 object-contain border border-gray-300"
                            />
                          ));
                        }
                      } catch (error) {
                        console.error("Lỗi parse images:", error);
                      }
                      return <span>Không có hình ảnh</span>;
                    })()}
                  </div>
                </td>
                <td className="border border-gray-300 px-6 py-4">{product.name}</td>
                <td className="border border-gray-300 px-6 py-4 text-center">
                  {categories.find((cat) => cat.id === product.category_id)?.name || "Không xác định"}
                </td>
                <td className="border border-gray-300 px-6 py-4 text-center">{product.unit}</td>
                <td className="border border-gray-300 px-6 py-4">{product.manufacturer}</td>
                <td className="border border-gray-300 px-6 py-4">{product.ingredients}</td>
                <td className="border border-gray-300 px-6 py-4">{product.description}</td>
                <td className="border border-gray-300 px-6 py-4 text-right">
                  {new Intl.NumberFormat('vi-VN').format(product.price)} VND
                </td>
                <td className="border border-gray-300 px-6 py-4 text-center">{product.quantity}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(product)}
                      className="flex items-center space-x-2 border-2 hover:bg-gray-300 text-black px-4 py-2 rounded-full font-semibold transition duration-300"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                      <span>Sửa</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
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
        <div className="flex justify-center mt-6">
          {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-4 py-2 rounded-full ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

      </div>

    </div>
  );
};

export default AdminProducts;

import axios from "axios";
import React, { useState, useEffect } from "react";

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
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null); // Biến để lưu ID sản phẩm đang chỉnh sửa


  // Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sản phẩm:", error);
    }
  };

  // Lấy danh mục sản phẩm
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

    const data = new FormData();
    data.append("name", formData.name);
    data.append("unit", formData.unit);
    data.append("category_id", formData.category_id);
    data.append("manufacturer", formData.manufacturer);
    data.append("ingredients", formData.ingredients);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("quantity", formData.quantity);

    // Thêm ảnh mới nếu có
    Array.from(images).forEach((image) => {
      data.append("images", image);
    });

    try {
      if (editingProductId) {
        // Nếu đang chỉnh sửa, gọi API cập nhật
        await axios.put(`http://localhost:5000/api/products/update/${editingProductId}`, data);
        setMessage("Sản phẩm đã được cập nhật!");
      } else {
        // Nếu không, thêm sản phẩm mới
        await axios.post("http://localhost:5000/api/products/add", data);
        setMessage("Sản phẩm đã được thêm!");
      }

      fetchProducts(); // Cập nhật danh sách sản phẩm
      resetForm(); // Đặt lại form
    } catch (error) {
      setMessage(error.response?.data?.message || "Đã xảy ra lỗi!");
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
    document.querySelector("input[type='file']").value = "";
    setEditingProductId(null);
  };


  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        setMessage("Sản phẩm đã được xóa.");
        fetchProducts(); // Cập nhật danh sách sản phẩm
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        setMessage(error.response?.data?.message || "Xóa sản phẩm thất bại.");
      }
    }
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
    setImages(JSON.parse(product.images)); // Hiển thị ảnh cũ nếu có
    setEditingProductId(product.id); // Lưu ID của sản phẩm đang chỉnh sửa
  };


  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Thêm Sản Phẩm</h1>
      {message && <p className="text-red-500 mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {/* Form thêm sản phẩm */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Tên sản phẩm</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Đơn vị</label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="Hộp">Hộp</option>
            <option value="Vỉ">Vỉ</option>
            <option value="Viên">Viên</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Danh mục</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Nhà sản xuất</label>
          <input
            type="text"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Thành phần</label>
          <textarea
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Giá</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Số lượng</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Hình ảnh (tối đa 10 ảnh)</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          {editingProductId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
        </button>
        <button
          type="button"
          className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          onClick={resetForm} // Gọi hàm resetForm khi ấn nút
        >
          Reset
        </button>

      </form>

      {/* Danh sách sản phẩm */}
      <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Danh sách sản phẩm</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Hình ảnh</th>
              <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Tên sản phẩm</th>
              <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Danh mục</th>
              <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Đơn vị</th>
              <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Nhà sản xuất</th>
              <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Thành phần</th>
              <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Mô tả</th>
              <th className="border border-gray-300 px-4 py-2">Giá</th>
              <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Số lượng</th>
              <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="border border-gray-300 px-4 py-2">{product.id}</td>

                <td className="border border-gray-300 px-4 py-2">
                  {(() => {
                    try {
                      const images = JSON.parse(product.images); // Kiểm tra và parse JSON
                      if (Array.isArray(images)) {
                        return images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={product.name}
                            className="h-12 w-12 object-cover inline-block mr-2"
                          />
                        ));
                      }
                    } catch (error) {
                      console.error("Lỗi parse images:", error); // Ghi log lỗi nếu JSON không hợp lệ
                    }
                    return "Không có hình ảnh"; // Trường hợp không có ảnh hoặc lỗi
                  })()}
                </td>


                <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {categories.find((cat) => cat.id === product.category_id)?.name || "Không xác định"}
                </td>
                <td className="border border-gray-300 px-4 py-2">{product.unit}</td>
                <td className="border border-gray-300 px-4 py-2">{product.manufacturer}</td>
                <td className="border border-gray-300 px-4 py-2">{product.ingredients}</td>
                <td className="border border-gray-300 px-4 py-2">{product.description}</td>
                <td className="border border-gray-300 px-4 py-2">{product.price} VND</td>
                <td className="border border-gray-300 px-4 py-2">{product.quantity}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="text-blue-500 hover:underline mr-2"
                      onClick={() => handleEdit(product)}
                    >
                      Sửa
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDelete(product.id)}
                    >
                      Xóa
                    </button>
                  </td>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;

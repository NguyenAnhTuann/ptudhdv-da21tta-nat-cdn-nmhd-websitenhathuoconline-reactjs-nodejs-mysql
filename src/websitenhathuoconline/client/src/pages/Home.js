import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  // Hàm định dạng giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price).replace("₫", ""); // Loại bỏ ký hiệu ₫ nếu không cần
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`); // Điều hướng đến trang chi tiết sản phẩm
  };
  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-bold text-center mb-8">Danh Sách Sản Phẩm</h1>
      <div className="grid grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white cursor-pointer"
            onClick={() => handleProductClick(product.id)}
            style={{ height: "450px" }}
          >
            <div className="h-1/2 flex justify-center items-center">
              <img
                src={JSON.parse(product.images)[0]}
                alt={product.name}
                className="object-cover h-full w-auto max-h-full rounded-md"
              />
            </div>
            <div className="mt-4">
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                {product.name}
              </h2>
              <p className="text-blue-600 font-bold text-xl mt-2">
                {formatPrice(product.price)}VNĐ / {product.unit}
              </p>
              <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                {product.description}
              </p>
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-full mt-4 w-full font-medium hover:bg-blue-600 transition duration-300"
              >
                Chọn mua
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

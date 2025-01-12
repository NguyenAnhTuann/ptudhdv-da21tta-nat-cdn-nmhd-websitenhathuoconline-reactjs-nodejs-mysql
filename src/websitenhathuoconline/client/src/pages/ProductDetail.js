import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); // Trạng thái ảnh lớn

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/${id}`);
                const productData = response.data;
                setProduct(productData);
                setSelectedImage(JSON.parse(productData.images)[0]); // Mặc định ảnh lớn là ảnh đầu tiên
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
            }
        };

        fetchProduct();
    }, [id]);

    if (!product) {
        return <p>Đang tải thông tin sản phẩm...</p>;
    }

    const images = JSON.parse(product.images);

    const handleAddToCart = () => {
        const productToAdd = {
            id: product.id, // Đảm bảo có `id`
            name: product.name,
            price: product.price,
            quantity: 1, // Mặc định số lượng là 1
            unit: product.unit,
            image: JSON.parse(product.images)[0], // Lấy ảnh đầu tiên
        };

        const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingProduct = existingCart.find((item) => item.id === productToAdd.id); // So sánh bằng ID
        if (existingProduct) {
            existingProduct.quantity += 1; // Nếu sản phẩm đã tồn tại, tăng số lượng
        } else {
            existingCart.push(productToAdd); // Nếu chưa tồn tại, thêm sản phẩm mới
        }

        localStorage.setItem("cart", JSON.stringify(existingCart)); // Lưu giỏ hàng
        alert("Đã thêm sản phẩm vào giỏ hàng!");
    };



    return (
        <div className="flex flex-col bg-gray-100 min-h-screen">
            <div className="container mx-auto my-8 px-4">
                {/* Khung chứa chính được giới hạn chiều rộng */}
                <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6">
                    <div className="flex flex-col lg:flex-row items-start gap-6">
                        {/* Hình ảnh sản phẩm */}
                        <div className="w-full lg:w-1/2 text-center">
                            {/* Ảnh lớn */}
                            <img
                                src={selectedImage} // Hiển thị ảnh lớn dựa trên trạng thái
                                alt={product.name}
                                className="w-full h-auto object-contain rounded-lg mb-4"
                            />

                            {/* Ảnh nhỏ */}
                            <div className="flex justify-center gap-2">
                                {images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        className={`w-16 h-16 object-cover rounded-md cursor-pointer border ${selectedImage === image ? "border-blue-500" : ""
                                            }`}
                                        onClick={() => setSelectedImage(image)} // Cập nhật ảnh lớn khi click
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Thông tin sản phẩm */}
                        <div className="w-full lg:w-1/2">
                            {/* Thương hiệu và tên sản phẩm */}
                            <h2 className="text-lg text-gray-500 font-semibold mb-2">Thương hiệu: {product.manufacturer}</h2>
                            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

                            {/* Giá và đơn vị tính */}
                            <p className="text-2xl text-blue-600 font-semibold mb-4">
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(product.price)}{" "}
                                / {product.unit}
                            </p>

                            {/* Các thông tin khác */}
                            <div className="mb-4">
                                <strong className="text-gray-700">Danh mục:</strong>
                                <p>{product.category_name || "Không xác định"}</p>
                            </div>
                            <div className="mb-4">
                                <strong className="text-gray-700">Thành phần:</strong>
                                <p>{product.ingredients}</p>
                            </div>
                            <div className="mb-4">
                                <strong className="text-gray-700">Mô tả:</strong>
                                <p>{product.description}</p>
                            </div>
                            <div className="mb-4">
                                <strong className="text-gray-700">Số lượng tồn kho:</strong>
                                <p>{product.quantity}</p>
                            </div>

                            {/* Các nút hành động */}
                            <div className="flex items-center gap-4 mt-6">
                                <button
                                    className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition"
                                    onClick={handleAddToCart} // Gắn sự kiện onClick vào hàm handleAddToCart
                                >
                                    Chọn mua
                                </button>

                                <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition">
                                    Tìm nhà thuốc
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;

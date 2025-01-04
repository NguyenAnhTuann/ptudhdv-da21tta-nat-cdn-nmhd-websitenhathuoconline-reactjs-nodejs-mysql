import axios from "axios";

export const addToCart = async (product, userId) => {
    try {
        const response = await axios.post("http://localhost:5000/api/cart/add", {
            userId,
            productId: product.id,
            quantity: 1,
        });

        if (response.status === 200) {
            console.log(response.data.message);
        }
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    }
};

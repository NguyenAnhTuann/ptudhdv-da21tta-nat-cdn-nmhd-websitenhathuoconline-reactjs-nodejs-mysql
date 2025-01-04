import React, { useEffect, useState } from "react";
import axios from "axios";

const Cart = ({ userId }) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
                setCart(response.data.cart);
            } catch (error) {
                console.error("Lỗi khi lấy giỏ hàng:", error);
            }
        };

        fetchCart();
    }, [userId]);

    return (
        <div className="container mx-auto my-8 px-4">
            <h1 className="text-2xl font-bold mb-4">Giỏ hàng của bạn</h1>
            {cart.length === 0 ? (
                <p>Giỏ hàng trống.</p>
            ) : (
                cart.map((item) => (
                    <div key={item.product_id}>
                        <p>{item.name}</p>
                        <p>Số lượng: {item.quantity}</p>
                        <p>Giá: {item.price}</p>
                        <img src={JSON.parse(item.images)[0]} alt={item.name} />
                    </div>
                ))
            )}
        </div>
    );
};

export default Cart;

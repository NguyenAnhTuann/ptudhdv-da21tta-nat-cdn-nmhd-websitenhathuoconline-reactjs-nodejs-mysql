import React, { useEffect, useState } from "react";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log(storedCart);
    setCart(storedCart);
    setCheckedItems(new Array(storedCart.length).fill(true));
  }, []);
  

  const handleIncrease = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += 1;
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleDecrease = (index) => {
    const updatedCart = [...cart];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const handleRemove = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    setCheckedItems(checkedItems.filter((_, i) => i !== index)); // Xóa trạng thái checkbox
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleCheckboxChange = (index) => {
    const updatedCheckedItems = [...checkedItems];
    updatedCheckedItems[index] = !updatedCheckedItems[index]; // Đảo ngược trạng thái
    setCheckedItems(updatedCheckedItems);
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setCheckedItems(new Array(cart.length).fill(isChecked));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item, index) => {
      if (checkedItems[index]) {
        return total + item.price * item.quantity;
      }
      return total;
    }, 0);
  };

  const isAllSelected = checkedItems.every((item) => item === true);

  const handlePurchase = async () => {
    const userId = 1; // ID người dùng (giả định)
    const products = cart
      .filter((_, index) => checkedItems[index])
      .map((item) => {
        if (!item.id) {
          console.error("Product ID is missing for item:", item);
          return null;
        }
        return {
          product_id: item.id, // Đảm bảo gửi đúng `product_id`
          quantity: item.quantity,
          price: item.price,
        };
      })
      .filter((product) => product !== null); // Chỉ giữ sản phẩm hợp lệ

    const status = "Chưa nhận hàng";

    // Kiểm tra nếu không có sản phẩm nào được chọn
    if (products.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để đặt hàng.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/orders/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, products, status }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Đặt hàng thành công!");
        localStorage.removeItem("cart");
        setCart([]);
      } else {
        alert(data.message || "Đặt hàng thất bại");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Đặt hàng thất bại");
    }
  };

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      <div className="container mx-auto my-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Giỏ hàng của bạn</h1>
        {cart.length === 0 ? (
          <p>Giỏ hàng trống.</p>
        ) : (
          <div className="flex gap-6">
            {/* Phần bảng giỏ hàng */}
            <div className="bg-white shadow-md rounded-lg p-6 flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="py-2 px-4">ID</th>
                    <th className="py-2 px-4">Sản phẩm</th>
                    <th className="py-2 px-4">Giá thành</th>
                    <th className="py-2 px-4">Số lượng</th>
                    <th className="py-2 px-4">Đơn vị</th>
                    <th className="py-2 px-4">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={checkedItems[index]}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      </td>
                      <td className="py-4 px-4">{item.id}</td>
                      <td className="py-4 px-4 flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <span>{item.name}</span>
                      </td>
                      <td className="py-4 px-4 text-blue-600 font-semibold">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.price)}
                      </td>
                      <td className="py-4 px-4 flex items-center gap-2">
                        <button
                          className="px-2 py-1 border rounded-md"
                          onClick={() => handleDecrease(index)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="px-2 py-1 border rounded-md"
                          onClick={() => handleIncrease(index)}
                        >
                          +
                        </button>
                      </td>
                      <td className="py-4 px-4">{item.unit}</td>
                      <td className="py-4 px-4">
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleRemove(index)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Phần bảng tổng tiền */}
            <div className="w-1/3 bg-white shadow-md rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Áp dụng ưu đãi để được giảm giá</h2>
              <div className="border-t py-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tổng tiền</span>
                  <span className="text-gray-800 font-bold">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(calculateTotal())}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Giảm giá trực tiếp</span>
                  <span className="text-gray-800 font-bold">0đ</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Giảm giá voucher</span>
                  <span className="text-gray-800 font-bold">0đ</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Thành tiền</span>
                  <span className="text-blue-600">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(calculateTotal())}
                  </span>
                </div>
                <p className="text-gray-600 mt-2">
                  Phương thức thanh toán: <span className="font-semibold">Thanh toán tiền mặt khi nhận hàng</span>
                </p>
              </div>
              <button
                className="w-full bg-blue-500 text-white py-3 rounded-lg mt-4 font-semibold hover:bg-blue-600"
                onClick={handlePurchase}
              >
                Mua hàng
              </button>

              <p className="text-gray-500 text-sm mt-4">
                Bằng việc tiến hành đặt mua hàng, bạn đồng ý với{" "}
                <button className="text-blue-500 hover:underline">
                  Điều khoản dịch vụ
                </button>{" "}
                và{" "}
                <button className="text-blue-500 hover:underline">
                  Chính sách xử lý dữ liệu cá nhân
                </button>
                {" "}của nhà thuốc NGUYEN ANH TUAN.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

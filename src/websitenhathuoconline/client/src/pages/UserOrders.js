import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Hàm định dạng giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/don-hang-cua-ban/${user.id}`
        );
        const data = await response.json();
        setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;

  const groupedOrders = Object.entries(
    orders.reduce((acc, order) => {
      if (!acc[order.created_at]) {
        acc[order.created_at] = [];
      }
      acc[order.created_at].push(order);
      return acc;
    }, {})
  ).sort(([timeA], [timeB]) => new Date(timeB) - new Date(timeA));

  return (
    <div className="container mx-auto my-8 px-4">
      {/* Nút Tiếp tục mua sắm */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => window.location.href = "/"}
          className="flex items-center text-blue-600 hover:underline"
        >
          <span className="mr-2 text-2xl">⭠</span>
          <span className="text-lg font-medium">Tiếp tục mua sắm</span>
        </button>
      </div>

      {/* Khi không có đơn hàng */}
      {orders.length === 0 ? (
        <div className="text-center bg-gray-100 p-8 rounded-lg shadow-md">
          <img
            src="https://nhathuoclongchau.com.vn/estore-images/cart/illustration-cart-empty.png"
            alt="Không có đơn hàng"
            className="w-40 h-40 mx-auto mb-6"
          />
          <p className="text-lg text-gray-600 mb-4">
            Bạn chưa có đơn hàng nào.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition"
          >
            Khám phá sản phẩm
          </button>
        </div>
      ) : (
        groupedOrders.map(([time, orders], index) => {
          const totalOrderPrice = orders.reduce(
            (sum, order) => sum + parseFloat(order.total_price),
            0
          );

          const totalProductCount = orders.reduce(
            (sum, order) => sum + order.quantity,
            0
          );

          const orderStatus = orders[0]?.status || "Không rõ trạng thái";

          return (
            <div
              key={index}
              className="mb-8 border border-gray-300 rounded-lg shadow-lg bg-white overflow-hidden"
            >
              {/* Header đơn hàng */}
              <div className="bg-blue-50 p-4 border-b border-gray-300 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    <span className="mr-2">🕒</span>
                    Thời gian: {new Date(time).toLocaleString("en-GB")}
                  </h2>
                  <p className="text-gray-700 text-lg mt-1">
                    <span className="mr-2">📦</span>
                    Tổng sản phẩm: <span className="font-semibold text-blue-600">{totalProductCount}</span>
                  </p>
                  <p className="text-gray-700 text-lg mt-1">
                    <span className="mr-2">💰</span>
                    Tổng giá trị: <span className="font-semibold text-blue-600">{formatPrice(totalOrderPrice)}</span>
                  </p>
                </div>
                <div>
                  <p className="text-lg font-medium">
                    <span className="mr-2">📋</span>
                    Trạng thái:
                    <span
                      className={`ml-1 font-semibold ${orderStatus === "Hoàn thành"
                          ? "text-green-600"
                          : "text-orange-600"
                        }`}
                    >
                      {orderStatus}
                    </span>
                  </p>
                </div>
              </div>

              {/* Chi tiết sản phẩm */}
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-left">
                    <th className="py-3 px-6 font-semibold text-center">Sản phẩm</th>
                    <th className="py-3 px-6 font-semibold text-center">Số lượng</th>
                    <th className="py-3 px-6 font-semibold text-center">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="py-4 px-6 border-b text-center text-gray-700">
                        {order.product_name}
                      </td>
                      <td className="py-4 px-6 border-b text-center text-gray-700">
                        {order.quantity}
                      </td>
                      <td className="py-4 px-6 border-b text-center text-gray-700">
                        {formatPrice(order.total_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })
      )}
    </div>


  );
};

export default UserOrders;

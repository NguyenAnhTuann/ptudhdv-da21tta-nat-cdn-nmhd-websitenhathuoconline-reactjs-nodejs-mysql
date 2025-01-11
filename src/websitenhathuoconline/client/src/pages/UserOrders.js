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

  // Nhóm và sắp xếp các đơn hàng theo thời gian
  const groupedOrders = Object.entries(
    orders.reduce((acc, order) => {
      if (!acc[order.created_at]) {
        acc[order.created_at] = [];
      }
      acc[order.created_at].push(order);
      return acc;
    }, {})
  ).sort(([timeA], [timeB]) => new Date(timeB) - new Date(timeA)); // Sắp xếp theo thời gian giảm dần

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-2xl font-bold mb-4">Đơn hàng của bạn</h1>
      {orders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
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

          // Lấy trạng thái từ sản phẩm đầu tiên trong đơn hàng
          const orderStatus = orders[0]?.status || "Không rõ trạng thái";

          return (
            <div
              key={index}
              className="mb-8 border border-gray-300 rounded-lg p-4 shadow-lg bg-gray-50"
            >
              <h2 className="text-xl font-semibold mb-4">
                Thời gian: {new Date(time).toLocaleString("en-GB")}
              </h2>
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                Tổng giá trị đơn hàng: {formatPrice(totalOrderPrice)}
              </h3>
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                Tổng số sản phẩm: {totalProductCount}
              </h3>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Trạng thái đơn hàng: {orderStatus}
              </h3>
              <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-4 px-6 border-b text-center whitespace-normal">
                      Sản phẩm
                    </th>
                    <th className="py-4 px-6 border-b text-center">Số lượng</th>
                    <th className="py-4 px-6 border-b text-center">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="py-4 px-6 border-b text-center whitespace-normal break-words">
                        {order.product_name}
                      </td>
                      <td className="py-4 px-6 border-b text-center">
                        {order.quantity}
                      </td>
                      <td className="py-4 px-6 border-b text-center">
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

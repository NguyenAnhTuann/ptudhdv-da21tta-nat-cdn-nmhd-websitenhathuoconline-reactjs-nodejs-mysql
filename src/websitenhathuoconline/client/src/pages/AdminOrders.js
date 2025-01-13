import React, { useEffect, useState } from "react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
      try {
        const response = await fetch("http://localhost:5000/api/admin/orders");
        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (time, newStatus) => {
    try {
      // Lấy tất cả các ID của đơn hàng trong cùng thời gian
      const orderIds = groupedOrders[time].products.map((product) => product.id);

      // Gửi yêu cầu cập nhật trạng thái cho tất cả các sản phẩm trong đơn hàng
      await Promise.all(
        orderIds.map(async (id) => {
          await fetch(`http://localhost:5000/api/admin/orders/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
          });
        })
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.created_at === time ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  const groupedOrders = orders.reduce((acc, order) => {
    const orderTime = order.created_at;
    if (!acc[orderTime]) {
      acc[orderTime] = {
        created_at: order.created_at,
        user_name: order.user_name,
        user_phone: order.user_phone,
        user_address: order.user_address,
        status: order.status,
        total_price: 0,
        total_quantity: 0,
        products: [],
      };
    }
    acc[orderTime].products.push({
      id: order.id,
      product_name: order.product_name,
      quantity: order.quantity,
      total_price: order.total_price,
    });
    acc[orderTime].total_price += parseFloat(order.total_price);
    acc[orderTime].total_quantity += order.quantity; // Cộng tổng số sản phẩm
    return acc;
  }, {});

  return (
    <div className="container mx-auto my-8 px-4">
      {/* Nút quay lại */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => window.location.href = "/admin"}
          className="flex items-center text-blue-600 hover:underline"
        >
          <span className="mr-2 text-2xl">⭠</span>
          <span className="text-lg font-medium">Quay lại</span>
        </button>
      </div>

      {/* Khi không có đơn hàng */}
      {Object.keys(groupedOrders).length === 0 ? (
        <div className="text-center bg-gray-100 p-8 rounded-lg shadow-md">
          <p className="text-lg text-gray-600 mb-4">
            Không có đơn hàng nào.
          </p>
        </div>
      ) : (
        Object.values(groupedOrders).map((order, index) => (
          <div
            key={index}
            className="mb-8 border border-gray-300 rounded-lg shadow-lg bg-white overflow-hidden"
          >
            {/* Header đơn hàng */}
            <div className="bg-blue-50 border-b p-4 border-gray-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                {/* Thông tin đơn hàng */}
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl font-bold text-gray-800">
                    <span className="mr-2">🕒</span>
                    Thời gian: {new Date(order.created_at).toLocaleString("en-GB")}
                  </h2>
                  <p className="text-gray-700 text-lg mt-1">
                    <span className="mr-2">👤</span>
                    <strong>Tên:</strong> {order.user_name}
                  </p>
                  <p className="text-gray-700 text-lg mt-1">
                    <span className="mr-2">📞</span>
                    <strong>Điện thoại:</strong> {order.user_phone}
                  </p>
                  <p className="text-gray-700 text-lg mt-1">
                    <span className="mr-2">🏠</span>
                    <strong>Địa chỉ:</strong> {order.user_address}
                  </p>
                  <p className="text-gray-700 text-lg mt-1">
                    <span>------------------------------</span>
                  </p>
                  <p className="text-gray-700 text-lg mt-1">
                    <span className="mr-2">📦</span>
                    Tổng sản phẩm: <span className="font-semibold text-blue-600">{order.total_quantity}</span>
                  </p>
                  <p className="text-gray-700 text-lg mt-1">
                    <span className="mr-2">💰</span>
                    Tổng giá trị: <span className="font-semibold text-blue-600">{formatPrice(order.total_price)}</span>
                  </p>
                </div>

              </div>

              {/* Trạng thái đơn hàng */}
              <div className="mt-4">
                <p className="text-lg font-medium">
                  <span className="mr-2">📋</span>
                  Trạng thái:
                  <span
                    className={`ml-1 font-semibold ${order.status === "Đã giao hàng"
                      ? "text-green-600"
                      : order.status === "Đang xử lý"
                        ? "text-orange-600"
                        : "text-red-600"
                      }`}
                  >
                    {order.status}
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
                {order.products.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-6 border-b text-center text-gray-700">
                      {product.product_name}
                    </td>
                    <td className="py-4 px-6 border-b border-l text-center text-gray-700">
                      {product.quantity}
                    </td>
                    <td className="py-4 px-6 border-b border-l text-center text-gray-700">
                      {formatPrice(product.total_price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer */}
            <div className="flex items-center justify-between bg-gray-100 p-4 border-gray-300">
              <div className="flex items-center">
                <label htmlFor={`status-${index}`} className="mr-4 font-semibold text-gray-700">
                  Trạng thái:
                </label>
                <select
                  id={`status-${index}`}
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.created_at, e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 focus:ring focus:ring-blue-400"
                >
                  <option value="Chưa nhận hàng">Chưa nhận hàng</option>
                  <option value="Đang xử lý">Đang xử lý</option>
                  <option value="Đã giao hàng">Đã giao hàng</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </div>
              <button
                onClick={() => updateOrderStatus(order.created_at, "Đã giao hàng")}
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition"
              >
                Đánh dấu đã giao
              </button>
            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
